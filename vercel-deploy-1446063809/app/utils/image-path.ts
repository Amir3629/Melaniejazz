"use client"

/**
 * Ensures the image path starts with a slash.
 * Relies on Next.js assetPrefix to handle deployment pathing.
 * @param imagePath The relative image path (e.g., images/gallery/foo.jpg or /images/gallery/foo.jpg)
 * @returns The normalized image path starting with /
 */
export function getImagePath(imagePath: string): string {
  if (!imagePath) return "";
  
  // Ensure path starts with a slash
  return imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
}

/**
 * Debugs image path processing
 * @param imagePath The image path to process and log
 * @returns The processed image path
 */
export function debugImagePath(imagePath: string): string {
  const processed = getImagePath(imagePath);
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "(Not Set)"; // Log env var for debug if needed
  console.log(`Original: ${imagePath}`);
  console.log(`Processed (Normalized): ${processed}`);
  console.log(`Env Base Path: ${basePath}`);
  console.log(`Environment: ${typeof window !== "undefined" ? window.location.hostname : "SSR"}`);
  return processed;
} 