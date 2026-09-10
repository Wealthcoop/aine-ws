import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { SITE_CONFIG } from '@/config/site'
import { ShieldCheck, Mail, MapPin, Rss, FileText, CheckCircle2 } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-slate-400">
      {/* Upper Trust & Transparency Banner */}
      <div className="border-b border-slate-800 bg-slate-900/60 py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="flex items-start gap-3">
              <ShieldCheck className="h-6 w-6 text-sky-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-white">Trust &amp; Verification Protocol</h4>
                <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                  Every article published on AINE.WS undergoes primary source verification, data validation, and strict editorial review prior to publication.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-6 w-6 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-white">Transparent Corrections</h4>
                <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                  We acknowledge factual errors transparently. Any substantive revision is accompanied by a timestamped editorial correction note.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FileText className="h-6 w-6 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-white">Autonomous &amp; Empirical Standards</h4>
                <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                  We cover AI, telephony, and local search based on measurable latency, code audits, and empirical algorithm telemetry.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
          {/* Masthead & Identity */}
          <div className="md:col-span-4">
            <div className="flex items-center gap-3">
              <span className="font-sans text-2xl font-black tracking-tight text-white">
                AINE<span className="text-sky-400">.WS</span>
              </span>
            </div>
            <p className="mt-3 text-xs text-slate-400 leading-relaxed max-w-sm">
              {SITE_CONFIG.legalName} is an independent digital news wire and research publication delivering investigative reporting on applied AI, search algorithms, and commercial automation infrastructure.
            </p>

            <div className="mt-4 space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                <span>
                  {SITE_CONFIG.address.streetAddress}, {SITE_CONFIG.address.addressLocality}, {SITE_CONFIG.address.addressRegion} {SITE_CONFIG.address.postalCode}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                <Link href="/contact" className="hover:text-white transition">
                  Contact Editorial Newsroom Desk
                </Link>
              </div>
            </div>
          </div>

          {/* Editorial Desks */}
          <div className="md:col-span-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Editorial Desks</h4>
            <ul className="mt-3 space-y-2 text-xs">
              {SITE_CONFIG.desks.map((desk) => (
                <li key={desk.id}>
                  <Link
                    href={`/desks/${desk.id}`}
                    className="hover:text-white transition block"
                  >
                    {desk.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/authors/justin-davis" className="hover:text-white transition block">
                  Lead Search Beat (Justin Davis)
                </Link>
              </li>
              <li>
                <Link href="/authors/marcus-vance" className="hover:text-white transition block">
                  Telephony &amp; RevOps Beat (Marcus Vance)
                </Link>
              </li>
              <li>
                <Link href="/authors/elena-chen" className="hover:text-white transition block">
                  Local Commerce Beat (Elena Chen)
                </Link>
              </li>
            </ul>
          </div>

          {/* E-E-A-T Standards & Policies */}
          <div className="md:col-span-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Trust &amp; Governance</h4>
            <ul className="mt-3 space-y-2 text-xs">
              <li>
                <Link href="/about" className="hover:text-white transition block">
                  About the Publication &amp; Masthead
                </Link>
              </li>
              <li>
                <Link href="/editorial-policy" className="hover:text-white transition block">
                  Editorial Standards &amp; AI Ethics
                </Link>
              </li>
              <li>
                <Link href="/corrections-policy" className="hover:text-white transition block">
                  Corrections Policy &amp; Public Log
                </Link>
              </li>
              <li>
                <Link href="/ownership" className="hover:text-white transition block">
                  Ownership &amp; Funding Disclosure
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition block text-sky-400 font-semibold">
                  Submit News Tip / Inquiries
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-white transition block">
                  Privacy Policy (GDPR / CCPA)
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition block">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Syndication & AI Feeds */}
          <div className="md:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Feeds &amp; Index</h4>
            <ul className="mt-3 space-y-2 text-xs">
              <li>
                <a
                  href="/news-sitemap.xml"
                  target="_blank"
                  className="flex items-center gap-1.5 hover:text-white transition"
                >
                  <Rss className="h-3 w-3 text-amber-500" />
                  <span>Google News XML</span>
                </a>
              </li>
              <li>
                <a
                  href="/feed.xml"
                  target="_blank"
                  className="flex items-center gap-1.5 hover:text-white transition"
                >
                  <Rss className="h-3 w-3 text-sky-400" />
                  <span>RSS 2.0 / Newsstand</span>
                </a>
              </li>
              <li>
                <a
                  href="/sitemap.xml"
                  target="_blank"
                  className="hover:text-white transition block"
                >
                  Standard Sitemap
                </a>
              </li>
              <li>
                <a
                  href="/llms.txt"
                  target="_blank"
                  className="inline-flex items-center gap-1 rounded bg-slate-800 px-2 py-0.5 text-[11px] text-sky-400 hover:bg-slate-700 transition"
                >
                  llms.txt (AI 3/3 Score)
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & Disclaimer */}
        <div className="mt-10 border-t border-slate-800 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500">
          <p>
            &copy; {new Date().getFullYear()} {SITE_CONFIG.legalName}. All rights reserved. Registered in Delaware, USA.
          </p>
          <p className="mt-2 md:mt-0">
            AINE.WS is an independent digital news wire.
          </p>
        </div>
      </div>
    </footer>
  )
}
