"use client"

import { Suspense } from 'react'
import Link from "next/link"
import TestNav from "@/app/components/test-nav"

function TestContent() {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="container mx-auto px-4 py-16">
        <div className="mb-8">
          <Link href="/" className="text-blue-400 hover:text-blue-300 underline">
            Back to Homepage
          </Link>
        </div>
        <h1 className="text-4xl text-white mb-8">Test Page</h1>
        <TestNav />
      </div>
    </div>
  )
}

export default function TestPage() {
  return (
    <Suspense fallback={<div className="text-center text-white">Loading test page...</div>}>
      <TestContent />
    </Suspense>
  )
} 