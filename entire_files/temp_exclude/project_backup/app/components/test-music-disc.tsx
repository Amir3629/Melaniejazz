"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Play, Pause } from "lucide-react";

export default function TestMusicDisc() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const track = {
    title: "Blues for John",
    artist: "Melvo Jazz",
    file: "/audio/AUDIO-2025-03-19-16-15-29.mp3",
    image: "/photo_8_2025-02-27_12-05-55.jpg"
  };

  const handlePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    } else {
      setIsPlaying(true);
      setIsLoading(true);
      
      if (audioRef.current) {
        audioRef.current.volume = 1.0;
        audioRef.current.currentTime = 0;
        
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsLoading(false);
            })
            .catch(err => {
              console.error("Failed to play audio:", err);
              setIsPlaying(false);
              setIsLoading(false);
            });
        }
      }
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
  };

  const handleError = () => {
    setIsPlaying(false);
    setIsLoading(false);
  };

  return (
    <section className="relative w-full bg-black py-16 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-white mb-4">Test Music Player</h2>
          <p className="text-gray-400">Optimized for mobile devices</p>
        </div>
        
        {/* Fixed-size container for the disc */}
        <div className="relative mx-auto mb-8" style={{ 
          width: "min(280px, 85vw)", 
          height: "min(280px, 85vw)"
        }}>
          {/* Disc container */}
          <div 
            className="absolute inset-0 rounded-full overflow-hidden cursor-pointer shadow-2xl"
            style={{ 
              boxShadow: '0 15px 40px rgba(0, 0, 0, 0.5)',
            }}
            onClick={handlePlay}
          >
            {/* Cover image with rotation */}
            <div 
              className={`absolute inset-0 rounded-full overflow-hidden ${isPlaying ? 'animate-spin-slow' : ''}`}
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
            </div>
            
            {/* Vinyl grooves overlay */}
            <div className="absolute inset-0 rounded-full bg-black/30">
              {/* Vinyl record grooves */}
              <div className="absolute inset-0 rounded-full">
                <div className="absolute inset-[10%] rounded-full border border-[#444]/70"></div>
                <div className="absolute inset-[20%] rounded-full border border-[#444]/70"></div>
                <div className="absolute inset-[30%] rounded-full border border-[#444]/70"></div>
                <div className="absolute inset-[40%] rounded-full border border-[#444]/70"></div>
              </div>
              
              {/* Center play/pause button */}
              <div className="absolute inset-0 m-auto w-24 h-24 rounded-full bg-black flex items-center justify-center">
                <button
                  className="w-20 h-20 rounded-full bg-black flex items-center justify-center hover:bg-black/70 transition-colors"
                  onClick={handlePlay}
                >
                  {isLoading ? (
                    <div className="w-6 h-6 border-2 border-[#C8A97E] border-t-transparent rounded-full animate-spin"></div>
                  ) : isPlaying ? (
                    <Pause className="w-6 h-6 text-[#C8A97E]" />
                  ) : (
                    <Play className="w-7 h-7 text-[#C8A97E] ml-1" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Track info */}
        <div className="text-center mt-6 mb-4">
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
      
      {/* CSS for animation */}
      <style jsx global>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .animate-spin-slow {
          animation: spin-slow 40s linear infinite;
        }
      `}</style>
    </section>
  );
} 