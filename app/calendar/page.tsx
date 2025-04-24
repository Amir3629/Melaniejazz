"use client"

import { Suspense } from 'react'
import Link from 'next/link'
import { Calendar, Clock, ArrowRight, Music, Mic, Users } from 'lucide-react'

function CalendarContent() {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="container mx-auto px-4 py-16">
        <div className="mb-8">
          <Link href="/" className="text-blue-400 hover:text-blue-300 underline">
            Back to Homepage
          </Link>
        </div>
        <h1 className="text-4xl text-white mb-8">Calendar</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-[#121212] border border-gray-800 rounded-xl p-6 hover:border-[#C8A97E]/50 transition-colors">
            <div className="w-12 h-12 rounded-full bg-[#C8A97E]/20 flex items-center justify-center mb-4">
              <Mic className="w-6 h-6 text-[#C8A97E]" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Vocal Coaching</h3>
            <p className="text-gray-400 mb-4">
              Buchen Sie eine individuelle Coaching-Session für Gesangstechnik, Interpretation oder Stimmbildung.
            </p>
            <Link 
              href="/booking?service=vocal-coaching"
              className="inline-flex items-center text-[#C8A97E] hover:text-[#D4AF37] transition-colors"
            >
              Jetzt buchen <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          
          <div className="bg-[#121212] border border-gray-800 rounded-xl p-6 hover:border-[#C8A97E]/50 transition-colors">
            <div className="w-12 h-12 rounded-full bg-[#C8A97E]/20 flex items-center justify-center mb-4">
              <Music className="w-6 h-6 text-[#C8A97E]" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Live Jazz Performance</h3>
            <p className="text-gray-400 mb-4">
              Buchen Sie einen Live-Auftritt für Ihre Veranstaltung, Hochzeit oder Firmenfeier.
            </p>
            <Link 
              href="/booking?service=professioneller-gesang"
              className="inline-flex items-center text-[#C8A97E] hover:text-[#D4AF37] transition-colors"
            >
              Jetzt buchen <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          
          <div className="bg-[#121212] border border-gray-800 rounded-xl p-6 hover:border-[#C8A97E]/50 transition-colors">
            <div className="w-12 h-12 rounded-full bg-[#C8A97E]/20 flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-[#C8A97E]" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Jazz Workshop</h3>
            <p className="text-gray-400 mb-4">
              Buchen Sie einen Workshop für Ihre Gruppe, Schule oder Unternehmen.
            </p>
            <Link 
              href="/booking?service=gesangsunterricht"
              className="inline-flex items-center text-[#C8A97E] hover:text-[#D4AF37] transition-colors"
            >
              Jetzt buchen <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
        
        <div className="bg-[#121212] border border-gray-800 rounded-xl p-6 mb-12">
          <div className="flex items-center mb-6">
            <Calendar className="w-6 h-6 text-[#C8A97E] mr-3" />
            <h2 className="text-2xl font-bold text-white">Meine Verfügbarkeit</h2>
          </div>
          
          <div className="bg-[#1A1A1A]/50 border border-[#C8A97E]/20 rounded-lg p-6 mb-6">
            <p className="text-gray-300 mb-6">
              Sehen Sie meine aktuelle Verfügbarkeit und buchen Sie direkt einen Termin über meinen Google Kalender. 
              Wählen Sie einfach einen freien Zeitslot aus und folgen Sie den Anweisungen zur Buchung.
            </p>
            
            <div className="flex justify-center">
              <a 
                href="https://calendar.google.com/calendar/appointments/schedules/AcZssZ30T2yfDb7XKvIARrVpIy2KIPltFAg7-YUnQlejiuhoJaIU3tvpj3ZR6Vn5klhf33WZjAu9QmYR"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-[#C8A97E] text-black font-medium rounded-lg hover:bg-[#D4AF37] transition-colors"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Google Kalender öffnen
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CalendarPage() {
  return (
    <Suspense fallback={<div className="text-center text-white">Loading calendar...</div>}>
      <CalendarContent />
    </Suspense>
  )
} 