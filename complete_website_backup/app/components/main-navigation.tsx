"use client"

import Link from 'next/link'
import { useTranslation } from 'react-i18next'

interface NavLink {
  href: string
  label: string
}

export default function MainNavigation() {
  const { t } = useTranslation()
  
  const links: NavLink[] = [
    { href: '/', label: t('nav.home', 'Home') },
    { href: '/about', label: t('nav.about', 'Über mich') },
    { href: '/services', label: t('nav.services', 'Leistungen') },
    { href: '/contact', label: t('nav.contact', 'Kontakt') }
  ]

  return (
    <nav className="flex gap-6">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="text-white hover:text-white/80 transition-colors duration-300"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  )
} 