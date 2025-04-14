"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Play, Pause, Music } from "lucide-react";

// Add event system for media coordination
const MEDIA_STOP_EVENT = 'stopAllMedia';

export default function TestEnhancedMusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showMiniPlayer, setShowMiniPlayer] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  
  const track = {
    title: "Blues for John",
    artist: "Melvo Jazz",
    file: "/audio/AUDIO-2025-03-19-16-15-29.mp3",
    image: "/photo_8_2025-02-27_12-05-55.jpg"
  };

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

  // Handle play/pause with better error handling
  const handlePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      setShowMiniPlayer(false);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    } else {
      // Dispatch event to stop other media
      window.dispatchEvent(new Event(MEDIA_STOP_EVENT));
      setIsPlaying(true);
      setIsLoading(true);
      
      if (audioRef.current) {
        try {
          // Make sure volume is set
          audioRef.current.volume = 1.0;
          audioRef.current.currentTime = 0; // Start from beginning if it ended
          
          // Use the play() method directly
          const playPromise = audioRef.current.play();
          
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                setIsLoading(false);
              })
              .catch(err => {
                console.error("Failed to play audio:", err);
                setError("Failed to play audio. Please try again.");
                setIsPlaying(false);
                setIsLoading(false);
              });
          }
        } catch (err) {
          console.error("Exception while playing audio:", err);
          setError("Failed to play audio. Please try again.");
          setIsPlaying(false);
          setIsLoading(false);
        }
      }
    }
  };

  // Handle audio ended
  const handleEnded = () => {
    setIsPlaying(false);
    setShowMiniPlayer(false);
  };

  // Handle audio error
  const handleError = (e: React.SyntheticEvent<HTMLAudioElement, Event>) => {
    console.error("Audio error:", e);
    setError("Failed to play audio. Please try again.");
    setIsPlaying(false);
    setIsLoading(false);
    setShowMiniPlayer(false);
  };

  return (
    <div className="relative w-full py-16 overflow-hidden bg-black" ref={sectionRef}>
      <div className="absolute inset-0 bg-black/95 backdrop-blur-xl z-0"></div>
      
      <div className="relative z-10 flex flex-col items-center">
        <h2 className="text-2xl font-bold text-white mb-4">Modified Enhanced Music Player</h2>
        <div className="w-16 h-1 bg-[#C8A97E] mb-8"></div>
        
        {/* Fixed-size Disc Container */}
        <div className="relative mx-auto mb-8" style={{ 
          width: "min(280px, 85vw)", 
          height: "min(280px, 85vw)"
        }}>
          {/* Main Vinyl Disc */}
          <motion.div 
            className="absolute inset-0 rounded-full overflow-hidden cursor-pointer"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
            style={{ boxShadow: '0 15px 40px rgba(0, 0, 0, 0.5)' }}
            onClick={handlePlay}
          >
            {/* Main disc */}
            <div className="absolute inset-0 rounded-full overflow-hidden shadow-2xl">
              {/* Disc image background - spinning only when playing */}
              <motion.div 
                className="absolute inset-0 rounded-full overflow-hidden"
                animate={{ rotate: isPlaying ? 360 : 0 }}
                transition={{ 
                  duration: 40, 
                  ease: "linear", 
                  repeat: isPlaying ? Infinity : 0,
                  repeatType: "loop" 
                }}
              >
                <Image 
                  src={track.image}
                  alt={track.title}
                  fill
                  sizes="(max-width: 768px) 85vw, 280px"
                  style={{ objectFit: 'cover', objectPosition: 'center' }}
                  className="opacity-100"
                  priority
                />
              </motion.div>
              
              {/* Inner disc with grooves - spinning only when playing */}
              <motion.div 
                className="absolute inset-0 rounded-full bg-black/30 backdrop-blur-none"
                animate={{ rotate: isPlaying ? 360 : 0 }}
                transition={{ 
                  duration: 40, 
                  ease: "linear", 
                  repeat: isPlaying ? Infinity : 0,
                  repeatType: "loop" 
                }}
              >
                {/* Vinyl grooves */}
                <div className="absolute inset-0 rounded-full">
                  <div className="absolute inset-[10%] rounded-full border border-[#444]/70"></div>
                  <div className="absolute inset-[20%] rounded-full border border-[#444]/70"></div>
                  <div className="absolute inset-[30%] rounded-full border border-[#444]/70"></div>
                  <div className="absolute inset-[40%] rounded-full border border-[#444]/70"></div>
                </div>
                
                {/* Center button */}
                <div className="absolute inset-0 m-auto w-24 h-24 rounded-full bg-black flex items-center justify-center">
                  <motion.button
                    className="w-20 h-20 rounded-full bg-black flex items-center justify-center hover:bg-black/70 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handlePlay}
                    transition={{ duration: 0.5 }}
                  >
                    {isLoading ? (
                      <div className="w-6 h-6 border-2 border-[#C8A97E] border-t-transparent rounded-full animate-spin"></div>
                    ) : isPlaying ? (
                      <Pause className="w-6 h-6 text-[#C8A97E]" />
                    ) : (
                      <Play className="w-7 h-7 text-[#C8A97E] ml-1" />
                    )}
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
        
        {/* Track title and artist */}
        <div className="text-center mt-4 mb-4">
          <h3 className="text-xl font-medium text-white mb-1">{track.title}</h3>
          <p className="text-sm text-[#C8A97E]">{track.artist}</p>
        </div>
      </div>
      
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={track.file}
        onEnded={handleEnded}
        onError={handleError}
        preload="auto"
        className="hidden"
      />
      
      {/* Show any error messages */}
      {error && (
        <div className="text-red-500 mt-4 text-center">
          {error}
        </div>
      )}
    </div>
  );
} 