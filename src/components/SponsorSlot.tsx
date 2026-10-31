import React from 'react'
import Link from 'next/link'
import { MONETIZATION_CONFIG } from '@/config/monetization'
import { ArrowUpRight, ShieldCheck, Zap } from 'lucide-react'

interface SponsorSlotProps {
  type?: 'inline' | 'sidebar' | 'leaderboard'
  vertical?: 'local-seo' | 'telephony' | 'enterprise'
}

export function SponsorSlot({ type = 'inline', vertical = 'local-seo' }: SponsorSlotProps) {
  // STRICT GOOGLE NEWS APPROVAL GUARD:
  // Returns null with zero HTML nodes or links when disabled.
  if (!MONETIZATION_CONFIG.SHOW_SPONSORSHIPS) {
    return null
  }

  if (vertical === 'enterprise') {
    return (
      <aside aria-label="Partner Resource" className="my-8 rounded-xl border border-orange-200 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 text-white shadow-md">
        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-orange-400">
          <span className="flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5" /> 2026 B2B CRM &amp; AI Agent Benchmark Winner
          </span>
          <span className="rounded bg-orange-500/20 px-2 py-0.5 text-[10px] text-orange-300">Editor&apos;s Pick</span>
        </div>
        <h4 className="mt-3 text-lg font-bold tracking-tight text-white">
          HubSpot Smart CRM + Breeze AI Agents: Unified Revenue &amp; Pipeline Engine
        </h4>
        <p className="mt-2 text-sm text-slate-300 leading-relaxed">
          Consolidate marketing automation, B2B sales pipelines, AI lead scoring, and multi-touch revenue attribution in one workspace.
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs text-slate-400">Editorial Analysis • Pipeline Setup Template</span>
          <div className="flex flex-wrap items-center gap-2.5">
            <a
              href="https://www.hubspot.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-orange-500 px-4 py-2 text-xs font-bold text-white transition hover:bg-orange-400"
            >
              Explore HubSpot Platform <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </aside>
    )
  }

  if (vertical === 'telephony') {
    return (
      <aside aria-label="Partner Resource" className="my-8 rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 text-white shadow-md">
        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-emerald-400">
          <span className="flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5" /> Industry Telephony Benchmark
          </span>
          <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300">Verified System</span>
        </div>
        <h4 className="mt-3 text-lg font-bold tracking-tight text-white">
          Inbound Telephony: Speed-to-Lead &amp; AI Whisper Routing
        </h4>
        <p className="mt-2 text-sm text-slate-300 leading-relaxed">
          Fast inbound response under 60 seconds with automated whisper briefing for reps and instant SMS fallback.
        </p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs text-slate-400">Inbound benchmarks</span>
          <a
            href="/news/voice-lead-response/b2b-speed-to-lead-benchmark-21x-drop"
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500 px-4 py-2 text-xs font-bold text-slate-950 transition hover:bg-emerald-400"
          >
            Review Benchmark Data <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </aside>
    )
  }

  return (
    <aside aria-label="Partner Resource" className="my-8 rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50/70 via-white to-slate-50 p-6 shadow-sm">
      <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-blue-700">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5" /> Local Search Infrastructure
        </span>
        <span className="rounded bg-blue-100 px-2 py-0.5 text-[10px] text-blue-800">Agency Audit</span>
      </div>
      <h4 className="mt-3 text-lg font-bold tracking-tight text-slate-900">
        Local Search Architecture: Entity-Driven Map Pack Investigation
      </h4>
      <p className="mt-2 text-sm text-slate-600 leading-relaxed">
        Engineered specifically for high-ticket contractors and service firms navigating Google AI Overviews and Google Maps algorithm fluctuations.
      </p>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs text-slate-500">Empirical 3-pack case studies</span>
        <a
          href="/news/local-business/local-seo-schema-citation-audit-guide"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-blue-700"
        >
          View Case Studies <ArrowUpRight className="h-3.5 w-3.5" />
        </a>
      </div>
    </aside>
  )
}
