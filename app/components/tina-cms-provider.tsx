'use client'

import { TinaProvider, TinaCMS } from 'tinacms'
import { useMemo } from 'react'
import getConfig from 'next/config'

export function TinaCMSProvider({ children }: { children: React.ReactNode }) {
  const { publicRuntimeConfig } = getConfig() || { publicRuntimeConfig: { basePath: '' } }
  const basePath = publicRuntimeConfig?.basePath || ''

  const cms = useMemo(() => {
    // Create a simple CMS instance with just the required props
    return new TinaCMS({
      clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID || '391cdcc3-31b1-4b98-893b-f505de0faf7d',
      enabled: true,
    });
  }, [basePath]);

  // These fetch functions need the basePath but we'll use them directly
  const loadMediaFile = async (id: string) => {
    const fileData = await fetch(`${basePath}/api/media?id=${id}`).then((res) => res.json())
    return fileData
  };

  const uploadMediaFile = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    const response = await fetch(`${basePath}/api/media`, {
      method: 'POST',
      body: formData,
    }).then((res) => res.json())
    return response
  };

  return <TinaProvider cms={cms}>{children}</TinaProvider>
} 