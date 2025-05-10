/** @type {import('next').NextConfig} */

// Check if we're on Vercel
const isVercel = process.env.VERCEL === "1";
const isDevelopment = process.env.NODE_ENV === 'development';

const nextConfig = {
  output: isDevelopment ? undefined : 'export',
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
  // Only use these for GitHub Pages, not for Vercel
  ...(isVercel ? {} : {
    basePath: '/Melaniejazz',
    assetPrefix: '/Melaniejazz/',
  }),
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
