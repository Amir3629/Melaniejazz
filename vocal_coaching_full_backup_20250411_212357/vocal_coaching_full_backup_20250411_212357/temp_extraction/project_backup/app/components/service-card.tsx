"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Check, ChevronDown } from "lucide-react"

interface ServiceCardProps {
  title: string
  subtitle: string
  description: string
  features: string[]
  details?: {
    duration?: string
    location?: string
    includes?: string[]
    suitable?: string[]
  }
  image?: string
  icon?: React.ReactNode
  delay?: number
  link?: string
}

export default function ServiceCard({
  title,
  subtitle,
  description,
  features,
  details,
  image,
  icon,
  delay = 0,
  link
}: ServiceCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isTouched, setIsTouched] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
  }

  const handleTouchStart = () => {
    setIsTouched(true)
  }

  const handleTouchEnd = () => {
    setIsTouched(false)
  }

  // Animation variants for the card
  const cardVariants = {
    collapsed: { 
      height: 320,
      scale: 1,
      transition: {
        duration: 1.2,
        ease: [0.4, 0, 0.2, 1]
      }
    },
    expanded: { 
      height: "auto",
      scale: 1.02,
      transition: { 
        duration: 1.2,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  // Line by line text animation
  const textVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.15,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay }}
      className="group relative w-full bg-black/20 backdrop-blur-sm rounded-xl overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      variants={cardVariants}
      animate={(isHovered || isTouched) ? "expanded" : "collapsed"}
      style={{
        borderRadius: "0.75rem",
        WebkitTransform: "translateZ(0)",
        WebkitBackfaceVisibility: "hidden",
        width: "100%",
        margin: 0,
        padding: 0,
        overflow: "hidden",
        transformOrigin: "center center",
        willChange: "transform, height",
        position: "relative",
        ...(image && {
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.8), rgba(0,0,0,0.6), rgba(0,0,0,0.8)), url('${image}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          boxShadow: '0 4px 30px rgba(0,0,0,0.5)',
          isolation: 'isolate'
        })
      }}
    >
      {/* Arrow indicator */}
      <motion.div
        className="absolute bottom-4 right-4 text-[#C8A97E]"
        animate={{
          y: [0, 4, 0],
          opacity: [0.6, 1, 0.6],
          rotate: (isHovered || isTouched) ? 180 : 0
        }}
        transition={{
          y: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          },
          opacity: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          },
          rotate: {
            duration: 1.2,
            ease: [0.4, 0, 0.2, 1]
          }
        }}
        style={{
          transformOrigin: 'center'
        }}
      >
        <ChevronDown className="w-6 h-6 drop-shadow-lg" />
      </motion.div>

      <div className="relative p-4 sm:p-6 flex flex-col">
        <div className="flex items-start gap-3 mb-3 sm:mb-4">
          {icon && (
            <div className="text-[#C8A97E]">
              {icon}
            </div>
          )}
          <div>
            <h3 className="text-xl font-medium text-white">{title}</h3>
            <p className="text-sm text-[#C8A97E]/90 mt-1">{subtitle}</p>
          </div>
        </div>

        <style jsx>{`
          .gold-bullet li {
            position: relative;
            padding-left: 20px;
          }
          .gold-bullet li::before {
            content: "";
            position: absolute;
            left: 0;
            top: 8px;
            width: 6px;
            height: 6px;
            background-color: #C8A97E;
            border-radius: 50%;
          }
        `}</style>

        <p className="text-sm text-gray-300 mb-4 sm:mb-6">{description}</p>

        <ul className="space-y-3 mb-4 sm:mb-6 gold-bullet">
          {features.map((feature, index) => (
            <li
              key={index}
              className="text-white/90"
            >
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>

        <AnimatePresence>
          {details && isHovered && (
            <motion.div 
              ref={contentRef}
              className="mt-auto space-y-3 sm:space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {details.includes && (
                <div>
                  <motion.h4 
                    className="text-[#C8A97E] text-sm font-medium mb-2"
                    variants={textVariants}
                    initial="hidden"
                    animate="visible"
                    custom={0}
                  >
                    <span className="inline-flex items-center justify-center w-4 h-4 mr-1">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                    {" "}Enthält
                  </motion.h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-1 gold-bullet">
                    {details.includes.map((item, index) => (
                      <motion.li
                        key={index}
                        className="text-white/90"
                        variants={textVariants}
                        initial="hidden"
                        animate="visible"
                        custom={index + 1}
                      >
                        <span className="text-sm">{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              )}
              
              {details.suitable && (
                <div>
                  <motion.h4 
                    className="text-[#C8A97E] text-sm font-medium mb-2"
                    variants={textVariants}
                    initial="hidden"
                    animate="visible"
                    custom={details.includes ? details.includes.length + 1 : 0}
                  >
                    <span className="inline-block">
                      👥
                    </span>
                    {" "}Geeignet für
                  </motion.h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-1 gold-bullet">
                    {details.suitable.map((item, index) => (
                      <motion.li
                        key={index}
                        className="text-white/90"
                        variants={textVariants}
                        initial="hidden"
                        animate="visible"
                        custom={index + (details.includes ? details.includes.length + 2 : 1)}
                      >
                        <span className="text-sm">{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              )}

              <motion.div 
                className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-3 sm:pt-4 border-t border-white/10"
                variants={textVariants}
                initial="hidden"
                animate="visible"
                custom={
                  (details.includes ? details.includes.length : 0) + 
                  (details.suitable ? details.suitable.length : 0) + 2
                }
              >
                {details.duration && (
                  <div>
                    <p className="text-[#C8A97E] text-xs mb-1 flex items-center">
                      <span className="inline-block mr-1">
                        ⏱️
                      </span>
                      {" "}Dauer
                    </p>
                    <p className="text-white/90 text-sm">{details.duration}</p>
                  </div>
                )}
                {details.location && (
                  <div>
                    <p className="text-[#C8A97E] text-xs mb-1 flex items-center">
                      <span className="inline-block mr-1">
                        📍
                      </span>
                      {" "}Ort
                    </p>
                    <p className="text-white/90 text-sm">{details.location}</p>
                  </div>
                )}
              </motion.div>

              {link && (
                <motion.div 
                  className="mt-2 text-center"
                  variants={textVariants}
                  initial="hidden"
                  animate="visible"
                  custom={
                    (details.includes ? details.includes.length : 0) + 
                    (details.suitable ? details.suitable.length : 0) + 3
                  }
                >
                  <a 
                    href={link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block text-[#C8A97E] text-sm hover:text-[#D4B88F] transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Für mehr erfahren →
                  </a>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
} 

