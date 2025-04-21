"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Play, Pause } from "lucide-react";
import { getAudioPath } from "@/app/utils/paths";
import "./direct-fix.css";

// Add event system for media coordination
const MEDIA_STOP_EVENT = 'stopAllMedia';

export default function EnhancedMusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showMiniPlayer, setShowMiniPlayer] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  
  // Add a test marker in the top right corner
  const [testMarker, setTestMarker] = useState('red');

  // Track details
  const track = {
    title: "Blues for John",
    artist: "Melvo Jazz",
    file: "/audio/AUDIO-2025-03-19-16-15-29",
    image: "/123.png"
  };

  // Create scrolling mini-player
  useEffect(() => {
    // Listen for stop events from other media players
    const handleMediaStop = () => {
      if (isPlaying) {
        setIsPlaying(false);
        if (audioRef.current) {
          audioRef.current.pause();
        }
      }
    };

    window.addEventListener(MEDIA_STOP_EVENT, handleMediaStop);
    return () => window.removeEventListener(MEDIA_STOP_EVENT, handleMediaStop);
  }, [isPlaying]);

  // Add scroll detection to show/hide mini player
  useEffect(() => {
    const handleScroll = () => {
      if (!isPlaying) {
        setShowMiniPlayer(false);
        return;
      }
      
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        
        // Show mini player only when scrolled away from music section
        const shouldShow = rect.bottom < 0 || rect.top > window.innerHeight;
        setShowMiniPlayer(shouldShow);
        
        // Update marker color based on mini-player visibility
        setTestMarker(shouldShow ? 'green' : 'orange');
      }
    };
    
    // Check immediately
    handleScroll();
    
    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Clean up
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isPlaying]);

  // Create audio element
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Create separate audio instance
    const audioEl = new Audio();
    audioEl.src = "/audio/AUDIO-2025-03-19-16-15-29.mp3";
    audioEl.volume = 1.0;
    audioEl.preload = "auto";
    
    // Directly set the ref
    if (audioRef && audioRef.current === null) {
      // @ts-ignore - we need to set this directly
      audioRef.current = audioEl;
    }
    
    // Add event listeners
    audioEl.addEventListener('ended', () => {
      setIsPlaying(false);
      setShowMiniPlayer(false);
    });
    
    audioEl.addEventListener('error', () => {
      setError("Failed to play audio. Please try again.");
      setIsPlaying(false);
      setIsLoading(false);
    });
    
    // Load the audio
    audioEl.load();
    
    return () => {
      // Clean up
      audioEl.pause();
      audioEl.removeEventListener('ended', () => {});
      audioEl.removeEventListener('error', () => {});
    };
  }, []);

  // Play/pause handler
  const handlePlay = () => {
    if (!audioRef.current) return;
    
    try {
      if (isPlaying) {
        // Pause the audio
        audioRef.current.pause();
        setIsPlaying(false);
        setShowMiniPlayer(false);
      } else {
        // Stop all other media
        window.dispatchEvent(new Event(MEDIA_STOP_EVENT));
        
        // Reset and play
        audioRef.current.currentTime = 0;
        
        const playPromise = audioRef.current.play();
        
        if (playPromise) {
          playPromise
            .then(() => {
              setIsPlaying(true);
            })
            .catch(err => {
              console.error("Failed to play audio:", err);
              setError("Failed to play audio. Please try again.");
            });
        }
      }
    } catch (err) {
      console.error("Exception in play handler:", err);
      setError("Failed to play audio. Please try again.");
    }
  };

  // Create scrolling mini-player with DOM
  useEffect(() => {
    // Only run in browser
    if (typeof window === 'undefined') return;
    
    const createScrollingMiniPlayer = () => {
      // Remove any existing mini-player
      const existingMiniPlayer = document.getElementById('scroll-mini-player');
      if (existingMiniPlayer) {
        existingMiniPlayer.parentNode?.removeChild(existingMiniPlayer);
      }
      
      // Create new mini-player
      const miniPlayer = document.createElement('div');
      miniPlayer.id = 'scroll-mini-player';
      
      // Style mini-player
      Object.assign(miniPlayer.style, {
        position: 'absolute',
        bottom: '80px',
        right: '20px',
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
        zIndex: '50',
        transition: 'opacity 0.3s ease',
        opacity: '0'
      });
      
      // Add title
      const title = document.createElement('div');
      title.textContent = track.title;
      Object.assign(title.style, {
        color: 'white',
        fontSize: '14px',
        fontWeight: '500',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        flexGrow: '1'
      });
      
      // Add pause button
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
      
      // Set pause icon
      button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>';
      
      // Add event listeners
      button.addEventListener('click', (e) => {
        e.stopPropagation();
        handlePlay();
      });
      
      miniPlayer.addEventListener('click', () => {
        if (sectionRef.current) {
          sectionRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      });
      
      // Assemble mini-player
      miniPlayer.appendChild(title);
      miniPlayer.appendChild(button);
      
      // Add to DOM
      const container = sectionRef.current?.parentNode || document.body;
      container.appendChild(miniPlayer);
      
      // Fade in
      setTimeout(() => {
        miniPlayer.style.opacity = '1';
      }, 10);
      
      return miniPlayer;
    };
    
    // Handle mini-player visibility
    if (isPlaying && showMiniPlayer) {
      // Create mini-player if not exists
      if (!document.getElementById('scroll-mini-player')) {
        createScrollingMiniPlayer();
      }
    } else {
      // Remove mini-player if exists
      const miniPlayer = document.getElementById('scroll-mini-player');
      if (miniPlayer) {
        miniPlayer.style.opacity = '0';
        setTimeout(() => {
          if (miniPlayer.parentNode) {
            miniPlayer.parentNode.removeChild(miniPlayer);
          }
        }, 300);
      }
    }
    
    // Clean up on unmount
    return () => {
      const miniPlayer = document.getElementById('scroll-mini-player');
      if (miniPlayer && miniPlayer.parentNode) {
        miniPlayer.parentNode.removeChild(miniPlayer);
      }
    };
  }, [isPlaying, showMiniPlayer, track.title]);

  return (
    <div className="relative w-full py-24 overflow-hidden" ref={sectionRef}>
      <div className="absolute inset-0 bg-black/95 backdrop-blur-xl z-0"></div>
      
      <div className="relative z-10 flex flex-col items-center">
        <h2 className="text-3xl font-bold text-white mb-6">Meine Musik</h2>
        <div className="w-16 h-1 bg-[#C8A97E] mb-12"></div>
        
        {/* Vinyl Disc */}
        <div style={{
          width: '260px',
          maxWidth: '80vw',
          margin: '0 auto',
          marginBottom: '1rem',
          position: 'relative'
        }}>
          <div style={{
            paddingTop: '100%',
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '50%'
          }}>
            <motion.div 
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                overflow: 'hidden',
                cursor: 'pointer',
                boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7)'
              }}
              onClick={handlePlay}
            >
              <div style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                overflow: 'hidden'
              }}>
                <motion.div 
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '50%',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  initial={false}
                  animate={{ 
                    rotate: isPlaying ? 360 : 0 
                  }}
                  transition={{ 
                    duration: 40, 
                    ease: "linear", 
                    repeat: isPlaying ? Infinity : 0,
                    repeatType: "loop"
                  }}
                >
                  <div 
                    className="disc-image-container"
                    style={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden'
                    }}
                  >
                    <Image 
                      src={track.image}
                      alt={track.title}
                      fill
                      sizes="(max-width: 768px) 80vw, 260px"
                      style={{ 
                        objectFit: 'cover', 
                        objectPosition: 'center',
                        transform: 'scale(1.2)'
                      }}
                      priority
                    />
                  </div>
                </motion.div>
                
                {/* Center play button */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  margin: 'auto',
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: 'black',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 5
                }}>
                  <motion.button
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: 'black',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handlePlay}
                  >
                    {isLoading ? (
                      <div 
                        style={{ 
                          width: '20px', 
                          height: '20px', 
                          borderRadius: '50%',
                          border: '2px solid #C8A97E',
                          borderTopColor: 'transparent',
                          animation: 'spin 1s linear infinite'
                        }}
                      ></div>
                    ) : isPlaying ? (
                      <Pause className="w-5 h-5 text-[#C8A97E]" />
                    ) : (
                      <Play className="w-6 h-6 text-[#C8A97E] ml-0.5" />
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Track title and artist */}
        <div className="text-center mt-8 mb-4">
          <h3 className="text-xl font-medium text-white mb-1">{track.title}</h3>
          <p className="text-sm text-[#C8A97E]">{track.artist}</p>
        </div>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="text-red-500 mt-4 text-center">
          {error}
        </div>
      )}
      
      {/* Test marker */}
      <div style={{ 
        position: 'absolute', 
        top: '10px', 
        right: '10px', 
        width: '10px', 
        height: '10px', 
        backgroundColor: testMarker, 
        borderRadius: '50%' 
      }}></div>
      
      {/* Animation keyframes */}
      <style jsx global>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
} 