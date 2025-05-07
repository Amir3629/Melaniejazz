import React from 'react';
import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function TestimonialSlider({ testimonials }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const goToPrevious = () => {
    const newIndex = (currentIndex === 0) 
      ? testimonials.length - 1 
      : currentIndex - 1;
    setCurrentIndex(newIndex);
  };
  
  const goToNext = () => {
    const newIndex = (currentIndex === testimonials.length - 1) 
      ? 0 
      : currentIndex + 1;
    setCurrentIndex(newIndex);
  };
  
  if (!testimonials || testimonials.length === 0) {
    return null;
  }
  
  return (
    <div className="relative max-w-4xl mx-auto">
      {/* Navigation Buttons */}
      <button 
        onClick={goToPrevious}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/30 p-2 rounded-full hover:bg-black/60 transition-colors"
        aria-label="Previous testimonial"
      >
        <ChevronLeft className="h-6 w-6 text-white" />
      </button>
      
      <button 
        onClick={goToNext}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/30 p-2 rounded-full hover:bg-black/60 transition-colors"
        aria-label="Next testimonial"
      >
        <ChevronRight className="h-6 w-6 text-white" />
      </button>
      
      {/* Testimonial Card */}
      <div className="bg-[#1A1A1A] rounded-lg p-8 text-center mx-12">
        <div className="flex flex-col items-center">
          {testimonials[currentIndex].avatar && (
            <div className="relative h-20 w-20 rounded-full overflow-hidden mb-4">
              <Image
                src={testimonials[currentIndex].avatar}
                alt={testimonials[currentIndex].author}
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
          )}
          
          <div className="text-[#C8A97E] text-5xl font-serif mb-4">"</div>
          
          <blockquote className="text-white text-lg mb-6">
            {testimonials[currentIndex].quote}
          </blockquote>
          
          <cite className="not-italic">
            <div className="text-[#C8A97E] font-bold">
              {testimonials[currentIndex].author}
            </div>
            {testimonials[currentIndex].role && (
              <div className="text-gray-400 text-sm">
                {testimonials[currentIndex].role}
              </div>
            )}
          </cite>
        </div>
      </div>
      
      {/* Pagination Dots */}
      <div className="flex justify-center mt-6 space-x-2">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentIndex ? 'w-6 bg-[#C8A97E]' : 'w-2 bg-gray-600'
            }`}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
} 