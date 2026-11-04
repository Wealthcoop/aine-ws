import React from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { SITE_CONFIG } from '@/config/site'
import { AUTHORS } from '@/config/authors'
import { ARTICLES } from '@/data/articles'
import { ArticleCard } from '@/components/ArticleCard'
import { ChevronRight, Feather, ShieldCheck } from 'lucide-react'

export const metadata: Metadata = {
  title: 'The Aine Frame: Founder Essays & Empirical Opinion',
  description: 'Original essays, empirical field studies, and strategic frameworks on artificial intelligence, search algorithms, and algorithmic commerce by Justin Davis.',
  alternates: {
    canonical: `${SITE_CONFIG.url}/frame`,
  },
}

export default function FrameArchivePage() {
  const author = AUTHORS['justin-davis']
  // Filter for original research, opinion pieces, or articles by Justin Davis marked as original
  const frameArticles = ARTICLES.filter((a) => 
    a.category === 'frame' || (a.is_original === true && a.authorId === 'justin-davis')
  ).sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())

  const leadArticle = frameArticles[0]
  const otherArticles = frameArticles.slice(1)

  return (
    <div className="bg-slate-50 py-10 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-600 mb-6">
          <Link href="/" className="hover:text-slate-900 transition">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="font-semibold text-slate-800">The Aine Frame</span>
        </nav>

        {/* Section Header */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-3 py-1 text-xs font-bold text-white uppercase tracking-wider mb-3">
                <Feather className="h-3.5 w-3.5 text-sky-400" />
                Founder Perspective &amp; Empirical Frameworks
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900">
                The Aine Frame
              </h1>
              <p className="mt-3 text-base sm:text-lg text-slate-600 font-serif leading-relaxed">
                Original founder essays, technical field audits, and strategic commentary on applied intelligence and autonomous business architecture by Justin Davis.
              </p>
            </div>

            {/* Author Card Component */}
            <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-50/80 p-4 shrink-0">
              <div className="relative h-14 w-14 overflow-hidden rounded-full border border-slate-300 bg-slate-200">
                <Image
                  src={author.avatar}
                  alt={author.name}
                  width={56}
                  height={56}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-sans text-sm font-bold text-slate-900">{author.name}</span>
                  <span className="inline-flex items-center gap-0.5 rounded bg-sky-100 px-1.5 py-0.5 text-[10px] font-bold text-sky-800">
                    <ShieldCheck className="h-3 w-3 text-sky-700" />
                    Verified
                  </span>
                </div>
                <p className="text-xs text-slate-600">{author.title}</p>
                <Link
                  href="/authors/justin-davis"
                  className="mt-1 text-xs font-semibold text-sky-700 hover:underline inline-block"
                >
                  View Profile &amp; Dispatches &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Lead Essay */}
        {leadArticle && (
          <div className="mt-8">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
              Featured Frame Analysis
            </h2>
            <ArticleCard article={leadArticle} variant="lead" />
          </div>
        )}

        {/* Supporting Analyses */}
        {otherArticles.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-6">
              Field Studies &amp; Perspective Archive
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherArticles.map((article) => (
                <ArticleCard key={article.id} article={article} variant="standard" />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
