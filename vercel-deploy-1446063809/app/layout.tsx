import type React from "react"
import "./globals.css"
import "./styles/responsive.css"
import "./styles/typography.css"
import "./styles/theme.css"
import "./styles/navigation-fix.css"
import "./styles/scrollbar.css"
import "./styles/mobile-fixes.css"
import "./styles/fix.css"
import "./styles/footer-fixes.css"
import "./styles/booking-fixes.css"
import "./styles/legal-modal-fixes.css"
import "./styles/contact-fixes.css"
import "./styles/footer-menu-fix.css"
import type { Metadata, Viewport } from "next"
import { Inter, Playfair_Display, Cormorant_Garamond, Montserrat, Roboto } from "next/font/google"
import RootClient from "./components/root-client"
import { MediaProvider } from "./components/media-context"
import { getImagePath } from './utils/image-path'
import HtmlMeta from "./components/html-meta"
import DebugHelper from './components/debug-helper'

// Optimize font loading with display swap
const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  preload: true,
})
const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
  weight: ['400', '700'],
  preload: true,
})
const roboto = Roboto({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
  weight: ['300', '400', '500', '700'],
  preload: true,
})
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-cormorant',
  weight: ['300', '400', '500', '600', '700'],
  preload: true,
})
const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat',
  weight: ['300', '400', '500', '600', '700'],
  preload: true,
})

// Fix viewport to allow scaling for accessibility
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export const metadata: Metadata = {
  title: "Mel jazz - Vocal Coaching in Berlin",
  description: "Professional vocal coaching and performance in Berlin",
  icons: {
    icon: [
      { url: getImagePath('/favicon.ico') },
      { url: getImagePath('/images/logo/ml-logo.PNG'), type: 'image/png', sizes: '64x64' }
    ],
    shortcut: { url: getImagePath('/images/logo/ml-logo.PNG'), sizes: '196x196' },
    apple: { url: getImagePath('/images/logo/ml-logo.PNG'), sizes: '180x180' },
    other: []
  },
  // manifest: getImagePath('/favicon/site.webmanifest'),
  // Add language metadata
  metadataBase: new URL('https://meljazz.com'),
  alternates: {
    canonical: '/',
    languages: {
      'en': '/en',
      'de': '/de',
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${cormorant.variable} ${montserrat.variable} ${roboto.variable} scroll-smooth`}>
      <head>
        {/* Preconnect to domains for faster resource loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Preload critical resources */}
        <link rel="preload" href={getImagePath('/backgrounds/hero-bg.jpg')} as="image" />
        
        <link 
          rel="icon" 
          href={getImagePath('/images/logo/ml-logo.PNG')} 
          sizes="64x64" 
          type="image/png" 
        />
        <link 
          rel="apple-touch-icon" 
          href={getImagePath('/images/logo/ml-logo.PNG')} 
          sizes="180x180" 
        />
        
        {/* Fix to handle overflow without direct style manipulation */}
        <style dangerouslySetInnerHTML={{
          __html: `
            html, body {
              overflow-x: hidden !important;
              width: 100vw;
              max-width: 100vw;
            }
            
            /* Optimize CSS rendering */
            img, svg {
              content-visibility: auto;
            }
            
            /* Add minimal CSS for LCP */
            .text-4xl {
              font-size: 2.25rem;
              line-height: 2.5rem;
              font-weight: 300;
            }
            
            @media (min-width: 768px) {
              .md\\:text-6xl {
                font-size: 3.75rem;
                line-height: 1;
              }
            }
            
            .text-white {
              color: #fff;
            }
            
            .font-light {
              font-weight: 300;
            }
            
            .drop-shadow-lg {
              filter: drop-shadow(0 10px 8px rgb(0 0 0 / 0.04)) drop-shadow(0 4px 3px rgb(0 0 0 / 0.1));
            }
            
            .font-playfair {
              font-family: var(--font-playfair);
            }
          `
        }} />
      </head>
      <body suppressHydrationWarning={true} style={{
        margin: 0,
        padding: 0,
        overflowX: 'hidden',
        width: '100vw',
        maxWidth: '100vw'
      }}>
        <MediaProvider>
          <RootClient className={`dark-theme-black ${playfair.variable} ${cormorant.variable} ${montserrat.variable} ${roboto.variable} ${inter.className} antialiased`}>
            <HtmlMeta />
            {children}
            <DebugHelper />
          </RootClient>
        </MediaProvider>
      </body>
    </html>
  )
}