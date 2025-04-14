"use client"

export function getImagePath(imagePath) {
  if (!imagePath) return '';
  
  // Development environment detection
  const isDevelopment = typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  
  // Fix missing slash if needed
  const normalizedPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  
  // For development, ensure paths are correct
  if (isDevelopment) {
    // Remove /vocal-coaching prefix if it exists
    if (normalizedPath.startsWith('/vocal-coaching/')) {
      // If path is already using the production prefix, strip it and continue processing
      return getImagePath(normalizedPath.replace('/vocal-coaching', ''));
    }
    
    // Check if path is for a gallery image or background image
    if (normalizedPath.includes('/images/gallery/')) {
      // For gallery images, try alternating path without 'images/'
      // This handles paths like /images/gallery/image.jpg -> /gallery/image.jpg
      if (normalizedPath.endsWith('.jpg') || normalizedPath.endsWith('.png') || normalizedPath.endsWith('.webp')) {
        return normalizedPath.replace('/images/gallery/', '/gallery/');
      }
    }
    
    // Similar handling for background images
    if (normalizedPath.includes('/images/backgrounds/')) {
      // For background images, try alternating path without 'images/'
      if (normalizedPath.endsWith('.jpg') || normalizedPath.endsWith('.png') || normalizedPath.endsWith('.webp')) {
        return normalizedPath.replace('/images/backgrounds/', '/backgrounds/');
      }
    }
    
    // Direct background path
    if (normalizedPath.includes('/backgrounds/')) {
      // Already direct format, keep it
      return normalizedPath;
    }
    
    // Direct gallery path
    if (normalizedPath.includes('/gallery/')) {
      // Already direct format, keep it
      return normalizedPath;
    }
    
    // Handle special case for music cursor
    if (normalizedPath.includes('music-cursor.png')) {
      return '/images/music-cursor.png';
    }
    
    return normalizedPath;
  }
  
  // For production, add the /vocal-coaching prefix if needed
  if (!isDevelopment && !normalizedPath.startsWith('/vocal-coaching/') && normalizedPath.startsWith('/')) {
    return `/vocal-coaching${normalizedPath}`;
  }
  
  return normalizedPath;
} 