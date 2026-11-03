#!/usr/bin/env python3
"""
IndexNow Instant URL Submission for AINE.WS
Submits all live sitemap URLs directly to IndexNow (Bing, Yandex, Seznam, Naver).
Dynamically extracts all article URLs from src/data/articles.ts.
"""

import json
import urllib.request
import urllib.error
import ssl
import os
import re

HOST = "aine.ws"
KEY = "e4b98c3641774d8bb23a5cfc02b38914"
KEY_LOCATION = f"https://{HOST}/{KEY}.txt"

BASE_URLS = [
    "https://aine.ws/",
    "https://aine.ws/about",
    "https://aine.ws/contact",
    "https://aine.ws/editorial-policy",
    "https://aine.ws/corrections-policy",
    "https://aine.ws/ownership",
    "https://aine.ws/privacy-policy",
    "https://aine.ws/terms",
    "https://aine.ws/desks/search-ai",
    "https://aine.ws/desks/local-business",
    "https://aine.ws/desks/voice-lead-response",
    "https://aine.ws/desks/ai-tools",
    "https://aine.ws/authors/justin-davis",
    "https://aine.ws/authors/molly-perkins",
    "https://aine.ws/authors/elena-chen"
]

def get_all_article_urls():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    articles_path = os.path.join(base_dir, "src/data/articles.ts")
    if not os.path.exists(articles_path):
        return []
    with open(articles_path, "r", encoding="utf-8") as f:
        text = f.read()
    matches = re.findall(r"slug:\s*[\x27\"]([^\x27\"]+)[\x27\"].*?category:\s*[\x27\"]([^\x27\"]+)[\x27\"]", text, re.DOTALL)
    urls = [f"https://aine.ws/news/{cat}/{slug}" for slug, cat in matches]
    return urls

def submit_indexnow():
    article_urls = get_all_article_urls()
    full_url_list = list(dict.fromkeys(BASE_URLS + article_urls))
    
    payload = {
        "host": HOST,
        "key": KEY,
        "keyLocation": KEY_LOCATION,
        "urlList": full_url_list
    }
    
    data = json.dumps(payload).encode('utf-8')
    endpoints = [
        "https://api.indexnow.org/indexnow",
        "https://www.bing.com/indexnow"
    ]
    
    print(f"[*] Pinging IndexNow with {len(full_url_list)} total URLs from {HOST}...")
    ctx = ssl._create_unverified_context()
    for endpoint in endpoints:
        req = urllib.request.Request(
            endpoint,
            data=data,
            headers={
                "Content-Type": "application/json; charset=utf-8",
                "User-Agent": "IndexNowSubmitter/1.0"
            }
        )
        try:
            with urllib.request.urlopen(req, context=ctx, timeout=10) as response:
                code = response.getcode()
                print(f"  [+] {endpoint} -> HTTP {code} (Accepted)")
        except urllib.error.HTTPError as e:
            print(f"  [!] {endpoint} returned HTTP {e.code}: {e.read().decode('utf-8')}")
        except Exception as e:
            print(f"  [-] {endpoint} error: {e}")

if __name__ == "__main__":
    submit_indexnow()
