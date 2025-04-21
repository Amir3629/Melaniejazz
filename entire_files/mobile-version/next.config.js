/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    defaultLocale: 'de',
    locales: ['de', 'en'],
  },
  images: {
    domains: ['localhost'],
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/mobile',
        permanent: true,
      },
    ]
  },
} 