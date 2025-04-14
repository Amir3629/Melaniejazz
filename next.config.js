/** @type {import('next').NextConfig} */

const nextConfig = {
  output: process.env.NODE_ENV === 'production' ? 'export' : undefined,
  images: {
    unoptimized: process.env.NODE_ENV === 'production',
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
  basePath: process.env.NODE_ENV === 'production' ? '/vocal-coachingg' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/vocal-coachingg/' : '',
  trailingSlash: true,
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
  publicRuntimeConfig: {
    basePath: process.env.NODE_ENV === 'production' ? '/vocal-coachingg' : '',
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['framer-motion', 'lucide-react'],
  },
  compress: true,
}

module.exports = nextConfig
