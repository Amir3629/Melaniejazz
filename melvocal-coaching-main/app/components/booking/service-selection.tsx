"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Mic, Music, Calendar, Check } from 'lucide-react'

// Service types
type ServiceType = 'gesangsunterricht' | 'vocal-coaching' | 'professioneller-gesang' | null

interface ServiceSelectionProps {
  selectedService: ServiceType
  onSelect: (service: ServiceType) => void
}

export default function ServiceSelection({ selectedService, onSelect }: ServiceSelectionProps) {
  const { t } = useTranslation()
  
  // Card animation variants
  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.1 * index,
        duration: 0.4,
        ease: "easeOut"
      }
    }),
    hover: {
      y: -5,
      boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)",
      transition: {
        duration: 0.2
      }
    },
    tap: {
      scale: 0.98,
      transition: {
        duration: 0.1
      }
    }
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto px-4 sm:px-0"
    >
      <div className="mb-6 sm:mb-8">
        <h3 className="text-xl sm:text-2xl font-semibold text-white mb-2">
          {t('booking.selectService', 'Dienst auswählen')}
        </h3>
        <p className="text-sm sm:text-base text-gray-400">
          {t('booking.selectServiceDesc', 'Wählen Sie den gewünschten Service aus.')}
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-3 sm:gap-4">
        {/* Live Jazz Performance */}
        <motion.div 
          variants={cardVariants}
          initial="initial"
          animate="animate"
          whileHover="hover"
          whileTap="tap"
          custom={0}
          className={`relative p-4 sm:p-6 rounded-xl border cursor-pointer transition-all duration-300 transform ${
            selectedService === 'professioneller-gesang' 
              ? 'bg-gradient-to-br from-[#1A1A1A] to-[#222] border-[#C8A97E] shadow-lg shadow-[#C8A97E]/10' 
              : 'bg-gradient-to-br from-[#0A0A0A] to-[#151515] border-gray-800 hover:border-[#C8A97E]/50'
          }`}
          onClick={() => onSelect('professioneller-gesang')}
        >
          <div className="flex items-start sm:items-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#1A1A1A] flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
              <Mic className="w-5 h-5 sm:w-6 sm:h-6 text-[#C8A97E]" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-base sm:text-lg font-medium text-white mb-1">
                {t('booking.liveJazzPerformance', 'Live Jazz Performance')}
              </h4>
              <p className="text-sm text-gray-400">
                {t('booking.nachVereinbarung', 'Nach Vereinbarung')}
              </p>
            </div>
            {selectedService === 'professioneller-gesang' && (
              <div className="w-8 h-8 rounded-full bg-[#C8A97E] flex items-center justify-center ml-3 sm:ml-4 flex-shrink-0">
                <Check className="w-5 h-5 text-black" />
              </div>
            )}
          </div>
        </motion.div>
        
        {/* Vocal Coaching & Gesangsunterricht */}
        <motion.div 
          variants={cardVariants}
          initial="initial"
          animate="animate"
          whileHover="hover"
          whileTap="tap"
          custom={1}
          className={`relative p-4 sm:p-6 rounded-xl border cursor-pointer transition-all duration-300 transform ${
            selectedService === 'vocal-coaching' 
              ? 'bg-gradient-to-br from-[#1A1A1A] to-[#222] border-[#C8A97E] shadow-lg shadow-[#C8A97E]/10' 
              : 'bg-gradient-to-br from-[#0A0A0A] to-[#151515] border-gray-800 hover:border-[#C8A97E]/50'
          }`}
          onClick={() => onSelect('vocal-coaching')}
        >
          <div className="flex items-start sm:items-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#1A1A1A] flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
              <Music className="w-5 h-5 sm:w-6 sm:h-6 text-[#C8A97E]" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-base sm:text-lg font-medium text-white mb-1">
                {t('booking.vocalCoachingAndGesang', 'Vocal Coaching & Gesangsunterricht')}
              </h4>
              <p className="text-sm text-gray-400">
                60 min
              </p>
            </div>
            {selectedService === 'vocal-coaching' && (
              <div className="w-8 h-8 rounded-full bg-[#C8A97E] flex items-center justify-center ml-3 sm:ml-4 flex-shrink-0">
                <Check className="w-5 h-5 text-black" />
              </div>
            )}
          </div>
        </motion.div>
        
        {/* Jazz Workshop */}
        <motion.div 
          variants={cardVariants}
          initial="initial"
          animate="animate"
          whileHover="hover"
          whileTap="tap"
          custom={2}
          className={`relative p-4 sm:p-6 rounded-xl border cursor-pointer transition-all duration-300 transform ${
            selectedService === 'gesangsunterricht' 
              ? 'bg-gradient-to-br from-[#1A1A1A] to-[#222] border-[#C8A97E] shadow-lg shadow-[#C8A97E]/10' 
              : 'bg-gradient-to-br from-[#0A0A0A] to-[#151515] border-gray-800 hover:border-[#C8A97E]/50'
          }`}
          onClick={() => onSelect('gesangsunterricht')}
        >
          <div className="flex items-start sm:items-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#1A1A1A] flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
              <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-[#C8A97E]" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-base sm:text-lg font-medium text-white mb-1">
                {t('booking.jazzWorkshop', 'Jazz Workshop')}
              </h4>
              <p className="text-sm text-gray-400">
                {t('booking.variableDuration', 'Variable Dauer')}
              </p>
            </div>
            {selectedService === 'gesangsunterricht' && (
              <div className="w-8 h-8 rounded-full bg-[#C8A97E] flex items-center justify-center ml-3 sm:ml-4 flex-shrink-0">
                <Check className="w-5 h-5 text-black" />
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
} 