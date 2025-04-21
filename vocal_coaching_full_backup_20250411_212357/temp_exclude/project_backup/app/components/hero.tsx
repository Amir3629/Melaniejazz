"use client"

import { motion } from "framer-motion"
import { useLanguage } from "./language-switcher"
import { useTranslation } from 'react-i18next'

export default function Hero() {
  const { currentLang } = useLanguage()
  const { t } = useTranslation()

  return (
    <section 
      className="relative w-full min-h-screen overflow-hidden"
      style={{
        margin: 0,
        padding: 0,
        width: '100vw',
        maxWidth: '100vw',
        left: 0,
        right: 0,
        boxSizing: 'border-box'
      }}
    >
      {/* Background Video */}
      <video 
        autoPlay 
        loop 
        muted 
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
        poster="/images/preview-poster.webp"
        style={{
          width: '100vw',
          maxWidth: '100vw',
          left: 0,
          right: 0
        }}
      >
        <source src="/videos/hero-bg.mp4" type="video/mp4" />
      </video>

      {/* Overlay */}
      <div 
        className="absolute inset-0 w-full h-full bg-gradient-to-b from-black/60 via-black/50 to-black/70 z-10"
        style={{
          width: '100vw',
          maxWidth: '100vw',
          left: 0,
          right: 0
        }}
      ></div>

      {/* Content */}
      <div className="relative flex items-center justify-center w-full h-full z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto px-4 md:px-6"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="mb-6 md:mb-8"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4 text-balance">
              {t('hero.title')}
            </h1>
            <div className="w-16 md:w-24 h-0.5 bg-[#C8A97E] mx-auto opacity-80"></div>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl lg:text-3xl font-serif italic text-white/85 mb-8 md:mb-12 px-4 text-balance"
          >
            {t('hero.subtitle')}
          </motion.h2>
          <p className="text-xl text-white/80 mt-6 max-w-2xl">
            {t('hero.description')}
          </p>
          <motion.a
            href="#services"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="button-text inline-flex items-center justify-center bg-[#C8A97E] text-black px-6 md:px-8 py-3 rounded-full transition-colors hover:bg-[#D4B88F] min-w-[160px] md:min-w-[200px] mt-8"
          >
            {t('hero.cta')}
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
} 