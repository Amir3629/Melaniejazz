'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { getImagePath } from '../utils/image-path'

interface Testimonial {
  _id: string
  name: string
  quote: string
  avatar: string
  title: string
}

export function TinaTestimonialsClient({ testimonials }: { testimonials: Testimonial[] }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [autoplay, setAutoplay] = useState(true)

  // Autoplay functionality
  useEffect(() => {
    if (!autoplay || testimonials.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [autoplay, testimonials.length])

  // Pause autoplay when user interacts
  const handleIndicatorClick = (index: number) => {
    setCurrentIndex(index)
    setAutoplay(false)
    
    // Resume autoplay after 10 seconds of inactivity
    setTimeout(() => setAutoplay(true), 10000)
  }

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
    setAutoplay(false)
    setTimeout(() => setAutoplay(true), 10000)
  }

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length)
    setAutoplay(false)
    setTimeout(() => setAutoplay(true), 10000)
  }

  if (!testimonials.length) {
    return <div className="text-center py-12">No testimonials found</div>
  }

  return (
    <div className="relative max-w-4xl mx-auto">
      {/* Testimonial Slider */}
      <div className="h-[400px] md:h-[300px] relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            className="absolute w-full h-full flex flex-col items-center justify-center px-8 text-center"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative w-20 h-20 mb-6 rounded-full overflow-hidden border-2 border-[#C8A97E]">
              <Image
                src={getImagePath(testimonials[currentIndex].avatar || '/images/testimonials/placeholder.jpg')}
                alt={testimonials[currentIndex].name}
                fill
                className="object-cover"
                sizes="80px"
              />
            </div>
            <p className="text-gray-200 italic mb-6 max-w-3xl">{testimonials[currentIndex].quote}</p>
            <h3 className="text-[#C8A97E] font-semibold text-xl">{testimonials[currentIndex].name}</h3>
            <p className="text-gray-400 text-sm">{testimonials[currentIndex].title}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={handlePrev}
        className="absolute top-1/2 left-0 transform -translate-y-1/2 p-2 text-white bg-black/30 hover:bg-black/50 rounded-full"
        aria-label="Previous testimonial"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>
      <button
        onClick={handleNext}
        className="absolute top-1/2 right-0 transform -translate-y-1/2 p-2 text-white bg-black/30 hover:bg-black/50 rounded-full"
        aria-label="Next testimonial"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>

      {/* Indicators */}
      <div className="flex justify-center mt-6 space-x-2">
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => handleIndicatorClick(i)}
            className={`w-3 h-3 rounded-full transition-colors ${
              i === currentIndex ? 'bg-[#C8A97E]' : 'bg-gray-600'
            }`}
            aria-label={`Go to testimonial ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

// Server component that fetches testimonials
export async function TinaTestimonials() {
  const { getCollection } = await import('../../lib/tina-content')
  const testimonials = await getCollection('testimonials')

  return <TinaTestimonialsClient testimonials={testimonials} />
} 