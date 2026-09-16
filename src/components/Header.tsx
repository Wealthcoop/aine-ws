'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, Radio, ArrowRight, ShieldCheck, Newspaper } from 'lucide-react'
import { SITE_CONFIG } from '@/config/site'

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const currentDate = 'Thursday, September 10, 2026'

  return (
    <header className="w-full border-b border-slate-200 bg-white sticky top-0 z-40">
      {/* Accessibility Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-2 focus:rounded-md focus:bg-sky-600 focus:px-4 focus:py-2 focus:text-white focus:shadow-lg focus:outline-none"
      >
        Skip to main editorial content
      </a>

      {/* Top Utility Bar */}
      <div className="border-b border-slate-100 bg-slate-900 text-white text-[12px]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1.5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 font-semibold text-sky-400">
              <Radio className="h-3 w-3 animate-pulse text-sky-400" />
              LIVE WIRE
            </span>
            <span className="hidden sm:inline text-slate-400">|</span>
            <span className="hidden sm:inline text-slate-300 font-medium">
              {currentDate}
            </span>
            <span className="hidden md:inline text-slate-400">|</span>
            <span className="hidden md:inline text-slate-300 truncate max-w-md">
              <strong className="text-white">BREAKING:</strong> Google Expands Dynamic AI Overviews Directly Into Local 3-Packs
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-300">
            <Link href="/about" className="hover:text-white transition">
              About
            </Link>
            <Link href="/editorial-policy" className="hover:text-white transition hidden sm:inline">
              Standards
            </Link>
            <Link href="/corrections-policy" className="hover:text-white transition hidden sm:inline">
              Corrections
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-1 rounded bg-sky-700 px-2 py-0.5 text-[11px] font-bold text-white transition hover:bg-sky-800"
            >
              Newsroom Desk <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Primary Masthead */}
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-sky-600 rounded-lg">
              <div className="relative h-12 w-48 sm:h-14 sm:w-56">
                <Image
                  src="/aine-ws-logo.svg"
                  alt="AI News - Applied Intelligence News Network"
                  fill
                  priority
                  className="object-contain object-left"
                />
              </div>
            </Link>
            <div className="hidden lg:block border-l border-slate-200 pl-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                Independent Editorial Reporting
              </p>
              <p className="text-[11px] text-slate-600">
                Tracking applied AI, algorithmic search updates &amp; commercial automation
              </p>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-600">
              <ShieldCheck className="h-4 w-4 text-sky-600" />
              <span>Independent E-E-A-T Verified</span>
            </div>
            <Link
              href="/contact?type=tip"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-900 bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-slate-800"
            >
              <Newspaper className="h-3.5 w-3.5" />
              <span>Submit News Tip</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center rounded-lg p-2 text-slate-700 hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-600"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Category Desk Navigation */}
      <nav aria-label="Editorial Desks" className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ul className="hidden md:flex items-center space-x-1 lg:space-x-4 py-2 text-sm font-semibold text-slate-700">
            <li>
              <Link
                href="/"
                className="inline-block rounded-md px-3 py-1.5 text-slate-900 transition hover:bg-slate-100"
              >
                Top Stories
              </Link>
            </li>
            {SITE_CONFIG.desks.map((desk) => (
              <li key={desk.id}>
                <Link
                  href={`/desks/${desk.id}`}
                  className="inline-block rounded-md px-3 py-1.5 transition hover:bg-slate-100 hover:text-sky-700"
                >
                  {desk.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/about"
                className="inline-block rounded-md px-3 py-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
              >
                Masthead
              </Link>
            </li>
          </ul>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="border-t border-slate-200 bg-white px-4 py-3 md:hidden space-y-2">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-lg px-3 py-2 text-base font-semibold text-slate-900 hover:bg-slate-100"
            >
              Top Stories
            </Link>
            {SITE_CONFIG.desks.map((desk) => (
              <Link
                key={desk.id}
                href={`/desks/${desk.id}`}
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-lg px-3 py-2 text-base font-semibold text-slate-700 hover:bg-slate-100 hover:text-sky-700"
              >
                {desk.label}
              </Link>
            ))}
            <div className="border-t border-slate-200 pt-2 space-y-1 text-sm text-slate-600">
              <Link
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-1.5 hover:text-slate-900"
              >
                Masthead &amp; About
              </Link>
              <Link
                href="/editorial-policy"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-1.5 hover:text-slate-900"
              >
                Editorial Standards &amp; AI Policy
              </Link>
              <Link
                href="/corrections-policy"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-1.5 hover:text-slate-900"
              >
                Corrections Policy
              </Link>
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-1.5 font-bold text-sky-700"
              >
                Submit News Tip / Contact Desk
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
