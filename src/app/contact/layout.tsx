import React from 'react'
import { Metadata } from 'next'
import { SITE_CONFIG } from '@/config/site'

export const metadata: Metadata = {
  title: 'Contact Editorial Desk & Newsroom',
  description: `Submit news tips, editorial inquiries, or corrections to the ${SITE_CONFIG.name} newsroom desk.`,
  alternates: {
    canonical: `${SITE_CONFIG.url}/contact`,
  },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        '@id': `${SITE_CONFIG.url}/contact#breadcrumb`,
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
            name: 'Contact',
            item: `${SITE_CONFIG.url}/contact`,
          },
        ],
      },
      {
        '@type': 'ContactPage',
        '@id': `${SITE_CONFIG.url}/contact#webpage`,
        url: `${SITE_CONFIG.url}/contact`,
        name: 'Contact Editorial Desk & Newsroom',
        description: `Submit news tips, editorial inquiries, or corrections to the ${SITE_CONFIG.name} newsroom desk.`,
        isPartOf: {
          '@type': 'WebSite',
          '@id': `${SITE_CONFIG.url}/#website`,
          url: SITE_CONFIG.url,
          name: SITE_CONFIG.name,
        },
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      {children}
    </>
  )
}
