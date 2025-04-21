"use client"

import TestMusicDisc from "@/app/components/test-music-disc"
import TestEnhancedMusicPlayer from "@/app/components/test-enhanced-music-player"
import Link from "next/link"

export default function MusicDiscTestPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="container mx-auto px-4 pt-16 pb-32">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-4xl text-white">Music Disc Test Page</h1>
          <Link href="/test" className="text-blue-400 hover:text-blue-300 underline">
            Back to Test Home
          </Link>
        </div>
        
        <p className="text-gray-300 mt-4 mb-12 max-w-2xl">
          This page tests simplified and optimized music disc components for mobile devices. 
          The components use relative sizing and proper CSS to ensure they display correctly on all screen sizes.
        </p>
        
        {/* Simple test component */}
        <div className="mb-16 p-4 border border-gray-800 rounded-lg">
          <h2 className="text-2xl text-white text-center mb-6">Simple Test Music Disc</h2>
          <p className="text-gray-400 text-center mb-8">A basic implementation with fixed dimensions</p>
          <TestMusicDisc />
        </div>
        
        {/* Modified enhanced component */}
        <div className="mb-16 p-4 border border-gray-800 rounded-lg">
          <h2 className="text-2xl text-white text-center mb-6">Modified Enhanced Music Player</h2>
          <p className="text-gray-400 text-center mb-8">Based on the original component but with fixed dimensions</p>
          <TestEnhancedMusicPlayer />
        </div>
      </div>
    </div>
  )
} 