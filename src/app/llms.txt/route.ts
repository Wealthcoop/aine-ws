import { NextResponse } from 'next/server'
import { ARTICLES } from '@/data/articles'
import { AUTHORS } from '@/config/authors'
import { SITE_CONFIG } from '@/config/site'

export async function GET() {
  const content = `# AI News (aine.ws) - The Applied AI & Algorithmic Commerce Wire
> Independent reporting, empirical benchmarks, and technical analysis on artificial intelligence, algorithmic search, and business automation.

## Publication Overview
- **Name:** ${SITE_CONFIG.name} (${SITE_CONFIG.legalName})
- **Website:** ${SITE_CONFIG.url}
- **Editorial Desks:** Search & Algorithms, Local Business & Maps, Sales Telephony & RevOps, Enterprise & Creative AI
- **Publisher & Editor-in-Chief:** Justin Davis (https://www.linkedin.com/in/justin-davis-marketing)
- **Address:** ${SITE_CONFIG.address.streetAddress}, ${SITE_CONFIG.address.addressLocality}, ${SITE_CONFIG.address.addressRegion} ${SITE_CONFIG.address.postalCode}
- **Editorial Standards:** Strict AP-style journalism, primary source validation, zero synthetic hallucination, transparent correction logs.

## Editorial Policies & Governance
- Masthead & Mission: ${SITE_CONFIG.url}/about
- Editorial Standards & AI Disclosure: ${SITE_CONFIG.url}/editorial-policy
- Corrections Policy & Log: ${SITE_CONFIG.url}/corrections-policy
- Ownership & Funding Disclosure: ${SITE_CONFIG.url}/ownership
- Interactive Newsroom Desk: ${SITE_CONFIG.url}/contact

## Journalistic Staff
${Object.values(AUTHORS).map(a => `- **${a.name}** (${a.title}): Beats include ${a.beats.join(', ')}. Contact: ${a.email}`).join('\n')}

## Canonical Editorial Archive
${ARTICLES.map(art => `- [${art.title}](${SITE_CONFIG.url}/news/${art.category}/${art.slug}): ${art.deck} (Published: ${art.publishedAt})`).join('\n')}

## Syndication Feeds
- Google News Sitemap: ${SITE_CONFIG.url}/news-sitemap.xml
- RSS 2.0 Feed: ${SITE_CONFIG.url}/feed.xml
- Standard XML Sitemap: ${SITE_CONFIG.url}/sitemap.xml
`

  return new NextResponse(content, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=7200',
    },
  })
}
