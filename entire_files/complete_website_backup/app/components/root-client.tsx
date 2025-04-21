"use client"

import React from 'react'
import ClientProvider from './client-provider'
import Footer from './footer'
import CookieConsent from './cookie-consent'

export default function RootClient({
  children,
  className,
}: {
  children: React.ReactNode
  className: string
}) {
  return (
    <ClientProvider>
      <div 
        className={className} 
        style={{ 
          margin: 0,
          padding: 0,
          width: '100vw',
          maxWidth: '100vw',
          overflowX: 'hidden',
          boxSizing: 'border-box',
          position: 'relative'
        }}
      >
        {children}
        <Footer />
        <CookieConsent />
      </div>
    </ClientProvider>
  )
} 