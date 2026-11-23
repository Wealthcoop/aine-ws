#!/usr/bin/env python3
"""
AINE.WS Superhuman AI Newsletter Radar -> Original Newsroom Publisher
Polls Resend Inbound (`wire@goldstandard.monster`) for newly forwarded Superhuman
editions across all formats (full weekday, short weekday, Sunday Robotics & AI).

Editorial & Copyright Policy:
- Uses forwarded newsletter editions strictly as a topic and primary-source radar.
- Follows tracking links to primary publisher URLs and drafts 100% original
  AINE.WS analysis using existing `newsroom_wire.py` synthesis & guardrails.
- Updates `src/data/trendingTools.json` ONLY when a Trending Tools section exists,
  preserving pinned monetization/affiliate entries.
- Updates `src/data/dailyPrompt.json` ONLY when a prompt/tutorial theme exists,
  drafting an original small-business / agency prompt.
"""

import os
import re
import sys
import json
import sqlite3
import urllib.request
import urllib.parse
from datetime import datetime, timezone
from html import unescape

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
REPO_ROOT = os.path.abspath(os.path.join(SCRIPT_DIR, ".."))
sys.path.insert(0, SCRIPT_DIR)

import newsroom_wire as nw

ARTICLES_TS_PATH = os.path.join(REPO_ROOT, "src", "data", "articles.ts")
TOOLS_JSON_PATH = os.path.join(REPO_ROOT, "src", "data", "trendingTools.json")
PROMPT_JSON_PATH = os.path.join(REPO_ROOT, "src", "data", "dailyPrompt.json")
DB_PATH = os.path.join(SCRIPT_DIR, "news_dedup.db")

TARGET_RECIPIENT = "wire@goldstandard.monster"

IGNORE_DOMAINS = (
    "joinsuperhuman.ai",
    "superhuman.ai",
    "beehiiv.com",
    "twitter.com",
    "x.com",
    "linkedin.com",
    "instagram.com",
    "facebook.com",
    "tiktok.com",
    "youtube.com",
    "wikipedia.org",
    "elfsight.com",
    "mailto:",
    "unsubscribe",
    "preferences",
    "privacy",
    "sponsor",
    "advertise",
)


def init_email_table(db_path: str):
    with sqlite3.connect(db_path) as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS processed_emails (
                email_id TEXT PRIMARY KEY,
                subject TEXT,
                processed_at TEXT
            )
            """
        )


def is_email_processed(db_path: str, email_id: str) -> bool:
    with sqlite3.connect(db_path) as conn:
        row = conn.execute(
            "SELECT 1 FROM processed_emails WHERE email_id = ?", (email_id,)
        ).fetchone()
        return row is not None


def mark_email_processed(db_path: str, email_id: str, subject: str):
    with sqlite3.connect(db_path) as conn:
        conn.execute(
            "INSERT OR IGNORE INTO processed_emails (email_id, subject, processed_at) VALUES (?, ?, ?)",
            (email_id, subject[:200], datetime.now(timezone.utc).isoformat()),
        )


def resend_get(api_key: str, path: str) -> dict:
    req = urllib.request.Request(
        f"https://api.resend.com{path}",
        headers={
            "Authorization": f"Bearer {api_key}",
            "User-Agent": "AINE-Newsroom-Wire/1.0",
        },
    )
    with urllib.request.urlopen(req, timeout=20) as resp:
        return json.loads(resp.read().decode("utf-8"))


def strip_utm_params(url: str) -> str:
    try:
        parsed = urllib.parse.urlsplit(url)
        qs = [
            (k, v)
            for k, v in urllib.parse.parse_qsl(parsed.query, keep_blank_values=False)
            if not k.lower().startswith(("utm_", "fbclid", "gclid", "mc_", "ref", "_bhlid"))
        ]
        return urllib.parse.urlunsplit(
            (parsed.scheme, parsed.netloc, parsed.path, urllib.parse.urlencode(qs), "")
        )
    except Exception:
        return url


def unwrap_url(raw_url: str) -> str:
    """Resolve newsletter tracking redirects to the real primary destination URL."""
    url = unescape(raw_url).strip()
    if not url.startswith(("http://", "https://")):
        return ""
    try:
        req = urllib.request.Request(
            url,
            method="HEAD",
            headers={"User-Agent": "Mozilla/5.0 (compatible; AINE-Wire/1.0)"},
        )
        with urllib.request.urlopen(req, timeout=8) as r:
            final = r.geturl()
            return strip_utm_params(final)
    except Exception:
        try:
            req = urllib.request.Request(
                url,
                method="GET",
                headers={"User-Agent": "Mozilla/5.0 (compatible; AINE-Wire/1.0)"},
            )
            with urllib.request.urlopen(req, timeout=8) as r:
                final = r.geturl()
                return strip_utm_params(final)
        except Exception:
            return strip_utm_params(url)


def is_valid_primary_url(url: str) -> bool:
    if not url or not url.startswith(("http://", "https://")):
        return False
    low = url.lower()
    if any(bad in low for bad in IGNORE_DOMAINS):
        return False
    return True


def html_to_clean_text(html: str) -> str:
    txt = re.sub(r"<script[\s\S]*?</script>", " ", html, flags=re.I)
    txt = re.sub(r"<style[\s\S]*?</style>", " ", txt, flags=re.I)
    txt = re.sub(r"<(br|p|div|li|tr|h[1-6])[^>]*>", "\n", txt, flags=re.I)
    txt = re.sub(r"<[^>]+>", " ", txt)
    txt = unescape(txt)
    lines = [re.sub(r"\s+", " ", ln).strip() for ln in txt.splitlines()]
    return "\n".join(ln for ln in lines if ln)


def extract_links_from_html(html: str) -> list:
    out = []
    seen = set()
    for m in re.finditer(r'<a[^>]+href=["\']([^"\']+)["\'][^>]*>(.*?)</a>', html, flags=re.I | re.S):
        href = unescape(m.group(1)).strip()
        anchor = re.sub(r"\s+", " ", unescape(re.sub(r"<[^>]+>", " ", m.group(2)))).strip()
        if not href.startswith(("http://", "https://")) or len(anchor) < 3:
            continue
        if any(skip in anchor.lower() for skip in ("unsubscribe", "privacy", "sponsor", "advertise", "read online", "view in browser", "refer a friend")):
            continue
        if href in seen:
            continue
        seen.add(href)
        out.append({"raw_url": href, "anchor": anchor[:140]})
    return out


def extract_structured_radar(subject: str, html_body: str, text_body: str) -> dict:
    """
    Use the editorial LLM strictly to parse an incoming Superhuman newsletter into
    a structured radar (primary story topics + links, optional trending tools,
    optional prompt theme). Returns empty lists/None cleanly for short editions.
    """
    clean_text = text_body.strip() if text_body and len(text_body.strip()) > 300 else html_to_clean_text(html_body or "")
    links = extract_links_from_html(html_body or "")[:45]
    link_index = "\n".join(f"- [{i}] {lk['anchor']} -> {lk['raw_url']}" for i, lk in enumerate(links))

    sys_prompt = (
        "You extract structured metadata from a forwarded AI newsletter so a newsroom can "
        "independently report on the underlying primary news stories. Return STRICT JSON only, "
        "with keys: edition_type ('full'|'short'|'robotics'), stories (array of up to 2 objects: "
        "{title, topic_summary, link_index, is_robotics}), tools (array of objects if a Trending Tools "
        "section exists else []: {name, link_index, description, category, emoji}), prompt_idea "
        "(object if a prompt or productivity workflow section exists else null: "
        "{title, useCase, prompt, model}). Never include sponsor ads or newsletter promos. "
        "For prompt_idea, write an original practical prompt for small business owners and agencies."
    )
    user_prompt = (
        f"Subject: {subject}\n\n"
        f"Newsletter Text (truncated):\n{clean_text[:9500]}\n\n"
        f"Links:\n{link_index}\n\n"
        "Return strict valid JSON only."
    )
    raw = nw.ask_editorial_generator(sys_prompt, user_prompt, max_tokens=1800)
    if not raw:
        return {"edition_type": "short", "stories": [], "tools": [], "prompt_idea": None}

    # Strip possible code fences
    raw = re.sub(r"^```(?:json)?\s*", "", raw.strip())
    raw = re.sub(r"\s*```$", "", raw.strip())
    try:
        parsed = json.loads(raw)
    except Exception:
        m = re.search(r"\{[\s\S]*\}", raw)
        parsed = json.loads(m.group(0)) if m else {}

    # Resolve raw links for stories and tools
    for st in parsed.get("stories") or []:
        idx = st.get("link_index")
        if isinstance(idx, int) and 0 <= idx < len(links):
            st["url"] = unwrap_url(links[idx]["raw_url"])
        else:
            st["url"] = ""

    for tl in parsed.get("tools") or []:
        idx = tl.get("link_index")
        if isinstance(idx, int) and 0 <= idx < len(links):
            tl["url"] = unwrap_url(links[idx]["raw_url"])
        else:
            tl["url"] = ""

    return parsed


def update_trending_tools(new_tools: list, dry_run: bool = False) -> int:
    valid = [
        t for t in new_tools
        if t.get("name") and t.get("description") and is_valid_primary_url(t.get("url", ""))
    ]
    if not valid:
        return 0

    existing = []
    if os.path.exists(TOOLS_JSON_PATH):
        with open(TOOLS_JSON_PATH, "r", encoding="utf-8") as f:
            existing = json.load(f)

    # Preserve pinned affiliate/monetization tools first
    pinned = [t for t in existing if t.get("pinned")]
    pinned_keys = {t["name"].strip().lower() for t in pinned}

    merged = list(pinned)
    seen = set(pinned_keys)

    for t in valid:
        key = t["name"].strip().lower()
        if key in seen:
            continue
        seen.add(key)
        merged.append(
            {
                "name": t["name"].strip()[:48],
                "url": t["url"],
                "emoji": (t.get("emoji") or "⚡").strip()[:4],
                "description": t["description"].strip().rstrip(".") + ".",
                "category": (t.get("category") or "AI Tool").strip()[:40],
            }
        )
        if len(merged) >= 6:
            break

    # Fill remaining slots from previous non-pinned tools if fewer than 4
    for old in existing:
        if len(merged) >= 5:
            break
        key = old["name"].strip().lower()
        if key not in seen:
            seen.add(key)
            merged.append(old)

    if not dry_run:
        with open(TOOLS_JSON_PATH, "w", encoding="utf-8") as f:
            json.dump(merged, f, indent=2, ensure_ascii=False)
            f.write("\n")
    return len(valid)


def update_daily_prompt(prompt_idea: dict, edition_label: str, dry_run: bool = False) -> bool:
    if not isinstance(prompt_idea, dict):
        return False
    title = (prompt_idea.get("title") or "").strip()
    prompt = (prompt_idea.get("prompt") or "").strip()
    if len(title) < 8 or len(prompt) < 40:
        return False

    payload = {
        "title": title[:110],
        "useCase": (prompt_idea.get("useCase") or "Business Productivity").strip()[:40],
        "prompt": prompt[:700],
        "model": (prompt_idea.get("model") or "ChatGPT / Claude / Gemini").strip()[:40],
        "sourceEdition": edition_label,
        "updatedAt": datetime.now(timezone.utc).strftime("%Y-%m-%d"),
    }
    if not dry_run:
        with open(PROMPT_JSON_PATH, "w", encoding="utf-8") as f:
            json.dump(payload, f, indent=2, ensure_ascii=False)
            f.write("\n")
    return True


def main():
    dry_run = "--dry-run" in sys.argv
    api_key = os.environ.get("RESEND_API_KEY", "").strip()
    if not api_key:
        print("[Superhuman Ingest] RESEND_API_KEY not configured; skipping newsletter poll cleanly.")
        return

    init_email_table(DB_PATH)
    db = nw.DedupDatabase(DB_PATH)

    try:
        listing = resend_get(api_key, "/emails/receiving")
    except Exception as e:
        print(f"[Superhuman Ingest] Resend receiving poll skipped due to error: {e}")
        return

    emails = listing.get("data") or []
    matching = []
    for em in emails:
        to_list = [addr.lower() for addr in (em.get("to") or [])]
        if TARGET_RECIPIENT not in to_list:
            continue
        if is_email_processed(DB_PATH, em["id"]):
            continue
        matching.append(em)

    if not matching:
        print("[Superhuman Ingest] No new unprocessed emails at wire@goldstandard.monster.")
        return

    with open(ARTICLES_TS_PATH, "r", encoding="utf-8") as f:
        articles_content = f.read()

    recent_images = re.findall(r"featuredImage:\s*['\"]([^'\"]+)['\"]", articles_content)
    existing_slugs = set(re.findall(r"slug:\s*['\"]([^'\"]+)['\"]", articles_content))
    new_articles = []

    # Process up to 2 latest unprocessed editions per run
    for em in matching[:2]:
        email_id = em["id"]
        subject = em.get("subject") or ""
        sender = (em.get("from") or "").lower()
        print(f"[Superhuman Ingest] Inspecting email {email_id}: '{subject}' from {sender}")

        # Skip Gmail forwarding verification emails cleanly
        if "forwarding-noreply@google.com" in sender or "gmail forwarding confirmation" in subject.lower():
            print("[Superhuman Ingest] Gmail verification email detected (not a newsletter); leaving out of articles.")
            continue

        try:
            full = resend_get(api_key, f"/emails/receiving/{email_id}")
        except Exception as e:
            print(f"  -> Could not fetch email body for {email_id}: {e}")
            continue

        radar = extract_structured_radar(
            subject, full.get("html") or "", full.get("text") or ""
        )
        edition_type = radar.get("edition_type") or "full"
        print(f"  -> Parsed edition_type={edition_type}, stories={len(radar.get('stories') or [])}, tools={len(radar.get('tools') or [])}, has_prompt={bool(radar.get('prompt_idea'))}")

        # 1. Draft original AINE.WS articles from primary source URLs (max 2 per edition)
        for st in (radar.get("stories") or [])[:2]:
            primary_url = st.get("url") or ""
            st_title = (st.get("title") or "").strip()
            if not st_title or not is_valid_primary_url(primary_url):
                continue
            is_dup, reason = db.is_duplicate(primary_url, st_title)
            if is_dup:
                print(f"  - Skipping duplicate story '{st_title[:50]}': {reason}")
                continue

            is_robotics = bool(st.get("is_robotics")) or edition_type == "robotics"
            feed_source = {
                "name": "Robotics & AI Desk" if is_robotics else "AI Industry Desk",
                "category": "ai-tools",
                "authorId": "justin-davis",
                "dateline": "SAN FRANCISCO",
            }
            item = {
                "title": st_title,
                "link": primary_url,
                "summary": st.get("topic_summary") or st_title,
                "published": full.get("created_at") or datetime.now(timezone.utc).isoformat(),
            }
            try:
                art = nw.synthesize_and_repair_article(item, feed_source, existing_slugs, recent_images)
                new_articles.append(art)
                existing_slugs.add(art["slug"])
                recent_images.insert(0, art["featuredImage"])
                if not dry_run:
                    db.record_article(primary_url, art["title"], art["slug"])
                print(f"  + Drafted original story: {art['title']} ({art['slug']})")
            except Exception as e:
                print(f"  -> Skipped story '{st_title[:45]}': {e}")

        # 2. Update Trending Tools ONLY when this edition includes tools
        tools_added = update_trending_tools(radar.get("tools") or [], dry_run=dry_run)
        if tools_added:
            print(f"  + Updated trendingTools.json ({tools_added} candidate tools merged).")

        # 3. Update Daily Business Prompt ONLY when this edition includes a prompt
        if update_daily_prompt(radar.get("prompt_idea"), f"AINE.WS {edition_type.title()} Edition", dry_run=dry_run):
            print("  + Updated dailyPrompt.json.")

        if not dry_run:
            mark_email_processed(DB_PATH, email_id, subject)

    if new_articles and not dry_run:
        chunks = [nw.format_article_ts(a) for a in new_articles]
        insertion = ",\n".join(chunks) + ",\n"
        marker = "export const ARTICLES: NewsArticle[] = [\n"
        if marker in articles_content:
            updated = articles_content.replace(marker, marker + insertion, 1)
            with open(ARTICLES_TS_PATH, "w", encoding="utf-8") as f:
                f.write(updated)
            for a in new_articles:
                nw.record_publishing_ledger(a["title"], a["slug"], a.get("_clean_words", 750), "SUCCESS", category=a["category"])
            nw.push_search_engine_indexing(new_articles)
            print(f"[Superhuman Ingest] Published {len(new_articles)} original article(s) to articles.ts.")


if __name__ == "__main__":
    main()
