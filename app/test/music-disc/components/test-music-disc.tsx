"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'

export default function TestMusicDisc() {
  const [isRotating, setIsRotating] = useState(false)
  const [rotation, setRotation] = useState(0)

  useEffect(() => {
    let animationFrame: number;
    
    const rotate = () => {
      if (isRotating) {
        setRotation(prev => (prev + 0.2) % 360);
        animationFrame = requestAnimationFrame(rotate);
      }
    };

    if (isRotating) {
      animationFrame = requestAnimationFrame(rotate);
    }

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [isRotating]);

  return (
    <div className="flex flex-col items-center">
      <div 
        className="relative w-64 h-64 border-8 border-gray-800 rounded-full overflow-hidden"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        <Image 
          src="/images/album-cover.jpg" 
          alt="Album Cover"
          fill
          priority
          className="object-cover"
          onError={(e) => {
            // Fallback for missing image
            const target = e.target as HTMLImageElement;
            target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 300 300'%3E%3Crect width='300' height='300' fill='%23333'/%3E%3Ctext x='50%25' y='50%25' font-size='24' text-anchor='middle' fill='%23888' dominant-baseline='middle'%3EAlbum Cover%3C/text%3E%3C/svg%3E";
          }}
        />
        <div className="absolute top-1/2 left-1/2 w-10 h-10 bg-black rounded-full transform -translate-x-1/2 -translate-y-1/2 border-2 border-gray-700"></div>
      </div>
      
      <button
        className="mt-4 px-4 py-2 bg-[#C8A97E] text-black rounded-md hover:bg-[#D4AF37] transition-colors"
        onClick={() => setIsRotating(!isRotating)}
      >
        {isRotating ? 'Stop' : 'Play'}
      </button>
    </div>
  )
} 