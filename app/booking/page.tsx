import { Suspense } from 'react'
import Link from "next/link"
import BookingForm from "@/app/components/booking-form"

export const metadata = {
  title: 'Booking | Melanie Becker Vocal Coaching',
  description: 'Book a jazz performance, vocal coaching session, or workshop with Melanie Becker.',
}

function BookingContent() {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="container mx-auto px-4 py-16">
        <div className="mb-8">
          <Link href="/" className="text-blue-400 hover:text-blue-300 underline">
            Back to Homepage
          </Link>
        </div>
        <h1 className="text-4xl text-white mb-8">Book a Session</h1>
        <BookingForm />
      </div>
    </div>
  )
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="text-center text-white">Loading booking form...</div>}>
      <BookingContent />
    </Suspense>
  )
} 