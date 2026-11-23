'use client'

import React, { useState } from 'react'
import { Copy, Check, Sparkles } from 'lucide-react'
import dailyPromptData from '@/data/dailyPrompt.json'

interface DailyPromptData {
  title: string
  useCase: string
  prompt: string
  model?: string
  sourceEdition?: string
  updatedAt?: string
}

const DATA = dailyPromptData as DailyPromptData

export default function DailyPrompt() {
  const [copied, setCopied] = useState(false)

  if (!DATA || !DATA.prompt || !DATA.title) {
    return null
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(DATA.prompt)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <aside
      aria-label="Daily Business AI Prompt"
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
    >
      <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-700">
          <Sparkles className="h-4 w-4 text-indigo-600" />
          <span>Daily Business AI Prompt</span>
        </div>
        {DATA.useCase && (
          <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-[11px] font-semibold text-indigo-700">
            {DATA.useCase}
          </span>
        )}
      </div>

      <h3 className="mt-3 font-serif text-base font-bold text-slate-900 leading-snug">
        {DATA.title}
      </h3>

      <p className="mt-2.5 rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-xs leading-relaxed text-slate-700 font-mono">
        {DATA.prompt}
      </p>

      <div className="mt-3.5 flex items-center justify-between gap-2">
        <span className="text-[11px] text-slate-500">
          {DATA.model ? `Works in ${DATA.model}` : 'Copy and fill in brackets'}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 transition"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy Prompt</span>
            </>
          )}
        </button>
      </div>
    </aside>
  )
}
