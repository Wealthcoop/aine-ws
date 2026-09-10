import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { NewsArticle } from '@/types/news'
import { AUTHORS } from '@/config/authors'
import { Clock, User } from 'lucide-react'

interface ArticleCardProps {
  article: NewsArticle
  variant?: 'featured' | 'standard' | 'compact' | 'lead'
  showImage?: boolean
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string; label: string }> = {
  'search-ai': {
    bg: 'bg-sky-50',
    text: 'text-sky-700',
    border: 'border-sky-200',
    label: 'Search & AI Overviews'
  },
  'local-business': {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    label: 'Local Business & Google Maps'
  },
  'voice-lead-response': {
    bg: 'bg-amber-50',
    text: 'text-amber-800',
    border: 'border-amber-200',
    label: 'Voice AI & Lead Response'
  },
  'ai-tools': {
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-200',
    label: 'AI Tools & Automation'
  }
}

export function ArticleCard({ article, variant = 'standard', showImage = true }: ArticleCardProps) {
  const author = AUTHORS[article.authorId] || AUTHORS['justin-davis']
  const catStyle = CATEGORY_COLORS[article.category] || CATEGORY_COLORS['search-ai']
  const articleHref = `/news/${article.category}/${article.slug}`
  const formattedDate = new Date(article.publishedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })

  if (variant === 'lead') {
    return (
      <article className="group relative grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8 rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm transition hover:shadow-md">
        <div className="lg:col-span-7 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <Link
                href={`/desks/${article.category}`}
                className={`inline-flex items-center rounded-full px-3 py-1 font-semibold uppercase tracking-wider transition ${catStyle.bg} ${catStyle.text} border ${catStyle.border} hover:opacity-80`}
              >
                {catStyle.label}
              </Link>
              {article.isBreaking && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-600 px-3 py-1 font-bold uppercase tracking-wider text-white">
                  <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" /> Breaking News
                </span>
              )}
              <time dateTime={article.publishedAt} className="text-slate-500">
                {formattedDate}
              </time>
            </div>

            <h2 className="mt-4 font-serif text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 group-hover:text-sky-700 transition">
              <Link href={articleHref} className="focus:outline-none focus:ring-2 focus:ring-sky-600 rounded">
                {article.title}
              </Link>
            </h2>

            <p className="mt-3 text-base md:text-lg text-slate-600 leading-relaxed line-clamp-3">
              {article.deck}
            </p>
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-500">
            <Link
              href={`/authors/${author.id}`}
              className="flex items-center gap-2 font-medium text-slate-800 hover:text-sky-700 transition"
            >
              <div className="h-7 w-7 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
                <Image
                  src={author.avatar}
                  alt={author.name}
                  width={28}
                  height={28}
                  className="h-full w-full object-cover"
                />
              </div>
              <span>By {author.name}</span>
            </Link>
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              <span>{article.readingTimeMinutes} min read</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 relative overflow-hidden rounded-xl bg-slate-900 aspect-[16/10] lg:aspect-auto">
          <Link href={articleHref} tabIndex={-1} aria-hidden="true" className="block h-full w-full">
            <Image
              src={article.featuredImage}
              alt={article.title}
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              priority
              className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
            />
          </Link>
        </div>
      </article>
    )
  }

  if (variant === 'compact') {
    return (
      <article className="group flex flex-col justify-between py-4 border-b border-slate-100 last:border-0">
        <div>
          <div className="flex items-center gap-2 text-[11px]">
            <Link
              href={`/desks/${article.category}`}
              className={`font-semibold uppercase tracking-wider transition ${catStyle.text} hover:underline`}
            >
              {catStyle.label}
            </Link>
            <span className="text-slate-300">•</span>
            <time dateTime={article.publishedAt} className="text-slate-400">
              {formattedDate}
            </time>
          </div>
          <h3 className="mt-1.5 font-serif text-base font-bold leading-snug text-slate-900 group-hover:text-sky-700 transition">
            <Link href={articleHref} className="focus:outline-none focus:ring-1 focus:ring-sky-600 rounded">
              {article.title}
            </Link>
          </h3>
        </div>
        <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
          <Link href={`/authors/${author.id}`} className="hover:text-slate-800 transition">
            By {author.name}
          </Link>
          <span>{article.readingTimeMinutes}m read</span>
        </div>
      </article>
    )
  }

  return (
    <article className="group flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md hover:border-slate-300">
      <div>
        {showImage && article.featuredImage && (
          <div className="relative mb-4 overflow-hidden rounded-lg bg-slate-900 aspect-[16/9]">
            <Link href={articleHref} tabIndex={-1} aria-hidden="true" className="block h-full w-full">
              <Image
                src={article.featuredImage}
                alt={article.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
              />
            </Link>
          </div>
        )}

        <div className="flex items-center gap-2 text-xs">
          <Link
            href={`/desks/${article.category}`}
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 font-semibold uppercase tracking-wider text-[11px] ${catStyle.bg} ${catStyle.text} border ${catStyle.border}`}
          >
            {catStyle.label}
          </Link>
          <time dateTime={article.publishedAt} className="text-slate-400 text-xs">
            {formattedDate}
          </time>
        </div>

        <h3 className="mt-3 font-serif text-lg font-bold leading-snug text-slate-900 group-hover:text-sky-700 transition">
          <Link href={articleHref} className="focus:outline-none focus:ring-1 focus:ring-sky-600 rounded">
            {article.title}
          </Link>
        </h3>

        <p className="mt-2 text-sm text-slate-600 leading-relaxed line-clamp-2">
          {article.deck}
        </p>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
        <Link
          href={`/authors/${author.id}`}
          className="flex items-center gap-1.5 font-medium text-slate-700 hover:text-sky-700 transition"
        >
          <User className="h-3 w-3 text-slate-400" />
          <span>{author.name}</span>
        </Link>
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <span>{article.readingTimeMinutes} min</span>
        </div>
      </div>
    </article>
  )
}
