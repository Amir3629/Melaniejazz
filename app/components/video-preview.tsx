"use client"

import { useRef, useState, useEffect } from "react"
import React from 'react'
import { motion, AnimatePresence } from "framer-motion"
import { VolumeX, Volume2, Play, Pause } from "lucide-react"
import { useMedia } from "./media-context"
import { getImagePath } from '../../utils/image-path'

// Add event system for media coordination
const MEDIA_STOP_EVENT = 'stopAllMedia'

const VideoPreview = () => {
  const { currentlyPlaying, setCurrentlyPlaying, stopAllMedia } = useMedia()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [showControls, setShowControls] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const posterImage = getImagePath('/images/preview-poster.svg')

  const videoSrc = getImagePath('/videos/preview.mp4')

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
      {/* Video container */}
      <div className="absolute inset-0 flex items-center justify-center bg-black">
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
          poster={getImagePath('/images/preview-poster.webp')}
          src={getImagePath('/videos/preview.mp4')}
        />
      </div>

      {/* Black overlay - separate from play button */}
      <div 
        className="absolute inset-0 bg-black/85 transition-opacity duration-700"
        style={{ opacity: isPlaying ? 0 : 1, pointerEvents: isPlaying ? 'none' : 'auto' }}
        onClick={handlePlayPause}
      ></div>

      {/* Standalone play button with fixed positioning */}
      {!isPlaying && (
        <div 
          className="absolute"
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '40px',
            height: '40px',
            zIndex: 10
          }}
        >
          <button 
            className="w-full h-full rounded-full bg-[#C8A97E] hover:bg-[#B69A6E] transition-colors relative"
            aria-label="Play video"
            onClick={handlePlayPause}
          >
            <div style={{ 
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-45%, -50%)',
              width: 0, 
              height: 0, 
              borderTop: '7px solid transparent',
              borderLeft: '11px solid black', 
              borderBottom: '7px solid transparent'
            }}></div>
          </button>
        </div>
      )}

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

export default VideoPreview;
