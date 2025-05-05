/**
 * Utility to get the correct image path based on deployment environment
 * Handles both Vercel and GitHub Pages paths
 */

export function getImagePath(path) {
  // Check if we're in a client environment
  const isClient = typeof window !== 'undefined';
  
  // Detect Vercel environment - this will be true when deployed to Vercel
  const isVercel = process.env.VERCEL === "1" || 
                   (isClient && window.location.hostname.includes('vercel.app'));
  
  // Check if we're in production mode
  const isProd = process.env.NODE_ENV === 'production';
  
  // Base path depends on deployment environment
  let basePath = '';
  
  // For GitHub Pages in production
  if (isProd && !isVercel) {
    basePath = '/Melaniejazz';
  }
  
  // Ensure path starts with a slash
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  // Debug the path construction
  if (isClient && localStorage.getItem('debug') === 'true') {
    console.log(`[getImagePath] Original: ${path}`);
    console.log(`[getImagePath] Clean: ${cleanPath}`);
    console.log(`[getImagePath] Base: ${basePath}`);
    console.log(`[getImagePath] Result: ${basePath}${cleanPath}`);
    console.log(`[getImagePath] isVercel: ${isVercel}`);
  }
  
  return `${basePath}${cleanPath}`;
}

// Debug function to troubleshoot path issues
export function debugImagePath() {
  if (typeof window === 'undefined') return;
  
  console.log('==== Image Path Debug Info ====');
  console.log(`Hostname: ${window.location.hostname}`);
  console.log(`Path: ${window.location.pathname}`);
  console.log(`Vercel: ${process.env.VERCEL === "1"}`);
  console.log(`isVercelHost: ${window.location.hostname.includes('vercel.app')}`);
  console.log('=============================');
} 