/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Needed for static export to GitHub Pages
  basePath: '/JazzBerlin', // Set the base path to your repository name
  assetPrefix: '/JazzBerlin/', // Helps with loading assets correctly
  images: {
    unoptimized: true, // Disable Next.js image optimization for static export if needed
  },
  // Optional: Add other configurations here
};

export default nextConfig; 