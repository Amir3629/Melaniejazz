"use client"

import { useState, useEffect, memo } from "react"
import React from 'react'
import { getImagePath } from "@/app/utils/image-path"
import Image from "next/image"

interface AppImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  loading?: "eager" | "lazy"
  sizes?: string
  quality?: number
  [key: string]: any
}

// Optimized Image component with performance improvements
export const AppImage = memo(({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  loading = "lazy",
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  quality = 75,
  ...props
}: AppImageProps) => {
  const [error, setError] = useState(false)
  const [attemptCount, setAttemptCount] = useState(0)
  const correctedSrc = getImagePath(src)
  
  // Reset error state if src changes
  useEffect(() => {
    setError(false)
    setAttemptCount(0)
  }, [src])
  
  // On error, load a placeholder SVG
  const handleError = () => {
    console.warn(`Failed to load image: ${correctedSrc}`)
    
    // Try alternative paths based on image type
    if (attemptCount === 0) {
      setAttemptCount(1)
      
      // Handle vocal-coaching prefixed paths
      if (correctedSrc.includes('/vocal-coaching/')) {
        const directPath = correctedSrc.replace('/vocal-coaching/', '/')
        console.log('Attempting with direct path:', directPath)
        tryImagePath(directPath)
        return
      }
      
      // Handle gallery images
      if (correctedSrc.includes('/gallery/') || correctedSrc.includes('/images/gallery/')) {
        // Try direct public path 
        const directPath = correctedSrc.replace('/images/gallery/', '/gallery/')
        console.log('Attempting gallery with direct path:', directPath)
        tryImagePath(directPath)
      } 
      // Handle background images
      else if (correctedSrc.includes('/backgrounds/') || correctedSrc.includes('/images/backgrounds/')) {
        // Try direct public path
        const directPath = correctedSrc.replace('/images/backgrounds/', '/backgrounds/')
        console.log('Attempting background with direct path:', directPath)
        tryImagePath(directPath)
      }
      else {
        setError(true)
      }
    } else if (attemptCount === 1) {
      // If the first attempt failed, try a more aggressive approach
      setAttemptCount(2)
      
      // Try removing any path prefixes and use just the filename
      const filename = correctedSrc.split('/').pop() || ''
      if (filename) {
        // Try paths based on the image content type
        if (correctedSrc.includes('gallery')) {
          tryImagePath(`/gallery/${filename}`)
        } else if (correctedSrc.includes('backgrounds') || correctedSrc.includes('hero-bg') || correctedSrc.includes('services-bg')) {
          tryImagePath(`/backgrounds/${filename}`)
        } else {
          setError(true)
        }
      } else {
        setError(true)
      }
    } else {
      setError(true)
    }
  }
  
  // Helper to try loading an image path
  const tryImagePath = (path: string) => {
    const imgElement = new window.Image()
    imgElement.src = path
    imgElement.onload = () => {
      // If direct path works, use it
      setError(false)
    }
    imgElement.onerror = () => {
      // Finally use fallback
      setError(true)
    }
  }

  // If error, try to determine what kind of placeholder to show
  const fallbackSrc = () => {
    const path = correctedSrc.toLowerCase();
    if (path.includes('/gallery/') || path.includes('performance')) {
      return '/images/placeholders/gallery.svg';
    }
    if (path.includes('/backgrounds/') || path.includes('hero-bg') || path.includes('services-bg')) {
      return '/images/placeholders/background.svg';
    }
    if (path.includes('/avatar/') || path.includes('avatar')) {
      return '/images/placeholders/avatar.svg';
    }
    if (path.includes('preview-poster')) {
      return '/images/placeholders/hero.svg';
    }
    if (path.includes('cursor')) {
      // Special case for cursor
      return '/images/placeholders/avatar.svg';
    }
    // Default placeholder
    return '/images/placeholders/hero.svg'
  }
  
  // Use the backup path after error
  const getImageSource = () => {
    if (error) {
      return fallbackSrc()
    } else if (attemptCount > 0) {
      // Handle vocal-coaching prefixed paths
      if (correctedSrc.includes('/vocal-coaching/')) {
        return correctedSrc.replace('/vocal-coaching/', '/')
      }
      
      if (correctedSrc.includes('/gallery/') || correctedSrc.includes('/images/gallery/')) {
        return correctedSrc.replace('/images/gallery/', '/gallery/')
      } else if (correctedSrc.includes('/backgrounds/') || correctedSrc.includes('/images/backgrounds/')) {
        return correctedSrc.replace('/images/backgrounds/', '/backgrounds/')
      } else if (attemptCount === 2) {
        // Use just the filename for the most direct path
        const filename = correctedSrc.split('/').pop() || ''
        if (filename) {
          if (correctedSrc.includes('gallery')) {
            return `/gallery/${filename}`
          } else if (correctedSrc.includes('backgrounds') || correctedSrc.includes('hero-bg') || correctedSrc.includes('services-bg')) {
            return `/backgrounds/${filename}`
          }
        }
      }
    }
    return correctedSrc
  }
  
  // Determine if image should be eager loaded based on content
  const getLoadingStrategy = () => {
    if (priority) return "eager";
    
    const path = correctedSrc.toLowerCase();
    // Load above-the-fold hero images eagerly
    if (path.includes('hero-bg') || path.includes('logo')) {
      return "eager";
    }
    
    return loading;
  };
  
  // Determine appropriate sizes based on image type for responsive loading
  const getImageSizes = () => {
    const path = correctedSrc.toLowerCase();
    
    if (path.includes('hero-bg') || path.includes('backgrounds')) {
      return "100vw"; // Full-width backgrounds
    }
    
    if (path.includes('gallery')) {
      return "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw";
    }
    
    if (path.includes('profile') || path.includes('avatar')) {
      return "(max-width: 640px) 80vw, (max-width: 1024px) 40vw, 25vw";
    }
    
    return sizes;
  };
  
  // Calculate appropriate quality based on image type
  const getImageQuality = () => {
    const path = correctedSrc.toLowerCase();
    
    if (path.includes('hero-bg') || path.includes('backgrounds')) {
      return 80; // Higher quality for hero images
    }
    
    if (path.includes('logo') || path.includes('svg')) {
      return 90; // Higher quality for logos
    }
    
    return quality;
  };
  
  return (
    <Image
      src={getImageSource()}
      alt={alt}
      width={width || 0}
      height={height || 0}
      className={className}
      loading={getLoadingStrategy()}
      sizes={getImageSizes()}
      quality={getImageQuality()}
      // Only set priority for truly critical images
      priority={priority || correctedSrc.toLowerCase().includes('hero-bg')}
      placeholder={correctedSrc.toLowerCase().includes('hero-bg') ? 'blur' : undefined}
      blurDataURL={correctedSrc.toLowerCase().includes('hero-bg') ? 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAEDQIHXG8ZhAAAAABJRU5ErkJggg==' : undefined}
      onError={handleError}
      {...props}
    />
  )
})

AppImage.displayName = 'AppImage';

interface RegularImgProps {
  src: string
  alt: string
  className?: string
  loading?: "eager" | "lazy"
  [key: string]: any
}

// Optimized RegularImg component
export const RegularImg = memo(({
  src,
  alt,
  className,
  loading = "lazy",
  ...props
}: RegularImgProps) => {
  const [error, setError] = useState(false)
  const [attemptCount, setAttemptCount] = useState(0)
  const correctedSrc = getImagePath(src)
  
  // Reset error state if src changes
  useEffect(() => {
    setError(false)
    setAttemptCount(0)
  }, [src])
  
  // On error, load a placeholder SVG
  const handleError = () => {
    console.warn(`Failed to load image: ${correctedSrc}`)
    
    // Try alternative paths based on image type
    if (attemptCount === 0) {
      setAttemptCount(1)
      
      // Handle vocal-coaching prefixed paths
      if (correctedSrc.includes('/vocal-coaching/')) {
        const directPath = correctedSrc.replace('/vocal-coaching/', '/')
        console.log('Attempting with direct path:', directPath)
        tryImagePath(directPath)
        return
      }
      
      // Handle gallery images
      if (correctedSrc.includes('/gallery/') || correctedSrc.includes('/images/gallery/')) {
        // Try direct public path 
        const directPath = correctedSrc.replace('/images/gallery/', '/gallery/')
        console.log('Attempting gallery with direct path:', directPath)
        tryImagePath(directPath)
      } 
      // Handle background images
      else if (correctedSrc.includes('/backgrounds/') || correctedSrc.includes('/images/backgrounds/')) {
        // Try direct public path
        const directPath = correctedSrc.replace('/images/backgrounds/', '/backgrounds/')
        console.log('Attempting background with direct path:', directPath)
        tryImagePath(directPath)
      }
      else {
        setError(true)
      }
    } else if (attemptCount === 1) {
      // If the first attempt failed, try a more aggressive approach
      setAttemptCount(2)
      
      // Try removing any path prefixes and use just the filename
      const filename = correctedSrc.split('/').pop() || ''
      if (filename) {
        // Try paths based on the image content type
        if (correctedSrc.includes('gallery')) {
          tryImagePath(`/gallery/${filename}`)
        } else if (correctedSrc.includes('backgrounds') || correctedSrc.includes('hero-bg') || correctedSrc.includes('services-bg')) {
          tryImagePath(`/backgrounds/${filename}`)
        } else {
          setError(true)
        }
      } else {
        setError(true)
      }
    } else {
      setError(true)
    }
  }
  
  // Helper to try loading an image path
  const tryImagePath = (path: string) => {
    const imgElement = new window.Image()
    imgElement.src = path
    imgElement.onload = () => {
      // If direct path works, use it
      setError(false)
    }
    imgElement.onerror = () => {
      // Finally use fallback
      setError(true)
    }
  }

  // If error, try to determine what kind of placeholder to show
  const fallbackSrc = () => {
    const path = correctedSrc.toLowerCase();
    if (path.includes('/gallery/') || path.includes('performance')) {
      return '/images/placeholders/gallery.svg';
    }
    if (path.includes('/backgrounds/') || path.includes('hero-bg') || path.includes('services-bg')) {
      return '/images/placeholders/background.svg';
    }
    if (path.includes('/avatar/') || path.includes('avatar')) {
      return '/images/placeholders/avatar.svg';
    }
    if (path.includes('preview-poster')) {
      return '/images/placeholders/hero.svg';
    }
    if (path.includes('cursor')) {
      // Special case for cursor
      return '/images/placeholders/avatar.svg';
    }
    // Default placeholder
    return '/images/placeholders/hero.svg'
  }
  
  // Use the backup path after error
  const getImageSource = () => {
    if (error) {
      return fallbackSrc()
    } else if (attemptCount > 0) {
      // Handle vocal-coaching prefixed paths
      if (correctedSrc.includes('/vocal-coaching/')) {
        return correctedSrc.replace('/vocal-coaching/', '/')
      }
      
      if (correctedSrc.includes('/gallery/') || correctedSrc.includes('/images/gallery/')) {
        return correctedSrc.replace('/images/gallery/', '/gallery/')
      } else if (correctedSrc.includes('/backgrounds/') || correctedSrc.includes('/images/backgrounds/')) {
        return correctedSrc.replace('/images/backgrounds/', '/backgrounds/')
      } else if (attemptCount === 2) {
        // Use just the filename for the most direct path
        const filename = correctedSrc.split('/').pop() || ''
        if (filename) {
          if (correctedSrc.includes('gallery')) {
            return `/gallery/${filename}`
          } else if (correctedSrc.includes('backgrounds') || correctedSrc.includes('hero-bg') || correctedSrc.includes('services-bg')) {
            return `/backgrounds/${filename}`
          }
        }
      }
    }
    return correctedSrc
  }
  
  // Determine appropriate loading strategy
  const getLoadingStrategy = () => {
    const path = correctedSrc.toLowerCase();
    if (path.includes('hero-bg') || path.includes('logo')) {
      return "eager";
    }
    return loading;
  };
  
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={getImageSource()}
      alt={alt}
      className={className}
      loading={getLoadingStrategy()}
      decoding="async"
      onError={handleError}
      {...props}
    />
  )
})

RegularImg.displayName = 'RegularImg'; 