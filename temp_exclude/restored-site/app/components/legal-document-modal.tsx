"use client"

import React, { Fragment, useRef, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface LegalDocumentModalProps {
  children: React.ReactNode
  isOpen: boolean
  onClose: () => void
  title?: string
}

export default function LegalDocumentModal({ 
  children, 
  isOpen, 
  onClose,
  title
}: LegalDocumentModalProps) {
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
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-[2px] z-[9999]"
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ 
              opacity: 1, 
              backdropFilter: "blur(2px)",
              transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] }
            }}
            exit={{ 
              opacity: 0, 
              backdropFilter: "blur(0px)",
              transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] }
            }}
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 overflow-y-auto z-[10000]">
            <div className="flex min-h-full items-center justify-center p-4">
              <motion.div
                className="relative w-full max-w-3xl bg-[#0A0A0A] rounded-xl border border-[#C8A97E]/20 shadow-2xl overflow-hidden"
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] }
                }}
                exit={{
                  opacity: 0,
                  y: 20,
                  scale: 0.95,
                  transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] }
                }}
              >
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-gray-800">
                  <h2 className="text-xl font-semibold text-white">{title}</h2>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Content */}
                <div className="max-h-[70vh] overflow-y-auto p-6 custom-scrollbar">
                  {children}
                </div>
              </motion.div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
} 