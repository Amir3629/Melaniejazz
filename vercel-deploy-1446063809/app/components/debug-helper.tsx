'use client';

import { useEffect, useState } from 'react';
import { debugImagePath } from '../../utils/image-path';

export default function DebugHelper() {
  const [isDebugMode, setIsDebugMode] = useState(false);
  const [pathInfo, setPathInfo] = useState<Record<string, any>>({});
  
  useEffect(() => {
    // Check for debug parameter in URL
    const urlParams = new URLSearchParams(window.location.search);
    const debug = urlParams.get('debug') === 'true';
    
    // Set debug mode in localStorage for other components
    if (debug) {
      localStorage.setItem('debug', 'true');
    }
    
    setIsDebugMode(debug);
    
    // Collect environment information
    if (debug) {
      // Run debug function
      debugImagePath();
      
      // Collect path information
      setPathInfo({
        hostname: window.location.hostname,
        pathname: window.location.pathname,
        isVercel: window.location.hostname.includes('vercel.app'),
        baseUrl: window.location.origin,
        href: window.location.href,
        userAgent: navigator.userAgent,
      });
    }
  }, []);
  
  if (!isDebugMode) return null;
  
  return (
    <div 
      style={{
        position: 'fixed',
        bottom: '10px',
        right: '10px',
        backgroundColor: 'rgba(0,0,0,0.8)',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        zIndex: 10000,
        maxWidth: '300px',
        fontSize: '12px',
        fontFamily: 'monospace',
      }}
    >
      <h4 style={{ margin: '0 0 8px 0' }}>Debug Info</h4>
      <pre style={{ margin: 0, maxHeight: '200px', overflow: 'auto' }}>
        {JSON.stringify(pathInfo, null, 2)}
      </pre>
      <button 
        onClick={() => {
          // Test loading an image
          const img = new Image();
          img.onload = () => console.log('Image loaded successfully');
          img.onerror = (e) => console.error('Image load error', e);
          img.src = '/images/logo/ml-logo.PNG';
        }}
        style={{
          marginTop: '8px',
          padding: '4px 8px',
          backgroundColor: '#0070f3',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Test Image Load
      </button>
    </div>
  );
} 