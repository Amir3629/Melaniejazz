"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from './language-switcher'
import { useTranslation } from 'react-i18next'
import ServiceSelection from './booking/service-selection'
import ProgressBar from './booking/progress-bar'
import LiveSingingForm from './booking/live-singing-form'
import VocalCoachingForm from './booking/vocal-coaching-form'
import WorkshopForm from './booking/workshop-form-new'
import ConfirmationStep from './booking/confirmation-step'
import { X, ArrowLeft, ArrowRight, Check } from 'lucide-react'

// Service types
type ServiceType = 'gesangsunterricht' | 'vocal-coaching' | 'professioneller-gesang' | null

// Form step type
type FormStep = 'service' | 'details' | 'confirm'

// Form data interface
interface FormData {
  // Common fields
  name: string;
  email: string;
  phone: string;
  message: string;
  
  // Live Singing fields
  eventType?: 'wedding' | 'corporate' | 'private' | 'other';
  eventDate?: string;
  guestCount?: string;
  musicPreferences?: string[];
  jazzStandards?: string;
  
  // Vocal Coaching fields
  sessionType?: '1:1' | 'group' | 'online';
  skillLevel?: 'beginner' | 'intermediate' | 'advanced';
  focusArea?: string[];
  preferredDate?: string;
  preferredTime?: string;
  
  // Workshop fields
  workshopTheme?: string;
  groupSize?: string;
  preferredDates?: string[];
  workshopDuration?: string;
  
  // Legal
  termsAccepted: boolean;
  privacyAccepted: boolean;
  serviceType: ServiceType | null;
}

// Props interface
interface BookingFormProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const BookingForm = ({ isOpen: externalIsOpen, onClose }: BookingFormProps) => {
  const { currentLang } = useLanguage()
  const { t } = useTranslation()
  
  // State for showing the booking form
  const [isOpen, setIsOpen] = useState(externalIsOpen)
  const [isClosing, setIsClosing] = useState(false)
  const [isContentVisible, setIsContentVisible] = useState(true)
  
  // State for current step and service type
  const [currentStep, setCurrentStep] = useState<FormStep>('service')
  const [serviceType, setServiceType] = useState<ServiceType>(null)
  
  // Form data state
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    message: '',
    termsAccepted: false,
    privacyAccepted: false,
    serviceType: null
  })
  
  // Effect to handle modal open/close
  useEffect(() => {
    if (externalIsOpen !== undefined) {
      setIsOpen(externalIsOpen)
      if (externalIsOpen) {
        document.documentElement.classList.add('modal-open')
      } else {
        document.documentElement.classList.remove('modal-open')
      }
    }
    
    // Cleanup when component unmounts
    return () => {
      document.documentElement.classList.remove('modal-open')
    }
  }, [externalIsOpen])
  
  // Helper function to scroll to the top of the form content
  const scrollToFormTop = () => {
    setTimeout(() => {
      const contentContainer = document.querySelector('.max-h-\\[50vh\\].overflow-y-auto');
      if (contentContainer) {
        contentContainer.scrollTop = 0;
      }
    }, 10);
  }

  // Handle service selection
  const handleServiceSelect = (service: ServiceType) => {
    setServiceType(service)
    setCurrentStep('details')
    scrollToFormTop();
  }
  
  // Handle form data changes
  const handleFormChange = (data: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...data }))
  }
  
  // Go to next step
  const goToNextStep = () => {
    if (currentStep === 'service') {
      setCurrentStep('details')
      scrollToFormTop();
    } else if (currentStep === 'details') {
      setCurrentStep('confirm')
      scrollToFormTop();
    }
  }
  
  // Go to previous step
  const goToPrevStep = () => {
    if (currentStep === 'details') {
      setCurrentStep('service')
      scrollToFormTop();
    } else if (currentStep === 'confirm') {
      setCurrentStep('details')
      scrollToFormTop();
    }
  }
  
  // Submit form
  const handleSubmit = () => {
    // Here you would typically send the data to your backend
    console.log('Form submitted:', formData)
    
    // Show success message and close form
    alert(t('booking.successMessage', 'Buchung erfolgreich eingereicht! Wir werden uns in Kürze bei Ihnen melden.'))
    closeBookingForm()
  }
  
  // Define animation variants
  const modalVariants = {
    open: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] }
    },
    closed: {
      opacity: 0,
      scale: 0.95,
      y: 20,
      transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] }
    }
  }

  const contentVariants = {
    open: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] }
    },
    closing: {
      opacity: 0,
      scale: 0.98,
      transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] }
    }
  }

  const backdropVariants = {
    open: {
      opacity: 1,
      backdropFilter: "blur(2px)",
      transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] }
    },
    closed: {
      opacity: 0,
      backdropFilter: "blur(0px)",
      transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] }
    }
  }

  // Close booking form with smooth simultaneous animations
  const closeBookingForm = () => {
    setIsClosing(true)
    
    // First animate content fading
    setTimeout(() => {
      // Then animate modal closing
      setTimeout(() => {
        setIsClosing(false)
        setIsOpen(false)
        if (onClose) {
          onClose()
        }
      }, 300)
    }, 500)
  }
  
  // Reset visibility when opening
  useEffect(() => {
    if (isOpen) {
      setIsContentVisible(true)
      setIsClosing(false)
    }
  }, [isOpen])
  
  // Determine if form is valid for current step
  const isCurrentStepValid = () => {
    if (currentStep === 'service') {
      return serviceType !== null
    }
    
    if (currentStep === 'details') {
      // Basic validation for details step
      return formData.name.trim() !== '' && 
             formData.email.trim() !== '' && 
             formData.phone.trim() !== ''
    }
    
    if (currentStep === 'confirm') {
      return formData.termsAccepted
    }
    
    return false
  }
  
  // Render service-specific form based on selected service
  const renderServiceForm = () => {
    switch(serviceType) {
      case 'professioneller-gesang':
        return (
          <LiveSingingForm 
            formData={formData} 
            onChange={handleFormChange} 
          />
        )
      case 'vocal-coaching':
        return (
          <VocalCoachingForm 
            formData={formData} 
            onChange={handleFormChange} 
          />
        )
      case 'gesangsunterricht':
        return (
          <WorkshopForm 
            formData={formData} 
            onChange={handleFormChange} 
          />
        )
      default:
        return null
    }
  }
  
  const getBookingTitle = () => {
    switch(serviceType) {
      case 'professioneller-gesang':
        return t('booking.liveSingingTitle', 'Live Jazz Performance buchen')
      case 'vocal-coaching':
        return t('booking.vocalCoachingTitle', 'Vocal Coaching buchen')
      case 'gesangsunterricht':
        return t('booking.workshopTitle', 'Jazz Workshop buchen')
      default:
        return t('booking.title', 'Termin buchen')
    }
  }
  
  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-[2px] z-[100]"
            variants={backdropVariants}
            initial="closed"
            animate={isClosing ? "closed" : "open"}
            exit="closed"
            onClick={closeBookingForm}
          />

          {/* Modal Container */}
          <div className="fixed inset-0 overflow-y-auto z-[101]">
            <div className="flex min-h-full items-center justify-center p-2 md:p-4">
              <motion.div
                className="relative w-full max-w-2xl bg-[#0A0A0A] rounded-xl border border-[#C8A97E]/20 shadow-2xl overflow-hidden"
                variants={modalVariants}
                initial="closed"
                animate={isClosing ? "closed" : "open"}
                exit="closed"
              >
                {/* Content Container */}
                <motion.div 
                  className="px-6 py-4 w-full"
                  variants={contentVariants}
                  initial="open"
                  animate={isClosing ? "closing" : "open"}
                >
                  {/* Close button */}
                  <button 
                    onClick={closeBookingForm}
                    className="absolute top-2 right-2 sm:top-3 sm:right-3 w-5 h-5 flex items-center justify-center z-10"
                    aria-label="Close booking form"
                  >
                    <span className="relative block w-4 h-4">
                      <span className="absolute top-1/2 left-0 w-full h-[1.5px] bg-[#C8A97E] rotate-45 -translate-y-1/2"></span>
                      <span className="absolute top-1/2 left-0 w-full h-[1.5px] bg-[#C8A97E] -rotate-45 -translate-y-1/2"></span>
                    </span>
                  </button>
                  
                  <h2 className="text-lg font-bold text-white mb-5 text-center mt-1">
                    {getBookingTitle()}
                  </h2>
                  
                  {/* Progress Bar */}
                  <div className="mb-6">
                    <ProgressBar currentStep={currentStep} />
                  </div>
                  
                  {/* Scrollable content area */}
                  <div className="max-h-[50vh] overflow-y-auto pr-2 mb-4 custom-scrollbar sm:px-4 w-full">

                    {/* Step 1: Service Selection */}
                    {currentStep === 'service' && (
                      <ServiceSelection 
                        selectedService={serviceType} 
                        onSelect={handleServiceSelect} 
                      />
                    )}
                    
                    {/* Step 2: Service-specific Form */}
                    {currentStep === 'details' && renderServiceForm()}
                    
                    {/* Step 3: Confirmation */}
                    {currentStep === 'confirm' && (
                      <ConfirmationStep 
                        formData={formData} 
                        serviceType={serviceType}
                        onChange={handleFormChange}
                        onClose={closeBookingForm}
                      />
                    )}
                  </div>
                  
                  {/* Navigation Buttons */}
                  <div className="flex justify-between mt-4">
                    {currentStep !== 'service' ? (
                        <button
                        onClick={goToPrevStep}
                        className="px-6 py-2 border border-gray-700 text-gray-300 rounded-full hover:border-gray-500 transition-colors flex items-center"
                        >
                        <ArrowLeft size={16} className="mr-2" />
                          {t('booking.back', 'Zurück')}
                        </button>
                    ) : (
                      <div></div> // Empty div to maintain flex spacing
                    )}
                    
                    {currentStep !== 'confirm' && (
                      <button
                        onClick={goToNextStep}
                        disabled={!isCurrentStepValid()}
                        className={`px-6 py-2 rounded-full flex items-center ${
                          isCurrentStepValid()
                            ? 'bg-[#C8A97E] text-black font-medium hover:bg-[#D4AF37] transition-colors'
                            : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {t('booking.continue', 'Weiter')}
                        <ArrowRight size={16} className="ml-2" />
                      </button>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

export default BookingForm;
