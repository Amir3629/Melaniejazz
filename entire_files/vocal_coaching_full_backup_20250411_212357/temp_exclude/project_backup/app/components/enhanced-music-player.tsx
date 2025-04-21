"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Play, Pause } from "lucide-react";
import { getAudioPath } from "@/app/utils/paths";
import "./direct-fix.css";
import { useMedia } from "./media-context";

// Add event system for media coordination
const MEDIA_STOP_EVENT = 'stopAllMedia';

export default function EnhancedMusicPlayer() {
  const { currentlyPlaying, setCurrentlyPlaying, stopAllMedia } = useMedia();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showMiniPlayer, setShowMiniPlayer] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  
  // Add a test marker in the top right corner
  const [testMarker, setTestMarker] = useState('blue');

  // Track details
  const track = {
    title: "Blues for John",
    artist: "Melvo Jazz",
    file: "/audio/AUDIO-2025-03-19-16-15-29",
    image: "/123.png"
  };

  // Listen for global stop events
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
    
    // Listen for media context changes
    if (currentlyPlaying === 'video' && isPlaying) {
      setIsPlaying(false);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }
    
    return () => window.removeEventListener(MEDIA_STOP_EVENT, handleMediaStop);
  }, [isPlaying, currentlyPlaying]);

  // Handle mini-player visibility
  useEffect(() => {
    // Only run in browser
    if (typeof window === 'undefined') return;
    
    let animationFrameId: number | null = null;
    let isAnimatingOut = false;
    
    const handleScroll = () => {
      if (!isPlaying) {
        setShowMiniPlayer(false);
        return;
      }
      
      // Always check if music section is in viewport
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        
        // Show mini player when scrolled past half of the music section
        const shouldShow = rect.top < -300;
        
        // If we're already animating out, don't interrupt
        if (isAnimatingOut) return;
        
        if (shouldShow !== showMiniPlayer) {
          // If hiding, start smooth exit animation
          if (showMiniPlayer && !shouldShow) {
            const minibar = document.getElementById('fixed-fallback-minibar');
            if (minibar) {
              // Set flag to prevent interruption
              isAnimatingOut = true;
              
              // Smoother animation with JS for more consistent exit
              const duration = 600; // ms - slightly faster for better responsiveness
              const startTime = performance.now();
              
              // Prevent clicks during animation
              minibar.style.pointerEvents = 'none';
              
              const animateExit = (currentTime: number) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Use cubic ease-out curve for natural motion
                const easeValue = 1 - Math.pow(1 - progress, 3);
                
                // Apply transition
                minibar.style.opacity = `${1 - easeValue}`;
                minibar.style.transform = `translate(-50%, ${easeValue * 20}px)`;
                
                if (progress < 1) {
                  // Continue animation with high priority
                  animationFrameId = requestAnimationFrame(animateExit);
                } else {
                  // Animation complete
                  setShowMiniPlayer(false);
                  isAnimatingOut = false;
                  animationFrameId = null;
                }
              };
              
              // Start animation with high priority
              animationFrameId = requestAnimationFrame(animateExit);
            } else {
              setShowMiniPlayer(false);
            }
          } else {
            setShowMiniPlayer(shouldShow);
          }
          
          // Update marker color
          setTestMarker(shouldShow ? 'green' : 'orange');
        }
      }
    };
    
    // Throttled scroll handler for better performance
    let ticking = false;
    const scrollListener = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };
    
    // Run immediately
    handleScroll();
    
    // Add optimized scroll event listener
    window.addEventListener('scroll', scrollListener, { passive: true });
    
    // Clean up
    return () => {
      window.removeEventListener('scroll', scrollListener);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isPlaying, showMiniPlayer]);

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

  // Audio-Video coordination
  useEffect(() => {
    // If the current playing media type changes to video, pause our audio
    if (currentlyPlaying === 'video' && isPlaying) {
    if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
        setShowMiniPlayer(false);
      }
    }
  }, [currentlyPlaying, isPlaying]);

  // Play/pause handler
  const handlePlay = () => {
    if (!audioRef.current) return;
    
    try {
      if (isPlaying) {
        // Pause the audio
        audioRef.current.pause();
        setCurrentlyPlaying(null);
        
        // Add consistent exit animation for the minibar
        const minibar = document.getElementById('fixed-fallback-minibar');
        if (minibar) {
          // Smooth animation with consistent timing
          const duration = 600; // ms - match scroll handler duration
          const startTime = performance.now();
          let animationFrameId: number | null = null;
          
          // Prevent clicks during animation
          minibar.style.pointerEvents = 'none';
          
          const animateExit = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Use cubic ease-out curve for natural motion
            const easeValue = 1 - Math.pow(1 - progress, 3);
            
            // Apply transition
            minibar.style.opacity = `${1 - easeValue}`;
            minibar.style.transform = `translate(-50%, ${easeValue * 20}px)`;
            
            if (progress < 1) {
              // Continue animation with high priority
              animationFrameId = requestAnimationFrame(animateExit);
            } else {
              // Animation complete
        setIsPlaying(false);
        setShowMiniPlayer(false);
              if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
                animationFrameId = null;
              }
            }
          };
          
          // Start animation with high priority
          animationFrameId = requestAnimationFrame(animateExit);
      } else {
          setIsPlaying(false);
          setShowMiniPlayer(false);
        }
      } else {
        // Stop all other media through the context
        stopAllMedia();
        
        // Update media context
        setCurrentlyPlaying('music');
        
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

  return (
    <div className="relative w-full py-24 overflow-hidden music-section clearfix" ref={sectionRef}>
      <div className="absolute inset-0 bg-black/95 backdrop-blur-xl z-0"></div>
      
      <div className="relative z-10 flex flex-col items-center">
        <h2 className="text-3xl font-bold text-white mb-6" id="meine-musik-header">Meine Musik</h2>
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
                  {/* Vinyl record styling - much darker and more visible rings */}
                  <div style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle at center, rgba(0,0,0,0.7) 18%, rgba(150,150,150,0.7) 18.5%, rgba(95,95,95,0.65) 19%, rgba(30,30,30,0.7) 19.5%, rgba(30,30,30,0.7) 27%, rgba(150,150,150,0.7) 27.5%, rgba(95,95,95,0.65) 28%, rgba(30,30,30,0.7) 28.5%, rgba(30,30,30,0.7) 37%, rgba(150,150,150,0.7) 37.5%, rgba(95,95,95,0.65) 38%, rgba(30,30,30,0.7) 38.5%, rgba(30,30,30,0.7) 47%, rgba(150,150,150,0.7) 47.5%, rgba(95,95,95,0.65) 48%, rgba(30,30,30,0.7) 48.5%, rgba(30,30,30,0.7) 57%, rgba(150,150,150,0.7) 57.5%, rgba(95,95,95,0.65) 58%, rgba(30,30,30,0.7) 58.5%, rgba(30,30,30,0.7) 67%, rgba(150,150,150,0.7) 67.5%, rgba(95,95,95,0.65) 68%, rgba(30,30,30,0.7) 68.5%), linear-gradient(135deg, rgba(30,30,30,0.8) 0%, rgba(15,15,15,0.9) 100%)',
                    zIndex: 2,
                    opacity: 1,
                    mixBlendMode: 'soft-light'
                  }}></div>
                  
                  {/* Center hole - more prominent */}
                  <div style={{
                    position: 'absolute',
                    width: '18%',
                    height: '18%',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle at center, #000 40%, #222)',
                    border: '2px solid rgba(120,120,120,0.8)',
                    zIndex: 3,
                    boxShadow: 'inset 0 0 5px rgba(0,0,0,0.8)'
                  }}></div>
                
                  {/* Darken the image slightly to make rings more visible */}
                  <div style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    background: 'rgba(0,0,0,0.32)',
                    zIndex: 2
                  }}></div>
                
                <Image 
                  src={track.image}
                  alt={track.title}
                  fill
                  sizes="(max-width: 768px) 80vw, 260px"
                  style={{ 
                    objectFit: 'cover', 
                    objectPosition: 'center',
                    transform: 'scale(1.2)',
                    zIndex: 1,
                    mixBlendMode: 'lighten'
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
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {/* Matching pause icon style for consistency */}
                        <div style={{ 
                          display: 'flex', 
                          width: '14px', 
                          justifyContent: 'space-between' 
                        }}>
                          <div style={{ 
                            width: '5px', 
                            height: '16px', 
                            backgroundColor: '#C8A97E', 
                            borderRadius: '1px' 
                          }}></div>
                          <div style={{ 
                            width: '5px', 
                            height: '16px', 
                            backgroundColor: '#C8A97E', 
                            borderRadius: '1px' 
                          }}></div>
                        </div>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {/* Solid shape play icon */}
                        <div style={{ 
                          width: 0,
                          height: 0,
                          borderTop: '9px solid transparent',
                          borderLeft: '16px solid #C8A97E',
                          borderBottom: '9px solid transparent',
                          marginLeft: '3px'
                        }}></div>
                      </div>
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
        
      {/* Fixed fallback minibar - redesigned for better mobile appearance */}
      {isPlaying && showMiniPlayer && (
          <div 
          id="fixed-fallback-minibar"
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 bg-black/95 rounded-full shadow-lg"
            style={{ 
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(200, 169, 126, 0.2)',
              maxWidth: '90%',
            width: 'auto',
            minWidth: '180px',
            animation: 'fadeInMiniPlayer 0.4s ease-out',
            transition: 'opacity 0.3s ease, transform 0.3s ease',
            isolation: 'isolate',
            contain: 'layout style paint',
              backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            willChange: 'transform, opacity',
            transform: 'translate3d(-50%, 0, 0)',
            zIndex: 9900
          }}
          onClick={() => sectionRef.current?.scrollIntoView({ behavior: 'smooth' })}
        >
          <div className="flex-1 text-white text-sm font-medium truncate">{track.title}</div>
          <button
            className="w-9 h-9 rounded-full bg-[#C8A97E] flex items-center justify-center shrink-0"
            style={{
              transition: 'transform 0.2s ease',
              boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            onClick={(e) => {
              e.stopPropagation();
              handlePlay();
            }}
          >
            {/* Mobile-optimized pause icon with absolute positioning */}
            <div style={{ 
              position: 'relative',
              width: '18px',
              height: '14px'
            }}>
              <div style={{ 
                position: 'absolute',
                left: '2px',
                width: '5px',
                height: '14px', 
                backgroundColor: 'black', 
                borderRadius: '1px'
              }}></div>
              <div style={{ 
                position: 'absolute',
                right: '2px',
                width: '5px',
                height: '14px', 
                backgroundColor: 'black', 
                borderRadius: '1px'
              }}></div>
            </div>
            </button>
          </div>
        )}
      
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
        width: '12px', 
        height: '12px', 
        backgroundColor: testMarker,
        border: '2px solid white',
        borderRadius: '50%',
        zIndex: 9999
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