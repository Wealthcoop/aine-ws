'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, Radio, ArrowRight, ShieldCheck, Newspaper } from 'lucide-react'
import { SITE_CONFIG } from '@/config/site'

export interface BreakingStoryHeadline {
  title: string
  category: string
  slug: string
}

interface HeaderProps {
  breakingStory?: BreakingStoryHeadline | null
}

export function Header({ breakingStory }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [currentDate, setCurrentDate] = useState('Tuesday, October 27, 2026')

  useEffect(() => {
    try {
      const now = new Date()
      const formatted = now.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      })
      setCurrentDate(formatted)
    } catch {}
  }, [])

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
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1 sm:px-6 lg:px-8 min-h-[48px]">
          <div className="flex items-center gap-3 overflow-hidden">
            <span className="inline-flex items-center gap-1.5 font-semibold text-sky-400 shrink-0">
              <Radio className="h-3 w-3 animate-pulse text-sky-400" />
              LIVE WIRE
            </span>
            <span className="hidden sm:inline text-slate-400 shrink-0">|</span>
            <span className="hidden sm:inline text-slate-200 font-medium shrink-0">
              {currentDate}
            </span>
            <span className="hidden md:inline text-slate-400 shrink-0">|</span>
            {breakingStory && (
              <span className="hidden md:inline text-slate-300 truncate max-w-xl">
                <Link
                  href={`/news/${breakingStory.category}/${breakingStory.slug}`}
                  className="hover:text-white transition group inline-flex items-center gap-1.5 truncate py-2.5 px-1 min-h-[48px]"
                >
                  <strong className="text-amber-400 uppercase tracking-wide text-[11px] font-bold shrink-0">BREAKING:</strong>
                  <span className="truncate group-hover:underline text-slate-200">{breakingStory.title}</span>
                </Link>
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2.5 text-slate-200">
            <Link
              href="/about"
              className="hover:text-white transition px-3 py-2.5 inline-flex items-center justify-center min-h-[48px] min-w-[48px] text-xs font-medium"
            >
              About
            </Link>
            <Link
              href="/editorial-policy"
              className="hover:text-white transition hidden sm:inline-flex px-3 py-2.5 items-center justify-center min-h-[48px] min-w-[48px] text-xs font-medium"
            >
              Standards
            </Link>
            <Link
              href="/corrections-policy"
              className="hover:text-white transition hidden sm:inline-flex px-3 py-2.5 items-center justify-center min-h-[48px] min-w-[48px] text-xs font-medium"
            >
              Corrections
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-1.5 rounded bg-sky-700 px-3.5 py-2 text-xs font-bold text-white transition hover:bg-sky-800 min-h-[48px]"
            >
              Newsroom Desk <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Primary Masthead */}
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="aine-brand-lockup" aria-label="Aine Home">
              {/* Square AI / NE.WS Stamp Icon */}
              <div className="aine-badge-icon" aria-hidden="true">
                <svg viewBox="0 0 100 100" width="52" height="52" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="100" height="100" rx="18" fill="#0F172A"/>
                  {/* Top Row: AI (Editorial Serif) */}
                  <text x="50" y="52" textAnchor="middle" fill="#FFFFFF" fontFamily="Georgia, 'Times New Roman', serif" fontWeight="800" fontSize="48" letterSpacing="1">AI</text>
                  {/* Center Split Divider Bar */}
                  <polygon points="16,58 46,58 42,66 16,66" fill="#FFFFFF"/>
                  <polygon points="50,58 84,58 84,66 46,66" fill="#FFFFFF"/>
                  {/* Bottom Row: NE.WS */}
                  <text x="50" y="86" textAnchor="middle" fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" fontWeight="800" fontSize="21" letterSpacing="1">
                    <tspan fill="#2563EB">NE</tspan><tspan fill="#E11D48">.</tspan><tspan fill="#2563EB">WS</tspan>
                  </text>
                </svg>
              </div>

              {/* Right Side Wordmark & Phonetic Sub-label */}
              <div className="aine-wordmark-group">
                <div className="aine-wordmark-title">
                  <span className="aine-main-name">AINE</span><span className="aine-domain-ext">.ws</span>
                </div>
                <div className="aine-wordmark-sub">
                  <span className="aine-phonetic">/eɪn/ (rhymes with main)</span>
                  <span className="aine-dot">·</span>
                  <span className="aine-tagline">APPLIED INTELLIGENCE WIRE</span>
                </div>
              </div>
            </Link>
          </div>

          {/* Right Header Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/standards"
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-600 hover:border-slate-300 hover:text-slate-900 transition"
              aria-label="Editorial Standards Verified"
            >
              <ShieldCheck className="h-4 w-4 text-sky-600" />
              <span>Editorial Standards Verified</span>
            </Link>
            <Link
              href="/contact?type=tip"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-900 bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800 min-h-[44px]"
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
              className="inline-flex items-center justify-center rounded-lg p-2.5 text-slate-700 hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-600 min-h-[48px] min-w-[48px]"
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
          <ul className="hidden md:flex items-center space-x-1 lg:space-x-4 py-1 text-sm font-semibold text-slate-700">
            <li>
              <Link
                href="/"
                className="inline-flex items-center rounded-md px-3 py-2 text-slate-900 transition hover:bg-slate-100 min-h-[44px]"
              >
                Top Stories
              </Link>
            </li>
            {SITE_CONFIG.desks.filter((desk) => desk.id !== 'wire').map((desk) => (
              <li key={desk.id}>
                <Link
                  href={`/desks/${desk.id}`}
                  className="inline-flex items-center rounded-md px-3 py-2 transition hover:bg-slate-100 hover:text-sky-700 min-h-[44px]"
                >
                  {desk.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/frame"
                className="inline-flex items-center rounded-md px-3 py-2 text-slate-700 transition hover:bg-slate-100 hover:text-sky-700 min-h-[44px]"
              >
                The Aine Frame
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="inline-flex items-center rounded-md px-3 py-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 min-h-[44px]"
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
              className="flex items-center rounded-lg px-3 py-3 text-base font-semibold text-slate-900 hover:bg-slate-100 min-h-[44px]"
            >
              Top Stories
            </Link>
            {SITE_CONFIG.desks.filter((desk) => desk.id !== 'wire').map((desk) => (
              <Link
                key={desk.id}
                href={`/desks/${desk.id}`}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center rounded-lg px-3 py-3 text-base font-semibold text-slate-700 hover:bg-slate-100 hover:text-sky-700 min-h-[44px]"
              >
                {desk.label}
              </Link>
            ))}
            <Link
              href="/frame"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center rounded-lg px-3 py-3 text-base font-semibold text-slate-700 hover:bg-slate-100 hover:text-sky-700 min-h-[44px]"
            >
              The Aine Frame
            </Link>
            <div className="border-t border-slate-200 pt-2 space-y-1 text-sm text-slate-600">
              <Link
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center px-3 py-2.5 hover:text-slate-900 min-h-[44px]"
              >
                Masthead &amp; About
              </Link>
              <Link
                href="/editorial-policy"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center px-3 py-2.5 hover:text-slate-900 min-h-[44px]"
              >
                Editorial Standards &amp; AI Policy
              </Link>
              <Link
                href="/corrections-policy"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center px-3 py-2.5 hover:text-slate-900 min-h-[44px]"
              >
                Corrections Policy
              </Link>
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center px-3 py-2.5 font-bold text-sky-700 min-h-[44px]"
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
