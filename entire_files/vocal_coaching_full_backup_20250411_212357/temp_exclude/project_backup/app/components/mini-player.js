// Mini player implementation that creates a player that scrolls with the page
// This bypasses React entirely for greater reliability

let miniPlayerInstance = null;

// Create or update the mini player
export function updateMiniPlayer({ 
  isPlaying, 
  shouldShow, 
  title, 
  handlePlay, 
  scrollToSection,
  onCreated,
  onRemoved 
}) {
  // Only run on the client
  if (typeof window === 'undefined') return;
  
  // Get or create mini-player element
  let miniPlayer = document.getElementById('fixed-mini-player');
  
  if (isPlaying && shouldShow) {
    if (miniPlayer) {
      // Update existing player button
      const button = miniPlayer.querySelector('button');
      if (button) {
        // Update icon based on playing state
        button.innerHTML = isPlaying 
          ? '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>'
          : '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>';
        
        // Make sure it's visible
        miniPlayer.style.opacity = '1';
      }
    } else {
      // Create if doesn't exist
      miniPlayer = document.createElement('div');
      miniPlayer.id = 'fixed-mini-player';
      
      // Style it - but position:absolute instead of fixed, so it scrolls with the page
      Object.assign(miniPlayer.style, {
        position: 'absolute',  // Changed from 'fixed' to 'absolute'
        bottom: '24px',
        right: '24px',
        zIndex: '9999',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '8px',
        width: '180px',
        maxWidth: '85%',
        padding: '8px 16px 8px 12px',
        background: 'rgba(0, 0, 0, 0.9)',
        backdropFilter: 'blur(10px)',
        borderRadius: '9999px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(200, 169, 126, 0.3)',
        transition: 'opacity 0.3s ease',
        opacity: '0' // Start hidden for fade-in
      });
      
      // Add title
      const titleElement = document.createElement('div');
      titleElement.textContent = title;
      Object.assign(titleElement.style, {
        color: 'white',
        fontSize: '14px',
        fontWeight: '500',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        flexGrow: '1'
      });
      
      // Add button
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
      
      // Add SVG icon based on state
      button.innerHTML = isPlaying 
        ? '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>'
        : '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>';
      
      // Add event listeners
      button.addEventListener('click', (e) => {
        e.stopPropagation();
        if (handlePlay) handlePlay();
      });
      
      miniPlayer.addEventListener('click', () => {
        if (scrollToSection) scrollToSection();
      });
      
      // Append elements
      miniPlayer.appendChild(titleElement);
      miniPlayer.appendChild(button);
      
      // Add to DOM - to the footer element if exists, or main element, so it scrolls with page
      const targetContainer = document.querySelector('footer') || document.querySelector('main') || document.body;
      targetContainer.appendChild(miniPlayer);
      
      // Fade in
      setTimeout(() => {
        if (miniPlayer) miniPlayer.style.opacity = '1';
      }, 10);
      
      // Save reference
      miniPlayerInstance = miniPlayer;
      
      // Callback
      if (onCreated) onCreated();

      // Add console message for debugging
      console.log("Mini-player created and added to page");
    }
  } else {
    // Remove if it exists
    if (miniPlayer) {
      // Fade out
      miniPlayer.style.opacity = '0';
      
      // Then remove
      setTimeout(() => {
        if (miniPlayer && miniPlayer.parentNode) {
          miniPlayer.parentNode.removeChild(miniPlayer);
          miniPlayerInstance = null;
          
          // Callback
          if (onRemoved) onRemoved();
          
          // Add console message for debugging
          console.log("Mini-player removed from page");
        }
      }, 300);
    }
  }
}

// Remove mini player
export function removeMiniPlayer() {
  const miniPlayer = document.getElementById('fixed-mini-player');
  if (miniPlayer && miniPlayer.parentNode) {
    miniPlayer.parentNode.removeChild(miniPlayer);
    miniPlayerInstance = null;
  }
} 