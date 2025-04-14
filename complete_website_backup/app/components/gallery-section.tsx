"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Dialog } from "@/app/components/ui/dialog"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { AppImage } from "@/app/components/ui/image"
import { createPortal } from "react-dom"

interface GalleryImage {
  src: string
  alt: string
  span: string
  description: string
  date: string
  location: string
}

const images: GalleryImage[] = [
  {
    src: '/images/gallery/performance1.jpg',
    alt: "Live Performance im B-Flat Jazz Club",
    span: "col-span-1 md:col-span-2",
    description: "Live Performance im B-Flat Jazz Club",
    date: "2024",
    location: "Berlin-Mitte"
  },
  {
    src: '/images/gallery/performance2.jpg',
    alt: "Aufnahmesession im Studio",
    span: "col-span-1",
    description: "Aufnahmesession im Studio",
    date: "2024",
    location: "Recording Studio Berlin"
  },
  {
    src: '/images/gallery/performance3.jpg',
    alt: "Live Concert",
    span: "col-span-1",
    description: "Jazz Festival Auftritt",
    date: "2023",
    location: "Jazztage Berlin"
  },
  {
    src: '/images/gallery/performance4.jpg',
    alt: "Teaching Session",
    span: "col-span-1 md:col-span-2",
    description: "Gesangsunterricht & Workshop",
    date: "2024",
    location: "Vocal Studio"
  },
  {
    src: '/images/gallery/performance5.jpg',
    alt: "Piano Performance",
    span: "col-span-1 md:col-span-2",
    description: "Piano & Vocal Performance",
    date: "2023",
    location: "Jazz Club Berlin"
  },
  {
    src: '/images/gallery/performance6.jpg',
    alt: "Stage Performance",
    span: "col-span-1 md:col-span-2",
    description: "Live Konzert mit Band",
    date: "2024",
    location: "Konzerthaus Berlin"
  },
  {
    src: '/images/gallery/performance7.jpg',
    alt: "Vocal Workshop",
    span: "col-span-1",
    description: "Vocal Workshop Session",
    date: "2024",
    location: "Studio Berlin"
  },
  {
    src: '/images/gallery/performance8.jpg',
    alt: "Jazz Club",
    span: "col-span-1",
    description: "Jazz Club Performance",
    date: "2024",
    location: "A-Trane Berlin"
  },
  {
    src: '/images/gallery/performance9.jpg',
    alt: "Concert Performance",
    span: "col-span-1 md:col-span-2",
    description: "Jazz Concert Evening",
    date: "2024",
    location: "Philharmonie Berlin"
  }
]

export default function GallerySection() {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)
  const [mounted, setMounted] = useState(false)
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  const [bgOpacity, setBgOpacity] = useState(0)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  const handleImageClick = (image: GalleryImage) => {
    // Preload the image before showing modal for smoother transition
    const img = new Image()
    img.src = image.src
    img.onload = () => {
      setIsImageLoaded(true)
      document.documentElement.style.overflow = 'hidden'
      setSelectedImage(image)
      // Start with opacity 0 and animate to full opacity
      setBgOpacity(0)
      setTimeout(() => setBgOpacity(0.95), 10)
    }
  }

  const handleClose = () => {
    // Apply smooth fade-out transition
    const imageElement = document.getElementById('gallery-modal-image')
    if (imageElement) {
      imageElement.classList.remove('opacity-100')
      imageElement.classList.add('opacity-0')
    }
    
    // Fade out the background slowly
    setBgOpacity(0)
    
    setTimeout(() => {
      setSelectedImage(null)
      setIsImageLoaded(false)
      document.documentElement.style.overflow = ''
    }, 700) // Match the transition duration
  }

  const handlePrev = () => {
    if (selectedImage === null) return
    
    // Apply smooth fade transition
    const imageElement = document.getElementById('gallery-modal-image')
    if (imageElement) {
      imageElement.classList.remove('opacity-100')
      imageElement.classList.add('opacity-0')
      
      setTimeout(() => {
        const currentIndex = images.findIndex(img => img.src === selectedImage.src)
        const prevIndex = (currentIndex - 1 + images.length) % images.length
        
        // Preload the next image
        const nextImg = new Image()
        nextImg.src = images[prevIndex].src
        nextImg.onload = () => {
          setSelectedImage(images[prevIndex])
        }
      }, 150) // Half the transition duration for quicker response
    } else {
      const currentIndex = images.findIndex(img => img.src === selectedImage.src)
      const prevIndex = (currentIndex - 1 + images.length) % images.length
      setSelectedImage(images[prevIndex])
    }
  }

  const handleNext = () => {
    if (selectedImage === null) return
    
    // Apply smooth fade transition
    const imageElement = document.getElementById('gallery-modal-image')
    if (imageElement) {
      imageElement.classList.remove('opacity-100')
      imageElement.classList.add('opacity-0')
      
      setTimeout(() => {
        const currentIndex = images.findIndex(img => img.src === selectedImage.src)
        const nextIndex = (currentIndex + 1) % images.length
        
        // Preload the next image
        const nextImg = new Image()
        nextImg.src = images[nextIndex].src
        nextImg.onload = () => {
          setSelectedImage(images[nextIndex])
        }
      }, 150) // Half the transition duration for quicker response
    } else {
      const currentIndex = images.findIndex(img => img.src === selectedImage.src)
      const nextIndex = (currentIndex + 1) % images.length
      setSelectedImage(images[nextIndex])
    }
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!selectedImage) return
    if (e.key === 'ArrowRight') handleNext()
    if (e.key === 'ArrowLeft') handlePrev()
    if (e.key === 'Escape') handleClose()
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.classList.remove('overflow-hidden')
    }
  }, [selectedImage])

  // Add a useEffect to handle image transitions
  useEffect(() => {
    if (selectedImage) {
      // Already handled by setting opacity directly on the image element
      setIsImageLoaded(true)
    }
  }, [selectedImage])

  const renderModal = () => {
    if (!selectedImage) return null

    return (
      <>
        {/* Background with smooth fade transition */}
        <div
          className="fixed inset-0 bg-black z-[998] transition-opacity duration-700 ease-in-out"
          onClick={handleClose}
          style={{ opacity: bgOpacity }}
        />

        <div
          className="fixed inset-0 z-[999] flex items-center justify-center p-4 transition-opacity duration-500"
          onClick={handleClose}
        >
          {/* Arrow icons positioned closer to image frame */}
          <div className="relative w-full max-w-4xl mx-auto">
            {/* Left arrow - positioned just outside the image */}
            <div 
              className="absolute -left-12 top-1/2 -translate-y-1/2 z-[1005] text-[#C8A97E] hover:text-white cursor-pointer transition-colors duration-300"
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              aria-label="Previous image"
            >
              <ChevronLeft size={40} strokeWidth={2.5} />
            </div>
            
            {/* Right arrow - positioned just outside the image */}
            <div 
              className="absolute -right-12 top-1/2 -translate-y-1/2 z-[1005] text-[#C8A97E] hover:text-white cursor-pointer transition-colors duration-300"
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              aria-label="Next image"
            >
              <ChevronRight size={40} strokeWidth={2.5} />
            </div>
            
            {/* Smooth animation container for image */}
            <div className="relative w-full transition-all duration-500 ease-in-out" onClick={(e) => e.stopPropagation()}>
              <div className="relative w-full flex items-center justify-center overflow-hidden">
                <div className="w-full flex items-center justify-center">
                  <picture>
                    <source srcSet={selectedImage.src} type="image/jpeg" />
                    <img
                      id="gallery-modal-image"
                      src={selectedImage.src}
                      alt={selectedImage.alt}
                      className="max-w-full max-h-[75vh] h-auto rounded-xl select-none transition-opacity duration-700 opacity-0"
                      style={{
                        objectFit: 'contain'
                      }}
                      draggable={false}
                      loading="eager"
                      onLoad={(e) => {
                        setIsImageLoaded(true)
                        // Add a slight delay before showing the image for smoother effect
                        setTimeout(() => {
                          if (e.target && e.target instanceof HTMLImageElement) {
                            e.target.classList.remove('opacity-0')
                            e.target.classList.add('opacity-100')
                          }
                        }, 50)
                      }}
                    />
                  </picture>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <section id="gallery" className="relative py-10 bg-[#000000]">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="section-heading mb-4">Galerie</h2>
          <div className="w-12 h-0.5 bg-[#C8A97E] mx-auto"></div>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5 lg:gap-6 max-w-7xl mx-auto">
          {images.map((image, index) => (
            <motion.div
              key={image.src}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className={`relative rounded-xl overflow-hidden cursor-pointer group gallery-item ${image.span}`}
              style={{ 
                willChange: 'transform',
                minHeight: '250px',
                height: image.span.includes('md:col-span-2') ? '300px' : '250px',
              }}
              onClick={() => handleImageClick(image)}
              whileTap={{ scale: 1.05 }}
            >
              <AppImage
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover transition-transform duration-400 ease-out group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                loading="lazy"
              />
              <div className="absolute inset-0 border-2 border-transparent group-active:border-[#C8A97E] rounded-xl transition-colors duration-300"></div>
              
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-400">
                <div className="absolute inset-x-0 bottom-0 p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-400">
                  <h3 className="text-white text-base md:text-lg font-medium mb-1 line-clamp-1">{image.alt}</h3>
                  <p className="text-gray-300 text-sm md:text-base line-clamp-2">{image.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {mounted && createPortal(
          selectedImage && isImageLoaded && renderModal(),
          document.body
        )}
      </div>
    </section>
  )
} 