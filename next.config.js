/** @type {import('next').NextConfig} */

// Detect if we're in a Vercel environment - check both process.env.VERCEL and hostname
const isVercel = process.env.VERCEL === "1";

const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        pathname: '/vi/**',
      },
      {
        protocol: 'https',
        hostname: 'i3.ytimg.com',
        pathname: '/vi/**',
      }
    ],
  },
  // Only use basePath and assetPrefix for GitHub Pages, not for Vercel
  ...(isVercel ? {} : {
    basePath: '/Melaniejazz',
    assetPrefix: '/Melaniejazz/',
  }),
  trailingSlash: false, // Changed to false for Vercel
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(woff|woff2|eot|ttf|otf|svg)$/i,
      type: 'asset/resource',
    })

    if (process.env.NODE_ENV === 'production') {
      config.mode = 'production';
    }

    return config
  },
  // Make runtime config available in the app
  publicRuntimeConfig: {
    basePath: isVercel ? '' : '/Melaniejazz',
    isVercel: isVercel
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['framer-motion', 'lucide-react'],
  },
  compress: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true
  }
}

module.exports = nextConfig
