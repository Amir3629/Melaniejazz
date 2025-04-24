/** @type {import('next').NextConfig} */

const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  basePath: isProd ? '/vocal-coaching' : '',
  assetPrefix: isProd ? '/vocal-coaching/' : '',
  trailingSlash: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    domains: ['localhost', 'images.unsplash.com', 'melanie-becker.com'],
    unoptimized: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  skipTrailingSlashRedirect: true,
  experimental: {
    optimizeCss: true,
  },
  // Include all page extensions
  pageExtensions: ['tsx', 'ts', 'jsx', 'js', 'mdx'],
  exportPathMap: async function () {
    return {
      '/': { page: '/' },
      // Manually define paths to avoid issues with _not-found
      // Add other pages as needed
      '/404': { page: '/404' },
    };
  },
}

module.exports = nextConfig
