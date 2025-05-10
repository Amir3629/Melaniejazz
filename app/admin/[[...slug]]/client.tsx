'use client'

import { useEffect, useState } from 'react'
import getConfig from 'next/config'
import { TinaAdmin } from 'tinacms'

export default function AdminPageClient() {
  const [isMounted, setIsMounted] = useState(false)
  const { publicRuntimeConfig } = getConfig() || { publicRuntimeConfig: { basePath: '' } }
  const basePath = publicRuntimeConfig?.basePath || ''

  useEffect(() => {
    setIsMounted(true)
    
    // Create a meta tag to help Tina find the correct base path
    const meta = document.createElement('meta')
    meta.name = 'tinacms-site-base-path'
    meta.content = basePath
    document.head.appendChild(meta)
  }, [basePath])

  if (!isMounted) return null

  return (
    <div className="tina-admin-container" style={{ height: '100vh' }}>
      <TinaAdmin config={{}} />
    </div>
  )
} 