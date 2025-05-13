/** @type {import('next').NextConfig} */

// Check if we're on Vercel
const isVercel = process.env.VERCEL === "1";

const nextConfig = {
  reactStrictMode: true,
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
  // Needed to handle GitHub Pages paths
  assetPrefix: process.env.NODE_ENV === 'production' ? '/Melaniejazz' : '',
  basePath: process.env.NODE_ENV === 'production' ? '/Melaniejazz' : '',
  trailingSlash: false,
  distDir: 'out',
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(woff|woff2|eot|ttf|otf|svg)$/i,
      type: 'asset/resource',
    })

    return config
  },
  // Simplified config with clear environment detection
  publicRuntimeConfig: {
    basePath: isVercel ? '' : '/Melaniejazz',
    isVercel: isVercel,
    // Add a debug flag to help troubleshoot
    debug: true
  },
  experimental: {
    optimizeCss: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true
  }
}

module.exports = nextConfig
