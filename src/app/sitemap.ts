import { MetadataRoute } from 'next'
import { ARTICLES } from '@/data/articles'
import { AUTHORS } from '@/config/authors'
import { SITE_CONFIG } from '@/config/site'
import { isArticleIndexable } from '@/lib/articleFilters'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_CONFIG.url

  const indexableArticles = ARTICLES.filter(isArticleIndexable)

  // Core Static Pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/frame`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date('2026-09-10'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/standards`,
      lastModified: new Date('2026-09-10'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/editorial-policy`,
      lastModified: new Date('2026-09-10'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/corrections-policy`,
      lastModified: new Date('2026-09-10'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/ownership`,
      lastModified: new Date('2026-09-10'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date('2026-09-10'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date('2026-09-10'),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date('2026-09-10'),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ]

  // Category Desks (exclude syndicated wire dump)
  const deskPages: MetadataRoute.Sitemap = SITE_CONFIG.desks
    .filter((desk) => desk.id !== 'wire')
    .map((desk) => ({
      url: `${baseUrl}/desks/${desk.id}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    }))

  // Authors with active indexable articles
  const authorPages: MetadataRoute.Sitemap = Object.keys(AUTHORS)
    .filter((authorId) => indexableArticles.some((a) => a.authorId === authorId))
    .map((authorId) => ({
      url: `${baseUrl}/authors/${authorId}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    }))

  // Indexable Original Articles
  const articlePages: MetadataRoute.Sitemap = indexableArticles.map((article) => ({
    url: `${baseUrl}/news/${article.category}/${article.slug}`,
    lastModified: new Date(article.updatedAt || article.publishedAt),
    changeFrequency: 'daily',
    priority: 0.9,
  }))

  return [...staticPages, ...deskPages, ...authorPages, ...articlePages]
}
