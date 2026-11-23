import React from 'react'
import Image from 'next/image'
import { MONETIZATION_CONFIG } from '@/config/monetization'
import trendingToolsData from '@/data/trendingTools.json'

export interface TrendingTool {
  name: string
  url: string
  emoji: string
  description: string
  category?: string
  pinned?: boolean
}

export const TRENDING_TOOLS: TrendingTool[] = trendingToolsData as TrendingTool[]

interface TrendingToolsProps {
  className?: string
  limit?: number
}

export default function TrendingTools({ className = '', limit }: TrendingToolsProps) {
  if (!MONETIZATION_CONFIG.SHOW_SPONSORSHIPS) {
    return null
  }

  const tools = limit ? TRENDING_TOOLS.slice(0, limit) : TRENDING_TOOLS

  return (
    <aside
      aria-label="Trending AI Tools and Resources"
      className={`overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md ${className}`}
    >
      {/* Banner Graphic Header */}
      <div className="relative w-full overflow-hidden border-b border-slate-200 bg-[#f0f8d8]">
        <Image
          src="/images/trending-tools-banner.webp"
          alt="Trending Tools"
          width={1024}
          height={201}
          sizes="(max-width: 640px) 92vw, (max-width: 1024px) 380px, 340px"
          priority={false}
          className="h-auto w-full object-cover"
        />
      </div>

      {/* Tools List */}
      <div className="p-6 sm:p-7">
        <ul className="space-y-4 text-sm sm:text-[15px] leading-relaxed text-slate-800">
          {tools.map((tool) => (
            <li key={tool.name} className="flex items-start gap-2.5">
              <span className="select-none text-slate-400 font-bold text-lg leading-none mt-0.5">•</span>
              <div className="flex-1">
                <span className="mr-1.5 text-base" role="img" aria-label={tool.name}>
                  {tool.emoji}
                </span>
                <a
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-blue-600 underline decoration-blue-400 underline-offset-2 hover:text-blue-800 transition"
                >
                  {tool.name}
                </a>
                <span className="font-normal text-slate-900">: {tool.description}</span>
              </div>
            </li>
          ))}
        </ul>

        {/* Editorial Disclosure */}
        <div className="mt-5 border-t border-slate-100 pt-3 text-[11px] text-slate-600 font-medium">
          <span>Editorial disclosure: Tools featured are independently vetted by the AINE.WS research desk.</span>
        </div>
      </div>
    </aside>
  )
}
