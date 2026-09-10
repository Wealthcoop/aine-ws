import React from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { AUTHORS } from '@/config/authors'
import { SITE_CONFIG } from '@/config/site'
import { ShieldCheck, Award, MapPin, Mail, Globe, ArrowRight, ExternalLink } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Masthead & About the Publication',
  description: `About ${SITE_CONFIG.name} (${SITE_CONFIG.legalName}): Mission, journalistic standards, masthead, and editorial leadership.`,
}

export default function AboutPage() {
  return (
    <div className="bg-white py-12 lg:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="border-b border-slate-200 pb-8">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-slate-800">
            <Award className="h-3 w-3 text-sky-600" /> Editorial Masthead &amp; Mission
          </div>
          <h1 className="mt-4 font-serif text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900">
            About {SITE_CONFIG.name}
          </h1>
          <p className="mt-4 text-lg text-slate-600 leading-relaxed font-serif">
            {SITE_CONFIG.legalName} is an independent, specialized digital news publication dedicated to empirical reporting, architectural analysis, and investigative journalism across artificial intelligence, search algorithms, and commercial automation.
          </p>
        </div>

        {/* Mission & Founding Principles */}
        <div className="mt-10 space-y-6 text-base text-slate-700 leading-relaxed">
          <h2 className="font-sans text-2xl font-bold tracking-tight text-slate-900">
            Our Journalistic Mission
          </h2>
          <p>
            As artificial intelligence accelerates from laboratory research into production software, the lines between commercial marketing, algorithmic hallucination, and factual reality have blurred. Traditional tech journalism frequently regurgitates corporate press releases without code-level scrutiny or empirical verification.
          </p>
          <p>
            <strong>AINE.WS was established to provide the antidote.</strong> We investigate how machine learning architectures, telephony pipelines, and search algorithms perform under real-world commercial conditions. Whether examining Google’s deployment of multi-entity AI Overviews in local map packs, quantifying phone response latency across B2B sales organizations, or reverse-engineering Generative Engine Optimization (GEO) heuristics, our coverage is anchored in verifiable data.
          </p>
        </div>

        {/* Masthead Team */}
        <div className="mt-14 border-t border-slate-200 pt-10">
          <h2 className="font-sans text-2xl font-bold tracking-tight text-slate-900">
            The Editorial Board &amp; Correspondents
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            All news reports, investigative analyses, and commentary on AINE.WS are produced by accredited journalists and subject-matter analysts.
          </p>

          <div className="mt-8 space-y-8">
            {Object.values(AUTHORS).map((author) => (
              <div
                key={author.id}
                className="flex flex-col sm:flex-row items-start gap-6 rounded-2xl border border-slate-200 bg-slate-50/50 p-6 transition hover:border-slate-300"
              >
                <div className="relative h-20 w-20 sm:h-24 sm:w-24 shrink-0 overflow-hidden rounded-full border-2 border-white shadow-sm bg-slate-200">
                  <Image
                    src={author.avatar}
                    alt={author.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h3 className="font-sans text-xl font-bold text-slate-900">
                        <Link href={`/authors/${author.id}`} className="hover:text-sky-700 transition">
                          {author.name}
                        </Link>
                      </h3>
                      <p className="text-xs font-semibold uppercase tracking-wider text-sky-700">
                        {author.role} • {author.title}
                      </p>
                    </div>
                    {author.linkedin && (
                      <a
                        href={author.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded border border-slate-300 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
                      >
                        LinkedIn <ExternalLink className="h-3 w-3 text-slate-400" />
                      </a>
                    )}
                  </div>
                  <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                    {author.bio}
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-semibold text-slate-500">Assigned Beats:</span>
                    {author.beats.map((beat) => (
                      <span
                        key={beat}
                        className="rounded-full bg-slate-200/70 px-2.5 py-0.5 text-[11px] font-medium text-slate-800"
                      >
                        {beat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Verification & Trust Commitments */}
        <div className="mt-14 rounded-2xl border border-sky-100 bg-sky-50/50 p-8">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-6 w-6 text-sky-700" />
            <h3 className="font-sans text-xl font-bold text-slate-900">
              The AINE.WS Verification Protocol
            </h3>
          </div>
          <p className="mt-3 text-sm text-slate-700 leading-relaxed">
            Our newsroom adheres to the Trust Project’s foundational indicators of journalistic credibility:
          </p>
          <ul className="mt-4 space-y-2 text-sm text-slate-700 list-disc pl-5">
            <li><strong>Original Source Citation:</strong> We do not publish second-hand rumors. All claims link to original research, API documentation, or named on-the-record witnesses.</li>
            <li><strong>Rigorous Human Oversight:</strong> While automated data pipelines assist in telemetry monitoring, every published story is written, fact-checked, and approved by human editors.</li>
            <li><strong>Clear Separation of Editorial &amp; Commercial Interests:</strong> Advertisers and sponsors have zero influence over beat coverage, investigative targets, or algorithmic ratings.</li>
          </ul>
        </div>

        {/* Corporate Headquarters */}
        <div className="mt-14 border-t border-slate-200 pt-8">
          <h3 className="font-sans text-lg font-bold text-slate-900">Corporate &amp; Bureau Coordinates</h3>
          <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 text-sm text-slate-600">
            <div>
              <p className="font-semibold text-slate-900">{SITE_CONFIG.legalName}</p>
              <p>{SITE_CONFIG.address.streetAddress}</p>
              <p>{SITE_CONFIG.address.addressLocality}, {SITE_CONFIG.address.addressRegion} {SITE_CONFIG.address.postalCode}</p>
              <p>United States of America</p>
            </div>
            <div>
              <p className="font-semibold text-slate-900">Editorial Direct Lines</p>
              <p>General Press: <a href={`mailto:${SITE_CONFIG.contact.pressInquiries}`} className="text-sky-600 underline">{SITE_CONFIG.contact.pressInquiries}</a></p>
              <p>News Tips: <Link href="/contact" className="text-sky-600 underline">aine.ws/contact</Link></p>
              <p>Corrections Desk: <Link href="/corrections-policy" className="text-sky-600 underline">aine.ws/corrections-policy</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
