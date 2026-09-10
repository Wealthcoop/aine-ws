import { Author } from '@/config/authors'

export interface NewsArticle {
  id: string
  slug: string
  title: string
  deck: string
  category: 'search-algorithms' | 'local-business' | 'telephony-automation' | 'enterprise-tools'
  authorId: string
  publishedAt: string
  updatedAt: string
  readingTimeMinutes: number
  featuredImage: string
  featuredImageCaption: string
  keyTakeaways: string[]
  contentHtml: string
  sources: { name: string; url: string; context: string }[]
  isBreaking?: boolean
  isFeatured?: boolean
}
