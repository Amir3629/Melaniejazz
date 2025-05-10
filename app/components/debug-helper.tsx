'use client'

import React from 'react'

/**
 * Debug helper component for development
 */
export default function DebugHelper() {
  // Only show in development mode
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-75 text-white text-xs p-2 rounded z-50">
      <p>Debug Mode</p>
    </div>
  )
} 