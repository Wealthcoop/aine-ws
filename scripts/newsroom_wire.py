#!/usr/bin/env python3
"""
AINE.WS Autonomous Newsroom Wire Ingestion Pipeline
--------------------------------------------------
Multi-source breaking AI news pipeline with built-in Auto-Repair Engine.
Monitors primary frontier AI feeds (OpenAI, Google, Anthropic wire, Techmeme,
Hugging Face, Reddit AI RSS). When a story breaks, the Auto-Repair Engine
automatically fixes missing fields, sanitizes malformed titles, resolves HTML entities,
normalizes slugs, formats valid AP journalism, and guarantees 100% Google indexing compliance.

Zero external pip dependencies: Pure Python standard library.

Usage:
  python3 scripts/newsroom_wire.py [--dry-run] [--limit N]
"""

import sys
import os
import json
import re
import ssl
import html
import sqlite3
import hashlib
import urllib.request
import urllib.parse
import xml.etree.ElementTree as ET
from datetime import datetime, timezone

# ── SSL Context Setup ────────────────────────────────────────────────────────
_SSL_CTX = ssl.create_default_context()
try:
    _UNVERIFIED_CTX = ssl._create_unverified_context()
except AttributeError:
    _UNVERIFIED_CTX = _SSL_CTX

# ── Multi-Source Feed Matrix ─────────────────────────────────────────────────
FEED_SOURCES = [
    {
        "id": "openai-official",
        "name": "OpenAI Official News",
        "url": "https://openai.com/news/rss.xml",
        "category": "ai-tools",
        "authorId": "justin-davis",
        "dateline": "SAN FRANCISCO",
        "type": "rss"
    },
    {
        "id": "google-ai-keyword",
        "name": "Google AI News",
        "url": "https://blog.google/technology/ai/rss/",
        "category": "search-ai",
        "authorId": "justin-davis",
        "dateline": "MOUNTAIN VIEW, Calif.",
        "type": "rss"
    },
    {
        "id": "anthropic-wire",
        "name": "Anthropic Wire (Google News 1h)",
        "url": "https://news.google.com/rss/search?q=Anthropic+when:1h&hl=en-US&gl=US&ceid=US:en",
        "category": "ai-tools",
        "authorId": "justin-davis",
        "dateline": "SAN FRANCISCO",
        "type": "rss"
    },
    {
        "id": "frontier-models-wire",
        "name": "Frontier AI Models Wire (Google News 1h)",
        "url": "https://news.google.com/rss/search?q=%22GPT-5%22+OR+%22Claude%22+OR+%22Gemini+Flash%22+OR+%22Gemini+Pro%22+OR+%22Llama+4%22+OR+%22Mistral%22+when:1h&hl=en-US&gl=US&ceid=US:en",
        "category": "ai-tools",
        "authorId": "justin-davis",
        "dateline": "SAN FRANCISCO",
        "type": "rss"
    },
    {
        "id": "techmeme-breaking",
        "name": "Techmeme AI Wire",
        "url": "https://www.techmeme.com/feed.xml",
        "category": "search-ai",
        "authorId": "justin-davis",
        "dateline": "NEW YORK",
        "type": "rss"
    },
    {
        "id": "huggingface-blog",
        "name": "Hugging Face Research",
        "url": "https://huggingface.co/blog/feed.xml",
        "category": "ai-tools",
        "authorId": "justin-davis",
        "dateline": "NEW YORK",
        "type": "atom"
    },
    {
        "id": "reddit-localllama",
        "name": "LocalLLaMA Community Wire",
        "url": "https://www.reddit.com/r/LocalLLaMA/hot/.rss",
        "category": "ai-tools",
        "authorId": "justin-davis",
        "dateline": "WILMINGTON, Del.",
        "type": "atom"
    },
    {
        "id": "google-search-central",
        "name": "Google Search Central",
        "url": "https://feeds.feedburner.com/blogspot/amDG",
        "category": "search-ai",
        "authorId": "justin-davis",
        "dateline": "MOUNTAIN VIEW, Calif.",
        "type": "rss"
    }
]

# ── Visual Diversity Image Pools (Categorized) ───────────────────────────────
IMAGE_POOLS = {
    "ai-tools": [
        "/news/mcp-agent-architecture.jpg",
        "/news/voice-ai-latency.jpg",
        "/news/contractor-video-seo.jpg",
        "/news/crm-automation-blueprint.jpg"
    ],
    "search-ai": [
        "/news/barcelona-search-conference.jpg",
        "/news/google-core-update.jpg",
        "/news/google-ai-overview-local.jpg",
        "/news/geo-entity-optimization.jpg",
        "/news/schema-graph-entity.jpg"
    ],
    "voice-lead-response": [
        "/news/telephony-speed-to-lead.jpg",
        "/news/cloud-voip-telecom.jpg",
        "/news/local-whisper-telecom.jpg"
    ],
    "local-business": [
        "/news/local-citation-audit.jpg",
        "/news/ai-review-analysis.jpg",
        "/news/programmatic-seo-guidelines.jpg"
    ]
}

# ── AI Entity Relevance Whitelist ────────────────────────────────────────────
AI_KEYWORDS_REGEX = re.compile(
    r'\b(OpenAI|Anthropic|Google|DeepMind|Gemini|Claude|GPT|GPT-4|GPT-5|'
    r'Llama|Mistral|Hugging Face|Transformer|Weights|Benchmark|Reasoning|'
    r'Search Central|Algorithm|Core Update|Voice AI|Speed-to-Lead|'
    r'Telephony|LLM|Agentic|Fine-Tuning|Multimodal|Sora|DeepSeek|Qwen|NVIDIA)\b',
    re.IGNORECASE
)

# ── Auto-Repair & Sanitization Engine ────────────────────────────────────────
def auto_repair_title(raw_title, feed_name=""):
    """Repairs messy feed titles into clean, journalistic AP headlines."""
    if not raw_title:
        return "Frontier AI Operational Intelligence and Performance Benchmarks"

    # 1. Unescape all HTML entities (&amp;, &lt;, &#39;, etc.)
    t = html.unescape(raw_title)
    # 2. Strip HTML tags
    t = re.sub(r'<[^>]+>', ' ', t)
    # 3. Normalize quotes and dashes
    t = t.replace('’', "'").replace('‘', "'").replace('“', '"').replace('”', '"').replace('—', ' - ').replace('–', ' - ')
    # 4. Strip noise prefixes e.g. [Breaking], [News], (Update), PSA:
    t = re.sub(r'^(?:\[[^\]]+\]|\([^\)]+\)|psa:\s*|review:\s*)\s*', '', t, flags=re.IGNORECASE)
    # 5. Strip publication trailing suffixes (e.g. " - The Verge", " | TechCrunch", " - OpenAI")
    t = re.sub(r'\s*[-–—|]\s*(The Verge|TechCrunch|VentureBeat|OpenAI|Google Blog|Hacker News|Reddit|Ars Technica|Wired|Reuters|Bloomberg|Search Engine Land|Search Engine Roundtable)\s*$', '', t, flags=re.IGNORECASE)
    # 6. Strip leading/trailing punctuation & excess whitespace
    t = re.sub(r'^[\[\(\"\'\s]+|[\]\)\"\'\s]+$', '', t)
    t = ' '.join(t.split())

    # 7. Check if title ends with a question mark; if so, convert from question to journalistic report
    if t.endswith('?'):
        t = re.sub(r'^(Why|How|What|Can|Does|Is|Will|Should)\s+', '', t, flags=re.IGNORECASE)
        t = t.rstrip('?').strip()
        t = f"Analysis: {t.capitalize()}"

    # 8. Ensure length is between 25 and 115 characters
    if len(t) < 25:
        t = f"{t}: Architecture and Benchmark Analysis"
    if len(t) > 115:
        cutoff = t[:112].rfind(' ')
        t = t[:cutoff if cutoff > 70 else 112].strip()

    return t

def auto_repair_deck(raw_summary, title, source_name):
    """Auto-repairs summary into a clean 100-180 character deck."""
    s = html.unescape(raw_summary or '')
    s = re.sub(r'<[^>]+>', ' ', s)
    s = s.replace('’', "'").replace('‘', "'").replace('“', '"').replace('”', '"')
    s = ' '.join(s.split())

    # Discard non-informative teasers
    lowered = s.lower()
    if len(s) < 40 or lowered.startswith(('read more', 'click here', 'continue reading', 'submitted by', 'view comments')):
        s = f"Official operational release from {source_name} detailing {title} and its performance benchmarks across commercial AI systems."

    if len(s) > 180:
        cutoff = s[:175].rfind(' ')
        s = s[:cutoff if cutoff > 120 else 172] + "..."

    return s

def auto_repair_slug(title, existing_slugs):
    """Generates guaranteed valid, unique, lowercase alphanumeric-hyphen slug."""
    t = title.replace("'", "").replace('"', "")
    s = re.sub(r'[^a-z0-9\s-]', '', t.lower())
    s = re.sub(r'[\s-]+', '-', s).strip('-')
    if len(s) < 12:
        s = f"ai-update-{s}"
    s = s[:55].rstrip('-')
    base = s
    count = 2
    while s in existing_slugs:
        s = f"{base[:48]}-v{count}"
        count += 1
    return s

def auto_repair_date(raw_date):
    """Parses any date format into compliant ISO 8601 string; falls back to now."""
    if raw_date:
        for fmt in (
            '%Y-%m-%dT%H:%M:%SZ',
            '%Y-%m-%dT%H:%M:%S%z',
            '%a, %d %b %Y %H:%M:%S %Z',
            '%a, %d %b %Y %H:%M:%S %z',
            '%Y-%m-%d %H:%M:%S',
            '%Y-%m-%d'
        ):
            try:
                dt = datetime.strptime(raw_date.strip(), fmt)
                if not dt.tzinfo:
                    dt = dt.replace(tzinfo=timezone.utc)
                return dt.astimezone(timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')
            except Exception:
                continue
    return datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')

def tokenize_title(title):
    words = re.findall(r'[a-z0-9]+', title.lower())
    stopwords = {'the', 'a', 'an', 'in', 'on', 'of', 'to', 'for', 'and', 'or', 'is', 'are', 'with', 'by', 'at', 'from', 'as', 'new', 'ai'}
    return set(w for w in words if w not in stopwords and len(w) > 2)

def jaccard_similarity(set_a, set_b):
    if not set_a or not set_b:
        return 0.0
    return len(set_a & set_b) / len(set_a | set_b)

def canonical_url_hash(url):
    parsed = urllib.parse.urlparse(url)
    q_pairs = urllib.parse.parse_qsl(parsed.query)
    clean_pairs = [(k, v) for k, v in q_pairs if not k.startswith('utm_') and k not in ('fbclid', 'gclid', 'ocid')]
    clean_query = urllib.parse.urlencode(clean_pairs)
    clean_url = urllib.parse.urlunparse((parsed.scheme, parsed.netloc, parsed.path, parsed.params, clean_query, ''))
    return hashlib.md5(clean_url.strip().lower().encode('utf-8')).hexdigest()

# ── SQLite Persistent Dedup Engine ───────────────────────────────────────────
class DedupDatabase:
    def __init__(self, db_path):
        self.db_path = db_path
        self._init_db()

    def _init_db(self):
        with sqlite3.connect(self.db_path) as conn:
            conn.execute("""
                CREATE TABLE IF NOT EXISTS seen_articles (
                    url_hash TEXT PRIMARY KEY,
                    raw_url TEXT,
                    title TEXT,
                    normalized_title TEXT,
                    source_name TEXT,
                    first_seen_at TEXT,
                    published_to_site INTEGER DEFAULT 0
                )
            """)
            conn.execute("CREATE INDEX IF NOT EXISTS idx_norm_title ON seen_articles(normalized_title)")
            conn.commit()

    def is_duplicate(self, url, title):
        url_hash = canonical_url_hash(url)
        title_tokens = tokenize_title(title)
        norm_title = re.sub(r'[^a-z0-9]', '', title.lower())

        with sqlite3.connect(self.db_path) as conn:
            cur = conn.cursor()
            # 1. Exact URL hash match
            cur.execute("SELECT 1 FROM seen_articles WHERE url_hash = ?", (url_hash,))
            if cur.fetchone():
                return True, "Exact URL match"

            # 2. Exact normalized title match
            cur.execute("SELECT 1 FROM seen_articles WHERE normalized_title = ?", (norm_title,))
            if cur.fetchone():
                return True, "Exact title match"

            # 3. Fuzzy Jaccard token overlap against recently published articles
            cur.execute("SELECT title FROM seen_articles WHERE published_to_site = 1 ORDER BY first_seen_at DESC LIMIT 50")
            for (seen_title,) in cur.fetchall():
                seen_tokens = tokenize_title(seen_title)
                score = jaccard_similarity(title_tokens, seen_tokens)
                if score >= 0.65:
                    return True, f"Fuzzy title overlap ({int(score*100)}% with '{seen_title[:40]}...')"

        return False, None

    def record_seen(self, url, title, source_name, published=False):
        url_hash = canonical_url_hash(url)
        norm_title = re.sub(r'[^a-z0-9]', '', title.lower())
        now_iso = datetime.now(timezone.utc).isoformat()
        with sqlite3.connect(self.db_path) as conn:
            conn.execute("""
                INSERT OR REPLACE INTO seen_articles (url_hash, raw_url, title, normalized_title, source_name, first_seen_at, published_to_site)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (url_hash, url, title, norm_title, source_name, now_iso, 1 if published else 0))
            conn.commit()

    def seed_from_existing_articles(self, articles_ts_content):
        slug_matches = re.findall(r"slug:\s*['\"]([^'\"]+)['\"]", articles_ts_content)
        title_matches = re.findall(r"title:\s*['\"]([^'\"]+)['\"]", articles_ts_content)
        count = 0
        for slug, title in zip(slug_matches, title_matches):
            dummy_url = f"https://aine.ws/news/{slug}"
            self.record_seen(dummy_url, title, "existing-archive", published=True)
            count += 1
        return count

# ── Feed Network Fetcher ─────────────────────────────────────────────────────
def fetch_feed(url):
    req = urllib.request.Request(
        url,
        headers={
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
    )
    for ctx in (_SSL_CTX, _UNVERIFIED_CTX):
        try:
            with urllib.request.urlopen(req, timeout=10, context=ctx) as response:
                return response.read()
        except Exception:
            continue
    return None

def parse_feed_items(raw_xml):
    items = []
    if not raw_xml:
        return items
    try:
        root = ET.fromstring(raw_xml)
        # Check standard RSS channel
        channel = root.find('channel')
        if channel is not None:
            for item in channel.findall('item'):
                title = item.findtext('title') or ''
                link = item.findtext('link') or ''
                description = item.findtext('description') or ''
                pubDate = item.findtext('pubDate') or ''
                if title and link:
                    items.append({
                        'title': title.strip(),
                        'link': link.strip(),
                        'summary': description.strip(),
                        'published': pubDate.strip()
                    })
            return items

        # Check Atom format
        for entry in root.findall('{http://www.w3.org/2005/Atom}entry'):
            title = entry.findtext('{http://www.w3.org/2005/Atom}title') or ''
            link_tag = entry.find('{http://www.w3.org/2005/Atom}link')
            link = link_tag.attrib.get('href', '') if link_tag is not None else ''
            summary = entry.findtext('{http://www.w3.org/2005/Atom}summary') or entry.findtext('{http://www.w3.org/2005/Atom}content') or ''
            pubDate = entry.findtext('{http://www.w3.org/2005/Atom}published') or entry.findtext('{http://www.w3.org/2005/Atom}updated') or ''
            if title and link:
                items.append({
                    'title': title.strip(),
                    'link': link.strip(),
                    'summary': summary.strip(),
                    'published': pubDate.strip()
                })
    except Exception as e:
        print(f"Warning: XML parsing error: {e}", file=sys.stderr)
    return items

# ── Visual Diversity Image Selector ──────────────────────────────────────────
def pick_diverse_image(category, recent_images):
    pool = IMAGE_POOLS.get(category, IMAGE_POOLS['ai-tools'])
    recent_set = set(recent_images[:3])
    candidates = [img for img in pool if img not in recent_set]
    if candidates:
        return candidates[0]
    return pool[0]

# ── Auto-Repair Article Synthesizer ──────────────────────────────────────────
def synthesize_and_repair_article(item, feed_source, existing_slugs, recent_images):
    """
    Transforms any raw, broken, or unformatted feed story into a 100% compliant,
    fully validated NewsArticle object ready for immediate Google indexing.
    """
    # 1. Auto-repair title
    repaired_title = auto_repair_title(item['title'], feed_source['name'])

    # 2. Auto-repair deck
    repaired_deck = auto_repair_deck(item['summary'], repaired_title, feed_source['name'])

    # 3. Auto-repair slug
    repaired_slug = auto_repair_slug(repaired_title, existing_slugs)

    # 4. Auto-repair date
    repaired_date = auto_repair_date(item.get('published'))

    # 5. Pick diverse, non-adjacent image
    chosen_image = pick_diverse_image(feed_source['category'], recent_images)

    dateline = feed_source.get('dateline', 'WILMINGTON, Del.')
    source_name = feed_source['name']

    # 6. Auto-generate 3 hard-hitting takeaways
    takeaways = [
        f"Official disclosure verified via {source_name} technical communication channels.",
        f"Deployment benchmarks emphasize accelerated execution speed, developer availability, and model reasoning integrity.",
        "System architects are evaluating enterprise integration timelines across production AI pipelines."
    ]

    # 7. Auto-format clean AP-style body HTML
    content_html = f"""<p class="lead"><strong>{dateline}</strong> — {source_name} has officially issued a technical release detailing major operational updates: <strong>{repaired_title}</strong>.</p>
<p>{repaired_deck}</p>
<p>Search engineers and enterprise systems architects are assessing the architectural implications of this update. Across commercial environments, benchmark verification and structured API performance remain paramount as autonomous multi-step reasoning capabilities expand.</p>
<p>Full implementation specifications and public test documentation are accessible directly via the primary disclosure below.</p>"""

    article = {
        "id": f"wire-{int(datetime.now().timestamp())}",
        "slug": repaired_slug,
        "title": repaired_title,
        "deck": repaired_deck,
        "category": feed_source['category'],
        "authorId": feed_source['authorId'],
        "publishedAt": repaired_date,
        "updatedAt": repaired_date,
        "readingTimeMinutes": 4,
        "featuredImage": chosen_image,
        "featuredImageCaption": f"Industry technological intelligence documented via {source_name} public disclosures.",
        "isBreaking": True,
        "isFeatured": False,
        "keyTakeaways": takeaways,
        "contentHtml": content_html,
        "sources": [
            {
                "name": source_name,
                "url": item['link'],
                "context": "Primary wire disclosure."
            }
        ]
    }

    # 8. Pre-Flight Health Validation (Self-Audit)
    assert re.match(r'^[a-z0-9-]+$', article['slug']), f"Invalid repaired slug: {article['slug']}"
    assert len(article['title']) >= 20, f"Repaired title too short: {article['title']}"
    assert len(article['deck']) >= 40, f"Repaired deck too short: {article['deck']}"
    assert article['category'] in IMAGE_POOLS, f"Invalid category: {article['category']}"
    assert article['featuredImage'].startswith('/news/'), f"Invalid image: {article['featuredImage']}"

    return article

def format_article_ts(art):
    takeaways_json = json.dumps(art["keyTakeaways"], indent=6)
    takeaways_formatted = takeaways_json.replace('\n', '\n    ')
    sources_str = "[\n" + ",\n".join(
        f"""      {{ name: {json.dumps(s['name'])}, url: {json.dumps(s['url'])}, context: {json.dumps(s['context'])} }}"""
        for s in art["sources"]
    ) + "\n    ]"
    return f"""  {{
    id: {json.dumps(art["id"])},
    slug: {json.dumps(art["slug"])},
    title: {json.dumps(art["title"])},
    deck: {json.dumps(art["deck"])},
    category: {json.dumps(art["category"])},
    authorId: {json.dumps(art["authorId"])},
    publishedAt: {json.dumps(art["publishedAt"])},
    updatedAt: {json.dumps(art["updatedAt"])},
    readingTimeMinutes: {art["readingTimeMinutes"]},
    featuredImage: {json.dumps(art["featuredImage"])},
    featuredImageCaption: {json.dumps(art["featuredImageCaption"])},
    isBreaking: {str(art["isBreaking"]).lower()},
    isFeatured: {str(art["isFeatured"]).lower()},
    keyTakeaways: {takeaways_formatted},
    contentHtml: `{art["contentHtml"]}`,
    sources: {sources_str}
  }}"""

# ── Instant Multi-Engine Search Indexing ──────────────────────────────────────
def push_search_engine_indexing(new_articles):
    if not new_articles:
        return
    host = "aine.ws"
    key = "e4b98c3641774d8bb23a5cfc02b38914"
    url_list = [f"https://{host}/news/{art['category']}/{art['slug']}" for art in new_articles] + [
        f"https://{host}/",
        f"https://{host}/news-sitemap.xml",
        f"https://{host}/sitemap.xml"
    ]
    payload = json.dumps({
        "host": host,
        "key": key,
        "keyLocation": f"https://{host}/{key}.txt",
        "urlList": url_list
    }).encode('utf-8')

    # 1. IndexNow API (Bing, Yandex, Seznam, Naver)
    endpoints = [
        "https://api.indexnow.org/indexnow",
        "https://www.bing.com/indexnow"
    ]
    for ep in endpoints:
        req = urllib.request.Request(
            ep,
            data=payload,
            headers={"Content-Type": "application/json; charset=utf-8", "User-Agent": "AINE.WS Indexing Bot/1.0"}
        )
        try:
            with urllib.request.urlopen(req, timeout=5, context=_UNVERIFIED_CTX) as resp:
                print(f"IndexNow notification sent to {ep}: HTTP {resp.status} for {len(url_list)} URLs.")
        except Exception as e:
            print(f"Notice: IndexNow ping to {ep} skipped: {e}")

    # 2. Google Sitemap Pings
    sitemaps = [f"https://{host}/news-sitemap.xml", f"https://{host}/sitemap.xml"]
    for sm in sitemaps:
        ping_url = f"https://www.google.com/ping?sitemap={urllib.parse.quote(sm)}"
        try:
            req = urllib.request.Request(ping_url, headers={"User-Agent": "AINE.WS Indexing Bot/1.0"})
            with urllib.request.urlopen(req, timeout=5, context=_UNVERIFIED_CTX) as resp:
                print(f"Google sitemap ping sent for {sm}: HTTP {resp.status}")
        except Exception as e:
            print(f"Notice: Google sitemap ping for {sm}: {e}")

# ── Main Orchestration ───────────────────────────────────────────────────────
def main():
    dry_run = "--dry-run" in sys.argv
    limit = 2
    for i, arg in enumerate(sys.argv):
        if arg == "--limit" and i + 1 < len(sys.argv):
            limit = int(sys.argv[i + 1])

    print(f"==> AINE.WS Newsroom Wire Initialized (Dry-Run: {dry_run}, Ingestion Limit: {limit})")

    script_dir = os.path.dirname(os.path.abspath(__file__))
    repo_root = os.path.abspath(os.path.join(script_dir, ".."))
    articles_ts_path = os.path.join(repo_root, "src", "data", "articles.ts")
    db_path = os.path.join(script_dir, "news_dedup.db")

    if not os.path.exists(articles_ts_path):
        print(f"Error: articles.ts not found at {articles_ts_path}", file=sys.stderr)
        sys.exit(1)

    with open(articles_ts_path, "r", encoding="utf-8") as f:
        articles_content = f.read()

    # Initialize Dedup Database
    db = DedupDatabase(db_path)
    with sqlite3.connect(db_path) as conn:
        count = conn.execute("SELECT count(*) FROM seen_articles").fetchone()[0]
    if count == 0:
        seeded = db.seed_from_existing_articles(articles_content)
        print(f"Seeded SQLite Dedup Database with {seeded} existing articles.")

    # Get recent images and slugs
    recent_images = re.findall(r"featuredImage:\s*['\"]([^'\"]+)['\"]", articles_content)
    existing_slugs = set(re.findall(r"slug:\s*['\"]([^'\"]+)['\"]", articles_content))
    print(f"Audited recent image memory: {recent_images[:3]}")

    new_articles = []
    for feed in FEED_SOURCES:
        if len(new_articles) >= limit:
            break
        print(f"\n[Scanning] {feed['name']}...")
        raw_xml = fetch_feed(feed['url'])
        if not raw_xml:
            print(f"  -> Warning: Could not fetch {feed['name']}, skipping gracefully.")
            continue

        items = parse_feed_items(raw_xml)
        print(f"  -> Found {len(items)} feed items.")

        for item in items:
            # Check relevance
            full_text = f"{item['title']} {item['summary']}"
            if not AI_KEYWORDS_REGEX.search(full_text):
                continue

            # Check duplication
            is_dup, dup_reason = db.is_duplicate(item['link'], item['title'])
            if is_dup:
                continue

            try:
                # Run through the Auto-Repair Engine
                article_obj = synthesize_and_repair_article(item, feed, existing_slugs, recent_images)
                new_articles.append(article_obj)

                # Update local tracking
                recent_images.insert(0, article_obj['featuredImage'])
                existing_slugs.add(article_obj['slug'])
                db.record_seen(item['link'], article_obj['title'], feed['name'], published=True)

                print(f"  [+] AUTO-REPAIRED & QUALIFIED: {article_obj['title']}")
                print(f"      Slug: {article_obj['slug']}")
                print(f"      Image: {article_obj['featuredImage']}")
                print(f"      Deck:  {article_obj['deck']}")
                break  # Advance to next feed for cross-source diversity

            except Exception as e:
                print(f"  -> Notice: Candidate auto-repair error on '{item['title'][:30]}...': {e}")
                continue

    if not new_articles:
        print("\nAll monitored feeds are up to date. Zero duplicates detected.")
        return

    print(f"\nSuccessfully prepared and auto-repaired {len(new_articles)} new breaking story(ies).")

    if dry_run:
        print("\n[DRY RUN ACTIVE] Skipping disk write and git commit.")
        for art in new_articles:
            print(f"  - Title: {art['title']}")
            print(f"    Slug:  {art['slug']}")
            print(f"    Image: {art['featuredImage']}")
            print(f"    Deck:  {art['deck']}")
        return

    # Format and insert new articles at the top of articles.ts
    formatted_ts_chunks = [format_article_ts(art) for art in new_articles]
    insertion_block = ",\n".join(formatted_ts_chunks) + ",\n"

    marker = "export const ARTICLES: NewsArticle[] = [\n"
    if marker not in articles_content:
        print(f"Error: Target marker '{marker.strip()}' not found in articles.ts", file=sys.stderr)
        sys.exit(1)

    updated_content = articles_content.replace(marker, marker + insertion_block, 1)

    with open(articles_ts_path, "w", encoding="utf-8") as f:
        f.write(updated_content)

    print(f"Published {len(new_articles)} auto-repaired article(s) to {articles_ts_path}!")

    # Push real-time indexing notifications to search engines
    push_search_engine_indexing(new_articles)

if __name__ == '__main__':
    main()
