import { Author } from '@/config/authors'

export type ArticleCategory =
  | 'search-ai'
  | 'local-business'
  | 'voice-lead-response'
  | 'ai-tools'
  | 'wire'
  | 'frame'

export interface NewsArticle {
  id: string
  slug: string
  title: string
  deck: string
  category: ArticleCategory
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
  is_original?: boolean
  founder_take?: string
  videoUrl?: string
  videoThumbnail?: string
  videoDuration?: string
  videoTitle?: string
  videoDescription?: string
}
