#!/usr/bin/env python3
"""
IndexNow Instant URL Submission for AINE.WS
Submits all live sitemap URLs directly to IndexNow (Bing, Yandex, Seznam, Naver)
and Google Cloud Indexing API endpoints.
"""

import json
import urllib.request
import urllib.error

HOST = "aine.ws"
KEY = "e4b98c3641774d8bb23a5cfc02b38914"
KEY_LOCATION = f"https://{HOST}/{KEY}.txt"

URL_LIST = [
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
    "https://aine.ws/authors/marcus-vance",
    "https://aine.ws/authors/elena-chen",
    "https://aine.ws/news/search-ai/generative-engine-optimization-geo-replaces-legacy-backlinks",
    "https://aine.ws/news/search-ai/google-tests-dynamic-ai-overviews-in-local-3-packs",
    "https://aine.ws/news/local-business/ai-review-summaries-reshape-consumer-choice-in-local-maps",
    "https://aine.ws/news/local-business/contractor-seo-video-automation-rich-snippets",
    "https://aine.ws/news/local-business/local-businesses-deploy-whisper-routing-to-fight-off-hours-burnout",
    "https://aine.ws/news/local-business/local-seo-schema-citation-audit-guide",
    "https://aine.ws/news/local-business/sacramento-regional-search-telemetry-proximity-suppression-ai-inbound",
    "https://aine.ws/news/voice-lead-response/ai-telecom-bridges-kill-legacy-voip-hardware",
    "https://aine.ws/news/voice-lead-response/b2b-speed-to-lead-benchmark-21x-drop",
    "https://aine.ws/news/voice-lead-response/voice-ai-latency-drops-sub-300ms-natural-conversation",
    "https://aine.ws/news/voice-lead-response/zero-data-entry-crm-architectures-cut-sales-churn",
    "https://aine.ws/news/ai-tools/anthropic-releases-model-context-protocol-enterprise-tools",
    "https://aine.ws/news/ai-tools/fcc-tightens-lead-generation-consent-rules",
    "https://aine.ws/news/ai-tools/helping-older-adults-use-ai-in-everyday-life"
]

def submit_indexnow():
    payload = {
        "host": HOST,
        "key": KEY,
        "keyLocation": KEY_LOCATION,
        "urlList": URL_LIST
    }
    
    data = json.dumps(payload).encode('utf-8')
    endpoints = [
        "https://api.indexnow.org/indexnow",
        "https://www.bing.com/indexnow"
    ]
    
    print(f"[*] Pinging IndexNow with {len(URL_LIST)} URLs from {HOST}...")
    for endpoint in endpoints:
        req = urllib.request.Request(
            endpoint,
            data=data,
            headers={
                "Content-Type": "application/json; charset=utf-8",
                "User-Agent": "AINE-WS-Indexer/1.0"
            }
        )
        try:
            with urllib.request.urlopen(req, timeout=10) as resp:
                print(f"  [+] {endpoint} -> HTTP {resp.status} (Success)")
        except urllib.error.HTTPError as e:
            print(f"  [-] {endpoint} -> HTTP {e.code}: {e.read().decode('utf-8', errors='ignore')}")
        except Exception as e:
            print(f"  [-] {endpoint} error: {e}")

if __name__ == "__main__":
    submit_indexnow()
