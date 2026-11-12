#!/usr/bin/env python3
"""
24/7 NUC Self-Healing Watchdog for AINE.WS
- Runs hourly health check + 3-hour backup wire ingestion.
- Never compromises EDITORIAL_VOICE.md or audit_indexing_health.py guardrails.
- Alerting rules:
  1. Zero alerts (no SMS, no email) if run succeeds or auto-recovers.
  2. First failure: Email alert only via Resend (no SMS).
  3. Two consecutive failures: SMS alert via Telnyx + Email.
"""
import os, sys, json, re, ssl, subprocess, urllib.request
from datetime import datetime, timezone

REPO = os.path.expanduser("~/projects/aine-ws")
HAOS_ENV = os.path.expanduser("~/haos-v1/.env")
STATE_FILE = os.path.join(REPO, "scripts", "WIRE_ALERT_STATE.json")
_SSL_CTX = ssl._create_unverified_context()

def load_env(path):
    env = {}
    if os.path.exists(path):
        with open(path) as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    k, v = line.split("=", 1)
                    env[k.strip()] = v.strip().strip("'\"")
    return env

def load_alert_state():
    if os.path.exists(STATE_FILE):
        try:
            with open(STATE_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            pass
    return {"status": "OK", "consecutive_failures": 0}

def send_telnyx_sms(msg):
    env = load_env(HAOS_ENV)
    key = env.get("TELNYX_API_KEY")
    frm = env.get("TELNYX_FROM_NUMBER")
    to = env.get("TELNYX_SMS_NUMBER")
    if not (key and frm and to):
        return False, "Missing Telnyx env vars"
    payload = json.dumps({"from": frm, "to": to, "text": msg[:480]}).encode("utf-8")
    req = urllib.request.Request(
        "https://api.telnyx.com/v2/messages",
        data=payload,
        headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json", "User-Agent": "AINE-Watchdog/1.0"}
    )
    try:
        with urllib.request.urlopen(req, timeout=10, context=_SSL_CTX) as r:
            return True, f"HTTP {r.status}"
    except Exception as e:
        return False, str(e)

def send_resend_email(subject, body_text):
    env = load_env(HAOS_ENV)
    key = env.get("RESEND_API_KEY") or os.environ.get("RESEND_API_KEY")
    if not key:
        return False, "Missing RESEND_API_KEY"
    payload = json.dumps({
        "from": "Justin Davis <jd@goldstandard.monster>",
        "to": ["goldstandardaiagency@gmail.com", "jd@goldstandard.monster"],
        "subject": subject,
        "text": body_text
    }).encode("utf-8")
    req = urllib.request.Request(
        "https://api.resend.com/emails",
        data=payload,
        headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json", "User-Agent": "AINE-Watchdog/1.0"}
    )
    try:
        with urllib.request.urlopen(req, timeout=10, context=_SSL_CTX) as r:
            return True, f"HTTP {r.status}"
    except Exception as e:
        return False, str(e)

def write_alert(status, reason, recovered=False, consecutive_failures=0):
    data = {
        "timestamp_utc": datetime.now(timezone.utc).isoformat(),
        "status": status,
        "reason": reason,
        "recovered": recovered,
        "consecutive_failures": consecutive_failures,
        "acknowledged": False
    }
    with open(STATE_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)

def run(cmd, cwd=REPO):
    return subprocess.run(cmd, cwd=cwd, capture_output=True, text=True)

def newest_article_age_hours():
    p = os.path.join(REPO, "src", "data", "articles.ts")
    if not os.path.exists(p):
        return 999.0, "missing"
    with open(p, "r", encoding="utf-8") as f:
        txt = f.read()
    dates = re.findall(r"publishedAt:\s*['\"]([^'\"]+)['\"]", txt)
    newest = None
    for d in dates:
        try:
            dt = datetime.fromisoformat(d.replace("Z", "+00:00"))
            if not dt.tzinfo:
                dt = dt.replace(tzinfo=timezone.utc)
            if newest is None or dt > newest:
                newest = dt
        except Exception:
            continue
    if not newest:
        return 999.0, "unknown"
    return (datetime.now(timezone.utc) - newest).total_seconds() / 3600.0, newest.isoformat()

def main():
    prev_state = load_alert_state()
    consecutive_failures = prev_state.get("consecutive_failures", 0)

    run(["git", "fetch", "origin", "main"])
    run(["git", "reset", "--hard", "origin/main"])

    age_h, newest_ts = newest_article_age_hours()
    gh_failed = False
    gh_reason = ""
    gh_res = run(["gh", "run", "list", "--workflow", "daily_news_wire.yml", "--limit", "1", "--json", "conclusion,status,url"])
    if gh_res.returncode == 0 and gh_res.stdout.strip():
        try:
            runs = json.loads(gh_res.stdout)
            if runs and runs[0].get("conclusion") == "failure":
                gh_failed = True
                gh_reason = f"GH Actions daily_news_wire failed ({runs[0].get('url')})"
        except Exception:
            pass

    if age_h <= 4.5 and not gh_failed:
        # Feed is completely fresh
        if consecutive_failures > 0 or prev_state.get("status") != "OK":
            write_alert("OK", f"Feed fresh ({age_h:.2f}h old, newest={newest_ts}).", recovered=True, consecutive_failures=0)
        print(f"[OK] AINE.WS fresh ({age_h:.2f}h old, newest={newest_ts}).")
        return

    trigger_reason = gh_reason if gh_failed else f"Feed stale ({age_h:.1f}h since {newest_ts})"
    print(f"[WATCHDOG] Triggering recovery run: {trigger_reason}")

    wire_res = run(["python3", "scripts/newsroom_wire.py", "--limit", "2"])
    audit_res = run(["python3", "scripts/audit_indexing_health.py"])

    if wire_res.returncode != 0 or audit_res.returncode != 0:
        consecutive_failures += 1
        err_detail = (wire_res.stderr or wire_res.stdout or "")[-400:] + " | " + (audit_res.stderr or audit_res.stdout or "")[-200:]
        status_label = "GUARDRAIL_FAILURE" if wire_res.returncode == 2 else "PIPELINE_ERROR"
        write_alert(status_label, f"{trigger_reason} -> Recovery failed: {err_detail}", recovered=False, consecutive_failures=consecutive_failures)

        email_subject = f"[AINE.WS NOTICE] Publishing Missed (Streak: {consecutive_failures})"
        email_body = f"AINE.WS missed scheduled publishing.\nReason: {trigger_reason}\nDetails: {err_detail[:400]}\nConsecutive failures: {consecutive_failures}\nWatchdog will attempt next run automatically."
        send_resend_email(email_subject, email_body)

        # STRICT RULE: Send SMS ONLY if 2 or more consecutive scheduled runs fail
        if consecutive_failures >= 2:
            sms_msg = f"AINE.WS ALERT: Publishing down for {consecutive_failures} consecutive runs. Reason: {err_detail[:180]}"
            send_telnyx_sms(sms_msg)
            print(f"[ALERT] SMS sent (consecutive failures = {consecutive_failures})")
        else:
            print(f"[NOTICE] Email sent. SMS suppressed for single failure (streak = {consecutive_failures})")

        sys.exit(1)

    st = run(["git", "status", "--porcelain", "src/data/articles.ts"])
    if st.stdout.strip():
        run(["git", "config", "user.name", "AINE NUC Watchdog"])
        run(["git", "config", "user.email", "bot@aine.ws"])
        run(["git", "add", "src/data/articles.ts", "scripts/news_dedup.db", "WIRE_PUBLISHING_LEDGER.md", "scripts/wire_health_status.json"])
        run(["git", "commit", "-m", "chore(watchdog): NUC auto-recovery wire publish [skip ci]"])
        push_res = run(["git", "push", "origin", "main"])
        if push_res.returncode != 0:
            consecutive_failures += 1
            write_alert("PIPELINE_ERROR", f"Push failed: {push_res.stderr[:250]}", recovered=False, consecutive_failures=consecutive_failures)
            send_resend_email("[AINE.WS NOTICE] Git push failed during auto-recovery", push_res.stderr[:300])
            if consecutive_failures >= 2:
                send_telnyx_sms(f"AINE.WS ALERT: Auto-recovery push failed for 2 consecutive runs: {push_res.stderr[:160]}")
            sys.exit(1)

        # Successfully recovered and published!
        # STRICT RULE: Zero SMS / Zero Email if it auto-recovers.
        write_alert("OK", f"Auto-recovered cleanly after: {trigger_reason}. Published fresh articles.", recovered=True, consecutive_failures=0)
        print("[RECOVERED] Published & pushed cleanly. Alerts suppressed per policy.")
    else:
        write_alert("OK", "Feed checked cleanly, no new stories needed.", recovered=True, consecutive_failures=0)
        print("[OK] Wire ran cleanly with no new unique stories needed.")

if __name__ == "__main__":
    main()
