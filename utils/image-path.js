/**
 * Utility to get the correct image path based on deployment environment
 * Handles both Vercel and GitHub Pages paths
 */

export function getImagePath(path) {
  // Check if we're in a Vercel environment
  const isVercel = typeof window !== 'undefined' 
    ? window.location.hostname.includes('vercel.app') 
    : process.env.VERCEL === '1';
  
  // Check if we're in production mode
  const isProd = process.env.NODE_ENV === 'production';
  
  // Base path depends on deployment environment
  let basePath = '';
  
  // For GitHub Pages in production
  if (isProd && !isVercel) {
    basePath = '/Melaniejazz';
  }
  
  // Clean the path to ensure no double slashes
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  return `${basePath}${cleanPath}`;
} 