"use client";

import Link from 'next/link';
import React from 'react';

interface NavigationLink {
  href: string;
  label: string;
}

interface MainNavigationProps {
  links: NavigationLink[];
}

export default function MainNavigation({ links }: MainNavigationProps) {
  return (
    <nav className="flex gap-4">
      {links.map((link, index) => (
        <Link
          key={index}
          href={link.href}
          className="text-white hover:text-white/80 transition-colors duration-300"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
} 