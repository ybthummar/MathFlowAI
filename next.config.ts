import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Optimize for Vercel
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'drive.google.com' },
      { protocol: 'https', hostname: 'cspit.charusat.ac.in' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
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
