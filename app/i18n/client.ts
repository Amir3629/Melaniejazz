'use client'

import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import resourcesToBackend from 'i18next-resources-to-backend'
import LanguageDetector from 'i18next-browser-languagedetector'

i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(resourcesToBackend((language: string, namespace: string) => 
    import(`./locales/${language}/${namespace}.json`)
  ))
  .init({
    fallbackLng: 'de',
    supportedLngs: ['de', 'en'],
    defaultNS: 'common',
    fallbackNS: 'common',
    ns: ['common'],
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  })

export default i18next
export const useTranslation = () => {
  const { t, i18n } = require('react-i18next').useTranslation()
  return { t, i18n }
} 