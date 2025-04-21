"use client"

import { useState, useEffect } from "react"
import { getImagePath } from "@/app/utils/image-path"
import Image from "next/image"

interface AppImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  [key: string]: any
}

export function AppImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  ...props
}: AppImageProps) {
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
  
  return (
    <Image
      src={getImageSource()}
      alt={alt}
      width={width || 0}
      height={height || 0}
      className={className}
      priority={priority}
      unoptimized
      onError={handleError}
      {...props}
    />
  )
}

interface RegularImgProps {
  src: string
  alt: string
  className?: string
  [key: string]: any
}

export function RegularImg({
  src,
  alt,
  className,
  ...props
}: RegularImgProps) {
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
  
  return (
    <img
      src={getImageSource()}
      alt={alt}
      className={className}
      loading="lazy"
      onError={handleError}
      {...props}
    />
  )
} 