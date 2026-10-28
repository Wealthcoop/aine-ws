'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Newspaper, ShieldCheck, X, ExternalLink, ArrowRight, Lock } from 'lucide-react'

interface TypebotNewsroomProps {
  typebot?: string
  apiHost?: string
  mode?: 'standard' | 'bubble'
  title?: string
  subText?: string
  heightClass?: string
  prefilledVariables?: Record<string, string | number | boolean>
}

export default function TypebotNewsroom({
  typebot = 'aine-newsroom-intake',
  apiHost = process.env.NEXT_PUBLIC_TYPEBOT_VIEWER_URL || 'http://100.87.152.113:8181',
  mode = 'standard',
  title = 'Confidential Newsroom Intake Bot',
  subText = 'Transmit confidential tips, algorithm changes, or local market observations directly to the editorial desk with journalistic source protection.',
  heightClass = 'h-[620px]',
  prefilledVariables,
}: TypebotNewsroomProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isBubbleOpen, setIsBubbleOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const queryParams = new URLSearchParams()
  if (prefilledVariables) {
    Object.entries(prefilledVariables).forEach(([key, val]) => {
      queryParams.set(key, String(val))
    })
  }
  const queryString = queryParams.toString()
  const iframeSrc = `${apiHost}/${typebot}${queryString ? `?${queryString}` : ''}`

  useEffect(() => {
    if (mode === 'bubble') return

    const currentRef = containerRef.current
    if (!currentRef) return

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsLoaded(true)
              observer.disconnect()
            }
          })
        },
        { rootMargin: '250px' }
      )
      observer.observe(currentRef)
      return () => observer.disconnect()
    } else {
      setIsLoaded(true)
    }
  }, [mode])

  // Floating Bubble Mode for AINE.WS
  if (mode === 'bubble') {
    return (
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        {isBubbleOpen && (
          <div className="w-[92vw] sm:w-[440px] h-[600px] bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl flex flex-col mb-4 overflow-hidden backdrop-blur-xl">
            {/* Header */}
            <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-sky-500/20 border border-sky-400 flex items-center justify-center text-sky-400">
                    <Newspaper className="w-4 h-4" />
                  </div>
                  <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 rounded-full border border-slate-950" />
                </div>
                <div>
                  <h4 className="text-sm font-sans font-bold text-white tracking-wide">
                    {title}
                  </h4>
                  <span className="text-[11px] text-sky-400 flex items-center gap-1">
                    <Lock className="w-2.5 h-2.5" /> End-to-End Encrypted Tip Line
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsBubbleOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-white transition-colors"
                aria-label="Close tip desk"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Typebot Viewer Runtime */}
            <div className="flex-1 w-full bg-slate-950">
              <iframe
                src={iframeSrc}
                width="100%"
                height="100%"
                frameBorder="0"
                title={title}
                className="w-full h-full"
                allow="microphone; camera"
              />
            </div>
          </div>
        )}

        {/* Floating Trigger Button */}
        <button
          onClick={() => setIsBubbleOpen(!isBubbleOpen)}
          className="group flex items-center gap-2 px-4 py-3 rounded-full bg-slate-900 border border-sky-500/40 text-white shadow-xl hover:border-sky-400 hover:shadow-sky-500/20 hover:scale-105 transition-all duration-300"
          aria-label={isBubbleOpen ? 'Close Newsroom Desk' : 'Open Confidential Tip Line'}
        >
          {isBubbleOpen ? (
            <X className="w-5 h-5 text-sky-400" />
          ) : (
            <>
              <ShieldCheck className="w-5 h-5 text-sky-400" />
              <span className="text-xs font-bold tracking-wide hidden sm:inline">Send News Tip</span>
            </>
          )}
        </button>
      </div>
    )
  }

  // Standard Embedded Form
  return (
    <div
      ref={containerRef}
      className={`w-full ${heightClass} border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm relative flex flex-col items-center justify-center`}
    >
      {isLoaded ? (
        <iframe
          src={iframeSrc}
          width="100%"
          height="100%"
          frameBorder="0"
          title={title}
          loading="lazy"
          className="w-full h-full rounded-2xl bg-white"
          allow="microphone; camera"
        />
      ) : (
        <div className="p-8 max-w-lg text-center flex flex-col items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600">
            <ShieldCheck className="w-7 h-7" />
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-xl font-serif font-bold text-slate-900">
              {title}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {subText}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 mt-1">
            <button
              onClick={() => setIsLoaded(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-slate-900 text-white font-sans font-bold text-xs hover:bg-slate-800 transition"
              aria-label="Start interactive news tip submission"
            >
              Start Intake Assistant <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <a
              href={iframeSrc}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs text-slate-500 hover:text-slate-800 transition-colors"
              aria-label="Open in standalone tab"
            >
              Direct Link <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
