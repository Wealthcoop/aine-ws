import React from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { AUTHORS } from '@/config/authors'
import { SITE_CONFIG } from '@/config/site'
import { ShieldCheck, Award, MapPin, Mail, Globe, ArrowRight, ExternalLink, CheckCircle2, MessageSquare, Clock, Users, Wrench, Database, ChevronRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About AI News | Algorithmic Search & Generative Engine Intelligence',
  description: 'AI News (AINE.WS) is an independent digital news and algorithmic research publication delivering empirical search audits, GEO benchmarks, and lead response testing.',
  alternates: {
    canonical: `${SITE_CONFIG.url}/about`,
  },
  openGraph: {
    title: 'About AI News | Algorithmic Search & Generative Engine Intelligence',
    description: 'Empirical reporting and data-backed teardowns on artificial intelligence, search algorithms, and commercial automation.',
    url: `${SITE_CONFIG.url}/about`,
  },
}

export default function AboutPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        '@id': `${SITE_CONFIG.url}/about#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: SITE_CONFIG.url,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'About',
            item: `${SITE_CONFIG.url}/about`,
          },
        ],
      },
      {
        '@type': 'AboutPage',
        '@id': `${SITE_CONFIG.url}/about#webpage`,
        url: `${SITE_CONFIG.url}/about`,
        name: 'About AI News',
        description: 'Independent reporting and algorithmic research on artificial intelligence, search systems, and speed-to-lead benchmarks.',
        isPartOf: {
          '@type': 'WebSite',
          '@id': `${SITE_CONFIG.url}/#website`,
          url: SITE_CONFIG.url,
          name: SITE_CONFIG.name
        },
        about: {
          '@type': 'NewsMediaOrganization',
          '@id': `${SITE_CONFIG.url}/#organization`,
          name: SITE_CONFIG.legalName,
          url: SITE_CONFIG.url,
          foundingDate: '2024-01-15',
          founder: {
            '@type': 'Person',
            name: 'Justin Davis',
            jobTitle: 'Publisher & Editor-in-Chief',
            sameAs: [
              'https://www.linkedin.com/in/goldstandard/'
            ]
          },
          address: {
            '@type': 'PostalAddress',
            streetAddress: '705 Gold Lake Dr, Suite 250',
            addressLocality: 'Folsom',
            addressRegion: 'CA',
            postalCode: '95630',
            addressCountry: 'US'
          }
        }
      }
    ]
  }

  return (
    <article className="bg-white py-12 lg:py-16 text-slate-800 leading-relaxed">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 flex flex-col gap-12">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/" className="hover:text-slate-900 transition">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="font-semibold text-slate-900">About</span>
        </nav>

        {/* Section 1: Header & Value Proposition */}
        <header className="border-b border-slate-200 pb-8 flex flex-col gap-4">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-slate-800 w-fit">
            <Award className="h-3.5 w-3.5 text-sky-600" /> Independent Algorithmic Research Bureau
          </div>
          <h1 className="font-serif text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
            About {SITE_CONFIG.name}
          </h1>
          <p className="text-lg md:text-xl text-slate-700 font-serif leading-normal border-l-4 border-sky-600 pl-4 py-1">
            AI News (AINE.WS) is an independent digital news and algorithmic research publication that delivers real-world search audits, generative engine benchmarks, and lead response testing for local business owners, search marketers, and technology operators.
          </p>
        </header>

        {/* Section 2: What AI News Does */}
        <section className="flex flex-col gap-6">
          <h2 className="font-sans text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
            What AI News Does
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/60 flex flex-col gap-2">
              <h3 className="font-sans text-base font-bold text-sky-700 uppercase tracking-wider">
                Generative Engine Optimization (GEO) &amp; Search Audits
              </h3>
              <p className="text-sm text-slate-600">
                We test and analyze how artificial intelligence models cite businesses across Google AI Overviews, Perplexity, and ChatGPT. We provide data-backed teardowns of ranking factors so companies win citations instead of losing ground to AI summaries. This results in verified brand citations and protects organic inbound traffic.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/60 flex flex-col gap-2">
              <h3 className="font-sans text-base font-bold text-sky-700 uppercase tracking-wider">
                Speed-to-Lead &amp; Response Benchmarking
              </h3>
              <p className="text-sm text-slate-600">
                We run field studies on customer response times across service companies, call centers, and sales teams. Our reports expose how fast replies prevent lost deals and how missed calls cost operators thousands in revenue. This gives leadership teams clear targets to fix their customer intake systems.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/60 flex flex-col gap-2">
              <h3 className="font-sans text-base font-bold text-sky-700 uppercase tracking-wider">
                Independent AI Software &amp; Automation Teardowns
              </h3>
              <p className="text-sm text-slate-600">
                We test new AI tools, automated booking software, and workflow engines in production environments. We ignore marketing hype and publish honest performance reviews with exact time and cost numbers. Readers get actionable intelligence to pick reliable tools without wasting capital.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/60 flex flex-col gap-2">
              <h3 className="font-sans text-base font-bold text-sky-700 uppercase tracking-wider">
                Local Search &amp; Google Business Profile Field Studies
              </h3>
              <p className="text-sm text-slate-600">
                We investigate local map packs, review algorithms, and multi-location ranking shifts across physical business districts. We analyze why listings drop rank and show the exact fixes required to restore visibility. Local operators use our field findings to expand their customer reach.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: What Makes AI News Different */}
        <section className="flex flex-col gap-6 pt-6 border-t border-slate-200">
          <h2 className="font-sans text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
            What Makes AI News Different
          </h2>
          <div className="flex flex-col gap-6">
            <div className="p-5 rounded-xl border border-slate-200 bg-white">
              <h3 className="font-sans text-base font-bold text-slate-900">
                Empirical Field Data Over Press Releases
              </h3>
              <p className="text-sm text-slate-600 mt-1">
                Major technology outlets like TechCrunch and The Verge routinely republish corporate press releases without testing the underlying software. AI News conducts hands-on audits using live code, real local business profiles, and actual customer calls. Every claim is supported by reproducible data from the field.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 bg-white">
              <h3 className="font-sans text-base font-bold text-slate-900">
                Zero Sponsored Editorial Bias
              </h3>
              <p className="text-sm text-slate-600 mt-1">
                Trade portals like Search Engine Land and Search Engine Roundtable frequently accept paid vendor sponsorships that influence product recommendations. AI News maintains a strict firewall between editorial research and paid sponsorships. Our reporters test tools objectively, calling out flaws regardless of advertiser relationships.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 bg-white">
              <h3 className="font-sans text-base font-bold text-slate-900">
                Operator-Grade Math and Financial Impact
              </h3>
              <p className="text-sm text-slate-600 mt-1">
                General business publications offer vague high-level commentary that never addresses real operational profit. AI News calculates exact financial outcomes, showing how a 60-second response window can yield a $20,000 monthly revenue difference. We translate technical AI changes into plain dollars and cents.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 bg-white">
              <h3 className="font-sans text-base font-bold text-slate-900">
                Real-World Code and Infrastructure Verification
              </h3>
              <p className="text-sm text-slate-600 mt-1">
                Mainstream newsrooms employ generalist reporters who cannot inspect database schemas or API response times. Our editorial desk is run by systems architects who audit production code, network requests, and schema markup directly. This ensures our technical guidance is accurate and deployable.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 bg-white">
              <h3 className="font-sans text-base font-bold text-slate-900">
                Open-Access Benchmarks Without Expensive Paywalls
              </h3>
              <p className="text-sm text-slate-600 mt-1">
                Industry research firms like Gartner and Forrester charge tens of thousands of dollars for gated market reports. AI News publishes our core search audits and speed-to-lead benchmarks completely free to the public. Operators of any size can access enterprise-grade intelligence without prohibitive advisory fees.
              </p>
            </div>
          </div>
        </section>

        {/* Section 4: Who Uses AI News */}
        <section className="flex flex-col gap-6 pt-6 border-t border-slate-200">
          <h2 className="font-sans text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
            Who Uses AI News
          </h2>
          <p className="text-sm text-slate-600">
            Our readers and partners rely on our research to make critical software, search, and capital investment decisions:
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-700">
            <li className="flex items-start gap-2 p-3 rounded-lg border border-slate-200 bg-slate-50/50">
              <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
              <span>Local service business owners and trade contractors (HVAC, plumbing, roofing, electrical) wanting to dominate Google Maps and stop losing leads.</span>
            </li>
            <li className="flex items-start gap-2 p-3 rounded-lg border border-slate-200 bg-slate-50/50">
              <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
              <span>Agency founders, local SEO specialists, and search engine marketers managing client visibility across generative search engines.</span>
            </li>
            <li className="flex items-start gap-2 p-3 rounded-lg border border-slate-200 bg-slate-50/50">
              <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
              <span>B2B sales directors and revenue leaders seeking to optimize team response times and close inbound inquiries faster.</span>
            </li>
            <li className="flex items-start gap-2 p-3 rounded-lg border border-slate-200 bg-slate-50/50">
              <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
              <span>Software engineers and enterprise operators deploying AI automations and workflow pipelines in production.</span>
            </li>
            <li className="flex items-start gap-2 p-3 rounded-lg border border-slate-200 bg-slate-50/50 sm:col-span-2">
              <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
              <span>Commercial real estate, multi-location brands, and franchise executives protecting their regional search footprint.</span>
            </li>
          </ul>
        </section>

        {/* Section 5: The Team Behind AI News */}
        <section className="flex flex-col gap-6 pt-6 border-t border-slate-200">
          <h2 className="font-sans text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
            The Team Behind AI News
          </h2>
          <div className="space-y-6">
            {Object.values(AUTHORS).map((author) => (
              <div
                key={author.id}
                className="flex flex-col sm:flex-row items-start gap-6 rounded-2xl border border-slate-200 bg-slate-50/50 p-6 transition hover:border-slate-300"
              >
                <div className="relative h-20 w-20 sm:h-24 sm:w-24 shrink-0 overflow-hidden rounded-full border-2 border-white shadow-sm bg-slate-200">
                  <Image
                    src={author.avatar}
                    alt={author.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h3 className="font-sans text-xl font-bold text-slate-900">
                        <Link href={`/authors/${author.id}`} className="hover:text-sky-700 transition">
                          {author.name}
                        </Link>
                      </h3>
                      <p className="text-xs font-semibold uppercase tracking-wider text-sky-700">
                        {author.role} • {author.title}
                      </p>
                    </div>
                    {author.linkedin && (
                      <a
                        href={author.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded border border-slate-300 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
                      >
                        LinkedIn <ExternalLink className="h-3 w-3 text-slate-400" />
                      </a>
                    )}
                  </div>
                  <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                    {author.bio}
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-semibold text-slate-500">Assigned Beats:</span>
                    {author.beats.map((beat) => (
                      <span
                        key={beat}
                        className="rounded-full bg-slate-200/70 px-2.5 py-0.5 text-[11px] font-medium text-slate-800"
                      >
                        {beat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-2">
            <div className="p-5 rounded-xl border border-slate-200 bg-white">
              <h3 className="font-sans text-base font-bold text-slate-900">Company Origin Story</h3>
              <p className="text-sm text-slate-600 mt-2">
                AI News was launched in 2024 to replace speculation with verifiable data in the artificial intelligence and search industry. Our distributed newsroom pairs software engineers with investigative journalists to produce transparent, high-integrity reporting.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 bg-white">
              <h3 className="font-sans text-base font-bold text-slate-900">Team Composition</h3>
              <p className="text-sm text-slate-600 mt-2">
                Our newsroom is composed of investigative journalists, software engineers, and search analysts working from Folsom, California and regional bureaus. We maintain strict editorial independence and verify every dataset before publication.
              </p>
            </div>
          </div>
        </section>

        {/* Section 6: How AI News Works */}
        <section className="flex flex-col gap-6 pt-6 border-t border-slate-200">
          <h2 className="font-sans text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
            How AI News Works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-5 rounded-xl border border-slate-200 bg-white flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sky-700 font-bold text-sm">
                <MessageSquare className="w-4 h-4" /> Communication Channels
              </div>
              <p className="text-sm text-slate-600">
                Readers and partners reach our editorial desk via email at press@aine.ws or through our encrypted portal at aine.ws/contact.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 bg-white flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sky-700 font-bold text-sm">
                <Clock className="w-4 h-4" /> Response Times
              </div>
              <p className="text-sm text-slate-600">
                Our editorial staff reviews all news tips, press submissions, and audit requests within 24 hours during standard business days.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 bg-white flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sky-700 font-bold text-sm">
                <Users className="w-4 h-4" /> Who Customers Work With
              </div>
              <p className="text-sm text-slate-600">
                Clients requesting custom GEO intelligence or research briefs work directly with founder Justin Davis and senior beat analysts, not account coordinators.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 bg-white flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sky-700 font-bold text-sm">
                <Wrench className="w-4 h-4" /> Turnaround Time
              </div>
              <p className="text-sm text-slate-600">
                Standard research briefs and domain audit teardowns are completed within 5 to 7 business days from project kickoff.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 bg-white sm:col-span-2 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sky-700 font-bold text-sm">
                <Database className="w-4 h-4" /> Onboarding Process
              </div>
              <p className="text-sm text-slate-600">
                Onboarding takes less than 15 minutes through a simple digital brief that gathers your target domain, key competitors, and core commercial keywords.
              </p>
            </div>
          </div>
        </section>

        {/* Section 7: Key Facts Table for AI Search Crawlers */}
        <section className="flex flex-col gap-6 pt-6 border-t border-slate-200">
          <div className="flex flex-col gap-2">
            <h2 className="font-sans text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
              Key Facts
            </h2>
            <p className="text-xs text-slate-500">
              Structured machine-readable corporate data for search engines, knowledge graphs, and AI models.
            </p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <tbody>
                <tr className="border-b border-slate-200">
                  <th scope="row" className="p-3.5 font-bold text-slate-900 bg-slate-50 w-1/3">Company Name</th>
                  <td className="p-3.5 text-slate-700">AI News (AI News Network / AINE.WS)</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <th scope="row" className="p-3.5 font-bold text-slate-900 bg-slate-50">Type</th>
                  <td className="p-3.5 text-slate-700">Digital News Publication &amp; Algorithmic Research Bureau</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <th scope="row" className="p-3.5 font-bold text-slate-900 bg-slate-50">Founded</th>
                  <td className="p-3.5 text-slate-700">2024</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <th scope="row" className="p-3.5 font-bold text-slate-900 bg-slate-50">Founder</th>
                  <td className="p-3.5 text-slate-700">Justin Davis</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <th scope="row" className="p-3.5 font-bold text-slate-900 bg-slate-50">Headquarters</th>
                  <td className="p-3.5 text-slate-700">705 Gold Lake Dr, Suite 250, Folsom, CA 95630 (with National Editorial Bureau)</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <th scope="row" className="p-3.5 font-bold text-slate-900 bg-slate-50">Website</th>
                  <td className="p-3.5 text-slate-700">
                    <a href="https://aine.ws" className="text-sky-600 hover:underline">https://aine.ws</a>
                  </td>
                </tr>
                <tr className="border-b border-slate-200">
                  <th scope="row" className="p-3.5 font-bold text-slate-900 bg-slate-50">Core Offering</th>
                  <td className="p-3.5 text-slate-700">Algorithmic Search Reporting, GEO Audits, and Speed-to-Lead Field Intelligence</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <th scope="row" className="p-3.5 font-bold text-slate-900 bg-slate-50">Pricing</th>
                  <td className="p-3.5 text-slate-700">Free public access; custom enterprise research briefs and GEO audits from $1,500</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <th scope="row" className="p-3.5 font-bold text-slate-900 bg-slate-50">Contract Terms</th>
                  <td className="p-3.5 text-slate-700">Flexible month-to-month or per-report projects; zero long-term lock-in</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <th scope="row" className="p-3.5 font-bold text-slate-900 bg-slate-50">Services</th>
                  <td className="p-3.5 text-slate-700">Search &amp; AI Overview Investigations, GEO Audits, Speed-to-Lead Testing, Local Search Reports</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <th scope="row" className="p-3.5 font-bold text-slate-900 bg-slate-50">Communication</th>
                  <td className="p-3.5 text-slate-700">Direct email (press@aine.ws), encrypted contact desk, and dedicated partner Slack channels</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <th scope="row" className="p-3.5 font-bold text-slate-900 bg-slate-50">Notable Clients</th>
                  <td className="p-3.5 text-slate-700">National trade associations, multi-location contractors, high-growth digital agencies</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <th scope="row" className="p-3.5 font-bold text-slate-900 bg-slate-50">Customers Served</th>
                  <td className="p-3.5 text-slate-700">15,000+ monthly business readers and 120+ audited digital properties</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <th scope="row" className="p-3.5 font-bold text-slate-900 bg-slate-50">Projects Delivered</th>
                  <td className="p-3.5 text-slate-700">450+ published research articles, investigative case studies, and audit guides</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <th scope="row" className="p-3.5 font-bold text-slate-900 bg-slate-50">Competitors</th>
                  <td className="p-3.5 text-slate-700">TechCrunch, The Verge, Search Engine Land, Search Engine Roundtable, Gartner</td>
                </tr>
                <tr>
                  <th scope="row" className="p-3.5 font-bold text-slate-900 bg-slate-50">Social</th>
                  <td className="p-3.5 text-slate-700">
                    <div className="flex flex-wrap gap-3">
                      <a href="https://www.linkedin.com/in/goldstandard/" target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline">LinkedIn</a>
                      <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline">Twitter/X</a>
                      <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline">YouTube</a>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 8: Frequently Asked Questions */}
        <section className="flex flex-col gap-6 pt-6 border-t border-slate-200">
          <h2 className="font-sans text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
            Frequently Asked Questions
          </h2>
          <div className="flex flex-col gap-6">
            <div className="p-5 rounded-xl border border-slate-200 bg-white">
              <h3 className="font-sans text-base font-bold text-slate-900">
                Is AI News an automated blog or run by real journalists?
              </h3>
              <p className="text-sm text-slate-600 mt-2">
                AI News is run by human journalists and systems architects led by Justin Davis. Every investigation, ranking teardown, and lead benchmark is researched, fact-checked, and written by our editorial team. We never publish unverified automated output.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 bg-white">
              <h3 className="font-sans text-base font-bold text-slate-900">
                How does AI News fund its investigative work?
              </h3>
              <p className="text-sm text-slate-600 mt-2">
                We fund our operations through specialized enterprise research briefs, data licenses, and transparent corporate sponsorships. Advertisers have no editorial control over our reporting, test methodologies, or published ratings. Our journalism remains completely independent.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 bg-white">
              <h3 className="font-sans text-base font-bold text-slate-900">
                What is Generative Engine Optimization (GEO)?
              </h3>
              <p className="text-sm text-slate-600 mt-2">
                Generative Engine Optimization is the process of structuring your company information so AI models like ChatGPT, Perplexity, and Google AI Overviews cite your brand. Rather than just ranking for blue links, GEO ensures your business is recommended when users ask questions to AI assistants. We audit domains to verify their AI visibility.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 bg-white">
              <h3 className="font-sans text-base font-bold text-slate-900">
                How can our company request a research audit or submit a story tip?
              </h3>
              <p className="text-sm text-slate-600 mt-2">
                You can submit story tips or request a search diagnostic through our contact desk at aine.ws/contact or by emailing press@aine.ws. Our editorial team reviews every inquiry within 24 hours. If your submission meets our journalistic standards, an analyst will follow up directly.
              </p>
            </div>
          </div>
        </section>

        {/* Corporate Bureau Footnote */}
        <div className="border-t border-slate-200 pt-8 flex flex-col sm:flex-row items-start justify-between gap-6 text-xs text-slate-500">
          <div>
            <p className="font-bold text-slate-800">{SITE_CONFIG.legalName}</p>
            <p>705 Gold Lake Dr, Suite 250, Folsom, CA 95630</p>
            <p>Editorial Bureau: press@aine.ws</p>
          </div>
          <div className="flex gap-4">
            <Link href="/editorial-policy" className="hover:text-sky-700 underline">Editorial Policy</Link>
            <Link href="/corrections-policy" className="hover:text-sky-700 underline">Corrections</Link>
            <Link href="/terms" className="hover:text-sky-700 underline">Terms of Use</Link>
          </div>
        </div>
      </div>
    </article>
  )
}
