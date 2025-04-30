"use client"

import React, { Fragment, useRef, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Dialog, Transition } from '@headlessui/react'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import TranslatedText from './TranslatedText'

// Dynamically import legal document contents
const ImpressumContent = dynamic(
  () => import('@/app/legal/impressum/page').catch(() => () => <div className="text-red-500">Failed to load Impressum</div>),
  { loading: () => <p className="text-gray-400">Loading...</p>, ssr: false }
)

const DatenschutzContent = dynamic(
  () => import('@/app/legal/datenschutz/page').catch(() => () => <div className="text-red-500">Failed to load Datenschutz</div>),
  { loading: () => <p className="text-gray-400">Loading...</p>, ssr: false }
)

const AGBContent = dynamic(
  () => import('@/app/legal/agb/page').catch(() => () => <div className="text-red-500">Failed to load AGB</div>),
  { loading: () => <p className="text-gray-400">Loading...</p>, ssr: false }
)

// Define Widerrufsrecht if it exists and is needed
/*
const WiderrufsrechtContent = dynamic(
  () => import('@/app/legal/widerrufsrecht/page').catch(() => () => <div className="text-red-500">Failed to load Widerrufsrecht</div>),
  { loading: () => <p className="text-gray-400">Loading...</p>, ssr: false }
)
*/

interface LegalDocumentModalProps {
  children?: React.ReactNode
  isOpen?: boolean
  onClose?: () => void
  documentType?: string
  title?: string
}

const LegalDocumentModal = ({ 
  children, 
  isOpen, 
  onClose,
  documentType,
  title
}: LegalDocumentModalProps) => {
  if (!isOpen) return null;
  
  const cancelButtonRef = useRef(null)
  const contentRef = useRef<HTMLDivElement>(null)
  
  // Prevent scroll propagation when reaching the top or bottom of the modal content
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const { currentTarget } = e;
    const isAtTop = currentTarget.scrollTop === 0;
    const isAtBottom = 
      currentTarget.scrollHeight - currentTarget.scrollTop <= currentTarget.clientHeight + 1;
    
    if ((isAtTop && e.deltaY < 0) || (isAtBottom && e.deltaY > 0)) {
      e.stopPropagation();
      e.preventDefault();
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/70 z-[5000]"
            onClick={onClose}
          />
          <div className="fixed inset-0 flex items-center justify-center z-[5001] p-4">
              <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-[#0A0A0A] rounded-xl max-w-4xl w-full max-h-[90vh] shadow-2xl border border-goldAccent/30 overflow-hidden relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 flex justify-between items-center border-b border-goldAccent/20">
                <h2 className="text-xl font-semibold text-white">
                  {title || (
                    <>
                      {documentType === 'impressum' && <TranslatedText text="Impressum" />}
                      {documentType === 'datenschutz' && <TranslatedText text="Datenschutz" />}
                      {documentType === 'agb' && <TranslatedText text="AGB" />}
                      {documentType === 'widerrufsrecht' && <TranslatedText text="Widerrufsrecht" />}
                      {!documentType && <TranslatedText text="Dokument" />}
                    </>
                  )}
                </h2>
              </div>
              {/* Close button */}
                  <button
                    onClick={onClose}
                className="absolute top-2 right-2 sm:top-3 sm:right-3 w-5 h-5 flex items-center justify-center z-10"
                aria-label="Close modal"
                  >
                <span className="relative block w-4 h-4">
                  <span className="absolute top-1/2 left-0 w-full h-[1.5px] bg-[#C8A97E] rotate-45 -translate-y-1/2"></span>
                  <span className="absolute top-1/2 left-0 w-full h-[1.5px] bg-[#C8A97E] -rotate-45 -translate-y-1/2"></span>
                </span>
                  </button>
              <div 
                className="p-6 overflow-y-auto custom-scrollbar max-h-[calc(90vh-70px)]"
                onWheel={handleWheel}
                ref={contentRef}
              >
                {documentType === 'impressum' && (
                  <div className="legal-document-content legal-impressum">
                     <ImpressumContent isModal={true} />
                  </div>
                )}
                
                {documentType === 'datenschutz' && (
                  <div className="legal-document-content legal-datenschutz">
                    <DatenschutzContent isModal={true} />
                  </div>
                )}
                
                {documentType === 'agb' && (
                  <div className="legal-document-content legal-agb">
                    <AGBContent isModal={true} />
                  </div>
                )}
                
                {documentType === 'widerrufsrecht' && (
                  // Only render placeholder if WiderrufsrechtContent isn't defined/imported
                  <div className="text-gray-300 space-y-4">
                    <h3 className="text-lg font-medium text-white">Widerrufsbelehrung</h3>
                    <p>Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen.</p>
                    <p>Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag des Vertragsabschlusses.</p>
                    <p>Um Ihr Widerrufsrecht auszuüben, müssen Sie uns mittels einer eindeutigen Erklärung über Ihren Entschluss, diesen Vertrag zu widerrufen, informieren.</p>
                     {/* <WiderrufsrechtContent isModal={true} /> */} 
                </div>
                )}

                {/* Render children ONLY if no documentType is specified */}
                {!documentType && children}
                </div>
              </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
} 

export default LegalDocumentModal;
