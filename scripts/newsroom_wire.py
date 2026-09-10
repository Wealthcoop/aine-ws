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

FEED_SOURCES = [
    {
        "name": "Google Search Central",
        "url": "https://developers.google.com/search/blog/feeds/blog.xml",
        "category": "search-algorithms",
        "authorId": "justin-davis",
    },
    {
        "name": "OpenAI News",
        "url": "https://openai.com/news/rss.xml",
        "category": "enterprise-tools",
        "authorId": "justin-davis",
    },
    {
        "name": "Search Engine Land",
        "url": "https://searchengineland.com/feed",
        "category": "search-algorithms",
        "authorId": "justin-davis",
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

def fetch_feed(url):
    try:
        req = urllib.request.Request(
            url,
            headers={'User-Agent': 'AINE.WS News Wire Bot/1.0 (+https://aine.ws)'}
        )
        with urllib.request.urlopen(req, timeout=10) as response:
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
    
    return {
        "id": f"wire-{int(datetime.now().timestamp())}",
        "slug": slug,
        "title": item['title'],
        "deck": item['summary'] or "Real-time algorithmic and technical intelligence report tracked by the AINE.WS wire.",
        "category": feed_source['category'],
        "authorId": feed_source['authorId'],
        "publishedAt": now_iso,
        "updatedAt": now_iso,
        "readingTimeMinutes": 4,
        "featuredImage": "/news/google-core-update.jpg",
        "featuredImageCaption": f"Technical telemetry tracked via {feed_source['name']} public disclosures.",
        "isBreaking": True,
        "isFeatured": False,
        "keyTakeaways": [
            f"Primary signal logged from {feed_source['name']} official channels.",
            "Technical analysis indicates direct impact on commercial query routing and algorithmic benchmarks.",
            "AINE.WS editorial desk is monitoring secondary telemetry across metropolitan datasets."
        ],
        "contentHtml": f"""<p class="lead"><strong>WILMINGTON, Del.</strong> — The AINE.WS editorial newsroom is tracking a new technical development originating from {feed_source['name']}: {item['title']}.</p>
<p>{item['summary']}</p>
<p>According to telemetry gathered by AINE.WS analysts, the announcement signals ongoing shifts in commercial search behavior, entity verification protocols, and algorithmic latency expectations.</p>
<p>Enterprise teams and local business operators are advised to review structured data schemas and pipeline latency to maintain organic visibility during rollout windows.</p>""",
        "sources": [
            {
                "name": feed_source['name'],
                "url": item['link'] or "https://aine.ws",
                "context": "Primary wire disclosure."
            }
        ]
    }

def main():
    dry_run = "--dry-run" in sys.argv
    print(f"==> AINE.WS Newsroom Wire Pipeline Initialized (Dry-Run: {dry_run})")
    
    found_count = 0
    for feed in FEED_SOURCES:
        print(f"Checking feed: {feed['name']} ({feed['url']})...")
        data = fetch_feed(feed['url'])
        if not data:
            continue
        items = parse_rss_or_atom(data)
        print(f"  Found {len(items)} items from {feed['name']}.")
        if items:
            sample_article = generate_article_obj(items[0], feed)
            found_count += 1
            print(f"  [Sample Generated Article]: {sample_article['title']}")
            print(f"  Slug: {sample_article['slug']} | Category: {sample_article['category']}")
            
    print(f"\nCompleted wire scan across {len(FEED_SOURCES)} sources. Total potential articles: {found_count}.")

if __name__ == '__main__':
    main()
