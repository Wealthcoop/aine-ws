import fs from 'node:fs'
import path from 'node:path'

const redirectsFilePath = path.join(process.cwd(), 'src/config/legacy_wire_redirects.json')
let legacyRedirects = []
if (fs.existsSync(redirectsFilePath)) {
  try {
    legacyRedirects = JSON.parse(fs.readFileSync(redirectsFilePath, 'utf-8'))
  } catch (e) {
    console.error('Failed to parse legacy redirects:', e)
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: '**' }
    ],
  },
  redirects: async () => [
    ...legacyRedirects
  ],
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        { key: 'X-XSS-Protection', value: '1; mode=block' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      ],
    },
  ],
}

export default nextConfig
