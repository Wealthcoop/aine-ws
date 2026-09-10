import React from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import { SITE_CONFIG } from '@/config/site'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: `Privacy policy and data governance practices of ${SITE_CONFIG.name}.`,
}

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-white py-12 lg:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <h1 className="font-serif text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900">
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Last Updated: September 10, 2026 • Compliant with GDPR &amp; CCPA/CPRA
        </p>

        <div className="mt-8 space-y-6 text-slate-700 leading-relaxed text-sm">
          <p>
            {SITE_CONFIG.legalName} (&quot;{SITE_CONFIG.name}&quot;, &quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) operates the publication at <a href={SITE_CONFIG.url} className="text-sky-600 underline">{SITE_CONFIG.url}</a>. This Privacy Policy details how we collect, use, and safeguard information when you access our news wire.
          </p>

          <h2 className="font-sans text-xl font-bold text-slate-900 pt-4">1. Information We Collect</h2>
          <p>
            We collect minimal information necessary to deliver independent news reporting:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Editorial Submissions &amp; Tips:</strong> When you use our Newsroom Desk to submit tips, corrections, or inquiries, we collect your name, email, and message content. If you check &quot;Confidential Anonymous Source&quot;, identifying details are withheld from public publication.</li>
            <li><strong>Automated Analytics:</strong> Standard non-personally identifiable server logs (IP address, browser user agent, referring URL, time of visit) used to assess technical uptime and protect against DDoS attacks.</li>
          </ul>

          <h2 className="font-sans text-xl font-bold text-slate-900 pt-4">2. Use of Information</h2>
          <p>
            We never sell or rent your personal information to data brokers or advertising exchanges. Information submitted through our editorial desk is strictly utilized to:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Investigate and verify reported news tips and industry leaks.</li>
            <li>Respond to reader inquiries or factual correction requests.</li>
            <li>Deliver requested email newsletters or dispatch alerts.</li>
          </ul>

          <h2 className="font-sans text-xl font-bold text-slate-900 pt-4">3. Data Retention &amp; Security</h2>
          <p>
            We implement enterprise-grade encryption (TLS 1.3) across all transmissions. Editorial tips submitted under anonymous source protection are safeguarded under journalistic confidentiality principles.
          </p>

          <h2 className="font-sans text-xl font-bold text-slate-900 pt-4">4. Your Legal Rights</h2>
          <p>
            Under GDPR and CCPA, you have the right to request access to, deletion of, or restriction of your personal data. To exercise these rights, contact us at <Link href="/contact" className="text-sky-600 underline">aine.ws/contact</Link>.
          </p>
        </div>
      </div>
    </div>
  )
}
