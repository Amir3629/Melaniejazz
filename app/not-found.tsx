"use client"

import { Suspense } from 'react'
import Link from "next/link"

function NotFoundContent() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-white mb-4">404</h1>
        <p className="text-xl text-gray-300 mb-8">Page not found</p>
        <Link href="/" className="text-blue-400 hover:text-blue-300 underline">
          Return to Homepage
        </Link>
      </div>
    </div>
  )
}

export default function NotFound() {
  return (
    <Suspense fallback={<div className="text-center text-white">Loading 404 page...</div>}>
      <NotFoundContent />
    </Suspense>
  )
} 