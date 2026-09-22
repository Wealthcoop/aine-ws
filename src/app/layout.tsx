import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { OrganizationSchema } from '@/components/OrganizationSchema'
import { SITE_CONFIG } from '@/config/site'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: `${SITE_CONFIG.name} | ${SITE_CONFIG.tagline}`,
    template: `%s | ${SITE_CONFIG.name}`
  },
  description: SITE_CONFIG.description,
  applicationName: SITE_CONFIG.name,
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
    siteName: SITE_CONFIG.name,
    title: `${SITE_CONFIG.name} | ${SITE_CONFIG.tagline}`,
    description: SITE_CONFIG.description,
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: `${SITE_CONFIG.name} - Applied AI News Wire`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_CONFIG.name} | ${SITE_CONFIG.tagline}`,
    description: SITE_CONFIG.description,
    images: ['/og-image.jpg'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [{ url: '/apple-touch-icon.png' }],
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
  return (
    <html lang="en" className="h-full">
      <head>
        <OrganizationSchema />
        <link rel="alternate" type="application/rss+xml" title="AI News RSS Feed" href="/feed.xml" />
        <link rel="sitemap" type="application/xml" title="Google News Sitemap" href="/news-sitemap.xml" />
        {/* Google tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-RD10J8RQYW"
          strategy="afterInteractive"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
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
      </head>
      <body className="flex min-h-screen flex-col bg-slate-50 text-slate-900 antialiased selection:bg-sky-500 selection:text-white">
        <Header />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
