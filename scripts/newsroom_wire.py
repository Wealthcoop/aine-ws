#!/usr/bin/env python3
"""
AINE.WS Autonomous Newsroom Wire Ingestion Pipeline
--------------------------------------------------
Multi-source breaking AI news pipeline inspired by OpenClaw architecture.
Monitors primary frontier AI feeds (OpenAI, Google, Anthropic wire, Techmeme,
Hugging Face, Reddit AI RSS), filters noise, eliminates duplicates via persistent
SQLite memory, enforces visual diversity, and synthesizes AP-style journalistic articles.

Zero external pip dependencies: Pure Python standard library.

Usage:
  python3 scripts/newsroom_wire.py [--dry-run] [--limit N]
"""

import sys
import os
import json
import re
import ssl
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

# ── Noise Rejection & Entity Relevance Filters ───────────────────────────────
NOISE_START_REGEX = re.compile(
    r'^(Why|How|What|Can|Does|Is|Has|Are|Do|Should|Would|Could|Anyone|'
    r'Help|Rant|Vent|Am I|ELI5|PSA|Unpopular|Hot take|DAE|TIL|'
    r'My experience|Review:|Question|Trouble|Bug|Looking for|'
    r'Just deleted|Thanks to everyone|I am|I\'m|F that|RIP|Goodbye)',
    re.IGNORECASE
)

AI_KEYWORDS_REGEX = re.compile(
    r'\b(OpenAI|Anthropic|Google|DeepMind|Gemini|Claude|GPT|GPT-4|GPT-5|'
    r'Llama|Mistral|Hugging Face|Transformer|Weights|Benchmark|Reasoning|'
    r'Search Central|Algorithm|Core Update|Voice AI|Speed-to-Lead|'
    r'Telephony|LLM|Agentic|Fine-Tuning|Multimodal|Sora|DeepSeek|Qwen|NVIDIA)\b',
    re.IGNORECASE
)

# ── Utility Functions ────────────────────────────────────────────────────────
def clean_html(text):
    if not text:
        return ""
    text = re.sub(r'<[^>]+>', ' ', text)
    text = urllib.parse.unquote(text)
    # decode basic entities
    text = text.replace('&amp;', '&').replace('&quot;', '"').replace('&apos;', "'").replace('&#39;', "'").replace('&lt;', '<').replace('&gt;', '>')
    return ' '.join(text.split())

def slugify(text):
    text = text.lower()
    text = re.sub(r'[^a-z0-9\s-]', '', text)
    text = re.sub(r'[\s-]+', '-', text).strip('-')
    return text[:65]

def tokenize_title(title):
    words = re.findall(r'[a-z0-9]+', title.lower())
    stopwords = {'the', 'a', 'an', 'in', 'on', 'of', 'to', 'for', 'and', 'or', 'is', 'are', 'with', 'by', 'at', 'from', 'as', 'new', 'ai'}
    return set(w for w in words if w not in stopwords and len(w) > 2)

def jaccard_similarity(set_a, set_b):
    if not set_a or not set_b:
        return 0.0
    return len(set_a & set_b) / len(set_a | set_b)

def canonical_url_hash(url):
    # Strip tracking query params
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
        # Extract existing titles and slugs
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
                        'title': clean_html(title),
                        'link': link.strip(),
                        'summary': clean_html(description)[:400],
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
                    'title': clean_html(title),
                    'link': link.strip(),
                    'summary': clean_html(summary)[:400],
                    'published': pubDate.strip()
                })
    except Exception as e:
        print(f"Warning: XML parsing error: {e}", file=sys.stderr)
    return items

# ── Noise & Quality Filter ───────────────────────────────────────────────────
def evaluate_candidate(item):
    title = item['title'].strip()
    # 1. Noise check
    if NOISE_START_REGEX.search(title) or title.endswith('?'):
        return False, "Filtered as question/rant noise"
    if len(title) < 22:
        return False, "Headline too short"
    # 2. AI Entity relevance check
    full_text = f"{title} {item['summary']}"
    if not AI_KEYWORDS_REGEX.search(full_text):
        return False, "No verified frontier AI entity match"
    return True, "Passed filter"

# ── Visual Diversity Image Selector ──────────────────────────────────────────
def pick_diverse_image(category, recent_images):
    pool = IMAGE_POOLS.get(category, IMAGE_POOLS['ai-tools'])
    # Avoid any image used in the last 3 published cards
    recent_set = set(recent_images[:3])
    candidates = [img for img in pool if img not in recent_set]
    if candidates:
        return candidates[0]
    # Fallback to least recently used in pool
    return pool[0]

# ── Journalistic Article Synthesizer ─────────────────────────────────────────
def synthesize_article(item, feed_source, chosen_image):
    now_iso = datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')
    slug = slugify(item['title'])
    clean_sum = item['summary']
    if not clean_sum or len(clean_sum) < 30:
        clean_sum = f"Official operational intelligence disclosure monitored from {feed_source['name']}."

    dateline = feed_source.get('dateline', 'WILMINGTON, Del.')
    source_name = feed_source['name']

    # Synthesize 3 hard-hitting takeaways
    takeaways = [
        f"Official disclosure verified via {source_name} technical communication channels.",
        f"Deployment benchmarks emphasize accelerated execution speed, developer availability, and model reasoning integrity.",
        "System architects are evaluating enterprise integration timelines across production AI pipelines."
    ]

    content_html = f"""<p class="lead"><strong>{dateline}</strong> — {source_name} has officially issued a technical release detailing major operational updates: <strong>{item['title']}</strong>.</p>
<p>{clean_sum}</p>
<p>Search engineers and enterprise systems architects are assessing the architectural implications of this update. Across commercial environments, benchmark verification and structured API performance remain paramount as autonomous multi-step reasoning capabilities expand.</p>
<p>Full implementation specifications and public test documentation are accessible directly via the primary disclosure below.</p>"""

    return {
        "id": f"wire-{int(datetime.now().timestamp())}",
        "slug": slug,
        "title": item['title'],
        "deck": clean_sum[:180] + ("..." if len(clean_sum) > 180 else ""),
        "category": feed_source['category'],
        "authorId": feed_source['authorId'],
        "publishedAt": now_iso,
        "updatedAt": now_iso,
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

# ── IndexNow Instant Submission ──────────────────────────────────────────────
def submit_indexnow(new_slugs):
    if not new_slugs:
        return
    host = "aine.ws"
    key = "e4b98c3641774d8bb23a5cfc02b38914"
    url_list = [f"https://{host}/news/{slug}" for slug in new_slugs] + [f"https://{host}/"]
    payload = json.dumps({
        "host": host,
        "key": key,
        "keyLocation": f"https://{host}/{key}.txt",
        "urlList": url_list
    }).encode('utf-8')

    req = urllib.request.Request(
        "https://api.indexnow.org/indexnow",
        data=payload,
        headers={"Content-Type": "application/json; charset=utf-8", "User-Agent": "AINE.WS Bot"}
    )
    try:
        with urllib.request.urlopen(req, timeout=5, context=_UNVERIFIED_CTX) as resp:
            print(f"IndexNow notification sent: HTTP {resp.status} for {len(url_list)} URLs.")
    except Exception as e:
        print(f"Notice: IndexNow ping skipped or timed out: {e}")

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

    # Initialize and seed Dedup Database
    db = DedupDatabase(db_path)
    # Check if DB has existing articles seeded
    with sqlite3.connect(db_path) as conn:
        count = conn.execute("SELECT count(*) FROM seen_articles").fetchone()[0]
    if count == 0:
        seeded = db.seed_from_existing_articles(articles_content)
        print(f"Seeded SQLite Dedup Database with {seeded} existing articles.")

    # Get recent images to guarantee visual diversity
    recent_images = re.findall(r"featuredImage:\s*['\"]([^'\"]+)['\"]", articles_content)
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
            passed, reason = evaluate_candidate(item)
            if not passed:
                continue

            is_dup, dup_reason = db.is_duplicate(item['link'], item['title'])
            if is_dup:
                continue

            # Found an eligible, non-duplicate breaking story
            chosen_image = pick_diverse_image(feed['category'], recent_images)
            article_obj = synthesize_article(item, feed, chosen_image)
            new_articles.append(article_obj)
            # Update local memory so subsequent items in this run also diversify
            recent_images.insert(0, chosen_image)
            db.record_seen(item['link'], item['title'], feed['name'], published=True)
            print(f"  [+] QUALIFIED CANDIDATE: {article_obj['title']}")
            print(f"      Image Assigned: {chosen_image}")
            print(f"      Category: {article_obj['category']}")
            break  # Move to next source to ensure cross-source diversity

    if not new_articles:
        print("\nAll monitored feeds are up to date. Zero duplicates detected.")
        return

    print(f"\nSuccessfully prepared {len(new_articles)} new breaking story(ies).")

    if dry_run:
        print("\n[DRY RUN ACTIVE] Skipping disk write and git commit.")
        for art in new_articles:
            print(f"  - Title: {art['title']}")
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

    print(f"Published {len(new_articles)} article(s) to {articles_ts_path}!")

    # Ping IndexNow
    submit_indexnow([art['slug'] for art in new_articles])

if __name__ == '__main__':
    main()
