import React from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import { SITE_CONFIG } from '@/config/site'
import { Building2, ShieldCheck, DollarSign, Users } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Ownership & Funding Disclosure',
  description: `Ownership, governance, and financial funding disclosure for ${SITE_CONFIG.name} (${SITE_CONFIG.legalName}).`,
  alternates: {
    canonical: `${SITE_CONFIG.url}/ownership`,
  },
}

export default function OwnershipPage() {
  return (
    <div className="bg-white py-12 lg:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="border-b border-slate-200 pb-8">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-slate-800">
            <Building2 className="h-3.5 w-3.5 text-sky-600" /> Corporate Transparency
          </div>
          <h1 className="mt-4 font-serif text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900">
            Ownership &amp; Funding Disclosure
          </h1>
          <p className="mt-3 text-base text-slate-600">
            Published in accordance with Google Publisher Center and FTC transparency guidelines.
          </p>
        </div>

        {/* Details */}
        <div className="mt-10 space-y-8 text-slate-700 leading-relaxed">
          <section>
            <h2 className="font-sans text-2xl font-bold tracking-tight text-slate-900">
              1. Publisher Entity &amp; Governance
            </h2>
            <p className="mt-3">
              <strong>{SITE_CONFIG.name}</strong> is owned and operated by <strong>{SITE_CONFIG.legalName}</strong>, a privately held digital media and technology research entity organized under the laws of the State of Delaware, United States.
            </p>
            <p className="mt-3">
              The publication was founded by <strong>Justin Davis</strong>, who serves as Publisher, Editor-in-Chief, and Lead Search Analyst. Editorial authority and newsroom decision-making reside entirely with the editorial staff.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
              <DollarSign className="h-5 w-5 text-emerald-600" />
              <span>2. Financial Structure &amp; Revenue Model</span>
            </div>
            <p className="mt-3 text-sm text-slate-600 leading-relaxed">
              {SITE_CONFIG.name} is funded through:
            </p>
            <ul className="mt-3 space-y-2 text-sm text-slate-700 list-disc pl-5">
              <li><strong>Private Capital:</strong> Initial founding capital contributed by the publisher to establish independent technical reporting infrastructure.</li>
              <li><strong>Direct Sponsorships &amp; Research Syndication:</strong> Technology companies and enterprise software providers may sponsor clearly demarcated research reports or industry benchmark surveys.</li>
              <li><strong>Affiliate Partnerships:</strong> Certain technical tool recommendations may include affiliate links. When present, these are explicitly labeled. Affiliate commissions never influence editorial scores or product evaluations.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-sans text-2xl font-bold tracking-tight text-slate-900">
              3. Editorial Independence Wall
            </h2>
            <p className="mt-3">
              In order to protect journalistic integrity, {SITE_CONFIG.name} maintains a strict structural wall between business operations and editorial reporting. Advertisers, corporate partners, and commercial sponsors:
            </p>
            <ul className="mt-3 space-y-2 list-disc pl-5">
              <li>Do not receive advance previews of investigative articles or reviews.</li>
              <li>Cannot purchase positive coverage, interview access, or algorithmic endorsements.</li>
              <li>Have no voice or vote in editorial assignments, story headlines, or corrections.</li>
            </ul>
          </section>

          <section className="border-t border-slate-200 pt-8">
            <h3 className="font-sans text-lg font-bold text-slate-900">Corporate Registered Bureau</h3>
            <p className="mt-2 text-sm text-slate-600">
              {SITE_CONFIG.legalName}<br />
              {SITE_CONFIG.address.streetAddress}<br />
              {SITE_CONFIG.address.addressLocality}, {SITE_CONFIG.address.addressRegion} {SITE_CONFIG.address.postalCode}<br />
              United States of America
            </p>
            <p className="mt-4 text-xs text-slate-500">
              Inquiries regarding corporate governance or legal matters can be routed through our <Link href="/contact" className="text-sky-600 underline">editorial contact desk</Link>.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
