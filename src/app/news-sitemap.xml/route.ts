import { NextResponse } from 'next/server'
import { ARTICLES } from '@/data/articles'
import { SITE_CONFIG } from '@/config/site'

function escapeXml(unsafe: string): string {
  if (!unsafe) return ''
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;'
      case '>': return '&gt;'
      case '&': return '&amp;'
      case '\'': return '&apos;'
      case '"': return '&quot;'
      default: return c
    }
  })
}

export async function GET() {
  // Google News Sitemap Specification: Include articles published within the last 48 hours.
  // Fallback to top 10 most recent articles if wire has a quiet window so sitemap is never empty.
  const now = Date.now()
  const fortyEightHoursAgo = new Date(now - 48 * 60 * 60 * 1000)

  const sortedArticles = [...ARTICLES].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )

  let activeArticles = sortedArticles.filter(
    (a) => new Date(a.publishedAt) >= fortyEightHoursAgo
  )

  if (activeArticles.length === 0) {
    activeArticles = sortedArticles.slice(0, 10)
  }

  const xmlArticles = activeArticles.map((article) => {
    const loc = `${SITE_CONFIG.url}/news/${article.category}/${article.slug}`
    const pubDate = new Date(article.publishedAt).toISOString()
    const title = escapeXml(article.title)

    return `  <url>
    <loc>${loc}</loc>
    <news:news>
      <news:publication>
        <news:name>${escapeXml(SITE_CONFIG.name)}</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${pubDate}</news:publication_date>
      <news:title>${title}</news:title>
    </news:news>
  </url>`
  }).join('\n')

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${xmlArticles}
</urlset>`

  return new NextResponse(sitemapXml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=1800, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
