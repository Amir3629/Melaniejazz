import Navigation from "@/app/components/navigation"
import { Suspense } from 'react'
import AGBClientContent from './agb-client'

export const metadata = {
  title: 'AGB - Vocal Coaching',
  description: 'Allgemeine Geschäftsbedingungen für Vocal Coaching Services'
}

export default function AGBPage() {
  return (
    <Suspense fallback={<div className="text-center text-white">Loading...</div>}>
      <AGBClientContent />
    </Suspense>
  )
} 