"use client"

import Link from 'next/link'

export default function TestNav() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div className="bg-[#121212] border border-gray-800 rounded-xl p-6 hover:border-[#C8A97E]/50 transition-colors">
        <h3 className="text-xl font-semibold text-white mb-2">Music Disc Test</h3>
        <p className="text-gray-400 mb-4">
          Test the music disc components for mobile responsiveness.
        </p>
        <Link 
          href="/test/music-disc"
          className="inline-flex items-center text-[#C8A97E] hover:text-[#D4AF37] transition-colors"
        >
          Go to Music Disc Test
        </Link>
      </div>
      
      <div className="bg-[#121212] border border-gray-800 rounded-xl p-6 hover:border-[#C8A97E]/50 transition-colors">
        <h3 className="text-xl font-semibold text-white mb-2">Payment Test</h3>
        <p className="text-gray-400 mb-4">
          Test the payment flow and form validation.
        </p>
        <Link 
          href="/payment/test-123"
          className="inline-flex items-center text-[#C8A97E] hover:text-[#D4AF37] transition-colors"
        >
          Go to Payment Test
        </Link>
      </div>
      
      <div className="bg-[#121212] border border-gray-800 rounded-xl p-6 hover:border-[#C8A97E]/50 transition-colors">
        <h3 className="text-xl font-semibold text-white mb-2">Booking Form Test</h3>
        <p className="text-gray-400 mb-4">
          Test the booking form with validation.
        </p>
        <Link 
          href="/booking"
          className="inline-flex items-center text-[#C8A97E] hover:text-[#D4AF37] transition-colors"
        >
          Go to Booking Form
        </Link>
      </div>
    </div>
  )
} 