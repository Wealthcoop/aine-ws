'use client'

import React, { useEffect, useState } from 'react'
import { Sparkles, CheckCircle2, Bookmark } from 'lucide-react'

interface GooglePreferredSourceProps {
  className?: string
  compact?: boolean
}

export default function GooglePreferredSource({
  className = '',
  compact = false,
}: GooglePreferredSourceProps) {
  const [scriptLoaded, setScriptLoaded] = useState(false)

  useEffect(() => {
    // Check if script is already present
    const existingScript = document.querySelector(
      'script[src="https://news.google.com/swg/js/v1/publisher.js"]'
    )
    if (!existingScript) {
      const script = document.createElement('script')
      script.src = 'https://news.google.com/swg/js/v1/publisher.js'
      script.async = true
      script.onload = () => setScriptLoaded(true)
      document.head.appendChild(script)
    } else {
      setScriptLoaded(true)
    }
  }, [])

  const preferredSourceUrl = 'https://www.google.com/preferences/source?q=aine.ws'

  if (compact) {
    return (
      <div
        className={`inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 shadow-sm text-xs ${className}`}
      >
        <GoogleLogo className="h-4 w-4 shrink-0" />
        <span className="font-medium text-slate-700">Add to Google Preferred Sources</span>
        <a
          href={preferredSourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-1 font-semibold text-sky-600 hover:text-sky-700 hover:underline"
        >
          Follow
        </a>
      </div>
    )
  }

  return (
    <aside
      aria-label="Google Preferred Source Subscription"
      className={`relative overflow-hidden rounded-2xl border border-sky-200 bg-gradient-to-br from-sky-50/70 via-white to-indigo-50/40 p-6 shadow-sm ${className}`}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm border border-slate-200">
            <GoogleLogo className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-sky-100 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-sky-800">
                <Sparkles className="h-3 w-3 text-sky-600" />
                Google Search & Discover
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs font-semibold text-slate-500">Official Source</span>
            </div>
            <h3 className="mt-1 text-base font-bold text-slate-900">
              Never Miss Breaking AI &amp; Search Coverage
            </h3>
            <p className="mt-1 text-xs text-slate-600 leading-relaxed max-w-xl">
              Add <strong>AINE.WS</strong> as a preferred source in Google to prioritize our breaking news wire, model benchmarks, and practical search audits directly in your Top Stories, Discover, and AI Overviews.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:items-end gap-2 w-full sm:w-auto shrink-0">
          {/* Google Official Interactive Button target */}
          <div google-add-preferred-source-btn="true" data-theme="light" className="min-h-[38px] flex items-center" />

          {/* Fallback Direct Link Button */}
          <a
            href={preferredSourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white shadow hover:bg-slate-800 transition active:scale-[0.98] w-full sm:w-auto text-center"
          >
            <Bookmark className="h-3.5 w-3.5 text-sky-400" />
            <span>Set AINE.WS as Preferred Source</span>
          </a>
          <span className="text-[10px] text-slate-500 text-center sm:text-right">
            One-click preference saved to your Google Account
          </span>
        </div>
      </div>
    </aside>
  )
}

function GoogleLogo({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  )
}
