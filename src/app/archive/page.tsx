import React from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import { SITE_CONFIG } from '@/config/site'
import { ARTICLES } from '@/data/articles'
import { ChevronRight, Layers, Calendar, User, ArrowRight, Database } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Complete News Wire Archive & Story Index | AI News',
  description: 'Comprehensive crawlable index of all investigative reports, algorithmic benchmarks, and enterprise AI telemetry published by AI News across all editorial desks.',
  alternates: {
    canonical: `${SITE_CONFIG.url}/archive`,
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
    title: 'Complete News Wire Archive & Story Index | AI News',
    description: 'Comprehensive crawlable index of all investigative reports, algorithmic benchmarks, and enterprise AI telemetry published by AI News across all editorial desks.',
    url: `${SITE_CONFIG.url}/archive`,
    siteName: SITE_CONFIG.name,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Complete News Wire Archive & Story Index | AI News',
    description: 'Comprehensive crawlable index of all investigative reports and telemetry across all editorial desks.',
  },
}

export default function MasterArchivePage() {
  const archiveUrl = `${SITE_CONFIG.url}/archive`

  // Group articles by desk
  const desksWithArticles = SITE_CONFIG.desks.map((desk) => {
    const articles = ARTICLES.filter((a) => a.category === desk.id)
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    return {
      desk,
      articles,
    }
  })

  // JSON-LD Schema
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        '@id': `${archiveUrl}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: SITE_CONFIG.url,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Master News Wire Archive',
            item: archiveUrl,
          },
        ],
      },
      {
        '@type': 'CollectionPage',
        '@id': `${archiveUrl}#collection`,
        url: archiveUrl,
        name: 'Complete News Wire Archive & Story Index',
        description: 'Comprehensive index of all published reports and investigations.',
        publisher: {
          '@type': 'NewsMediaOrganization',
          '@id': `${SITE_CONFIG.url}/#organization`,
          name: SITE_CONFIG.name,
          url: SITE_CONFIG.url,
        },
      },
    ],
  }

  return (
    <div className="bg-slate-50 py-10 lg:py-14">
      {/* Schema.org CollectionPage + Breadcrumbs */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link href="/" className="hover:text-slate-900 transition">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="font-semibold text-slate-900">Master Wire Archive</span>
        </nav>

        {/* Master Header */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-10 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-700">
            <Database className="h-4 w-4" /> Comprehensive Newsroom Directory
          </div>
          <h1 className="mt-3 font-serif text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900">
            Master News Wire Archive
          </h1>
          <p className="mt-3 text-base md:text-lg text-slate-600 max-w-3xl leading-relaxed">
            Direct access to all {ARTICLES.length} investigative reports, empirical studies, and speed-to-lead benchmarks published across our editorial beats.
          </p>

          {/* Quick Jump Anchors */}
          <div className="mt-6 flex flex-wrap gap-2 pt-4 border-t border-slate-100">
            {desksWithArticles.map(({ desk, articles }) => (
              <a
                key={desk.id}
                href={`#${desk.id}`}
                className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-sky-100 hover:text-sky-800 transition"
              >
                <span>{desk.label}</span>
                <span className="rounded-full bg-slate-200 px-1.5 py-0.2 text-[10px] text-slate-700">
                  {articles.length}
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Desks and Articles */}
        <div className="mt-12 space-y-16">
          {desksWithArticles.map(({ desk, articles }) => (
            <section
              key={desk.id}
              id={desk.id}
              className="scroll-mt-12 rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-5 gap-3">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-700">
                    <Layers className="h-4 w-4" /> Beat Archive
                  </div>
                  <h2 className="mt-1 font-serif text-2xl md:text-3xl font-bold text-slate-900">
                    {desk.label}
                  </h2>
                  <p className="mt-1 text-xs md:text-sm text-slate-500">
                    {desk.description}
                  </p>
                </div>
                <Link
                  href={`/desks/${desk.id}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-sky-700 hover:text-sky-900 transition shrink-0"
                >
                  <span>View Beat Page</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {/* Articles Directory List */}
              <div className="mt-6 divide-y divide-slate-100">
                {articles.map((art) => (
                  <article
                    key={art.id}
                    className="py-4 first:pt-0 last:pb-0 hover:bg-slate-50/80 -mx-4 px-4 rounded-lg transition"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-4">
                      <Link
                        href={`/news/${art.category}/${art.slug}`}
                        className="font-serif text-base font-bold text-slate-900 hover:text-sky-700 transition"
                      >
                        {art.title}
                      </Link>
                      <time
                        dateTime={art.publishedAt}
                        className="text-xs text-slate-600 whitespace-nowrap shrink-0"
                      >
                        {new Date(art.publishedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </time>
                    </div>
                    {art.deck && (
                      <p className="mt-1 text-xs text-slate-600 line-clamp-2">
                        {art.deck}
                      </p>
                    )}
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
