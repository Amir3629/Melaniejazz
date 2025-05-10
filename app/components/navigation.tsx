"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useLanguage } from "./language-switcher"
import LanguageSwitcher from "./language-switcher"
import { useTranslation } from 'react-i18next'
import '../../lib/i18n'

// Production or development detection
const isDevelopment = process.env.NODE_ENV === 'development'
const logoPath = process.env.NODE_ENV === 'production'
  ? "/Melaniejazz/images/logo/ml-logo.PNG"
  : "/images/logo/ml-logo.PNG"

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { currentLang } = useLanguage()
  const { t } = useTranslation()
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    // Mark as initialized after first mount
    setIsInitialized(true)
    
    // Check initial scroll position
    setIsScrolled(window.scrollY > 50)
    
    // Force header to be interactive
    const header = document.querySelector('header')
    if (header) {
      header.style.pointerEvents = 'auto'
    }
  }, [])

  // Enhanced scroll handler with debounce
  useEffect(() => {
    let frameId: number | null = null
    let lastScrollY = window.scrollY

    const handleScroll = () => {
      lastScrollY = window.scrollY
      
      if (frameId) return
      
      frameId = requestAnimationFrame(() => {
        setIsScrolled(lastScrollY > 50)
        frameId = null
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => {
      if (frameId) {
        cancelAnimationFrame(frameId)
      }
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Handle body overflow when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      document.body.classList.add('menu-open')
    } else {
      document.body.style.overflow = ''
      document.body.classList.remove('menu-open')
    }
    
    return () => {
      document.body.style.overflow = ''
      document.body.classList.remove('menu-open')
    }
  }, [isOpen])

  // Force re-render when language changes
  useEffect(() => {
    const handleLanguageChange = () => {
      // Just trigger a re-render
    }

    window.addEventListener('languageChanged', handleLanguageChange)
    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange)
    }
  }, [])

  const links = [
    { href: "/#services", label: t("nav.services") },
    { href: "/#about", label: t("nav.about") },
    { href: "/#references", label: t("nav.references") },
    { href: "/#testimonials", label: t("nav.testimonials") },
    { href: "/#contact", label: t("nav.contact") },
  ]

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const closeMenu = () => {
    setIsOpen(false)
  }

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault()
    closeMenu()
    window.scrollTo({ top: 0, behavior: 'smooth' })
    if (pathname !== '/') {
      router.push('/')
    }
  }

  // Function to scroll to an element with better positioning
  const scrollToElement = (id: string) => {
    closeMenu()
    
    const element = document.getElementById(id)
    if (!element) return
    
    const headerHeight = 80
    const scrollPosition = element.offsetTop - headerHeight
    
    window.scrollTo({
      top: scrollPosition,
      behavior: 'smooth'
    })
  }

  // Handle navigation click on both mobile and desktop
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    
    if (href.startsWith('/') && !href.includes('#')) {
      closeMenu()
      router.push(href)
      return
    }

    const hash = href.split('#')[1]
    if (hash) {
      scrollToElement(hash)
    }
  }

  return (
    <>
      <style jsx global>{`
        :root {
          --header-height-mobile: 60px;
          --header-height: 60px;
        }

        /* Header styles */
        header.main-header {
          background-color: transparent;
          box-shadow: none;
          backdrop-filter: none;
          -webkit-backdrop-filter: none;
          height: var(--header-height-mobile);
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          width: 100%;
          z-index: 100;
          pointer-events: auto;
        }

        @media (min-width: 768px) {
          header.main-header {
            height: var(--header-height);
          }
        }

        /* Add blur effect to main content when mobile menu is open */
        body.menu-open #__next > *:not(header) {
          filter: blur(8px);
          transition: filter 0.3s ease-out;
        }

        body.menu-open {
          overflow: hidden;
        }

        /* The sliding background element */
        .sliding-header-bg {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: var(--header-height-mobile);
          background-color: black;
          transform: translateY(${isScrolled ? '0' : '-100%'});
          transition: transform 0.3s ease-out;
          z-index: 1;
          opacity: 0.85;
        }

        @media (min-width: 768px) {
          .sliding-header-bg {
            height: var(--header-height);
          }
        }

        /* Ensure content stays above the animation */
        header.main-header .header-content {
          position: relative; 
          z-index: 100;
          pointer-events: auto !important;
        }
        
        /* Make navigation links clickable regardless of scroll state */
        header.main-header a,
        header.main-header button {
          position: relative;
          z-index: 101;
          pointer-events: auto !important;
          cursor: pointer !important;
        }

        /* Mobile menu container */
        .mobile-menu-container {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.95);
          z-index: 99;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }

        /* Mobile menu button positioning */
        .mobile-menu-button {
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          z-index: 102;
        }
      `}</style>
      
      <header className="main-header">
        {/* Sliding background that appears on scroll */}
        <div className="sliding-header-bg"></div>
        
        <div className="container mx-auto px-4 header-content">
          <div className="flex items-center justify-between h-[var(--header-height-mobile)] md:h-[var(--header-height)]">
            {/* Logo */}
            <Link 
              href="/" 
              onClick={handleLogoClick}
              className="relative w-20 h-8 md:w-24 md:h-10 z-50"
              >
                <Image
                  src={logoPath}
                  alt="Mel jazz"
                  fill
                  className="object-contain brightness-0 invert hover:opacity-80 transition-opacity"
                  priority
                />
            </Link>

            {/* Desktop Menu */}
            <nav className="hidden md:flex items-center space-x-8">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-white text-sm font-medium hover:text-[#C8A97E] transition-colors"
                  onClick={(e) => handleNavClick(e, link.href)}
                >
                  {link.label}
                </a>
              ))}
              {isDevelopment && (
                <Link
                  href="/admin"
                  className="bg-[#C8A97E] text-black text-sm font-medium px-4 py-2 rounded hover:bg-[#B8996E] transition-colors"
                >
                  Admin
                </Link>
              )}
              <LanguageSwitcher />
            </nav>

            {/* Mobile Menu Button - Right aligned */}
            <button
              onClick={toggleMenu}
              className="md:hidden text-white focus:outline-none p-2 mobile-menu-button"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
            >
              <div className="w-6 h-6 relative flex items-center justify-center">
                <span className={`absolute h-0.5 w-6 bg-current transform transition-all duration-300 ${
                  isOpen ? 'rotate-45 translate-y-0 bg-[#C8A97E]' : '-translate-y-1.5'
                }`} />
                <span className={`absolute h-0.5 w-6 bg-current transform transition-all duration-300 ${
                  isOpen ? 'opacity-0 w-0' : 'opacity-100'
                }`} />
                <span className={`absolute h-0.5 w-6 bg-current transform transition-all duration-300 ${
                  isOpen ? '-rotate-45 translate-y-0 bg-[#C8A97E]' : 'translate-y-1.5'
                }`} />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu - Full screen overlay */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="mobile-menu-container md:hidden"
            >
              <nav className="flex flex-col items-center justify-center w-full h-full space-y-8 py-16">
                {links.map((link) => (
                  <a
                    key={link.href}
                        href={link.href}
                    className="text-xl text-white hover:text-[#C8A97E] transition-colors py-2"
                    onClick={(e) => handleNavClick(e, link.href)}
                  >
                    {link.label}
                  </a>
                ))}
                {isDevelopment && (
                  <Link
                    href="/admin"
                    className="text-[#C8A97E] text-xl hover:text-white transition-colors py-2"
                    onClick={closeMenu}
                  >
                    Admin
                  </Link>
                )}
                <div className="mt-8">
                  <LanguageSwitcher />
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  )
}

export default Navigation;
