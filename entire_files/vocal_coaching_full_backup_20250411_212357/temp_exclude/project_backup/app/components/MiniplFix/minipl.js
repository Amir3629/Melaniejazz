// Scrolling mini-player implementation

export function createScrollingMiniPlayer(container, title, isPlaying, onPlayPause) {
  // Only run in browser
  if (typeof window === 'undefined') return null;
  
  // Remove any existing mini-player
  const existingPlayer = document.getElementById('scrolling-minipl');
  if (existingPlayer) {
    existingPlayer.parentNode.removeChild(existingPlayer);
  }
  
  // Create container
  const miniPlayer = document.createElement('div');
  miniPlayer.id = 'scrolling-minipl';
  
  // Style container
  Object.assign(miniPlayer.style, {
    position: 'absolute',
    bottom: '80px',
    right: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between', 
    padding: '8px 12px 8px 16px',
    background: 'rgba(0, 0, 0, 0.9)',
    backdropFilter: 'blur(10px)',
    borderRadius: '9999px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(200, 169, 126, 0.3)',
    width: '180px',
    maxWidth: '85%',
    transition: 'opacity 0.3s ease',
    opacity: '0',
    zIndex: '50'
  });
  
  // Create title element
  const titleEl = document.createElement('div');
  titleEl.textContent = title;
  Object.assign(titleEl.style, {
    color: 'white',
    fontSize: '14px',
    fontWeight: '500',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    flexGrow: '1'
  });
  
  // Create button
  const button = document.createElement('button');
  Object.assign(button.style, {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: '#C8A97E',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    flexShrink: '0',
    border: 'none',
    outline: 'none'
  });
  
  // Set button icon
  button.innerHTML = isPlaying ? 
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>' :
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>';
  
  // Add click handler
  button.addEventListener('click', (e) => {
    e.stopPropagation();
    if (onPlayPause) onPlayPause();
  });
  
  // Assemble mini-player
  miniPlayer.appendChild(titleEl);
  miniPlayer.appendChild(button);
  
  // Append to container
  container.appendChild(miniPlayer);
  
  // Fade in
  setTimeout(() => {
    miniPlayer.style.opacity = '1';
  }, 10);
  
  return {
    element: miniPlayer,
    updatePlayState: (isPlaying) => {
      button.innerHTML = isPlaying ? 
        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>' :
        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>';
    },
    remove: () => {
      miniPlayer.style.opacity = '0';
      setTimeout(() => {
        if (miniPlayer.parentNode) {
          miniPlayer.parentNode.removeChild(miniPlayer);
        }
      }, 300);
    }
  };
} 