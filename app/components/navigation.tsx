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

  // Ensure navigation links are always interactive regardless of scroll position
  useEffect(() => {
    // Make all navigation links and buttons interactive
    const makeInteractive = () => {
      const navLinks = document.querySelectorAll('header a, header button');
      navLinks.forEach(link => {
        if (link instanceof HTMLElement) {
          link.style.pointerEvents = 'auto';
          link.style.position = 'relative';
          link.style.zIndex = '50';
        }
      });
    };

    // Call immediately and after a delay to catch all elements
    makeInteractive();
    const timer = setTimeout(makeInteractive, 500);
    
    return () => clearTimeout(timer);
  }, []);

  // Special handling for Services link which often has issues
  useEffect(() => {
    const makeServicesLinkClickable = () => {
      // Target all elements related to Services link in both desktop and mobile menus
      const serviceLinks = document.querySelectorAll('header a[href*="services"], header a[data-href*="services"], header div[data-href*="services"]');
      
      serviceLinks.forEach(link => {
        if (link instanceof HTMLElement) {
          // Apply extreme z-index and ensure pointer events
          link.style.zIndex = '9999';
          link.style.position = 'relative';
          link.style.pointerEvents = 'auto';
          link.style.cursor = 'pointer';
          
          // For div container elements, increase click area
          if (link.tagName === 'DIV') {
            link.style.padding = '15px';
            link.style.margin = '-15px';
          }
          
          // Add direct click listener for services
          link.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            // First close mobile menu if open
            if (isOpen) setIsOpen(false);
            
            // Scroll to services section
            setTimeout(() => {
              scrollToElement('services');
            }, 100);
          });
        }
      });
    };
    
    // Apply immediately and with delays to catch any late-loaded elements
    makeServicesLinkClickable();
    const timer1 = setTimeout(makeServicesLinkClickable, 500);
    const timer2 = setTimeout(makeServicesLinkClickable, 1500);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [isOpen]);

  // Emergency fix for Services link not working on initial page load
  useEffect(() => {
    // This is a direct approach that adds a completely separate click area
    // for the services link at the exact position where it should be
    const createServicesClickOverlay = () => {
      // First remove any existing overlay to prevent duplicates
      const existingOverlay = document.getElementById('services-click-overlay');
      if (existingOverlay) {
        existingOverlay.remove();
      }

      // Create a new overlay element
      const overlay = document.createElement('div');
      overlay.id = 'services-click-overlay';
      overlay.style.position = 'fixed';
      overlay.style.zIndex = '99999';
      overlay.style.top = '0';
      overlay.style.left = '0';
      overlay.style.width = '100%';
      overlay.style.height = '80px'; // Match header height
      overlay.style.pointerEvents = 'none';
      
      // Add the overlay to the document
      document.body.appendChild(overlay);

      // Find the position of the services nav item
      const servicesItem = document.querySelector('header nav div[data-href*="services"]');
      if (servicesItem && servicesItem instanceof HTMLElement) {
        const rect = servicesItem.getBoundingClientRect();
        
        // Create a clickable area just for services
        const clickArea = document.createElement('div');
        clickArea.style.position = 'absolute';
        clickArea.style.left = `${rect.left}px`;
        clickArea.style.top = `${rect.top}px`;
        clickArea.style.width = `${rect.width}px`;
        clickArea.style.height = `${rect.height}px`;
        clickArea.style.backgroundColor = 'rgba(255,0,0,0.0)'; // Invisible
        clickArea.style.zIndex = '99999';
        clickArea.style.cursor = 'pointer';
        clickArea.style.pointerEvents = 'auto';
        
        // Add direct click handler
        clickArea.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          scrollToElement('services');
        });
        
        // Add to overlay
        overlay.appendChild(clickArea);
      }
    };

    // Initialize and re-initialize on window resize
    createServicesClickOverlay();
    window.addEventListener('resize', createServicesClickOverlay);
    
    // Set up multiple timers to re-check and re-create overlay
    const timers = [
      setTimeout(createServicesClickOverlay, 500),
      setTimeout(createServicesClickOverlay, 1000),
      setTimeout(createServicesClickOverlay, 2000)
    ];

    return () => {
      window.removeEventListener('resize', createServicesClickOverlay);
      timers.forEach(timer => clearTimeout(timer));
      
      const overlay = document.getElementById('services-click-overlay');
      if (overlay) {
        overlay.remove();
      }
    };
  }, []);

  // Apply the same fix to ALL navigation items
  useEffect(() => {
    // This function creates clickable overlays for all navigation items
    const createAllNavClickOverlays = () => {
      // First remove any existing main overlay
      const existingMainOverlay = document.getElementById('all-nav-click-overlay');
      if (existingMainOverlay) {
        existingMainOverlay.remove();
      }

      // Create a new overlay element for all nav items
      const mainOverlay = document.createElement('div');
      mainOverlay.id = 'all-nav-click-overlay';
      mainOverlay.style.position = 'fixed';
      mainOverlay.style.zIndex = '99999';
      mainOverlay.style.top = '0';
      mainOverlay.style.left = '0';
      mainOverlay.style.width = '100%';
      mainOverlay.style.height = '80px'; // Match header height
      mainOverlay.style.pointerEvents = 'none';
      
      // Add the overlay to the document
      document.body.appendChild(mainOverlay);

      // Find all navigation items
      const navItems = document.querySelectorAll('header nav div[data-nav-item]');
      
      navItems.forEach(navItem => {
        if (navItem instanceof HTMLElement) {
          const href = navItem.getAttribute('data-href');
          if (!href) return;
          
          const rect = navItem.getBoundingClientRect();
          
          // Create a clickable area for this nav item
          const clickArea = document.createElement('div');
          clickArea.style.position = 'absolute';
          clickArea.style.left = `${rect.left}px`;
          clickArea.style.top = `${rect.top}px`;
          clickArea.style.width = `${rect.width}px`;
          clickArea.style.height = `${rect.height}px`;
          clickArea.style.backgroundColor = 'rgba(255,0,0,0.0)'; // Invisible
          clickArea.style.zIndex = '99999';
          clickArea.style.cursor = 'pointer';
          clickArea.style.pointerEvents = 'auto';
          
          // Add direct click handler based on the href attribute
          clickArea.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            // Direct navigation for non-hash links
            if (href.startsWith('/') && !href.includes('#')) {
              router.push(href);
              return;
            }
            
            // Handle hash navigation
            const hash = href.split('#')[1];
            if (hash) {
              scrollToElement(hash);
            }
          });
          
          // Add to overlay
          mainOverlay.appendChild(clickArea);
        }
      });
      
      // Also create a clickable area for the logo
      const logoLink = document.querySelector('header .header-content Link, header .header-content a');
      if (logoLink && logoLink instanceof HTMLElement) {
        const logoRect = logoLink.getBoundingClientRect();
        
        // Create a clickable area for the logo
        const logoClickArea = document.createElement('div');
        logoClickArea.style.position = 'absolute';
        logoClickArea.style.left = `${logoRect.left}px`;
        logoClickArea.style.top = `${logoRect.top}px`;
        logoClickArea.style.width = `${logoRect.width + 40}px`; // Extra width to ensure full coverage
        logoClickArea.style.height = `${logoRect.height + 20}px`; // Extra height
        logoClickArea.style.backgroundColor = 'rgba(255,0,0,0.0)'; // Invisible
        logoClickArea.style.zIndex = '99999';
        logoClickArea.style.cursor = 'pointer';
        logoClickArea.style.pointerEvents = 'auto';
        
        // Add direct click handler for the logo
        logoClickArea.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          
          // If not on homepage, navigate to homepage
          if (pathname !== '/') {
            router.push('/');
            return;
          }
          
          // If on homepage, scroll to top
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        });
        
        // Add to overlay
        mainOverlay.appendChild(logoClickArea);
      }
    };

    // Initialize and re-initialize on window resize
    createAllNavClickOverlays();
    window.addEventListener('resize', createAllNavClickOverlays);
    
    // Set up multiple timers to re-check and re-create overlays
    const timers = [
      setTimeout(createAllNavClickOverlays, 500),
      setTimeout(createAllNavClickOverlays, 1000),
      setTimeout(createAllNavClickOverlays, 2000),
      setTimeout(createAllNavClickOverlays, 3000)
    ];

    return () => {
      window.removeEventListener('resize', createAllNavClickOverlays);
      timers.forEach(timer => clearTimeout(timer));
      
      const overlay = document.getElementById('all-nav-click-overlay');
      if (overlay) {
        overlay.remove();
      }
    };
  }, [router, pathname]);

  // Add special handler for top navigation links
  useEffect(() => {
    // Find all the navigation links
    const navLinks = document.querySelectorAll('header nav a');
    
    // Add event handlers to each link
    navLinks.forEach(link => {
      if (link instanceof HTMLAnchorElement) {
        // Save the original href
        const href = link.getAttribute('href');
        if (!href) return;
        
        // Store the href as a data attribute
        link.setAttribute('data-href', href);
        
        // Add touch event listener
        link.addEventListener('touchstart', (e) => {
          e.preventDefault();
          
          // Handle direct navigation
          if (href.startsWith('/') && !href.startsWith('/#')) {
            router.push(href);
            return;
          }
          
          // Handle hash navigation
          const hash = href.split('#')[1];
          if (hash) {
            scrollToElement(hash);
          }
        });
        
        // Add click event listener
        link.addEventListener('click', (e) => {
          e.preventDefault();
          
          // Handle direct navigation
          if (href.startsWith('/') && !href.startsWith('/#')) {
            router.push(href);
            return;
          }
          
          // Handle hash navigation
          const hash = href.split('#')[1];
          if (hash) {
            scrollToElement(hash);
          }
        });
      }
    });
    
    // Clean up event listeners
    return () => {
      const navLinks = document.querySelectorAll('header nav a');
      navLinks.forEach(link => {
        if (link instanceof HTMLAnchorElement) {
          link.removeEventListener('touchstart', () => {});
          link.removeEventListener('click', () => {});
        }
      });
    };
  }, [router]);

  // Special handler for the logo 
  useEffect(() => {
    // Create a special overlay for the logo
    const createLogoOverlay = () => {
      // Remove any existing overlay
      const existingOverlay = document.getElementById('logo-click-overlay');
      if (existingOverlay) {
        existingOverlay.remove();
      }
      
      // Create new overlay
      const overlay = document.createElement('div');
      overlay.id = 'logo-click-overlay';
      overlay.style.position = 'fixed';
      overlay.style.top = '0';
      overlay.style.left = '0';
      overlay.style.width = '100%';
      overlay.style.height = '80px';
      overlay.style.zIndex = '999999';
      overlay.style.pointerEvents = 'none';
      
      document.body.appendChild(overlay);
      
      // Find the logo
      const logoElement = document.querySelector('header .header-content a');
      if (logoElement && logoElement instanceof HTMLElement) {
        const rect = logoElement.getBoundingClientRect();
        
        // Create clickable area for logo
        const clickArea = document.createElement('div');
        clickArea.style.position = 'absolute';
        clickArea.style.left = `${rect.left}px`;
        clickArea.style.top = `${rect.top}px`;
        clickArea.style.width = `${rect.width + 20}px`;
        clickArea.style.height = `${rect.height + 20}px`;
        clickArea.style.backgroundColor = 'rgba(0,0,0,0)';
        clickArea.style.cursor = 'pointer';
        clickArea.style.zIndex = '999999';
        clickArea.style.pointerEvents = 'auto';
        
        // Add click handler
        clickArea.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          
          if (pathname !== '/') {
            router.push('/');
          } else {
            window.scrollTo({
              top: 0,
              behavior: 'smooth'
            });
          }
        });
        
        overlay.appendChild(clickArea);
      }
    };
    
    // Initialize and set up timers
    createLogoOverlay();
    window.addEventListener('resize', createLogoOverlay);
    
    const timers = [
      setTimeout(createLogoOverlay, 500),
      setTimeout(createLogoOverlay, 1000),
      setTimeout(createLogoOverlay, 2000)
    ];
    
    return () => {
      window.removeEventListener('resize', createLogoOverlay);
      timers.forEach(timer => clearTimeout(timer));
      
      const overlay = document.getElementById('logo-click-overlay');
      if (overlay) {
        overlay.remove();
      }
    };
  }, [pathname, router]);

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
    
    const isMobile = window.innerWidth < 768;
    const headerHeight = isMobile ? 70 : 80;
    const elementRect = element.getBoundingClientRect();
    // Use 70px offset for contact section, 50px for others
    const additionalOffset = id === 'contact' ? 90 : 50;
    const scrollPosition = elementRect.top + window.pageYOffset - headerHeight + additionalOffset;

    // Simple, immediate scroll with custom easing
    const start = window.pageYOffset;
    const change = scrollPosition - start;
    const duration = 500; // Faster duration
    const startTime = performance.now();

    function easeInOutQuad(t: number): number {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }

    function animate(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      window.scrollTo(0, start + change * easeInOutQuad(progress));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }

    requestAnimationFrame(animate);
  };

  // Unified click handler for both mobile and desktop
  const handleNavClick = (href: string) => {
    if (href.startsWith('/') && !href.includes('#')) {
      router.push(href);
      return;
    }

    const hash = href.split('#')[1];
    if (hash) {
      const element = document.getElementById(hash);
      if (element) {
        if (isOpen) setIsOpen(false);
        scrollToElement(hash);
      }
    }
  };

  // Mobile menu item click handler
  const handleMobileMenuItemClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    e.stopPropagation();
    handleNavClick(href);
  };

  return (
    <>
      <style jsx global>{`
        :root {
          --header-height-mobile: 60px;
          --header-height: 60px;
        }

        header.main-header {
          background-color: transparent !important;
          box-shadow: none !important;
          backdrop-filter: none !important;
          -webkit-backdrop-filter: none !important;
          height: var(--header-height-mobile);
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
          transform: translateY(-100%);
          transition: transform 0.3s ease-out;
          z-index: 1;
          opacity: 0.85;
        }

        @media (min-width: 768px) {
          .sliding-header-bg {
            height: var(--header-height);
          }
        }

        /* Active state when scrolled */
        header.main-header.scrolled .sliding-header-bg {
          transform: translateY(0);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }

        /* Ensure content stays above the animation */
        header.main-header .header-content {
          position: relative; 
          z-index: 999;
          pointerEvents: auto !important;
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
        }
        
        @media (min-width: 768px) {
          header.main-header::before {
            height: var(--header-height);
          }
        }

        /* Make all navigation links clickable regardless of scroll state */
        header.main-header a,
        header.main-header button {
          position: relative;
          z-index: 9999;
          pointerEvents: auto !important;
          cursor: pointer !important;
        }

        /* Ensure navigation container is clickable */
        header.main-header nav {
          position: relative;
          z-index: 9999;
          pointerEvents: auto !important;
        }
        
        /* Specific hover effects */
        header.main-header button:hover,
        header.main-header a:hover {
          color: #C8A97E !important;
        }
      `}</style>
      
      <header 
        className={`fixed top-0 left-0 right-0 z-[100] main-header ${isScrolled ? 'scrolled' : ''}`} 
        style={{ 
          pointerEvents: 'auto', 
          zIndex: 9900,
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          width: '100%',
          height: 'var(--header-height-mobile)'
        }}
      >
        {/* Our custom sliding background */}
        <div className="sliding-header-bg"></div>
        
        {/* Header content */}
        <div className="container mx-auto header-content">
          <div className="flex items-center justify-between h-[var(--header-height-mobile)] md:h-[var(--header-height)]">
            <Link 
              href="/" 
              onClick={handleLogoClick}
              className="relative w-20 md:w-28 h-8 md:h-10 transition-all duration-300"
              style={{ 
                position: 'relative',
                zIndex: 99999,
                pointerEvents: 'auto',
                cursor: 'pointer',
                display: 'block'
              }}
            >
              <div 
                className="relative w-full h-full scale-110"
                style={{ 
                  position: 'relative',
                  zIndex: 99999,
                  pointerEvents: 'auto'
                }}
              >
                <Image
                  src={logoPath}
                  alt="Mel jazz"
                  fill
                  className="object-contain brightness-0 invert hover:opacity-80 transition-opacity"
                  priority
                  data-i18n="logo.alt"
                  style={{ 
                    pointerEvents: 'auto'
                  }}
                />
              </div>
            </Link>

            {/* Desktop Menu */}
            <nav 
              className="hidden md:flex items-center space-x-6 lg:space-x-8" 
              style={{ 
                position: 'relative',
                zIndex: 9999,
                pointerEvents: 'auto'
              }}
            >
              {links.map((link) => {
                // Extract the section ID
                const sectionId = link.href.includes('#') ? link.href.split('#')[1] : '';
                
                return (
                  <div 
                    key={link.label}
                    className="relative"
                    data-nav-item
                    data-href={link.href}
                    style={{
                      cursor: 'pointer',
                      position: 'relative',
                      zIndex: 9999,
                      padding: '12px 16px',
                      margin: '0',
                      backgroundColor: 'transparent'
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      
                      // Direct navigation for non-hash links
                      if (link.href.startsWith('/') && !link.href.includes('#')) {
                        router.push(link.href);
                        return;
                      }
                      
                      // Handle hash navigation
                      if (sectionId) {
                        scrollToElement(sectionId);
                      }
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();

                      // Direct navigation for non-hash links
                      if (link.href.startsWith('/') && !link.href.includes('#')) {
                        router.push(link.href);
                        return;
                      }
                      
                      // Handle hash navigation
                      if (sectionId) {
                        scrollToElement(sectionId);
                      }
                    }}
                  >
                    <span
                      className="text-sm font-medium tracking-wider uppercase text-white hover:text-[#C8A97E] transition-all duration-300 block"
                      style={{
                        position: 'relative',
                        zIndex: 9999,
                        pointerEvents: 'auto'
                      }}
                    >
                      {t(link.label)}
                    </span>
                  </div>
                );
              })}
              <LanguageSwitcher />
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="md:hidden text-white focus:outline-none p-2 mr-1 relative z-[9900] group ml-auto"
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
              className="md:hidden fixed inset-0 bg-black/75 mobile-menu-container"
              style={{ 
                zIndex: 9800,
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                overflowY: 'auto',
                overflowX: 'hidden',
                touchAction: 'none',
                backgroundImage: 'radial-gradient(circle at center, rgba(200, 169, 126, 0.1) 0%, transparent 70%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onAnimationStart={() => {
                document.body.classList.add('menu-open');
              }}
              onAnimationComplete={() => {
                if (!isOpen) {
                  document.body.classList.remove('menu-open');
                }
              }}
              id="mobile-navigation-menu"
            >
              <nav className="flex flex-col items-center justify-center w-full h-full">
                <div className="w-full max-w-xs space-y-6 -mt-20">
                  {links.map((link, index) => (
                    <motion.div
                      key={link.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="w-full"
                    >
                      <a
                        href={link.href}
                        onClick={(e) => handleMobileMenuItemClick(e, link.href)}
                        className="group text-xl font-medium tracking-wider uppercase text-white hover:text-[#C8A97E] transition-all duration-300 no-underline block py-4 text-center w-full"
                        data-i18n={link.label}
                      >
                        {t(link.label)}
                      </a>
                    </motion.div>
                  ))}
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: links.length * 0.1 }}
                  className="mt-8"
                >
                  <LanguageSwitcher />
                </motion.div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Emergency direct access buttons */}
        <div 
          className="fixed top-0 left-0 w-full" 
          style={{ 
            zIndex: 9999, 
            pointerEvents: 'none',
            height: '80px'
          }}
        >
          {/* We don't need the specific buttons anymore since we have the general overlay */}
          {/* They were causing the black boxes */}
        </div>
      </header>
    </>
  )
}
