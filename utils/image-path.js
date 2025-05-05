/**
 * Utility to get the correct image path based on deployment environment
 * Handles both Vercel and GitHub Pages paths
 */

export function getImagePath(path) {
  // Simple check for Vercel environment
  const isVercel = process.env.VERCEL === "1";
  
  // Base path depends on deployment environment
  const basePath = isVercel ? '' : '/Melaniejazz';
  
  // Ensure path starts with a slash
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  // Debug info to console in development
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    console.log(`[getImagePath] ${basePath}${cleanPath}`);
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