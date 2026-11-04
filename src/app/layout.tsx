import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { OrganizationSchema } from '@/components/OrganizationSchema'
import { SITE_CONFIG } from '@/config/site'
import { ARTICLES } from '@/data/articles'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: 'Aine (AINE.ws): The Applied AI & Algorithmic Commerce Wire',
    template: '%s | Aine (AINE.ws)'
  },
  description: SITE_CONFIG.description,
  applicationName: 'Aine (AINE.ws)',
  authors: [{ name: 'Justin Davis', url: `${SITE_CONFIG.url}/authors/justin-davis` }],
  creator: SITE_CONFIG.legalName,
  publisher: SITE_CONFIG.legalName,
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  alternates: {
    canonical: './',
    types: {
      'application/rss+xml': '/feed.xml',
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: SITE_CONFIG.locale,
    url: SITE_CONFIG.url,
    siteName: 'Aine (AINE.ws)',
    title: 'Aine (AINE.ws): The Applied AI & Algorithmic Commerce Wire',
    description: SITE_CONFIG.description,
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Aine (AINE.ws) : Applied Intelligence Wire',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aine (AINE.ws): The Applied AI & Algorithmic Commerce Wire',
    description: SITE_CONFIG.description,
    images: ['/og-image.jpg'],
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico' },
    ],
    apple: [{ url: '/favicon.svg' }],
  },
  other: {
    'google-site-verification': process.env.NEXT_PUBLIC_GSC_VERIFICATION || 'ZCEez8R7ae_zvdcPy1nbioBNtFJ1zCpPXUgibCD155Q',
    'news_keywords': 'artificial intelligence, search algorithms, google ai overview, telephony automation, local seo, agent architecture',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Find freshest breaking news story once on server (keeps client bundle lean)
  const sortedArticles = [...ARTICLES].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )
  const latest = sortedArticles.find((a) => a.isBreaking) || sortedArticles[0]
  const breakingStory = latest ? {
    title: latest.title,
    category: latest.category,
    slug: latest.slug,
  } : null

  return (
    <html lang="en" className="h-full">
      <head>
        <OrganizationSchema />
        <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        <link rel="alternate" type="application/rss+xml" title="Aine (AINE.ws) RSS Feed" href="/feed.xml" />
        <link rel="sitemap" type="application/xml" title="Google News Sitemap" href="/news-sitemap.xml" />
      </head>
      <body className="flex min-h-screen flex-col bg-slate-50 text-slate-900 antialiased selection:bg-sky-500 selection:text-white">
        <Header breakingStory={breakingStory} />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
        {/* Google tag (gtag.js) deferred to browser idle to protect FCP and LCP */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-RD10J8RQYW"
          strategy="lazyOnload"
        />
        <Script
          id="google-analytics"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-RD10J8RQYW', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
      </body>
    </html>
  )
}
