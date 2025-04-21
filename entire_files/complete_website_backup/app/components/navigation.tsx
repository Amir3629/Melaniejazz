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
import { Menu, X } from 'lucide-react'
import '../styles/header-scroll.css'

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { currentLang } = useLanguage()
  const { t } = useTranslation()
  const menuButtonRef = React.useRef<HTMLButtonElement>(null)

  // Force re-render when language changes
  useEffect(() => {
    const handleLanguageChange = () => {
      setIsOpen(isOpen)
    }

    window.addEventListener('languageChanged', handleLanguageChange)
    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange)
    }
  }, [isOpen])

  // Ensure body has no padding
  useEffect(() => {
    document.body.style.paddingTop = '0';
    return () => {
      document.body.style.paddingTop = '';
    };
  }, []);

  const logoPath = process.env.NODE_ENV === 'production'
    ? "/vocal-coaching/images/logo/ml-logo.PNG"
    : "/vocal-coaching/images/logo/ml-logo.PNG"

  const links = [
    { href: "/#services", label: "nav.services" },
    { href: "/#about", label: "nav.about" },
    { href: "/#references", label: "nav.references" },
    { href: "/#testimonials", label: "nav.testimonials" },
    { href: "/#contact", label: "nav.contact" },
  ]

  // Simplified scroll handler that only handles header visibility
  useEffect(() => {
    let isMounted = true

    const handleScroll = () => {
      if (isMounted) {
        setIsScrolled(window.scrollY > 50)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      isMounted = false
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Make menu button clickable regardless of scroll position
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      const menuBtn = menuButtonRef.current
      if (!menuBtn) return
      
      // Get button position
      const rect = menuBtn.getBoundingClientRect()
      // Check if touch is within button area (with extra padding for easier tapping)
      const touchX = e.touches[0].clientX
      const touchY = e.touches[0].clientY
      const padding = 10 // Extra padding around the button in pixels
      
      if (
        touchX >= rect.left - padding &&
        touchX <= rect.right + padding &&
        touchY >= rect.top - padding &&
        touchY <= rect.bottom + padding
      ) {
        e.preventDefault()
        setIsOpen(prev => !prev)
      }
    }
    
    // Add global touch event listener
    document.addEventListener('touchstart', handleTouchStart, { passive: false })
    
    return () => {
      document.removeEventListener('touchstart', handleTouchStart)
    }
  }, [])

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  }

  const closeMenu = () => {
    setIsOpen(false);
  }

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault()
    closeMenu()
    
    if (pathname !== '/') {
      router.push('/')
      return
    }

    // Smooth scroll to top with a slower duration
    const scrollToTop = () => {
      const currentPosition = window.pageYOffset
      if (currentPosition > 0) {
        requestAnimationFrame(() => {
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          })
        })
      }
    }

    scrollToTop()
  }

  // Function to restore scroll position after menu closes
  const restoreScrollPosition = (scrollY: string) => {
    if (scrollY) {
      const position = parseInt(scrollY || '0') * -1;
      window.scrollTo(0, position);
    }
  }

  // Function to scroll to an element with better positioning
  const scrollToElement = (id: string) => {
    const element = document.getElementById(id);
    if (!element) return;
    
    // Get window width for mobile detection
    const isMobile = window.innerWidth < 768;
    
    // Calculate position to show the element in the viewport
    const elementRect = element.getBoundingClientRect();
    const absoluteElementTop = elementRect.top + window.pageYOffset;
    const headerHeight = isMobile ? 70 : 80; // Smaller offset for mobile
    
    // Calculate a better position that shows more of the element in view
    const elementHeight = elementRect.height;
    const windowHeight = window.innerHeight;
    
    let scrollPosition;
    
    // Custom positioning for different sections
    switch(id) {
      case 'testimonials':
        // For testimonials, position to show more of the testimonial content
        scrollPosition = absoluteElementTop - 50;
        break;
        
      case 'services':
        // Services might need to be seen from the top
        scrollPosition = absoluteElementTop + 35;
        break;
        
      case 'contact':
        // Move down to show the contact form
        scrollPosition = absoluteElementTop + 50;
        break;
        
      case 'about':
        // About section should show more content
        scrollPosition = absoluteElementTop + 50;
        break;
        
      case 'references':
        // References section should be positioned to show more content
        scrollPosition = absoluteElementTop + 50;
        break;
        
      default:
        // Default behavior for any other sections
        scrollPosition = absoluteElementTop + 50;
    }
    
    // Smooth scroll to the calculated position
    window.scrollTo({
      top: scrollPosition,
      behavior: 'smooth'
    });
  }

  return (
    <>
      <style jsx global>{`
        /* Override any previous header styles to ensure our animation works */
        header.main-header {
          background-color: transparent !important;
          box-shadow: none !important;
          backdrop-filter: none !important;
          -webkit-backdrop-filter: none !important;
        }

        /* The sliding background element */
        .sliding-header-bg {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: black;
          transform: translateY(-100%);
          transition: transform 0.5s ease-out;
          z-index: 1;
          opacity: 0.7;
        }

        /* Active state when scrolled */
        header.main-header.scrolled .sliding-header-bg {
          transform: translateY(0);
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
        }

        /* Ensure content stays above the animation */
        header.main-header .header-content {
          position: relative; 
          z-index: 2;
        }
        
        /* Always make header area clickable even when transparent */
        header.main-header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: var(--header-height-mobile);
          z-index: 1;
          pointer-events: auto;
        }
        
        @media (min-width: 768px) {
          header.main-header::before {
            height: var(--header-height);
          }
        }
      `}</style>
      
      <header className={`fixed top-0 left-0 right-0 z-[100] main-header ${isScrolled ? 'scrolled' : ''}`}>
        {/* Our custom sliding background */}
        <div className="sliding-header-bg"></div>
        
        {/* Header content */}
        <div className="container mx-auto header-content">
          <div className="flex items-center justify-between h-[var(--header-height-mobile)] md:h-[var(--header-height)]">
            <Link 
              href="/" 
              onClick={handleLogoClick}
              className="relative w-20 md:w-28 h-8 md:h-10 transition-all duration-300"
            >
              <div className="relative w-full h-full scale-110">
                <Image
                  src={logoPath}
                  alt="Mel jazz"
                  fill
                  className="object-contain brightness-0 invert hover:opacity-80 transition-opacity"
                  priority
                  data-i18n="logo.alt"
                />
              </div>
            </Link>

            {/* Desktop Menu */}
            <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
              {links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    
                    // Handle direct navigation
                    if (link.href.startsWith('/') && !link.href.startsWith('/#')) {
                      router.push(link.href);
                      return;
                    }
                    
                    // Handle hash navigation with custom scrolling function
                    const hash = link.href.split('#')[1];
                    if (hash) {
                      scrollToElement(hash);
                    }
                  }}
                  className="text-sm font-medium tracking-wider uppercase text-white hover:text-[#C8A97E] transition-all duration-300 no-underline after:hidden"
                  data-i18n={link.label}
                >
                  {t(link.label)}
                </a>
              ))}
              <LanguageSwitcher />
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="md:hidden text-white focus:outline-none p-2 mr-1 relative z-[9900] group"
              aria-label={t(isOpen ? 'nav.close' : 'nav.menu')}
              ref={menuButtonRef}
            >
              <div className="w-7 h-7 relative transform transition-all duration-300 flex items-center justify-center">
                <span className={`absolute h-[2px] w-5 bg-current transform transition-all duration-300 ${
                  isOpen ? 'rotate-45 translate-y-0 bg-[#C8A97E]' : '-translate-y-1.5 group-hover:bg-[#C8A97E]'
                }`} />
                <span className={`absolute h-[2px] w-5 bg-current transform transition-all duration-300 ${
                  isOpen ? 'opacity-0 w-0' : 'opacity-100 group-hover:bg-[#C8A97E]'
                }`} />
                <span className={`absolute h-[2px] w-5 bg-current transform transition-all duration-300 ${
                  isOpen ? '-rotate-45 translate-y-0 bg-[#C8A97E]' : 'translate-y-1.5 group-hover:bg-[#C8A97E]'
                }`} />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="md:hidden fixed inset-0 bg-black/90 pt-[var(--header-height-mobile)] mobile-menu-container"
              style={{ 
                zIndex: 9800,
                backdropFilter: 'blur(10px) !important',
                WebkitBackdropFilter: 'blur(10px) !important',
                overflowY: 'auto',
                overflowX: 'hidden',
                touchAction: 'none',
                backgroundImage: 'radial-gradient(circle at center, rgba(200, 169, 126, 0.1) 0%, transparent 70%)'
              }}
              id="mobile-navigation-menu"
            >
              <nav className="flex flex-col items-center justify-center min-h-[85vh] -mt-[calc(var(--header-height-mobile)_+_1rem)] px-8">
                <div className="w-full max-w-xs">
                  {links.map((link, index) => (
                    <motion.div
                      key={link.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="w-full my-4"
                    >
                      <a
                        href={link.href}
                        onClick={(e) => {
                          e.preventDefault();
                          
                          // First close the menu
                          setIsOpen(false);
                          
                          // Get the target hash
                          const hash = link.href.split('#')[1];
                          if (hash) {
                            // Use the scroll helper with a small delay to allow menu to close first
                            setTimeout(() => {
                              const element = document.getElementById(hash);
                              if (element) {
                                scrollToElement(hash);
                              }
                            }, 150);
                          }
                        }}
                        className="group text-xl font-medium tracking-wider uppercase text-white hover:text-[#C8A97E] transition-all duration-300 no-underline block py-3 text-center w-full relative overflow-hidden"
                        data-i18n={link.label}
                      >
                        <span className="relative z-10">{t(link.label)}</span>
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#C8A97E] transition-all duration-500 group-hover:w-full"></span>
                      </a>
                    </motion.div>
                  ))}
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: links.length * 0.1 }}
                  className="mt-16"
                >
                  <LanguageSwitcher />
                </motion.div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  )
}