import { SITE_CONFIG } from '@/config/site'
import { AUTHORS } from '@/config/authors'

export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'NewsMediaOrganization',
    name: SITE_CONFIG.name,
    legalName: SITE_CONFIG.legalName,
    url: SITE_CONFIG.url,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_CONFIG.url}/aine-ws-logo.svg`,
      width: 600,
      height: 120,
    },
    foundingDate: SITE_CONFIG.foundingDate,
    description: SITE_CONFIG.description,
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE_CONFIG.address.streetAddress,
      addressLocality: SITE_CONFIG.address.addressLocality,
      addressRegion: SITE_CONFIG.address.addressRegion,
      postalCode: SITE_CONFIG.address.postalCode,
      addressCountry: SITE_CONFIG.address.addressCountry,
    },
    publishingPrinciples: `${SITE_CONFIG.url}/editorial-policy`,
    correctionsPolicy: `${SITE_CONFIG.url}/corrections-policy`,
    ethicsPolicy: `${SITE_CONFIG.url}/editorial-policy#ethics`,
    ownershipFundingInfo: `${SITE_CONFIG.url}/ownership`,
    diversityPolicy: `${SITE_CONFIG.url}/editorial-policy#standards`,
    founder: {
      '@type': 'Person',
      name: AUTHORS['justin-davis'].name,
      jobTitle: AUTHORS['justin-davis'].role,
      sameAs: [
        AUTHORS['justin-davis'].linkedin,
      ].filter(Boolean),
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'editorial desk',
        url: `${SITE_CONFIG.url}/contact`,
        availableLanguage: ['English'],
      },
      {
        '@type': 'ContactPoint',
        contactType: 'corrections',
        url: `${SITE_CONFIG.url}/contact?type=correction`,
        availableLanguage: ['English'],
      }
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
