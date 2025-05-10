'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminClient() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Script to inject Tina CMS directly via their CDN
    const loadTinaCDN = () => {
      try {
        // Create the script element for Tina
        const script = document.createElement('script')
        script.src = 'https://cdn.tina.io/tina-admin.js'
        script.async = true
        script.defer = true
        script.onload = () => {
          // Initialize Tina once the script is loaded
          const config = {
            clientId: '391cdcc3-31b1-4b98-893b-f505de0faf7d',
            branch: 'main',
            tinaGraphQLVersion: 'latest',
          }
          
          // @ts-ignore - window.tina will be defined by the CDN script
          window.tina?.init(config)
          setIsLoading(false)
        }
        
        script.onerror = () => {
          setError('Failed to load Tina CMS from CDN. Please try again later.')
          setIsLoading(false)
        }
        
        // Add the script to the document
        document.head.appendChild(script)
        
        // Apply necessary styles
        const style = document.createElement('style')
        style.textContent = `
          body, html {
            margin: 0;
            padding: 0;
            height: 100vh;
            width: 100vw;
            overflow: hidden;
          }
          
          #__next {
            height: 100vh;
            width: 100vw;
          }
          
          #tina-root {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            width: 100vw;
            height: 100vh;
            z-index: 9999;
          }
        `
        document.head.appendChild(style)
        
        // Create a div for Tina to render into
        const tinaRoot = document.createElement('div')
        tinaRoot.id = 'tina-root'
        document.body.appendChild(tinaRoot)
        
        return () => {
          // Clean up on unmount
          if (script.parentNode) script.parentNode.removeChild(script)
          if (style.parentNode) style.parentNode.removeChild(style)
          if (tinaRoot.parentNode) tinaRoot.parentNode.removeChild(tinaRoot)
        }
      } catch (err) {
        console.error('Error initializing Tina:', err)
        setError('An error occurred while setting up Tina CMS.')
        setIsLoading(false)
        return () => {}
      }
    }
    
    // Load Tina
    const cleanup = loadTinaCDN()
    
    return cleanup
  }, [])

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
        <div className="max-w-md mx-auto text-center bg-red-900/30 border border-red-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-red-300">Something went wrong</h2>
          <p className="mb-6 text-gray-300">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-800 hover:bg-red-700 rounded transition-colors"
          >
            Try Again
          </button>
          <button 
            onClick={() => router.push('/')}
            className="px-4 py-2 ml-2 bg-gray-800 hover:bg-gray-700 rounded transition-colors"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C8A97E] mb-4"></div>
        <p className="text-lg">Loading Tina CMS...</p>
      </div>
    )
  }

  // Return an empty div as Tina will render into #tina-root
  return null
} 