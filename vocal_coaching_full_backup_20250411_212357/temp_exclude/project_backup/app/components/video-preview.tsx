"use client"

import { useRef, useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { VolumeX, Volume2, Play, Pause } from "lucide-react"
import { useMedia } from "./media-context"

// Add event system for media coordination
const MEDIA_STOP_EVENT = 'stopAllMedia'

export default function VideoPreview() {
  const { currentlyPlaying, setCurrentlyPlaying, stopAllMedia } = useMedia()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [showControls, setShowControls] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const posterImage = process.env.NODE_ENV === 'production'
    ? '/vocal-coaching/images/preview-poster.svg'
    : '/images/preview-poster.svg'

  const videoSrc = process.env.NODE_ENV === 'production'
    ? '/vocal-coaching/videos/preview.mp4'
    : '/videos/preview.mp4'

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load()
    }
  }, [])

  // Listen for global stop events
  useEffect(() => {
    const handleStopAllMedia = () => {
      if (videoRef.current) {
        videoRef.current.pause()
        setIsPlaying(false)
      }
    }
    
    window.addEventListener('stopAllMedia', handleStopAllMedia)
    return () => {
      window.removeEventListener('stopAllMedia', handleStopAllMedia)
    }
  }, [])
  
  // Enhanced coordination with music player
  useEffect(() => {
    if (currentlyPlaying === 'music' && isPlaying) {
      videoRef.current?.pause();
      setIsPlaying(false);
    }
  }, [currentlyPlaying, isPlaying]);

  const handleLoadStart = () => {
    setIsLoading(true)
    setHasError(false)
  }

  const handleLoadedData = () => {
    setIsLoading(false)
  }

  const handleError = (e: any) => {
    console.error('Video loading error:', e)
    setIsLoading(false)
    setHasError(true)
  }

  const handlePlayPause = () => {
    if (isPlaying) {
      videoRef.current?.pause();
      setIsPlaying(false);
      setCurrentlyPlaying(null);
    } else {
      // Stop any playing music first
      stopAllMedia();
      
      // Then play our video
      videoRef.current?.play()
        .then(() => {
          setIsPlaying(true);
          setCurrentlyPlaying('video');
        })
        .catch(err => {
          console.error('Error playing video:', err);
          setHasError(true);
        });
    }
  };

  const handleMuteToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!videoRef.current) return
    videoRef.current.muted = !isMuted
    setIsMuted(!isMuted)
  }

  return (
    <div 
      className="relative mx-auto aspect-[3/4] bg-black overflow-hidden" 
      style={{ width: "168px", borderRadius: "22px" }}
    >
      <div className="absolute inset-0 flex items-center justify-center bg-neutral-900">
        <video
          ref={videoRef}
          className="max-h-full object-contain"
          style={{ width: "auto", height: "100%", maxWidth: "100%" }}
          playsInline
          loop
          muted={isMuted}
          onLoadStart={handleLoadStart}
          onLoadedData={handleLoadedData}
          onError={handleError}
          poster={process.env.NODE_ENV === 'production' ? '/vocal-coaching/images/preview-poster.webp' : '/images/preview-poster.webp'}
          src={process.env.NODE_ENV === 'production' ? '/vocal-coaching/videos/preview.mp4' : '/videos/preview.mp4'}
        />
      </div>

      {/* Dark overlay with play button */}
      <div 
        className={`absolute inset-0 flex items-center justify-center bg-black/60 transition-opacity duration-700 ${isPlaying ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        onClick={handlePlayPause}
      >
        <button 
          className="flex items-center justify-center rounded-full bg-[#C8A97E] hover:bg-[#B69A6E] transition-colors"
          style={{ width: "32px", height: "32px" }}
          aria-label="Play video"
        >
          {/* Smaller play triangle with stronger contrast */}
          <div 
            className="video-play-triangle"
            style={{ 
              width: 0,
              height: 0,
              borderTop: '6px solid transparent',
              borderLeft: '10px solid black',
              borderBottom: '6px solid transparent',
              marginLeft: '2px'
            }}
          ></div>
        </button>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80">
          <div style={{ width: "20px", height: "20px" }} className="border-2 border-[#C8A97E] border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80">
          <p className="text-[#C8A97E] text-xs px-2 text-center">Video konnte nicht geladen werden</p>
        </div>
      )}

      {/* Mute/Unmute button */}
      <button
        onClick={handleMuteToggle}
        className={`absolute bottom-3 right-3 p-0 transition-opacity hover:opacity-75 focus:outline-none ${isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        <span className="text-white text-sm block video-mute-icon">
          {isMuted ? '🔇' : '🔊'}
        </span>
      </button>
    </div>
  )
}