import { NewsArticle } from '@/types/news'

const LOW_VALUE_TITLE_PATTERNS = [
  /\bwikipedia\b/i,
  /\bwidget\b/i,
]

const LOW_VALUE_URL_PATTERNS = [
  /wikipedia\.org/i,
  /elfsight\.com/i,
]

function countBodyWords(html: string): number {
  const plain = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  if (!plain) return 0
  return plain.split(' ').length
}

/**
 * Quality gate determining whether an article is surfaced on the homepage,
 * desk archives, and XML sitemap (index, follow) versus kept noindex.
 *
 * Rules:
 * 1. Explicit `noIndex: true` articles are always excluded.
 * 2. Low-value encyclopedia or widget pages (e.g., Wikipedia, SaaS widgets) stay noindex.
 * 3. Manually marked original reporting (`is_original: true`) is always indexable.
 * 4. Automated newsroom analyses pass automatically when they contain at least
 *    500 words of substantive body copy AND structured analysis (2+ H2 sections
 *    or an HTML data table). Thin wire stubs remain noindex to protect crawl budget.
 */
export function isArticleIndexable(article: NewsArticle): boolean {
  if (article.noIndex) {
    return false
  }

  const title = article.title || ''
  if (LOW_VALUE_TITLE_PATTERNS.some((rx) => rx.test(title))) {
    return false
  }

  const sourcesText = JSON.stringify(article.sources || [])
  if (LOW_VALUE_URL_PATTERNS.some((rx) => rx.test(sourcesText))) {
    return false
  }

  if (article.is_original === true) {
    return true
  }

  const html = article.contentHtml || ''
  const wordCount = countBodyWords(html)
  const h2Count = (html.match(/<h2\b/gi) || []).length
  const hasTable = /<table\b/i.test(html)

  return wordCount >= 500 && (h2Count >= 2 || hasTable)
}
