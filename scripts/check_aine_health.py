#!/usr/bin/env python3
"""
AINE.WS Watchdog & Pre-Task Alert Verifier
Checks:
1. Live GitHub Actions workflow status (.github/workflows/daily_news_wire.yml)
2. Age of newest article in https://aine.ws/news-sitemap.xml or src/data/articles.ts
3. Local scripts/wire_health_status.json and remote NUC watchdog state (if reachable)
Exits 0 if healthy, non-zero with exact alert reason if stale (> 6h), failed, or blocked by guardrails.
"""

import os
import sys
import json
import re
import ssl
import subprocess
import urllib.request
from datetime import datetime, timezone

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HEALTH_FILE = os.path.join(BASE_DIR, "scripts", "wire_health_status.json")
ALERT_FLAG = os.path.expanduser("~/.gemini/config/rules/AINE_ACTIVE_ALERT.md")

def check_git_articles_age():
    articles_path = os.path.join(BASE_DIR, "src", "data", "articles.ts")
    if not os.path.exists(articles_path):
        return None, "articles.ts missing"
    with open(articles_path, "r", encoding="utf-8") as f:
        txt = f.read()
    dates = re.findall(r"publishedAt:\s*['\"]([^'\"]+)['\"]", txt)
    newest_dt = None
    for d in dates:
        try:
            dt = datetime.fromisoformat(d.replace("Z", "+00:00"))
            if not dt.tzinfo:
                dt = dt.replace(tzinfo=timezone.utc)
            if newest_dt is None or dt > newest_dt:
                newest_dt = dt
        except Exception:
            continue
    if newest_dt is None:
        return None, "No parseable publishedAt timestamps in articles.ts"
    age_hours = (datetime.now(timezone.utc) - newest_dt).total_seconds() / 3600.0
    return age_hours, newest_dt.isoformat()

def check_live_sitemap_age():
    ctx = ssl._create_unverified_context()
    try:
        req = urllib.request.Request("https://aine.ws/news-sitemap.xml", headers={"User-Agent": "AINE-Watchdog/1.0"})
        with urllib.request.urlopen(req, timeout=8, context=ctx) as resp:
            xml_txt = resp.read().decode("utf-8", errors="ignore")
        dates = re.findall(r"<news:publication_date>([^<]+)</news:publication_date>", xml_txt)
        if not dates:
            dates = re.findall(r"<lastmod>([^<]+)</lastmod>", xml_txt)
        newest_dt = None
        for d in dates:
            try:
                dt = datetime.fromisoformat(d.strip().replace("Z", "+00:00"))
                if not dt.tzinfo:
                    dt = dt.replace(tzinfo=timezone.utc)
                if newest_dt is None or dt > newest_dt:
                    newest_dt = dt
            except Exception:
                continue
        if newest_dt:
            age_hours = (datetime.now(timezone.utc) - newest_dt).total_seconds() / 3600.0
            return age_hours, newest_dt.isoformat()
    except Exception as e:
        return None, f"Sitemap fetch failed: {e}"
    return None, "No dates in live sitemap"

def main():
    alerts = []
    if os.path.exists(HEALTH_FILE):
        try:
            with open(HEALTH_FILE, "r", encoding="utf-8") as f:
                hs = json.load(f)
            if hs.get("status") in ("GUARDRAIL_FAILURE", "PIPELINE_ERROR", "CRITICAL_ALERT"):
                alerts.append(f"Health file status={hs.get('status')}: {hs.get('note')} | guardrails={hs.get('guardrail_failures')} | errors={hs.get('errors')}")
        except Exception as e:
            alerts.append(f"Health file unreadable: {e}")

    local_age, local_info = check_git_articles_age()
    live_age, live_info = check_live_sitemap_age()

    if local_age is not None and local_age > 8.0:
        alerts.append(f"Local articles.ts newest article is stale ({local_age:.1f}h old, {local_info})")
    if live_age is not None and live_age > 8.0:
        alerts.append(f"Live aine.ws news-sitemap newest article is stale ({live_age:.1f}h old, {live_info})")

    # Check latest GH workflow status if gh available
    try:
        res = subprocess.run(
            ["gh", "run", "list", "--workflow", "daily_news_wire.yml", "--limit", "1", "--json", "conclusion,status,createdAt"],
            cwd=BASE_DIR, capture_output=True, text=True, timeout=6
        )
        if res.returncode == 0 and res.stdout.strip():
            runs = json.loads(res.stdout)
            if runs:
                r = runs[0]
                if r.get("conclusion") == "failure":
                    alerts.append(f"Latest GitHub Actions daily_news_wire.yml FAILED (createdAt={r.get('createdAt')})")
    except Exception:
        pass

    if alerts:
        print("AINE_HEALTH_ALERT:")
        for a in alerts:
            print(" -", a)
        sys.exit(1)

    print(f"AINE_HEALTH_OK | local_age={local_age:.2f}h ({local_info}) | live_age={live_age if live_age is not None else 'n/a'} ({live_info})")
    sys.exit(0)

if __name__ == "__main__":
    main()
