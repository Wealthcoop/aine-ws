import React from 'react'
import Image from 'next/image'

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
    url: 'https://go.try-hubspot.com/c/7635911/976131/12893',
    emoji: '🧡',
    description: 'All-in-one AI agent customer platform for marketing automation, sales pipelines, and smart CRM workflows.',
    category: 'CRM & Marketing Automation',
  },
  {
    name: 'Hailuo AI',
    url: 'https://hailuoai.pxf.io/c/7635911/3866417/51611',
    emoji: '🎬',
    description: 'Generate cinema-grade video clips and lifelike AI animations in seconds directly from text prompts.',
    category: 'Generative AI Video',
  },
  {
    name: 'GlobalGPT',
    url: 'https://globalgpt.sjv.io/c/7635911/4003393/56788',
    emoji: '🌐',
    description: 'Access every top frontier AI model (chat, image, video, search, and autonomous agents) under one single workspace.',
    category: 'Universal AI Workspace',
  },
  {
    name: 'InVideo',
    url: 'https://invideo.sjv.io/c/7635911/883681/12258',
    emoji: '⚡',
    description: 'Turn ideas, blog posts, and scripts into studio-ready marketing videos with autonomous voiceovers and b-roll.',
    category: 'Video Production',
  },
  {
    name: 'Business Capital Pre-Check',
    url: 'https://www.traffik.monster/buying-power',
    emoji: '💼',
    description: 'Check your commercial buying power and get pre-approved for up to $250,000 in zero-percent working capital with no impact on personal credit.',
    category: 'Commercial Funding & Growth Capital',
  },
]

interface TrendingToolsProps {
  className?: string
  limit?: number
}

export default function TrendingTools({ className = '', limit }: TrendingToolsProps) {
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

      {/* Tools List matching exact screenshot styling */}
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
                  rel="sponsored nofollow noopener"
                  className="font-semibold text-blue-600 underline decoration-blue-400 underline-offset-2 hover:text-blue-800 transition"
                >
                  {tool.name}
                </a>
                <span className="font-normal text-slate-900">: {tool.description}</span>
              </div>
            </li>
          ))}
        </ul>

        {/* Transparent Compliance Disclosure */}
        <div className="mt-5 border-t border-slate-100 pt-3 text-[11px] text-slate-400">
          <span>Editorial disclosure: Tools featured are independently vetted by the AINE.WS research desk. Links may contain affiliate partnerships at zero extra cost to you.</span>
        </div>
      </div>
    </aside>
  )
}
