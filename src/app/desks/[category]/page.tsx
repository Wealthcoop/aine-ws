import React from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { SITE_CONFIG } from '@/config/site'
import { ARTICLES } from '@/data/articles'
import { AUTHORS } from '@/config/authors'
import { ArticleCard } from '@/components/ArticleCard'
import { Newspaper, ChevronRight, Layers } from 'lucide-react'

interface PageProps {
  params: {
    category: string
  }
}

export async function generateStaticParams() {
  return SITE_CONFIG.desks.map((d) => ({ category: d.id }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const desk = SITE_CONFIG.desks.find((d) => d.id === params.category)
  if (!desk) {
    return { title: 'Desk Not Found' }
  }

  return {
    title: `${desk.label} Desk - Latest News & Benchmarks`,
    description: desk.description,
    openGraph: {
      title: `${desk.label} Desk | ${SITE_CONFIG.name}`,
      description: desk.description,
    },
  }
}

export default function DeskArchivePage({ params }: PageProps) {
  const desk = SITE_CONFIG.desks.find((d) => d.id === params.category)

  if (!desk) {
    notFound()
  }

  const deskArticles = ARTICLES.filter((a) => a.category === desk.id)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())

  const leadArticle = deskArticles[0]
  const otherArticles = deskArticles.slice(1)

  return (
    <div className="bg-slate-50 py-10 lg:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link href="/" className="hover:text-slate-900 transition">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-slate-400">Editorial Desks</span>
          <ChevronRight className="h-3 w-3" />
          <span className="font-semibold text-slate-900">{desk.label}</span>
        </nav>

        {/* Desk Header */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-10 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-700">
            <Layers className="h-4 w-4" /> Editorial Beat Archive
          </div>
          <h1 className="mt-3 font-serif text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900">
            {desk.label}
          </h1>
          <p className="mt-3 text-base md:text-lg text-slate-600 max-w-3xl leading-relaxed">
            {desk.description}
          </p>
        </div>

        {/* Articles Feed */}
        <div className="mt-10 space-y-10">
          {leadArticle && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
                Desk Lead Investigation
              </h2>
              <ArticleCard article={leadArticle} variant="lead" />
            </div>
          )}

          {otherArticles.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
                Additional Wire Reports &amp; Analyses
              </h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {otherArticles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
