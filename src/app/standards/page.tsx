import React from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import { SITE_CONFIG } from '@/config/site'
import { ShieldCheck, CheckCircle2, FileCheck, Award, ChevronRight, Check } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Editorial Standards & Verification Protocol',
  description: `The editorial standards, multi-source verification protocols, and algorithmic reporting ethics governing ${SITE_CONFIG.name}.`,
  alternates: {
    canonical: `${SITE_CONFIG.url}/standards`,
  },
}

export default function StandardsPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        '@id': `${SITE_CONFIG.url}/standards#breadcrumb`,
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
            name: 'Editorial Standards',
            item: `${SITE_CONFIG.url}/standards`,
          },
        ],
      },
    ],
  }

  return (
    <div className="bg-white py-12 lg:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-600 mb-6">
          <Link href="/" className="hover:text-slate-900 transition">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="font-semibold text-slate-800">Editorial Standards</span>
        </nav>

        <div className="border-b border-slate-200 pb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-3 py-1 text-xs font-bold text-sky-800 uppercase tracking-wider mb-4">
            <ShieldCheck className="h-4 w-4 text-sky-600" />
            Verification Protocol
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900">
            Editorial Standards &amp; Verification Protocol
          </h1>
          <p className="mt-4 text-lg text-slate-600 font-serif leading-relaxed">
            How Aine verifies empirical data, separates original field research from syndicated wire dispatches, and enforces rigorous sourcing.
          </p>
        </div>

        <div className="mt-10 space-y-12">
          <section>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-sky-600" />
              1. Two-Tier Editorial Architecture
            </h2>
            <p className="mt-3 text-sm text-slate-700 leading-relaxed">
              Every dispatch published across Aine belongs to one of two strictly delineated categories:
            </p>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl border border-sky-200 bg-sky-50/50 p-5">
                <span className="text-xs font-bold uppercase tracking-wider text-sky-800 block">Condition A</span>
                <h3 className="mt-1 font-bold text-slate-900 text-base">Original Analysis &amp; The Aine Frame</h3>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                  Deep investigative reporting, empirical telemetry, proprietary rank tracking benchmarks, and founder perspectives signed with a verified personal byline.
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block">Condition B</span>
                <h3 className="mt-1 font-bold text-slate-900 text-base">Aine Wire Desk</h3>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                  Syndicated corporate announcements, regulatory filings, and industry dispatches clearly designated as automated or curated dispatches.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-sky-600" />
              2. Empirical Telemetry &amp; Sourcing Standards
            </h2>
            <p className="mt-3 text-sm text-slate-700 leading-relaxed">
              Reports citing search ranking shifts, Google Maps proximity suppression, or voice AI latency must cite reproducible datasets or primary source documentation. Unverifiable third-party rumors are rejected.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-slate-700">
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Primary source documentation must be hyperlinked directly in the verification ledger.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Simulated geo-grid data must clearly state methodology and limitations.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Sponsored components are strictly separated from editorial copy.</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Award className="h-5 w-5 text-sky-600" />
              3. Corrections &amp; Public Transparency
            </h2>
            <p className="mt-3 text-sm text-slate-700 leading-relaxed">
              When factual errors occur, they are corrected promptly with a visible notice at the bottom of the article detailing the date, time, and specific revision made.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <Link
                href="/editorial-policy"
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                Full Editorial Policy &rarr;
              </Link>
              <Link
                href="/corrections-policy"
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                Corrections Policy &rarr;
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 rounded-lg bg-sky-700 px-4 py-2 text-xs font-semibold text-white hover:bg-sky-800 transition"
              >
                Contact the Newsroom Desk &rarr;
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
