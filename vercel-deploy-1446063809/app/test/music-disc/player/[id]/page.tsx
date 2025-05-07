import { Suspense } from 'react'
import TestEnhancedMusicPlayer from "@/app/components/test-enhanced-music-player"
import Link from "next/link"

function PlayerContent() {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="container mx-auto px-4 pt-16 pb-32">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-4xl text-white">Music Player</h1>
          <Link href="/test/music-disc" className="text-blue-400 hover:text-blue-300 underline">
            Back to Music Disc Test
          </Link>
        </div>
        
        <div className="p-4 border border-gray-800 rounded-lg">
          <TestEnhancedMusicPlayer />
        </div>
      </div>
    </div>
  )
}

export function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' }
  ]
}

export default function PlayerPage() {
  return (
    <Suspense fallback={<div className="text-center text-white">Loading music player...</div>}>
      <PlayerContent />
    </Suspense>
  )
} 