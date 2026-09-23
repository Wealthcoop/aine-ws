import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ARTICLES } from '@/data/articles'
import { AUTHORS } from '@/config/authors'
import { ArticleCard } from '@/components/ArticleCard'
import { NewsletterForm } from '@/components/NewsletterForm'
import TrendingTools from '@/components/TrendingTools'
import {
  Radio,
  Flame,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  Award,
  Zap,
  Layers,
  Mail,
  CheckCircle2
} from 'lucide-react'
import { Metadata } from 'next'
import { SITE_CONFIG } from '@/config/site'

export const metadata: Metadata = {
  alternates: {
    canonical: SITE_CONFIG.url,
  },
}

export default function HomePage() {
  const leadArticle = ARTICLES.find((a) => a.isFeatured && a.isBreaking) || ARTICLES[0]
  const secondaryFeatured = ARTICLES.filter((a) => a.id !== leadArticle.id && a.isFeatured).slice(0, 2)
  const wireHeadlines = ARTICLES.filter((a) => a.id !== leadArticle.id).slice(0, 5)

  // Desk grouped articles
  const searchArticles = ARTICLES.filter((a) => a.category === 'search-ai').slice(0, 3)
  const localArticles = ARTICLES.filter((a) => a.category === 'local-business').slice(0, 3)
  const voiceArticles = ARTICLES.filter((a) => a.category === 'voice-lead-response').slice(0, 3)
  const toolsArticles = ARTICLES.filter((a) => a.category === 'ai-tools').slice(0, 3)

  return (
    <div className="bg-slate-50 py-8 lg:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top Hero Section: Lead Story + Live Wire Feed */}
        <section aria-label="Top Stories" className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Main Lead Story */}
          <div className="lg:col-span-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-700">
                <Radio className="h-4 w-4 animate-pulse" />
                <span>Lead Investigation</span>
              </div>
              <span className="text-xs font-medium text-slate-600">
                Updated Continuously
              </span>
            </div>

            <ArticleCard article={leadArticle} variant="lead" />

            {/* Secondary Featured Grid */}
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {secondaryFeatured.map((art) => (
                <ArticleCard key={art.id} article={art} />
              ))}
            </div>
          </div>

          {/* Right Wire Headlines Column */}
          <aside aria-label="Live Wire Headlines" className="lg:col-span-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900">
                  <TrendingUp className="h-4 w-4 text-sky-600" />
                  <span>Real-Time News Wire</span>
                </div>
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              </div>

              <div className="mt-2 divide-y divide-slate-100">
                {wireHeadlines.map((art) => (
                  <ArticleCard key={art.id} article={art} variant="compact" />
                ))}
              </div>

              <div className="mt-6 border-t border-slate-100 pt-4">
                <Link
                  href="/desks/search-ai"
                  className="flex items-center justify-center gap-1.5 rounded-lg bg-slate-100 py-2.5 text-xs font-bold text-slate-800 hover:bg-slate-200 transition"
                >
                  <span>Explore All Wire Archives</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* From the Editor-in-Chief Box */}
            <div className="mt-6 rounded-2xl border border-sky-200 bg-gradient-to-br from-sky-50 to-white p-6 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-800">
                <Award className="h-4 w-4 text-sky-600" />
                <span>From the Editor-in-Chief</span>
              </div>
              <h4 className="mt-2 font-serif text-lg font-bold text-slate-900">
                The New Standard in Algorithmic Journalism
              </h4>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                &ldquo;AI News was launched to strip away marketing hype and benchmark how applied AI, search models, and telecom automation actually impact commercial balance sheets.&rdquo;
              </p>
              <div className="mt-4 flex items-center gap-3 border-t border-sky-100 pt-3">
                <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border border-sky-300 bg-white">
                  <Image
                    src={AUTHORS['justin-davis'].avatar}
                    alt="Justin Davis"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="text-xs">
                  <strong className="block text-slate-900">Justin Davis</strong>
                  <span className="text-slate-500">Publisher &amp; Editor-in-Chief</span>
                </div>
              </div>
            </div>

            {/* Trending Tools Showcase */}
            <div className="mt-6">
              <TrendingTools />
            </div>
          </aside>
        </section>

        {/* Category Desk 1: Search & AI Overviews */}
        <section aria-label="Search & AI Overviews Desk" className="mt-16">
          <div className="flex items-center justify-between border-b-2 border-sky-600 pb-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-sky-700">Beat Coverage</span>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-slate-900">
                Search &amp; AI Overviews
              </h2>
            </div>
            <Link
              href="/desks/search-ai"
              className="inline-flex items-center gap-1 text-xs font-bold text-sky-700 hover:text-sky-900 transition"
            >
              <span>View Desk</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {searchArticles.map((art) => (
              <ArticleCard key={art.id} article={art} />
            ))}
          </div>
        </section>

        {/* Category Desk 2: Voice AI & Lead Response */}
        <section aria-label="Voice AI & Lead Response Desk" className="mt-16">
          <div className="flex items-center justify-between border-b-2 border-amber-600 pb-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800">Beat Coverage</span>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-slate-900">
                Voice AI &amp; Lead Response
              </h2>
            </div>
            <Link
              href="/desks/voice-lead-response"
              className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 hover:text-amber-950 transition"
            >
              <span>View Desk</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {voiceArticles.map((art) => (
              <ArticleCard key={art.id} article={art} />
            ))}
          </div>
        </section>

        {/* Category Desk 3: Local Business & Google Maps */}
        <section aria-label="Local Business & Google Maps Desk" className="mt-16">
          <div className="flex items-center justify-between border-b-2 border-emerald-600 pb-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Beat Coverage</span>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-slate-900">
                Local Business &amp; Google Maps
              </h2>
            </div>
            <Link
              href="/desks/local-business"
              className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 hover:text-emerald-950 transition"
            >
              <span>View Desk</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {localArticles.map((art) => (
              <ArticleCard key={art.id} article={art} />
            ))}
          </div>
        </section>

        {/* Category Desk 4: AI Tools & Automation */}
        <section aria-label="AI Tools & Automation Desk" className="mt-16">
          <div className="flex items-center justify-between border-b-2 border-purple-600 pb-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-purple-700">Beat Coverage</span>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-slate-900">
                AI Tools &amp; Automation
              </h2>
            </div>
            <Link
              href="/desks/ai-tools"
              className="inline-flex items-center gap-1 text-xs font-bold text-purple-700 hover:text-purple-900 transition"
            >
              <span>View Desk</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {toolsArticles.map((art) => (
              <ArticleCard key={art.id} article={art} />
            ))}
          </div>
        </section>

        {/* Newsletter Signup: The Daily Dispatch */}
        <section aria-label="Newsletter" className="mt-20 rounded-3xl border border-slate-900 bg-slate-950 p-8 sm:p-12 text-white shadow-xl">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-center">
            <div className="lg:col-span-7">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-900/60 px-3 py-1 text-xs font-bold uppercase tracking-wider text-sky-400">
                <Mail className="h-3.5 w-3.5" /> Daily Executive Briefing
              </span>
              <h3 className="mt-3 font-serif text-3xl md:text-4xl font-extrabold tracking-tight text-white">
                The AI News Daily Dispatch
              </h3>
              <p className="mt-3 text-sm md:text-base text-slate-400 leading-relaxed max-w-xl">
                Every weekday morning at 7:00 AM EST, our editorial board synthesizes the previous 24 hours of algorithm updates, speed-to-lead benchmarks, and AI code releases into a 5-minute technical briefing.
              </p>
              <div className="mt-4 flex items-center gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Zero spam
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Instant one-click unsubscribe
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Read by 12,000+ operators
                </span>
              </div>
            </div>

            <div className="lg:col-span-5">
              <NewsletterForm />
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
