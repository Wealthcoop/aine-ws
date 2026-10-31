import React from 'react'
import Image from 'next/image'
import { MONETIZATION_CONFIG } from '@/config/monetization'

export interface TrendingTool {
  name: string
  url: string
  emoji: string
  description: string
  category?: string
}

export const TRENDING_TOOLS: TrendingTool[] = [
  {
    name: 'HubSpot',
    url: 'https://www.hubspot.com',
    emoji: '🧡',
    description: 'Customer platform for marketing automation, sales pipelines, and CRM workflows.',
    category: 'CRM & Marketing Automation',
  },
  {
    name: 'Hailuo AI',
    url: 'https://hailuoai.video',
    emoji: '🎬',
    description: 'Video generation engine and AI animations from text prompts.',
    category: 'Generative AI Video',
  },
  {
    name: 'Claude',
    url: 'https://claude.ai',
    emoji: '🤖',
    description: 'Frontier AI assistant by Anthropic for analysis, code synthesis, and deep research.',
    category: 'Frontier AI Workspace',
  },
  {
    name: 'InVideo',
    url: 'https://invideo.io',
    emoji: '⚡',
    description: 'Video creation platform with automated voiceovers and editing tools.',
    category: 'Video Production',
  },
]

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
          src="/images/trending-tools-banner.png"
          alt="Trending Tools"
          width={1024}
          height={201}
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
        <div className="mt-5 border-t border-slate-100 pt-3 text-[11px] text-slate-400">
          <span>Editorial disclosure: Tools featured are independently vetted by the AINE.WS research desk.</span>
        </div>
      </div>
    </aside>
  )
}

