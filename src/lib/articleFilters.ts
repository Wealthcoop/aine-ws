import { NewsArticle } from '@/types/news'

/**
 * Determines whether an article should be indexed by search engines and surfaced
 * in primary sitemaps, homepage feeds, editorial desks, and author archives.
 *
 * Automated syndicated wire rewrites and third-party You.com aggregation posts
 * remain accessible at their URLs with `noindex, follow` to protect crawl budget
 * and prevent indexing bloat.
 */
export function isArticleIndexable(article: NewsArticle): boolean {
  if (article.noIndex) {
    return false
  }
  if (article.is_original !== true) {
    return false
  }
  const captionLower = (article.featuredImageCaption || '').toLowerCase()
  const sourcesLower = JSON.stringify(article.sources || []).toLowerCase()
  if (captionLower.includes('you.com') || sourcesLower.includes('you.com')) {
    return false
  }
  return true
}
