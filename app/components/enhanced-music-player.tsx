"use client";

import { useState, useRef, useEffect } from "react";
import React from 'react'
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Play, Pause } from "lucide-react";
import { getAudioPath } from "@/app/utils/paths";
import "./direct-fix.css";
import { useMedia } from "./media-context";
import { useTranslation } from 'react-i18next';
// import getConfig from 'next/config';

// Add event system for media coordination
const MEDIA_STOP_EVENT = 'stopAllMedia';

// Get the basePath from runtime config
// const { publicRuntimeConfig } = getConfig() || { publicRuntimeConfig: { basePath: '' } };
// const basePath = publicRuntimeConfig.basePath || '';

const EnhancedMusicPlayer = () => {
  const { currentlyPlaying, setCurrentlyPlaying, stopAllMedia } = useMedia();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showMiniPlayer, setShowMiniPlayer] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { t } = useTranslation();
  
  // --- DEBUG STATE ---
  const [debugDot1Color, setDebugDot1Color] = useState("red"); // isPlaying
  const [debugDot2Color, setDebugDot2Color] = useState("red"); // shouldShow based on scroll
  const [debugDot3Color, setDebugDot3Color] = useState("red"); // showMiniPlayer state
  // --- END DEBUG STATE ---
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  
  // --- CONSOLE LOG --- //
  console.log(`EnhancedMusicPlayer Render - isPlaying: ${isPlaying}, showMiniPlayer: ${showMiniPlayer}`);

  // Track details (Explicitly prefix paths)
  const track = {
    title: "Blues for John",
    artist: "Melvo Jazz",
    image: `/JazzBerlin/123.PNG` // Explicit prefix
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
      // --- DEBUG ---
      setDebugDot1Color("red");
      // --- END DEBUG ---
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }
    
    return () => window.removeEventListener(MEDIA_STOP_EVENT, handleMediaStop);
  }, [isPlaying, currentlyPlaying]);

  // Handle mini-player visibility (Simplified state setting)
  useEffect(() => {
    console.log("Mini-player visibility Effect RUNS"); // --- CONSOLE LOG --- //
    // --- DEBUG ---
    setDebugDot1Color(isPlaying ? "lime" : "red");
    setDebugDot3Color(showMiniPlayer ? "lime" : "red");
    // --- END DEBUG ---
    if (typeof window === 'undefined') return;
    
    const handleScroll = () => {
      if (!sectionRef.current) return; // Check if sectionRef is available

      const rect = sectionRef.current.getBoundingClientRect();
      // Show when the top of the section is scrolled way above the viewport
      const shouldShowCondition = rect.top < -300; 
      // --- DEBUG ---
      setDebugDot2Color(shouldShowCondition ? "lime" : "red");
      // --- END DEBUG ---

      // --- CONSOLE LOG --- //
      console.log(`handleScroll - isPlaying: ${isPlaying}, current showMiniPlayer: ${showMiniPlayer}, shouldShow: ${shouldShowCondition}, rect.top: ${rect.top}`);
      
      if (!isPlaying) {
        // If not playing or section isn't mounted, ensure mini player is hidden
        if(showMiniPlayer) {
           console.log("Setting showMiniPlayer to FALSE (not playing)"); // --- CONSOLE LOG --- //
        setShowMiniPlayer(false);
           // --- DEBUG ---
           setDebugDot3Color("red");
           // --- END DEBUG ---
        }
        return;
      }
      
      // Only update state if it changes
      if (shouldShowCondition !== showMiniPlayer) {
        console.log(`Setting showMiniPlayer to: ${shouldShowCondition}`); // --- CONSOLE LOG --- //
        setShowMiniPlayer(shouldShowCondition);
        // --- DEBUG ---
        setDebugDot3Color(shouldShowCondition ? "lime" : "red");
        // --- END DEBUG ---
                }
              };
              
    // Optimization: Throttle scroll handler
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
    
    // Run immediately and add listener
    handleScroll();
    window.addEventListener('scroll', scrollListener, { passive: true });
    
    // Clean up
    return () => {
      console.log("Mini-player visibility Effect CLEANUP"); // --- CONSOLE LOG --- //
      window.removeEventListener('scroll', scrollListener);
    };
  // Dependencies now only include isPlaying and showMiniPlayer to re-evaluate if state needs changing
  }, [isPlaying, showMiniPlayer]);

  // Create audio element and set source with explicit prefix
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const audioEl = new Audio();
    audioEl.src = `/JazzBerlin/audio/AUDIO-2025-03-19-16-15-29.mp3`; // Explicit prefix
    audioEl.volume = 1.0;
    audioEl.preload = "auto";
    
    if (audioRef && audioRef.current === null) {
      // @ts-ignore
      audioRef.current = audioEl;
    }
    
    const endedHandler = () => {
      setIsPlaying(false);
      setShowMiniPlayer(false);
      // --- DEBUG ---
      setDebugDot1Color("red");
      setDebugDot3Color("red");
      // --- END DEBUG ---
    };
    const errorHandler = (e: Event | string) => {
      console.error("Audio Error:", e);
      setError("Failed to load or play audio."); 
      setIsPlaying(false);
      setIsLoading(false);
      // --- DEBUG ---
      setDebugDot1Color("red");
      // --- END DEBUG ---
    };

    audioEl.addEventListener('ended', endedHandler);
    audioEl.addEventListener('error', errorHandler);
    
    const canPlayHandler = () => console.log("Audio can play through.");
    audioEl.addEventListener('canplaythrough', canPlayHandler);

    audioEl.load();
    
    return () => {
      audioEl.pause();
      audioEl.removeEventListener('ended', endedHandler);
      audioEl.removeEventListener('error', errorHandler);
      audioEl.removeEventListener('canplaythrough', canPlayHandler);
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
        // --- DEBUG ---
        setDebugDot1Color("red");
        setDebugDot3Color("red");
        // --- END DEBUG ---
      }
    }
  }, [currentlyPlaying, isPlaying]);

  // Play/pause handler
  const handlePlay = () => {
    console.log("handlePlay called"); // --- CONSOLE LOG --- //
    if (!audioRef.current) return;
    
      if (isPlaying) {
      console.log("Pausing audio"); // --- CONSOLE LOG --- //
        audioRef.current.pause();
        setIsPlaying(false);
      setShowMiniPlayer(false); // Ensure mini player hides on manual pause
      // --- DEBUG ---
      setDebugDot1Color("red");
      setDebugDot3Color("red");
      // --- END DEBUG ---
      } else {
      console.log("Playing audio"); // --- CONSOLE LOG --- //
        stopAllMedia();
        setCurrentlyPlaying('music');
        
          const playPromise = audioRef.current.play();
          
        if (playPromise) {
            playPromise
              .then(() => {
            console.log("Audio play promise resolved"); // --- CONSOLE LOG --- //
                setIsPlaying(true);
            // --- DEBUG ---
            setDebugDot1Color("lime");
            // --- END DEBUG ---
              })
              .catch(err => {
          console.error("Failed to play audio:", err);
                setError("Failed to play audio. Please try again.");
            setIsPlaying(false); 
            // --- DEBUG ---
            setDebugDot1Color("red");
            // --- END DEBUG ---
          });
      } else {
        // If play() doesn't return a promise (older browsers?)
        setIsPlaying(true);
        // --- DEBUG ---
        setDebugDot1Color("lime");
        // --- END DEBUG ---
      }
    }
  };

  return (
    <div className="relative w-full py-24 overflow-hidden music-section clearfix" ref={sectionRef}>
      {/* --- CONSOLE LOG --- */} 
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
                  ref={imageRef}
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
                  onLoad={() => setImageLoaded(true)}
                  onError={(e) => {
                    console.error('Image failed to load:', track.image, e);
                    setError("Disc image failed to load.");
                  }}
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
        
      {/* Mini Player with AnimatePresence */}
      <AnimatePresence>
      {isPlaying && showMiniPlayer && (
            <motion.div 
              id="fixed-fallback-minibar" // Keep ID if needed, though direct manipulation is removed
              className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center justify-between gap-1 px-2 py-1 bg-black/95 rounded-full shadow-lg" // Further reduced padding & gap
            style={{ 
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(200, 169, 126, 0.2)',
              maxWidth: '85%',
                width: '200px',
            isolation: 'isolate',
            contain: 'layout style paint',
              backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            willChange: 'transform, opacity',
            zIndex: 9900
          }}
              initial={{ opacity: 0, y: 20 }} // Start hidden and slightly down
              animate={{ opacity: 1, y: 0 }}   // Animate to visible and original position
              exit={{ opacity: 0, y: 20 }}      // Animate out hidden and down
              transition={{ duration: 0.3, ease: "easeOut" }} // Animation timing
          onClick={() => sectionRef.current?.scrollIntoView({ behavior: 'smooth' })}
        >
          <div className="flex-1 text-white text-sm font-medium truncate text-center">{track.title}</div>
          <button
            onClick={handlePlay}
            className="mini-player-button p-2 rounded-full bg-black/50 hover:bg-black/70 group transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-75"
            aria-label={isPlaying ? t('player.pause', "Pause") : t('player.play', "Play")}
          >
            <AnimatePresence mode="wait">
              {isPlaying ? (
                <motion.div key="pause" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }}>
                  <Pause
                    size={20} // Smaller icon for mini player
                    className="text-white group-hover:text-yellow-400 transition-colors duration-200"
                  />
                </motion.div>
              ) : (
                <motion.div key="play" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }}>
                  <Play
                    size={20} // Smaller icon for mini player
                    className="text-white group-hover:text-yellow-400 transition-colors duration-200"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
            </motion.div>
        )}
      </AnimatePresence>
      
      {/* Error message */}
      {error && (
        <div className="text-red-500 mt-4 text-center">
          {error}
        </div>
      )}
      
      {/* Animation keyframes (Only spin needed now) */}
      <style jsx global>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
} 

export default EnhancedMusicPlayer;
