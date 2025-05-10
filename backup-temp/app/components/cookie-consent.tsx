"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if user has already accepted cookies
    const hasAccepted = localStorage.getItem("cookieConsent")
    if (!hasAccepted) {
      // Show cookie banner after a short delay
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  const acceptCookies = () => {
    localStorage.setItem("cookieConsent", "true")
    setIsVisible(false)
  }

  const dismissCookies = () => {
    setIsVisible(false)
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-[#0A0A0A] border-t border-gray-800"
        >
          <div className="container mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex-1">
              <p className="text-gray-300 text-sm md:text-base">
                Diese Website verwendet Cookies, um Ihr Browsererlebnis zu verbessern. Durch die Nutzung unserer Website stimmen Sie allen Cookies gemäß unserer{" "}
                <Link href="/legal/datenschutz" className="text-[#C8A97E] underline">
                  Datenschutzrichtlinie
                </Link>{" "}
                zu.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={acceptCookies}
                className="px-4 py-2 text-sm bg-[#C8A97E] text-black rounded hover:bg-[#D4AF37] transition-colors"
              >
                Akzeptieren
              </button>
              <button
                onClick={dismissCookies}
                className="p-2 text-gray-400 hover:text-white"
                aria-label="Dismiss"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default CookieConsent