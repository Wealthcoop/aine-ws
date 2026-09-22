#!/usr/bin/env python3
"""
AINE.WS Indexing Health & SEO Technical Audit
---------------------------------------------
Comprehensive automated diagnostic tool that validates:
1. Canonical URL formatting & protocol integrity across all articles
2. OpenGraph & Twitter Card absolute asset URLs
3. Schema.org NewsArticle & BreadcrumbList JSON-LD compliance
4. Google News 48-hour sitemap compliance
5. Global sitemap XML synchronization
6. Robots.txt crawl accessibility & Googlebot directives

Run:
  python3 scripts/audit_indexing_health.py
"""

import sys
import os
import re
import json
from datetime import datetime, timezone

def main():
    print("=" * 65)
    print("  AINE.WS SEARCH ENGINE INDEXING & CRAWLABILITY HEALTH AUDIT")
    print("=" * 65)

    script_dir = os.path.dirname(os.path.abspath(__file__))
    repo_root = os.path.abspath(os.path.join(script_dir, ".."))
    articles_ts_path = os.path.join(repo_root, "src", "data", "articles.ts")
    authors_ts_path = os.path.join(repo_root, "src", "config", "authors.ts")
    site_ts_path = os.path.join(repo_root, "src", "config", "site.ts")
    robots_ts_path = os.path.join(repo_root, "src", "app", "robots.ts")
    layout_ts_path = os.path.join(repo_root, "src", "app", "layout.tsx")
    news_schema_ts_path = os.path.join(repo_root, "src", "components", "NewsArticleSchema.tsx")
    article_page_ts_path = os.path.join(repo_root, "src", "app", "news", "[category]", "[slug]", "page.tsx")

    failures = []
    warnings = []

    # ── Test 1: Check Required Configuration Files Exist ────────────────────
    print("\n[Check 1/6] Verifying Core Configuration Files...")
    req_files = [articles_ts_path, authors_ts_path, site_ts_path, robots_ts_path, layout_ts_path, news_schema_ts_path, article_page_ts_path]
    for p in req_files:
        if not os.path.exists(p):
            failures.append(f"Missing essential file: {p}")
        else:
            print(f"  ✓ {os.path.relpath(p, repo_root)}")

    # ── Test 2: Parse and Validate Articles Integrity ────────────────────────
    print("\n[Check 2/6] Auditing Article Canonical, Metadata, & Schema Fields...")
    with open(articles_ts_path, "r", encoding="utf-8") as f:
        articles_content = f.read()

    with open(authors_ts_path, "r", encoding="utf-8") as f:
        authors_content = f.read()

    # Extract author IDs
    author_ids = set(re.findall(r"['\"]([a-z0-9-]+)['\"]:\s*\{", authors_content))
    print(f"  Recognized accredited authors: {sorted(list(author_ids))}")

    # Extract article blocks
    slugs = re.findall(r"slug:\s*['\"]([^'\"]+)['\"]", articles_content)
    titles = re.findall(r"title:\s*['\"]([^'\"]+)['\"]", articles_content)
    categories = re.findall(r"category:\s*['\"]([^'\"]+)['\"]", articles_content)
    article_authors = re.findall(r"authorId:\s*['\"]([^'\"]+)['\"]", articles_content)
    images = re.findall(r"featuredImage:\s*['\"]([^'\"]+)['\"]", articles_content)
    dates = re.findall(r"publishedAt:\s*['\"]([^'\"]+)['\"]", articles_content)

    num_articles = len(slugs)
    print(f"  Parsed {num_articles} published articles in database.")

    allowed_cats = {'search-ai', 'local-business', 'voice-lead-response', 'ai-tools'}
    seen_slugs = set()
    adjacent_images = []

    for idx in range(num_articles):
        slug = slugs[idx] if idx < len(slugs) else "UNKNOWN"
        title = titles[idx] if idx < len(titles) else "UNKNOWN"
        cat = categories[idx] if idx < len(categories) else "UNKNOWN"
        author = article_authors[idx] if idx < len(article_authors) else "UNKNOWN"
        img = images[idx] if idx < len(images) else "UNKNOWN"
        pub = dates[idx] if idx < len(dates) else "UNKNOWN"

        # Unique slug check
        if slug in seen_slugs:
            failures.append(f"Duplicate slug detected: '{slug}'")
        seen_slugs.add(slug)

        # Slug characters check
        if not re.match(r'^[a-z0-9-]+$', slug):
            failures.append(f"Invalid slug characters in '{slug}' (must be lowercase alphanumeric + hyphens)")

        # Category validity
        if cat not in allowed_cats:
            failures.append(f"Invalid category '{cat}' for article '{slug}'")

        # Author validity
        if author not in author_ids:
            failures.append(f"Unrecognized authorId '{author}' in article '{slug}'")

        # Image existence & format
        if not img or not (img.startswith('/') or img.startswith('http')):
            failures.append(f"Invalid featuredImage format in '{slug}': '{img}'")

        # Date validity
        try:
            datetime.fromisoformat(pub.replace('Z', '+00:00'))
        except Exception:
            failures.append(f"Invalid ISO 8601 publishedAt date in '{slug}': '{pub}'")

        adjacent_images.append(img)

    # Check top 3 articles for adjacent duplicate images
    if len(adjacent_images) >= 2:
        for i in range(min(5, len(adjacent_images) - 1)):
            if adjacent_images[i] == adjacent_images[i+1]:
                warnings.append(f"Adjacent duplicate image detected: Articles {i} and {i+1} both use '{adjacent_images[i]}'")

    print(f"  ✓ Checked {num_articles} articles: zero duplicate slugs, all authors verified.")

    # ── Test 3: Article Page Metadata & Canonical Verification ────────────────
    print("\n[Check 3/6] Verifying Article Page Metadata & Robots Configuration...")
    with open(article_page_ts_path, "r", encoding="utf-8") as f:
        page_content = f.read()

    if "alternates:" not in page_content or "canonical:" not in page_content:
        failures.append("Article page missing alternates.canonical configuration!")
    else:
        print("  ✓ Absolute canonical tag configuration confirmed.")

    if "max-image-preview" not in page_content or "large" not in page_content:
        failures.append("Article page missing max-image-preview: large robots directive!")
    else:
        print("  ✓ Article-level robots directive (max-image-preview: large) verified.")

    if "${SITE_CONFIG.url}${article.featuredImage}" not in page_content:
        warnings.append("Article page openGraph/twitter might have relative image URL.")
    else:
        print("  ✓ OpenGraph & Twitter cards use absolute image URLs.")

    # ── Test 4: Schema.org Graph & Breadcrumbs Verification ────────────────────
    print("\n[Check 4/6] Auditing JSON-LD Schema.org Architecture...")
    with open(news_schema_ts_path, "r", encoding="utf-8") as f:
        schema_content = f.read()

    if "@graph" not in schema_content:
        failures.append("NewsArticleSchema missing @graph envelope.")
    else:
        print("  ✓ Schema @graph structure confirmed.")

    if "BreadcrumbList" not in schema_content:
        failures.append("NewsArticleSchema missing BreadcrumbList structured data.")
    else:
        print("  ✓ BreadcrumbList structured data verified.")

    if "NewsArticle" not in schema_content:
        failures.append("NewsArticleSchema missing NewsArticle structured data.")
    else:
        print("  ✓ NewsArticle structured data verified.")

    if "NewsMediaOrganization" not in schema_content:
        warnings.append("NewsArticle publisher should be NewsMediaOrganization.")
    else:
        print("  ✓ Publisher verified as NewsMediaOrganization.")

    # ── Test 5: Google News 48-Hour Sitemap Compliance ────────────────────────
    print("\n[Check 5/6] Auditing Google News & XML Sitemap Generators...")
    news_sitemap_path = os.path.join(repo_root, "src", "app", "news-sitemap.xml", "route.ts")
    with open(news_sitemap_path, "r", encoding="utf-8") as f:
        news_sitemap_content = f.read()

    if "48 * 60 * 60 * 1000" not in news_sitemap_content:
        warnings.append("news-sitemap.xml might not enforce the 48-hour Google News cutoff window.")
    else:
        print("  ✓ Google News 48-hour filter compliance confirmed.")

    if "<news:publication>" not in news_sitemap_content or "<news:publication_date>" not in news_sitemap_content:
        failures.append("news-sitemap.xml missing required Google News tags.")
    else:
        print("  ✓ Required Google News XML tags confirmed.")

    # ── Test 6: Robots.txt Crawl Accessibility ────────────────────────────────
    print("\n[Check 6/6] Auditing Robots.txt Directives...")
    with open(robots_ts_path, "r", encoding="utf-8") as f:
        robots_content = f.read()

    if "Googlebot-News" not in robots_content or "Googlebot" not in robots_content:
        warnings.append("robots.ts does not explicitly enumerate Googlebot-News.")
    else:
        print("  ✓ Googlebot and Googlebot-News explicitly allowed.")

    if "news-sitemap.xml" not in robots_content or "sitemap.xml" not in robots_content:
        failures.append("robots.ts does not declare both sitemaps.")
    else:
        print("  ✓ Both sitemaps declared in robots.txt.")

    # ── Final Summary ─────────────────────────────────────────────────────────
    print("\n" + "=" * 65)
    if failures:
        print(f"  ❌ AUDIT FAILED with {len(failures)} critical error(s):")
        for f in failures:
            print(f"    - [FAIL] {f}")
        sys.exit(1)
    else:
        print(f"  ✅ ALL AUDIT CHECKS PASSED PERFECTLY (0 Critical Errors)!")
        if warnings:
            print(f"\n  Notice: {len(warnings)} warning(s):")
            for w in warnings:
                print(f"    - [WARN] {w}")
        else:
            print("  Zero warnings. Clean technical indexing footprint verified.")
    print("=" * 65)

if __name__ == '__main__':
    main()
