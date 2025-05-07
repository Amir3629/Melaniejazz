/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Needed for static export to GitHub Pages
  basePath: '/Melaniejazz', // Set the base path to your repository name
  assetPrefix: '/Melaniejazz/', // Helps with loading assets correctly
  images: {
    unoptimized: true, // Disable Next.js image optimization for static export
  },
  // Enable experimental features
  experimental: {
    // Enable client-side rendering for static pages
    runtime: 'experimental-edge',
  },
  // Redirect /admin to the PagesCMS
  async redirects() {
    return [
      {
        source: '/admin',
        destination: 'https://pagescms.org/editor?repo=Amir3629/Melaniejazz&branch=main',
        permanent: false,
        basePath: false,
      },
    ];
  },
};

export default nextConfig; 