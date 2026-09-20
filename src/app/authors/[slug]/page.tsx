import React from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { AUTHORS } from '@/config/authors'
import { ARTICLES } from '@/data/articles'
import { SITE_CONFIG } from '@/config/site'
import { ArticleCard } from '@/components/ArticleCard'
import { Mail, ExternalLink, ShieldCheck, Newspaper, Award } from 'lucide-react'

interface PageProps {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  return Object.keys(AUTHORS).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const author = AUTHORS[params.slug]
  if (!author) {
    return { title: 'Author Not Found' }
  }

  return {
    title: `${author.name} - ${author.title}`,
    description: author.bio,
    alternates: {
      canonical: `${SITE_CONFIG.url}/authors/${params.slug}`,
    },
    openGraph: {
      title: `${author.name} | Editorial Masthead | ${SITE_CONFIG.name}`,
      description: author.bio,
      images: [{ url: author.avatar }],
    },
  }
}

export default function AuthorProfilePage({ params }: PageProps) {
  const author = AUTHORS[params.slug]

  if (!author) {
    notFound()
  }

  const authorArticles = ARTICLES.filter((a) => a.authorId === author.id)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())

  return (
    <div className="bg-slate-50 py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Author Header Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-10 shadow-sm">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="relative h-32 w-32 md:h-40 md:w-40 shrink-0 overflow-hidden rounded-2xl border-4 border-slate-100 bg-slate-100 shadow-md">
              <Image
                src={author.avatar}
                alt={author.name}
                fill
                priority
                className="object-cover"
              />
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-sky-100 px-3 py-0.5 text-xs font-bold uppercase tracking-wider text-sky-800">
                  <ShieldCheck className="h-3.5 w-3.5" /> Accredited Journalist
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-0.5 text-xs font-semibold text-slate-700">
                  {author.role}
                </span>
              </div>

              <h1 className="mt-3 font-serif text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
                {author.name}
              </h1>
              <p className="mt-1 text-base font-semibold text-sky-700">
                {author.title}
              </p>

              <p className="mt-4 text-base text-slate-600 leading-relaxed max-w-3xl">
                {author.bio}
              </p>

              {/* Beats & Verified Credentials */}
              <div className="mt-6 flex flex-wrap items-center justify-center md:justify-start gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mr-1">
                  Assigned Beats:
                </span>
                {author.beats.map((beat) => (
                  <span
                    key={beat}
                    className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-800 border border-slate-200"
                  >
                    {beat}
                  </span>
                ))}
              </div>

              {/* Author Actions */}
              <div className="mt-6 flex flex-wrap items-center justify-center md:justify-start gap-3 border-t border-slate-100 pt-6">
                {author.linkedin && (
                  <a
                    href={author.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition"
                  >
                    <span>Verified LinkedIn Profile</span>
                    <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                  </a>
                )}
                <Link
                  href={`/contact?type=${author.id}`}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-slate-800 transition"
                >
                  <Mail className="h-3.5 w-3.5" />
                  <span>Send Direct Inquiry / Tip</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Authored Articles */}
        <div className="mt-12">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <h2 className="font-serif text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Newspaper className="h-5 w-5 text-sky-600" />
              <span>Investigative Catalog &amp; Byline Reports</span>
            </h2>
            <span className="text-xs font-medium text-slate-500">
              {authorArticles.length} Published Investigations
            </span>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {authorArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
