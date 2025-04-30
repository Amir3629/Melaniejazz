"use client"

import { useEffect } from 'react'
import React from 'react'
import { usePathname } from 'next/navigation'
import { useLanguage } from './language-switcher'

/**
 * HtmlMeta component adds dynamic meta tags and fixes accessibility issues
 * This component should be included in the RootLayout to ensure proper HTML attributes
 */
const HtmlMeta = () => {
  const pathname = usePathname()
  const { currentLang } = useLanguage()
  
  useEffect(() => {
    // Set the HTML lang attribute based on the current language
    const html = document.documentElement
    if (html) {
      html.setAttribute('lang', currentLang || 'en')
    }
    
    // Fix viewport meta tag to enable zooming for accessibility
    const viewportMeta = document.querySelector('meta[name="viewport"]')
    if (viewportMeta) {
      viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=5')
    } else {
      // Create viewport meta if it doesn't exist
      const meta = document.createElement('meta')
      meta.setAttribute('name', 'viewport')
      meta.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=5')
      document.head.appendChild(meta)
    }
    
    // Add robots meta tag
    const robotsMeta = document.querySelector('meta[name="robots"]')
    if (!robotsMeta) {
      const meta = document.createElement('meta')
      meta.setAttribute('name', 'robots')
      meta.setAttribute('content', 'index, follow')
      document.head.appendChild(meta)
    }
    
    // Add theme-color meta tag for mobile browsers
    const themeColorMeta = document.querySelector('meta[name="theme-color"]')
    if (!themeColorMeta) {
      const meta = document.createElement('meta')
      meta.setAttribute('name', 'theme-color')
      meta.setAttribute('content', '#040202')
      document.head.appendChild(meta)
    }
    
    // Add canonical URL
    const linkCanonical = document.querySelector('link[rel="canonical"]')
    if (!linkCanonical) {
      const link = document.createElement('link')
      link.setAttribute('rel', 'canonical')
      link.setAttribute('href', `https://meljazz.com${pathname}`)
      document.head.appendChild(link)
    }
    
    // Add preconnect for critical resources
    const addPreconnect = (url: string, crossOrigin?: string) => {
      const existingLink = document.querySelector(`link[rel="preconnect"][href="${url}"]`)
      if (!existingLink) {
        const link = document.createElement('link')
        link.setAttribute('rel', 'preconnect')
        link.setAttribute('href', url)
        if (crossOrigin) {
          link.setAttribute('crossorigin', crossOrigin)
        }
        document.head.appendChild(link)
      }
    }
    
    // Add preconnect for Google Fonts
    addPreconnect('https://fonts.googleapis.com')
    addPreconnect('https://fonts.gstatic.com', 'anonymous')
    
    return () => {
      // Cleanup function if needed
    }
  }, [pathname, currentLang])
  
  // This component doesn't render anything visually
  return null
} 

export default HtmlMeta;
