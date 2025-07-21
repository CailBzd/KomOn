/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['localhost', 'api.komon.fr', 'api.komon.ptilab.fr', 'images.unsplash.com'],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://api.komon.ptilab.fr/api',
    NEXT_PUBLIC_SCALEWAY_PROJECT_ID: process.env.NEXT_PUBLIC_SCALEWAY_PROJECT_ID || '849d4454-a4c4-4704-9908-44e1f7954f8b',
    NEXT_PUBLIC_SCALEWAY_REGION: process.env.NEXT_PUBLIC_SCALEWAY_REGION || 'fr-par',
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_MAPBOX_TOKEN: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
  },
  output: 'standalone',
  trailingSlash: false,
  poweredByHeader: false,
  compress: true,
  productionBrowserSourceMaps: false,
}

module.exports = nextConfig 