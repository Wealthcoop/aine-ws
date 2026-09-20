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
  return <>{children}</>
}
