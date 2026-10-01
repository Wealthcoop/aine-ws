import React from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import { SITE_CONFIG } from '@/config/site'

import { ChevronRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: `Terms of service governing the use of ${SITE_CONFIG.name}.`,
  alternates: {
    canonical: `${SITE_CONFIG.url}/terms`,
  },
}

export default function TermsPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        '@id': `${SITE_CONFIG.url}/terms#breadcrumb`,
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
            name: 'Terms of Service',
            item: `${SITE_CONFIG.url}/terms`,
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
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link href="/" className="hover:text-slate-900 transition">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="font-semibold text-slate-900">Terms of Service</span>
        </nav>

        <h1 className="font-serif text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900">
          Terms of Service
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Effective: January 15, 2026 • Last Reviewed: September 10, 2026
        </p>

        <div className="mt-8 space-y-6 text-slate-700 leading-relaxed text-sm">
          <p>
            Welcome to {SITE_CONFIG.name} ({SITE_CONFIG.legalName}). By accessing our digital news publication or syndication feeds, you agree to these Terms of Service.
          </p>

          <h2 className="font-sans text-xl font-bold text-slate-900 pt-4">1. Intellectual Property &amp; Fair Use</h2>
          <p>
            All original news reporting, investigative analyses, graphics, data compilations, and editorial layouts are the intellectual property of {SITE_CONFIG.legalName}, protected by United States and international copyright laws.
          </p>
          <p>
            Journalistic fair use quoting of our reporting is permitted provided that explicit editorial attribution and a direct canonical hyperlink to the source article on <a href={SITE_CONFIG.url} className="text-sky-600 underline">aine.ws</a> are provided. Automated mass scraping without authorization is strictly prohibited.
          </p>

          <h2 className="font-sans text-xl font-bold text-slate-900 pt-4">2. Editorial Disclaimer</h2>
          <p>
            Content published by AI News is provided for informational and journalistic purposes only. Our technical analyses of search algorithms, AI architectures, and telephony systems reflect empirical testing and journalistic research, not financial, legal, or investment advice.
          </p>

          <h2 className="font-sans text-xl font-bold text-slate-900 pt-4">3. Governing Law</h2>
          <p>
            These Terms are governed by and construed in accordance with the laws of the State of Delaware, United States, without regard to its conflict of law provisions.
          </p>
        </div>
      </div>
    </div>
  )
}
