'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'

export function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubmitted(true)
    }
  }

  if (submitted) {
    return (
      <div className="rounded-xl bg-slate-900 border border-emerald-500/50 p-4 text-center">
        <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold text-sm">
          <CheckCircle2 className="h-5 w-5" />
          <span>Subscribed to The AI News Daily Dispatch</span>
        </div>
        <p className="mt-1 text-xs text-slate-400">
          Your first morning briefing will arrive tomorrow at 7:00 AM EST.
        </p>
      </div>
    )
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your executive email..."
          className="flex-1 rounded-lg border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
        />
        <button
          type="submit"
          className="rounded-lg bg-sky-500 px-6 py-3 text-sm font-bold text-slate-950 transition hover:bg-sky-400 shrink-0"
        >
          Join Dispatch
        </button>
      </form>
      <p className="mt-2 text-[11px] text-slate-500">
        Protected by our <Link href="/privacy-policy" className="underline hover:text-slate-400">Privacy Policy</Link>. You may unsubscribe at any time.
      </p>
    </div>
  )
}
