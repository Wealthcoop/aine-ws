import { MetadataRoute } from 'next'
import { SITE_CONFIG } from '@/config/site'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/wp-includes/', '/wp-admin/', '/*?cat=*', '/*?ver=*'],
      },
      {
        userAgent: 'Googlebot-News',
        allow: '/',
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
      },
      {
        userAgent: 'GPTBot',
        allow: '/',
      },
      {
        userAgent: 'ClaudeBot',
        allow: '/',
      },
      {
        userAgent: 'PerplexityBot',
        allow: '/',
      },
    ],
    sitemap: [
      `${SITE_CONFIG.url}/sitemap.xml`,
      `${SITE_CONFIG.url}/news-sitemap.xml`,
    ],
    host: SITE_CONFIG.url,
  }
}
