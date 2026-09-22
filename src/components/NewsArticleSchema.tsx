import { NewsArticle } from '@/types/news'
import { AUTHORS } from '@/config/authors'
import { SITE_CONFIG } from '@/config/site'

interface NewsArticleSchemaProps {
  article: NewsArticle
}

function ensureAbsoluteUrl(pathOrUrl: string): string {
  if (!pathOrUrl) return `${SITE_CONFIG.url}/og-image.jpg`
  if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
    return pathOrUrl
  }
  const cleanPath = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`
  return `${SITE_CONFIG.url}${cleanPath}`
}

export function NewsArticleSchema({ article }: NewsArticleSchemaProps) {
  const author = AUTHORS[article.authorId] || AUTHORS['justin-davis']
  const articleUrl = `${SITE_CONFIG.url}/news/${article.category}/${article.slug}`
  const deskUrl = `${SITE_CONFIG.url}/desks/${article.category}`
  const imageUrl = ensureAbsoluteUrl(article.featuredImage)
  const deskLabel = article.category.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

  const pubDate = article.publishedAt || new Date().toISOString()
  const modDate = article.updatedAt || pubDate
  const pubYear = new Date(pubDate).getFullYear() || 2026

  const schemaGraph = {
    '@context': 'https://schema.org',
    '@graph': [
      // 1. BreadcrumbList Schema for Google Rich Snippets
      {
        '@type': 'BreadcrumbList',
        '@id': `${articleUrl}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Wire',
            item: SITE_CONFIG.url,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: `${deskLabel} Desk`,
            item: deskUrl,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: article.title,
            item: articleUrl,
          },
        ],
      },
      // 2. NewsArticle Schema for Google News & Discover
      {
        '@type': 'NewsArticle',
        '@id': `${articleUrl}#article`,
        isPartOf: {
          '@type': 'WebPage',
          '@id': articleUrl,
        },
        mainEntityOfPage: articleUrl,
        headline: article.title.length > 110 ? `${article.title.substring(0, 107)}...` : article.title,
        alternativeHeadline: article.title,
        description: article.deck,
        image: [
          imageUrl,
        ],
        inLanguage: 'en-US',
        copyrightYear: pubYear,
        datePublished: pubDate,
        dateModified: modDate,
        articleSection: deskLabel,
        author: [
          {
            '@type': 'Person',
            name: author.name,
            jobTitle: author.title,
            url: `${SITE_CONFIG.url}/authors/${author.id}`,
            sameAs: author.linkedin ? [author.linkedin] : undefined,
          },
        ],
        publisher: {
          '@type': 'NewsMediaOrganization',
          '@id': `${SITE_CONFIG.url}/#organization`,
          name: SITE_CONFIG.name,
          url: SITE_CONFIG.url,
          logo: {
            '@type': 'ImageObject',
            url: `${SITE_CONFIG.url}/icon.svg`,
            width: 512,
            height: 512,
          },
          publishingPrinciples: `${SITE_CONFIG.url}/editorial-policy`,
        },
        isAccessibleForFree: true,
        ...(article.videoUrl && {
          video: {
            '@type': 'VideoObject',
            name: article.videoTitle || article.title,
            description: article.videoDescription || article.deck,
            thumbnailUrl: [
              ensureAbsoluteUrl(article.videoThumbnail || article.featuredImage),
            ],
            uploadDate: pubDate,
            duration: article.videoDuration || 'PT38S',
            contentUrl: ensureAbsoluteUrl(article.videoUrl),
            embedUrl: articleUrl,
          },
        }),
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaGraph) }}
    />
  )
}
