"use client"

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react'

export default function TestEnhancedMusicPlayer() {
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
            src="/images/album-cover.jpg" 
            alt="Album Cover" 
            fill
            priority
            className="object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 300 300'%3E%3Crect width='300' height='300' fill='%23333'/%3E%3Ctext x='50%25' y='50%25' font-size='24' text-anchor='middle' fill='%23888' dominant-baseline='middle'%3EAlbum Cover%3C/text%3E%3C/svg%3E";
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