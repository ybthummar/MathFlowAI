import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Optimize for Vercel
  images: {
    remotePatterns: [],
    unoptimized: false,
  },
  // Firebase Admin needs to be external
  serverExternalPackages: ['firebase-admin'],
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
}

export default nextConfig
