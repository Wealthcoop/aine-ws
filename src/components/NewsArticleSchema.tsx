import { NewsArticle } from '@/types/news'
import { AUTHORS } from '@/config/authors'
import { SITE_CONFIG } from '@/config/site'

interface NewsArticleSchemaProps {
  article: NewsArticle
}

export function NewsArticleSchema({ article }: NewsArticleSchemaProps) {
  const author = AUTHORS[article.authorId] || AUTHORS['justin-davis']

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_CONFIG.url}/news/${article.category}/${article.slug}`,
    },
    headline: article.title,
    description: article.deck,
    image: [
      `${SITE_CONFIG.url}${article.featuredImage}`,
    ],
    datePublished: article.publishedAt,
    dateModified: article.updatedAt || article.publishedAt,
    articleSection: article.category.replace('-', ' '),
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
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_CONFIG.url}/aine-ws-logo.svg`,
        width: 600,
        height: 120,
      },
      publishingPrinciples: `${SITE_CONFIG.url}/editorial-policy`,
    },
    isAccessibleForFree: true,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
