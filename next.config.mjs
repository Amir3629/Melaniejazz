/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export', // No longer needed for Vercel default deployment
  // basePath: '/JazzBerlin', // Remove for Vercel
  // assetPrefix: '/JazzBerlin/', // Remove for Vercel
  images: {
    unoptimized: true, // Keep for now, can be removed if Vercel image optimization works
  },
  // Optional: Add other configurations here
};

export default nextConfig; 