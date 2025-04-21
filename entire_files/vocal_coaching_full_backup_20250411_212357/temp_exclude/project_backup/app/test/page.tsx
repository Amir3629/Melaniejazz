"use client"

import TestNav from "@/app/components/test-nav"
import { LanguageProvider } from "@/app/components/language-switcher"
import Link from "next/link"

export default function TestPage() {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-[#0A0A0A]">
        <TestNav />
        <div className="container mx-auto px-4 pt-32">
          <h1 className="text-4xl text-white">Test Page</h1>
          <p className="text-gray-300 mt-4 mb-8">
            This page is for testing the navigation component with language support.
          </p>
          
          <div className="mt-8">
            <h2 className="text-2xl text-white mb-4">Test Pages</h2>
            <ul className="space-y-2">
              <li>
                <Link href="/test/music-disc" className="text-blue-400 hover:text-blue-300 underline">
                  Music Disc Test - Mobile Responsive Version
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </LanguageProvider>
  )
} 