#!/usr/bin/env python3
"""
AINE.WS Autonomous Newsroom Wire Ingestion Pipeline
--------------------------------------------------
Monitors primary technology RSS feeds, extracts algorithm updates and telephony benchmarks,
and synthesizes AP-style journalistic articles for continuous publication freshness.

Usage:
  python3 scripts/newsroom_wire.py [--dry-run] [--category CATEGORY]
"""

import sys
import os
import json
import re
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timezone

# Allowed categories in src/types/news.ts: 'search-ai' | 'local-business' | 'voice-lead-response' | 'ai-tools'
FEED_SOURCES = [
    {
        "name": "Google Search Central",
        "url": "https://feeds.feedburner.com/blogspot/amDG",
        "category": "search-ai",
        "authorId": "justin-davis",
        "image": "/news/google-core-update.jpg",
    },
    {
        "name": "Search Engine Roundtable",
        "url": "https://feeds.feedburner.com/SearchEngineRoundtable1",
        "category": "search-ai",
        "authorId": "justin-davis",
        "image": "/news/google-ai-overview-local.jpg",
    },
    {
        "name": "Search Engine Land",
        "url": "https://searchengineland.com/feed",
        "category": "search-ai",
        "authorId": "justin-davis",
        "image": "/news/geo-entity-optimization.jpg",
    },
    {
        "name": "OpenAI News",
        "url": "https://openai.com/news/rss.xml",
        "category": "ai-tools",
        "authorId": "justin-davis",
        "image": "/news/mcp-agent-architecture.jpg",
    },
]

def clean_text(raw_html):
    cleanr = re.compile('<.*?>')
    cleantext = re.sub(cleanr, '', raw_html)
    return ' '.join(cleantext.split())

def slugify(text):
    text = text.lower()
    text = re.sub(r'[^a-z0-9\s-]', '', text)
    text = re.sub(r'[\s-]+', '-', text).strip('-')
    return text[:60]

import ssl

def fetch_feed(url):
    req = urllib.request.Request(
        url,
        headers={'User-Agent': 'AINE.WS News Wire Bot/1.0 (+https://aine.ws)'}
    )
    try:
        ctx = ssl.create_default_context()
        with urllib.request.urlopen(req, timeout=10, context=ctx) as response:
            return response.read()
    except Exception:
        try:
            unverified_ctx = ssl._create_unverified_context()
            with urllib.request.urlopen(req, timeout=10, context=unverified_ctx) as response:
                return response.read()
        except Exception as e:
            print(f"Warning: Could not fetch {url}: {e}", file=sys.stderr)
            return None

def parse_rss_or_atom(xml_data):
    items = []
    try:
        root = ET.fromstring(xml_data)
        # Check RSS 2.0
        channel = root.find('channel')
        if channel is not None:
            for item in channel.findall('item'):
                title = item.findtext('title') or ''
                link = item.findtext('link') or ''
                description = item.findtext('description') or ''
                pubDate = item.findtext('pubDate') or ''
                if title:
                    items.append({
                        'title': title.strip(),
                        'link': link.strip(),
                        'summary': clean_text(description)[:300],
                        'published': pubDate.strip()
                    })
            return items

        # Check Atom
        for entry in root.findall('{http://www.w3.org/2005/Atom}entry'):
            title = entry.findtext('{http://www.w3.org/2005/Atom}title') or ''
            link_tag = entry.find('{http://www.w3.org/2005/Atom}link')
            link = link_tag.attrib.get('href', '') if link_tag is not None else ''
            summary = entry.findtext('{http://www.w3.org/2005/Atom}summary') or entry.findtext('{http://www.w3.org/2005/Atom}content') or ''
            pubDate = entry.findtext('{http://www.w3.org/2005/Atom}published') or entry.findtext('{http://www.w3.org/2005/Atom}updated') or ''
            if title:
                items.append({
                    'title': title.strip(),
                    'link': link.strip(),
                    'summary': clean_text(summary)[:300],
                    'published': pubDate.strip()
                })
    except Exception as e:
        print(f"XML Parsing error: {e}", file=sys.stderr)
    return items

def generate_article_obj(item, feed_source):
    now_iso = datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')
    slug = slugify(item['title'])
    
    clean_summary = item['summary'] or "Real-time algorithmic and technical intelligence report tracked by the AINE.WS wire."
    
    return {
        "id": f"wire-{int(datetime.now().timestamp())}",
        "slug": slug,
        "title": item['title'],
        "deck": clean_summary,
        "category": feed_source['category'],
        "authorId": feed_source['authorId'],
        "publishedAt": now_iso,
        "updatedAt": now_iso,
        "readingTimeMinutes": 4,
        "featuredImage": feed_source.get("image", "/news/google-core-update.jpg"),
        "featuredImageCaption": f"Industry search intelligence tracked via {feed_source['name']} public updates.",
        "isBreaking": False,
        "isFeatured": False,
        "keyTakeaways": [
            f"Official update documented from {feed_source['name']} technical disclosures.",
            "Analysis focuses on how search visibility, ranking criteria, and AI citations are impacted.",
            "AINE.WS editorial desk is tracking real-world ranking shifts across local and national search markets."
        ],
        "contentHtml": f"""<p class="lead"><strong>WILMINGTON, Del.</strong> — The AINE.WS editorial newsroom is covering a new search development from {feed_source['name']}: {item['title']}.</p>
<p>{clean_summary}</p>
<p>According to analysis from the AINE.WS editorial desk, the update directly influences how search engines evaluate business authority, answer local queries, and surface commercial listings.</p>
<p>Business operators and search professionals are advised to review site performance and structured schema to ensure uninterrupted organic search reach.</p>""",
        "sources": [
            {
                "name": feed_source['name'],
                "url": item['link'] or "https://aine.ws",
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

def get_articles_ts_path():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    repo_root = os.path.abspath(os.path.join(script_dir, ".."))
    return os.path.join(repo_root, "src", "data", "articles.ts")

def get_existing_slugs(articles_ts_content):
    return set(re.findall(r"slug:\s*['\"]([^'\"]+)['\"]", articles_ts_content))

def main():
    dry_run = "--dry-run" in sys.argv
    print(f"==> AINE.WS Newsroom Wire Pipeline Initialized (Dry-Run: {dry_run})")
    
    articles_ts_path = get_articles_ts_path()
    if not os.path.exists(articles_ts_path):
        print(f"Error: articles.ts not found at {articles_ts_path}", file=sys.stderr)
        sys.exit(1)
        
    with open(articles_ts_path, "r", encoding="utf-8") as f:
        articles_content = f.read()
        
    existing_slugs = get_existing_slugs(articles_content)
    print(f"Loaded {len(existing_slugs)} existing article slugs from articles.ts.")
    
    new_articles = []
    for feed in FEED_SOURCES:
        print(f"Checking feed: {feed['name']} ({feed['url']})...")
        data = fetch_feed(feed['url'])
        if not data:
            continue
        items = parse_rss_or_atom(data)
        print(f"  Found {len(items)} items from {feed['name']}.")
        
        # Pick the most recent item that hasn't been published yet
        for item in items:
            slug = slugify(item['title'])
            if slug and slug not in existing_slugs and not any(a['slug'] == slug for a in new_articles):
                sample_article = generate_article_obj(item, feed)
                new_articles.append(sample_article)
                print(f"  [New Story Candidate]: {sample_article['title']}")
                print(f"  Slug: {sample_article['slug']} | Category: {sample_article['category']}")
                break  # Only take the top new article per feed source per run
                
    if not new_articles:
        print("All feeds up to date. No new articles to publish.")
        return
        
    print(f"\nFound {len(new_articles)} new article(s) ready for ingestion.")
    
    if dry_run:
        print("Dry run active — skipping file write.")
        for art in new_articles:
            print(f"  - WOULD PUBLISH: {art['title']} ({art['slug']})")
        return
        
    # Format and insert new articles into articles.ts
    formatted_ts_chunks = [format_article_ts(art) for art in new_articles]
    insertion_block = ",\n".join(formatted_ts_chunks) + ",\n"
    
    marker = "export const ARTICLES: NewsArticle[] = [\n"
    if marker not in articles_content:
        print(f"Error: Target marker '{marker.strip()}' not found in articles.ts", file=sys.stderr)
        sys.exit(1)
        
    updated_content = articles_content.replace(marker, marker + insertion_block, 1)
    
    with open(articles_ts_path, "w", encoding="utf-8") as f:
        f.write(updated_content)
        
    print(f"Successfully published {len(new_articles)} new article(s) to {articles_ts_path}!")

if __name__ == '__main__':
    main()
