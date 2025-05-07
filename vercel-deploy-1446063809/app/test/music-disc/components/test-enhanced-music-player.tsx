"use client"

import { useState, useEffect, useRef } from 'react'
import React from 'react'
import Image from 'next/image'
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react'

const TestEnhancedMusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(100)
  const [volume, setVolume] = useState(70)
  const [isMuted, setIsMuted] = useState(false)
  
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const animationRef = useRef<number | null>(null)
  
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio('/music/test-track.mp3')
      audioRef.current.loop = true
      
      audioRef.current.addEventListener('loadedmetadata', () => {
        if (audioRef.current) {
          setDuration(audioRef.current.duration)
        }
      })
      
      audioRef.current.addEventListener('timeupdate', () => {
        if (audioRef.current) {
          setCurrentTime(audioRef.current.currentTime)
        }
      })
      
      // Fallback for duration if loadedmetadata doesn't fire
      setTimeout(() => {
        if (duration === 100 && audioRef.current) {
          setDuration(audioRef.current.duration || 100)
        }
      }, 1000)
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ''
      }
    }
  }, [duration])
  
  useEffect(() => {
    const rotate = () => {
      if (isPlaying) {
        setRotation(prev => (prev + 0.1) % 360)
        animationRef.current = requestAnimationFrame(rotate)
      }
    }
    
    if (isPlaying) {
      audioRef.current?.play().catch(error => {
        console.error("Audio play failed:", error)
        setIsPlaying(false)
      })
      animationRef.current = requestAnimationFrame(rotate)
    } else {
      audioRef.current?.pause()
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isPlaying])
  
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100
    }
  }, [volume, isMuted])
  
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  }
  
  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value)
    setCurrentTime(newTime)
    if (audioRef.current) {
      audioRef.current.currentTime = newTime
    }
  }
  
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
  }
  
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-64 h-64 mb-6">
        <div 
          className="w-full h-full border-8 border-gray-800 rounded-full overflow-hidden"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          <Image 
            src="images/album-cover.jpg"
            alt="Album Cover" 
            fill
            priority
            className="object-cover"
            onError={(e) => {
              // Fallback for missing image
              e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiMzRjNGNDYiLz48cGF0aCBkPSJNNjYuNTQ4MyA1NC40MDI2QzcwLjgwODkgNTQuNDAyNiA3NC4yNjA5IDUwLjk4NzggNzQuMjYwOSA0Ni43NzE3Qzc0LjI2MDkgNDIuNTU1NiA3MC44MDg5IDM5LjE0MDggNjYuNTQ4MyAzOS4xNDA4QzYyLjI4NzYgMzkuMTQwOCA1OC44MzU2IDQyLjU1NTYgNTguODM1NiA0Ni43NzE3QzU4LjgzNTYgNTAuOTg3OCA2Mi4yODc2IDU0LjQwMjYgNjYuNTQ4MyA1NC40MDI2WiIgZmlsbD0iIzUxNTE1QSIvPjxwYXRoIGQ9Ik0zOC43Mjk4IDU5Ljk4MTJDNDIuOTkwNSA1OS45ODEyIDQ2LjQ0MjQgNTYuNTY2NCA0Ni40NDI0IDUyLjM1MDNDNDYuNDQyNCA0OC4xMzQyIDQyLjk5MDUgNDQuNzE5NCAzOC43Mjk4IDQ0LjcxOTRDMzQuNDY5MSA0NC43MTk0IDMxLjAxNzIgNDguMTM0MiAzMS4wMTcyIDUyLjM1MDNDMzEuMDE3MiA1Ni41NjY0IDM0LjQ2OTEgNTkuOTgxMiAzOC43Mjk4IDU5Ljk4MTJaIiBmaWxsPSIjNTE1MTVBIi8+PHBhdGggZD0iTTgxLjAxMTUgNzYuODg5N0M4MS4wMTE1IDc2Ljg4OTcgNzkuMjE3NCA2Ni41NDQ0IDc2LjkzMDYgNjEuNzIwMUM3NS4wODEgNTcuOTMxIDcwLjU4ODYgNTQuOTkwMSA2Ni41NTgxIDU0Ljk5MDFDNjEuNjkyMiA1NC45OTAxIDU4Ljc5NjEgNTguMDU0OCA1Mi41NzE2IDU4LjA1NDhDNDYuMzM3OCA1OC4wNTQ4IDQzLjQ0MTcgNTQuOTkwMSAzOC41ODUgNTQuOTkwMUMzNC41NDQ0IDU0Ljk5MDEgMzAuMDUyIDU3LjkzMSAyOC4yMDI0IDYxLjcyMDFDMjUuOTE1NiA2Ni41NDQ0IDI0LjEyMTUgNzYuODg5NyAyNC4xMjE1IDc2Ljg4OTdDMjMuNzA1OCA3OC44NjkgMjUuMjkxMyA4MC43MzkxIDI3LjM0MjUgODAuNzM5MUg3Ny43OTAzQzc5Ljg0MTYgODAuNzM5MSA4MS40MzcyIDc4Ljg2OSA4MS4wMTE1IDc2Ljg4OTdaIiBmaWxsPSIjNTE1MTVBIi8+PC9zdmc+';
            }}
          />
          <div className="absolute top-1/2 left-1/2 w-10 h-10 bg-black rounded-full transform -translate-x-1/2 -translate-y-1/2 border-2 border-gray-700"></div>
        </div>
      </div>
      
      <div className="w-full max-w-xs">
        <div className="mb-4 text-center">
          <h3 className="text-white text-lg font-medium">Test Track</h3>
          <p className="text-gray-400 text-sm">Test Artist</p>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
          <input 
            type="range"
            min="0"
            max={duration}
            value={currentTime}
            onChange={handleProgressChange}
            className="w-full h-2 rounded-full appearance-none cursor-pointer bg-gray-700"
            style={{
              backgroundImage: `linear-gradient(to right, #C8A97E ${(currentTime / duration) * 100}%, #4B4B4B ${(currentTime / duration) * 100}%)`
            }}
          />
        </div>
        
        <div className="flex justify-center space-x-4 mb-6">
          <button className="w-8 h-8 flex items-center justify-center text-white hover:text-[#C8A97E] transition-colors">
            <SkipBack size={24} />
          </button>
          <button 
            className="w-12 h-12 flex items-center justify-center bg-[#C8A97E] text-black rounded-full hover:bg-[#D4AF37] transition-colors"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
          </button>
          <button className="w-8 h-8 flex items-center justify-center text-white hover:text-[#C8A97E] transition-colors">
            <SkipForward size={24} />
          </button>
        </div>
        
        <div className="flex items-center space-x-2">
          <button 
            className="text-white hover:text-[#C8A97E] transition-colors"
            onClick={() => setIsMuted(!isMuted)}
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          <input 
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={handleVolumeChange}
            className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-gray-700"
            style={{
              backgroundImage: `linear-gradient(to right, #C8A97E ${volume}%, #4B4B4B ${volume}%)`
            }}
          />
        </div>
      </div>
    </div>
  )
} 

export default TestEnhancedMusicPlayer;
