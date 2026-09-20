import React from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import { SITE_CONFIG } from '@/config/site'
import { CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Corrections Policy & Public Verification Log',
  description: `The formal corrections and factual clarification policy for ${SITE_CONFIG.name}, including our public corrections log.`,
  alternates: {
    canonical: `${SITE_CONFIG.url}/corrections-policy`,
  },
}

export default function CorrectionsPolicyPage() {
  const correctionsLog = [
    {
      date: '2026-08-28',
      articleTitle: 'OpenAI Search Architecture Benchmarks',
      correctionText: 'An earlier version of this report stated the latency threshold was measured across 10,000 queries. The verified benchmark sample was 8,500 queries. The data table has been updated accordingly.',
      resolvedBy: 'Justin Davis, Editor-in-Chief'
    },
    {
      date: '2026-07-14',
      articleTitle: 'FCC Carrier Registration Requirements for Voice AI',
      correctionText: 'Clarified that STIR/SHAKEN certification level B requires cryptographic token signing through an authorized telecom carrier, rather than direct FCC portal registration.',
      resolvedBy: 'Marcus Vance, Senior Telephony Reporter'
    }
  ]

  return (
    <div className="bg-white py-12 lg:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="border-b border-slate-200 pb-8">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-900">
            <CheckCircle2 className="h-3.5 w-3.5" /> Accountability Standard
          </div>
          <h1 className="mt-4 font-serif text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900">
            Corrections Policy &amp; Public Log
          </h1>
          <p className="mt-4 text-lg text-slate-600 leading-relaxed font-serif">
            Accuracy is the cornerstone of credible journalism. When errors occur in our reporting, {SITE_CONFIG.name} is committed to correcting them promptly, transparently, and comprehensively.
          </p>
        </div>

        {/* Policy Details */}
        <div className="mt-10 space-y-8 text-slate-700 leading-relaxed">
          <div>
            <h2 className="font-sans text-2xl font-bold tracking-tight text-slate-900">
              Our Commitment to Immediate Rectification
            </h2>
            <p className="mt-3">
              We distinguish between minor typographical errata and substantive factual errors. Typographical fixes that do not alter the meaning of a report are corrected directly in the content management system. Substantive errors—such as incorrect metrics, misattributed statements, or flawed legal interpretations—require:
            </p>
            <ul className="mt-3 space-y-2 list-disc pl-5">
              <li>Immediate factual verification by the beat editor or Editor-in-Chief.</li>
              <li>An inline revision of the text to present accurate, verified data.</li>
              <li>A prominent, timestamped <strong>Editorial Correction Note</strong> appended to the bottom of the article.</li>
              <li>Permanent recording in our public Corrections Log below.</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h3 className="font-sans text-lg font-bold text-slate-900">
              How to Submit a Factual Correction Request
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              If you have identified a factual discrepancy, broken link, or inaccurate figure in any article published by AI News, please notify our editorial desk immediately:
            </p>
            <div className="mt-4">
              <Link
                href="/contact?type=correction"
                className="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-sky-700"
              >
                <span>Submit Correction to Editorial Desk</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Public Corrections Log */}
          <div className="pt-6">
            <h2 className="font-sans text-2xl font-bold tracking-tight text-slate-900">
              Public Editorial Corrections Log
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              In accordance with Google News and Trust Project standards, below is our rolling public log of substantive editorial corrections:
            </p>

            <div className="mt-6 space-y-4">
              {correctionsLog.map((item, idx) => (
                <div key={idx} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="font-semibold text-slate-900">{item.articleTitle}</span>
                    <span className="rounded bg-slate-100 px-2 py-0.5 text-slate-600 font-mono">
                      Timestamp: {item.date}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-slate-700 leading-relaxed">
                    {item.correctionText}
                  </p>
                  <p className="mt-3 text-xs font-medium text-slate-500">
                    Verified &amp; Appended by: <span className="text-slate-800">{item.resolvedBy}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
