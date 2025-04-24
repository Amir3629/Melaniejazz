/**
 * Utility function to handle image paths with proper base path for production/development
 */

/**
 * Formats image paths for use in the application
 * @param path - The relative path to the image
 * @returns The properly formatted path with base path if needed
 */
export function getImagePath(path: string): string {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // Add the production prefix if in production
  return process.env.NODE_ENV === 'production'
    ? `/JazzBerlin/${cleanPath}`
    : `/${cleanPath}`;
}

// Debug function to log image path resolution
export function debugImagePath(originalPath: string): void {
  console.log({
    original: originalPath,
    processed: getImagePath(originalPath),
    environment: process.env.NODE_ENV,
  })
} 