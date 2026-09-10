import React from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ARTICLES } from '@/data/articles'
import { AUTHORS } from '@/config/authors'
import { SITE_CONFIG } from '@/config/site'
import { NewsArticleSchema } from '@/components/NewsArticleSchema'
import { SponsorSlot } from '@/components/SponsorSlot'
import { ArticleCard } from '@/components/ArticleCard'
import {
  ChevronRight,
  Clock,
  Calendar,
  User,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
  Share2,
  FileCheck,
  ArrowRight
} from 'lucide-react'

interface PageProps {
  params: {
    category: string
    slug: string
  }
}

export async function generateStaticParams() {
  return ARTICLES.map((article) => ({
    category: article.category,
    slug: article.slug,
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const article = ARTICLES.find((a) => a.slug === params.slug)
  if (!article) {
    return { title: 'Article Not Found' }
  }

  const author = AUTHORS[article.authorId] || AUTHORS['justin-davis']

  return {
    title: article.title,
    description: article.deck,
    authors: [{ name: author.name, url: `${SITE_CONFIG.url}/authors/${author.id}` }],
    category: article.category,
    openGraph: {
      type: 'article',
      title: article.title,
      description: article.deck,
      url: `${SITE_CONFIG.url}/news/${article.category}/${article.slug}`,
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt || article.publishedAt,
      section: article.category,
      authors: [`${SITE_CONFIG.url}/authors/${author.id}`],
      images: [
        {
          url: article.featuredImage,
          width: 1200,
          height: 675,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.deck,
      images: [article.featuredImage],
    },
  }
}

export default function ArticleReaderPage({ params }: PageProps) {
  const article = ARTICLES.find((a) => a.slug === params.slug)

  if (!article) {
    notFound()
  }

  const author = AUTHORS[article.authorId] || AUTHORS['justin-davis']
  const formattedPublishDate = new Date(article.publishedAt).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
  const formattedPublishTime = new Date(article.publishedAt).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  })

  // Related articles from same or adjacent categories
  const relatedArticles = ARTICLES.filter((a) => a.id !== article.id)
    .slice(0, 3)

  return (
    <article className="bg-white py-8 lg:py-12">
      {/* Schema.org NewsArticle JSON-LD */}
      <NewsArticleSchema article={article} />

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link href="/" className="hover:text-slate-900 transition">Wire</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href={`/desks/${article.category}`} className="hover:text-slate-900 transition uppercase font-semibold">
            {article.category.replace('-', ' ')}
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-slate-400 truncate max-w-xs">{article.title}</span>
        </nav>

        {/* Article Header */}
        <header className="border-b border-slate-200 pb-8">
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={`/desks/${article.category}`}
              className="rounded-full bg-sky-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-sky-800 hover:bg-sky-200 transition"
            >
              {article.category.replace('-', ' ')}
            </Link>
            {article.isBreaking && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-600 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
                <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" /> Breaking Wire
              </span>
            )}
          </div>

          <h1 className="mt-4 font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
            {article.title}
          </h1>

          <p className="mt-4 text-lg sm:text-xl text-slate-600 font-serif leading-relaxed">
            {article.deck}
          </p>

          {/* Author Byline & Timestamps */}
          <div className="mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50/70 p-4">
            <div className="flex items-center gap-3">
              <Link href={`/authors/${author.id}`} className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-slate-300 bg-slate-200">
                <Image
                  src={author.avatar}
                  alt={author.name}
                  fill
                  className="object-cover"
                />
              </Link>
              <div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/authors/${author.id}`}
                    className="font-sans text-sm font-bold text-slate-900 hover:text-sky-700 transition"
                  >
                    {author.name}
                  </Link>
                  <span className="text-[10px] rounded bg-slate-200 px-1.5 py-0.5 font-semibold text-slate-700">
                    Verified
                  </span>
                </div>
                <p className="text-xs text-slate-500">{author.title}</p>
              </div>
            </div>

            <div className="flex flex-col sm:items-end text-xs text-slate-500 space-y-0.5">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                <time dateTime={article.publishedAt}>
                  Published: {formattedPublishDate} at {formattedPublishTime}
                </time>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-slate-400" />
                <span>Reading Time: {article.readingTimeMinutes} minutes</span>
              </div>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        <div className="mt-8">
          <div className="relative overflow-hidden rounded-2xl bg-slate-900 aspect-[16/9] shadow-sm">
            <Image
              src={article.featuredImage}
              alt={article.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 900px"
              className="object-cover"
            />
          </div>
          {article.featuredImageCaption && (
            <figcaption className="mt-2 text-center text-xs text-slate-500 italic">
              {article.featuredImageCaption} (AI News Telemetry Archive)
            </figcaption>
          )}
        </div>

        {/* Key Takeaways Callout */}
        {article.keyTakeaways && article.keyTakeaways.length > 0 && (
          <div className="mt-8 rounded-2xl border border-sky-200 bg-sky-50/60 p-6 shadow-sm">
            <div className="flex items-center gap-2 text-sky-900 font-bold text-sm uppercase tracking-wider">
              <FileCheck className="h-4 w-4 text-sky-700" />
              <span>Key Editorial Takeaways</span>
            </div>
            <ul className="mt-3 space-y-2.5 text-sm text-slate-800">
              {article.keyTakeaways.map((takeaway, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sky-200 text-[11px] font-bold text-sky-800 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-snug">{takeaway}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Main Article Body (AP Style) */}
        <div
          className="article-prose mt-10"
          dangerouslySetInnerHTML={{ __html: article.contentHtml }}
        />

        {/* Native Sponsor Slot (Strictly controlled by MONETIZATION_CONFIG) */}
        <SponsorSlot
          vertical={
            article.category === 'telephony-automation'
              ? 'telephony'
              : 'local-seo'
          }
        />

        {/* Primary Sources & Attributions (Google News Requirement) */}
        {article.sources && article.sources.length > 0 && (
          <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Primary Source Verification &amp; Attributions</span>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              In adherence to AI News fact-checking standards, the statements in this report were verified against the following primary sources:
            </p>
            <ul className="mt-4 space-y-2 text-xs">
              {article.sources.map((source, idx) => (
                <li key={idx} className="flex items-start justify-between gap-4 border-b border-slate-200/60 pb-2 last:border-0 last:pb-0">
                  <div>
                    <strong className="text-slate-900 block">{source.name}</strong>
                    <span className="text-slate-600">{source.context}</span>
                  </div>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sky-700 hover:text-sky-900 font-medium shrink-0"
                  >
                    <span>View Record</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Author Bio Box */}
        <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-slate-300 bg-slate-100">
              <Image
                src={author.avatar}
                alt={author.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="font-sans text-base font-bold text-slate-900">
                Reported by {author.name}
              </h3>
              <p className="text-xs text-slate-500">{author.role}</p>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                {author.bio}
              </p>
              <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs">
                <Link
                  href={`/authors/${author.id}`}
                  className="font-semibold text-sky-700 hover:underline"
                >
                  View Author Profile &amp; Byline History &rarr;
                </Link>
                <Link
                  href={`/contact?type=${author.id}`}
                  className="text-slate-500 hover:text-slate-800"
                >
                  Contact Journalist Directly
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Editorial Correction Notice */}
        <div className="mt-8 border-t border-slate-200 pt-4 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <div className="flex items-center gap-1.5">
            <AlertCircle className="h-3.5 w-3.5 text-slate-400" />
            <span>Spotted a factual discrepancy?</span>
          </div>
          <Link
            href={`/contact?type=correction&subject=${encodeURIComponent('Correction: ' + article.title)}`}
            className="text-sky-700 font-semibold hover:underline"
          >
            Submit a correction request to our editorial desk &rarr;
          </Link>
        </div>

        {/* Related Articles */}
        <div className="mt-14 border-t border-slate-200 pt-10">
          <h2 className="font-serif text-2xl font-bold text-slate-900">
            Related Investigations
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {relatedArticles.map((rel) => (
              <ArticleCard key={rel.id} article={rel} />
            ))}
          </div>
        </div>
      </div>
    </article>
  )
}
