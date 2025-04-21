export const isMobileDevice = () => {
  if (typeof window === 'undefined') return false;
  
  // Check screen width
  const isMobileWidth = window.innerWidth <= 768;
  
  // Check user agent for mobile devices
  const isMobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
  
  return isMobileWidth || isMobileUserAgent;
};

export const redirectToMobile = () => {
  if (typeof window === 'undefined') return;
  
  if (isMobileDevice()) {
    const currentPath = window.location.pathname;
    if (!currentPath.startsWith('/mobile')) {
      window.location.href = `/mobile${currentPath}`;
    }
  }
};

export const redirectToDesktop = () => {
  if (typeof window === 'undefined') return;
  
  const currentPath = window.location.pathname;
  if (currentPath.startsWith('/mobile')) {
    window.location.href = currentPath.replace('/mobile', '');
  }
};

// Hook to handle orientation changes
export const handleOrientationChange = (callback: () => void) => {
  if (typeof window === 'undefined') return;
  
  window.addEventListener('orientationchange', () => {
    // Wait for the orientation change to complete
    setTimeout(callback, 100);
  });
  
  return () => {
    window.removeEventListener('orientationchange', callback);
  };
}; 