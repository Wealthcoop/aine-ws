#!/usr/bin/env python3
"""
AINE.WS Superhuman AI Newsletter Radar -> Original Newsroom Publisher
Polls Resend Inbound (`wire@goldstandard.monster`) for newly forwarded Superhuman
editions across all formats (full weekday, short weekday, Sunday Robotics & AI).

Editorial & Copyright Policy:
- Uses forwarded newsletter editions strictly as a topic and entity radar.
- Resolves real primary publisher URLs via You.com Search API (never scraping
  Cloudflare-gated email click trackers and never copying newsletter prose).
- Drafts 100% original AINE.WS analysis using existing `newsroom_wire.py` synthesis
  and editorial guardrails.
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
    "youtu.be",
    "reddit.com",
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
    last_err = None
    for ctx in (nw._SSL_CTX, nw._UNVERIFIED_CTX):
        try:
            with urllib.request.urlopen(req, timeout=20, context=ctx) as resp:
                return json.loads(resp.read().decode("utf-8"))
        except Exception as e:
            last_err = e
    raise last_err


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


def strip_raw_urls(text: str) -> str:
    """Remove long inline email tracking URLs so truncation never hides bottom sections."""
    cleaned = re.sub(r"<https?://[^>]+>", "", text)
    cleaned = re.sub(r"https?://\S+", "", cleaned)
    cleaned = re.sub(r"\n{3,}", "\n\n", cleaned)
    return cleaned.strip()


def resolve_primary_source_via_you(query: str, freshness: str = "week", limit: int = 5) -> dict:
    """
    Use the official You.com Search API to resolve a primary publisher URL and
    fresh snippet for a newsletter story topic or AI tool homepage.
    """
    api_key = (
        os.environ.get("YOU_API_KEY")
        or os.environ.get("YDC_API_KEY")
        or "ydc-sk-ad77719b3933f5e1-YUmlb4x2xLYEJcA7fNqrx2lai04J6Rzd-dd75ddeb"
    )
    if not api_key or not query.strip():
        return {}

    payload = {"query": query.strip()[:220], "count": limit}
    if freshness:
        payload["freshness"] = freshness

    req = urllib.request.Request(
        "https://ydc-index.io/v1/search",
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "X-API-Key": api_key,
            "Content-Type": "application/json",
            "User-Agent": "AINE-Newsroom/1.0",
        },
    )
    for ctx in (nw._SSL_CTX, nw._UNVERIFIED_CTX):
        try:
            with urllib.request.urlopen(req, timeout=15, context=ctx) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                results = data.get("results", {}).get("web", [])
                for r in results:
                    link = strip_utm_params((r.get("url") or "").strip())
                    if is_valid_primary_url(link):
                        return {
                            "url": link,
                            "title": (r.get("title") or "").strip(),
                            "summary": ((r.get("description") or r.get("snippet") or "").strip()),
                            "published": str(r.get("page_age") or datetime.now(timezone.utc).isoformat()),
                        }
                return {}
        except Exception as e:
            print(f"  -> You.com primary-source lookup attempt failed for '{query[:55]}': {e}")
            continue
    return {}


def extract_structured_radar(subject: str, html_body: str, text_body: str) -> dict:
    """
    Use the editorial LLM strictly to parse an incoming Superhuman newsletter into
    a structured topic radar (top primary news stories, optional trending tools,
    optional prompt theme). Returns empty lists/None cleanly for short editions.
    """
    # Prefer clean stripped text so huge Beehiiv tracking URLs never consume context
    if html_body and len(html_body.strip()) > 400:
        clean_text = strip_raw_urls(html_to_clean_text(html_body))
    else:
        clean_text = strip_raw_urls(text_body or "")

    sys_prompt = (
        "You extract structured metadata from a forwarded AI newsletter so an independent "
        "newsroom can locate the underlying primary news sources and report original stories. "
        "Return STRICT JSON only with keys:\n"
        "- edition_type: 'full' | 'short' | 'robotics'\n"
        "- stories: array of up to 2 top non-sponsored news stories (skip sponsor ads, "
        "newsletter promos, and pure social-media video clips when major tech/business news "
        "exists): [{title, topic_summary, search_query, is_robotics}]\n"
        "- tools: array of objects ONLY if a Trending AI Tools / Productivity Tools section "
        "exists in the email (otherwise []): [{name, search_query, description, category, emoji}]\n"
        "- prompt_idea: object ONLY if a Prompt of the Day / AI Prompt / tutorial workflow "
        "section exists in the email (otherwise null): {title, useCase, prompt, model}\n"
        "For search_query, provide a crisp 6 to 12 word Google/news query naming the exact "
        "company, product, and event so a search API finds the primary publisher article.\n"
        "For prompt_idea, write an original practical prompt for small business owners and agencies."
    )
    user_prompt = (
        f"Subject: {subject}\n\n"
        f"Full Newsletter Text (tracking URLs removed):\n{clean_text[:14000]}\n\n"
        "Return strict valid JSON only."
    )
    raw = nw.ask_editorial_generator(sys_prompt, user_prompt, max_tokens=1800)
    if not raw:
        return {"edition_type": "short", "stories": [], "tools": [], "prompt_idea": None}

    raw = re.sub(r"^```(?:json)?\s*", "", raw.strip())
    raw = re.sub(r"\s*```$", "", raw.strip())
    try:
        parsed = json.loads(raw)
    except Exception:
        m = re.search(r"\{[\s\S]*\}", raw)
        parsed = json.loads(m.group(0)) if m else {}

    # Resolve primary source URLs via You.com Search API (clean, no tracker scraping)
    for st in (parsed.get("stories") or [])[:3]:
        q = (st.get("search_query") or st.get("title") or "").strip()
        hit = resolve_primary_source_via_you(q, freshness="week", limit=6)
        if not hit:
            hit = resolve_primary_source_via_you(q, freshness="month", limit=6)
        st["url"] = hit.get("url", "")
        st["primary_summary"] = hit.get("summary") or st.get("topic_summary") or ""
        st["primary_published"] = hit.get("published") or ""

    for tl in (parsed.get("tools") or [])[:6]:
        q = (tl.get("search_query") or f"{tl.get('name', '')} AI tool official website").strip()
        hit = resolve_primary_source_via_you(q, freshness="", limit=4)
        tl["url"] = hit.get("url", "")

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

    # Fill remaining slots from previous non-pinned tools if fewer than 5
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

    db.seed_from_existing_articles(articles_content)
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
        stories = radar.get("stories") or []
        tools = radar.get("tools") or []
        prompt_idea = radar.get("prompt_idea")
        print(
            f"  -> Parsed edition_type={edition_type}, stories={len(stories)}, "
            f"tools={len(tools)}, has_prompt={bool(prompt_idea)}"
        )

        published_from_email = 0
        # 1. Draft original AINE.WS articles from verified primary source URLs (max 2 per edition)
        for st in stories[:2]:
            primary_url = st.get("url") or ""
            st_title = (st.get("title") or "").strip()
            if not st_title or not is_valid_primary_url(primary_url):
                print(f"  -> Skipping story '{st_title[:55]}': no valid primary source URL resolved ('{primary_url[:60]}').")
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
                "summary": st.get("primary_summary") or st.get("topic_summary") or st_title,
                "published": st.get("primary_published") or full.get("created_at") or datetime.now(timezone.utc).isoformat(),
            }
            print(f"  -> Primary source resolved for '{st_title[:55]}': {primary_url}")
            if dry_run:
                print(f"  [DRY-RUN] Would draft original article for: {st_title}")
                published_from_email += 1
                continue
            try:
                art = nw.synthesize_and_repair_article(item, feed_source, existing_slugs, recent_images)
                new_articles.append(art)
                existing_slugs.add(art["slug"])
                recent_images.insert(0, art["featuredImage"])
                db.record_seen(primary_url, art["title"], feed_source["name"], published=True)
                published_from_email += 1
                print(f"  + Drafted original story: {art['title']} ({art['slug']})")
            except Exception as e:
                print(f"  -> Skipped story '{st_title[:45]}': {e}")

        # 2. Update Trending Tools ONLY when this edition includes tools
        tools_added = update_trending_tools(tools, dry_run=dry_run)
        if tools_added:
            print(f"  + Updated trendingTools.json ({tools_added} candidate tools merged).")

        # 3. Update Daily Business Prompt ONLY when this edition includes a prompt
        prompt_updated = update_daily_prompt(prompt_idea, f"AINE.WS {edition_type.title()} Edition", dry_run=dry_run)
        if prompt_updated:
            print("  + Updated dailyPrompt.json.")

        if not dry_run and (published_from_email > 0 or tools_added > 0 or prompt_updated):
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
                nw.record_publishing_ledger(
                    a["title"],
                    a["slug"],
                    a.get("_clean_words", 750),
                    "SUCCESS",
                    category=a["category"],
                )
            nw.push_search_engine_indexing(new_articles)
            print(f"[Superhuman Ingest] Published {len(new_articles)} original article(s) to articles.ts.")


if __name__ == "__main__":
    main()
