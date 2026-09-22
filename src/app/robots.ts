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
        userAgent: [
          'Googlebot-News',
          'Googlebot',
          'GPTBot',
          'ClaudeBot',
          'PerplexityBot',
          'DuckDuckBot',
          'Bingbot',
          'YandexBot',
          'Baiduspider',
          'NaverBot',
          'Sogou web spider',
          'Bravebot',
          'Qwantify',
          'Bytespider'
        ],
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
