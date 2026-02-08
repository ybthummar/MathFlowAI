import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Optimize for Vercel
  images: {
    remotePatterns: [],
    unoptimized: false,
  },
  // Native Node.js packages need to be external
  serverExternalPackages: ['firebase-admin', 'pdfkit'],
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
}

export default nextConfig
