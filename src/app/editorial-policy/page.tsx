import React from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import { SITE_CONFIG } from '@/config/site'
import { ShieldCheck, CheckCircle2, FileCheck, AlertTriangle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Editorial Standards & Ethics Policy',
  description: `The editorial standards, fact-checking guidelines, and AI disclosure framework governing ${SITE_CONFIG.name}.`,
}

export default function EditorialPolicyPage() {
  return (
    <div className="bg-white py-12 lg:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="border-b border-slate-200 pb-8">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-800">
            <ShieldCheck className="h-3.5 w-3.5" /> E-E-A-T Trust Architecture
          </div>
          <h1 className="mt-4 font-serif text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900">
            Editorial Standards &amp; Ethics Policy
          </h1>
          <p className="mt-3 text-base text-slate-600">
            Effective Date: January 15, 2026 • Last Reviewed: September 10, 2026
          </p>
        </div>

        {/* Content */}
        <div className="mt-10 space-y-10 text-slate-700 leading-relaxed">
          <section>
            <h2 className="font-sans text-2xl font-bold tracking-tight text-slate-900">
              1. Fundamental Journalistic Commitment
            </h2>
            <p className="mt-3">
              {SITE_CONFIG.legalName} publishes under the standard canons of American journalism: accuracy, independence, fairness, and accountability. Our coverage focuses on the technical, operational, and commercial impacts of artificial intelligence, search engine ranking algorithms, and sales telephony automation.
            </p>
            <p className="mt-3">
              We operate with strict editorial independence. No advertiser, sponsor, venture capital backer, or corporate entity exerts editorial veto power over our reporting, headline choices, or source selections.
            </p>
          </section>

          <section id="standards">
            <h2 className="font-sans text-2xl font-bold tracking-tight text-slate-900">
              2. Fact-Checking &amp; Primary Source Verification
            </h2>
            <p className="mt-3">
              Factual integrity is non-negotiable. Our reporters follow a three-tier verification protocol:
            </p>
            <ul className="mt-3 space-y-2 list-disc pl-5">
              <li><strong>Empirical Telemetry:</strong> Whenever an algorithm update or latency claim is reported (e.g. speed-to-lead benchmarks, map-pack fluctuations), reporters must reference documented test methodology, sample size, and date range.</li>
              <li><strong>Primary Documentation:</strong> Claims attributing official statements or technical capabilities to platforms (such as Google, OpenAI, Anthropic, or the FCC) must directly link to official engineering blogs, patent filings, or public regulatory filings.</li>
              <li><strong>Corroboration:</strong> Breaking stories relying on anonymous industry insiders require at least two independent corroborating sources before editorial clearance is granted.</li>
            </ul>
          </section>

          <section id="ai-disclosure" className="rounded-2xl border border-sky-100 bg-sky-50/60 p-6 sm:p-8">
            <div className="flex items-center gap-2.5 text-sky-900">
              <FileCheck className="h-6 w-6 text-sky-600" />
              <h2 className="font-sans text-2xl font-bold tracking-tight">
                3. Artificial Intelligence &amp; Automation Disclosure
              </h2>
            </div>
            <p className="mt-4 text-sm text-sky-950 leading-relaxed">
              In an era of generative machine learning, transparency regarding our own use of technology is critical:
            </p>
            <ul className="mt-3 space-y-2 text-sm text-sky-950 list-disc pl-5">
              <li><strong>Zero Synthetic Hallucination:</strong> AI News does not publish unverified, fully automated synthetic articles. All stories are drafted, reviewed, contextualized, and approved by named human journalists on our masthead.</li>
              <li><strong>Automated Telemetry Tools:</strong> Our newsroom employs proprietary scrapers and RSS monitoring pipelines (such as our newsroom wire) to monitor public SERP indices, patent databases, and code releases. These tools surface raw signals; human editors synthesize and report the story.</li>
              <li><strong>Accountability:</strong> Byline authors take full professional and legal responsibility for every sentence, graphic, and metric appearing under their names.</li>
            </ul>
          </section>

          <section id="ethics">
            <h2 className="font-sans text-2xl font-bold tracking-tight text-slate-900">
              4. Conflicts of Interest &amp; Commercial Separation
            </h2>
            <p className="mt-3">
              To maintain the highest tier of reader and search engine trust:
            </p>
            <ul className="mt-3 space-y-2 list-disc pl-5">
              <li><strong>Clear Advertising Delimitation:</strong> Sponsored content, partner case studies, or native affiliate resources are explicitly labeled as such and strictly segregated from editorial reporting.</li>
              <li><strong>No Pay-for-Coverage:</strong> AI News does not accept payment, gifts, or financial kickbacks in exchange for favorable news coverage, product reviews, or interview features.</li>
              <li><strong>Disclosures:</strong> If an article analyzes a service or software with which our parent organization maintains an agency or vendor relationship, a prominent disclosure is included within the piece.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-sans text-2xl font-bold tracking-tight text-slate-900">
              5. Corrections and Retractions
            </h2>
            <p className="mt-3">
              When factual errors occur, we correct them swiftly and transparently. We do not stealth-edit stories. Any correction that alters meaning or numerical data is appended with an explicit timestamped notice at the bottom of the article.
            </p>
            <p className="mt-2">
              For complete details on submitting a correction request or reviewing our public log, please visit our dedicated <Link href="/corrections-policy" className="text-sky-600 underline font-medium">Corrections Policy</Link>.
            </p>
          </section>

          <section className="border-t border-slate-200 pt-8">
            <h3 className="font-sans text-lg font-bold text-slate-900">Questions or Concerns?</h3>
            <p className="mt-2 text-sm text-slate-600">
              Inquiries regarding our editorial integrity or journalistic conduct should be directed to Justin Davis, Publisher &amp; Editor-in-Chief, via our <Link href="/contact" className="text-sky-600 underline">editorial contact desk</Link>.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
