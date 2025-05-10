"use client"

import { memo } from "react"
import React from 'react'
import { motion } from "framer-motion"
import Image from "next/image"
import { useState } from "react"
import { useLanguage } from "./language-switcher"
import { useTranslation } from 'react-i18next'
import { getImagePath } from '../../utils/image-path'

const collaborations = [
  // First Row
  {
    name: "B-Flat",
    logo: getImagePath('/images/collaborations/bflat.svg'),
    link: "https://b-flat-berlin.de"
  },
  {
    name: "Blue Note",
    logo: getImagePath('/images/collaborations/bluenote.svg'),
    link: "https://www.bluenote.net"
  },
  {
    name: "CVT",
    logo: getImagePath('/images/collaborations/cvt-teacher.svg'),
    link: "https://completevocalinstitute.com/complete-vocal-technique-de/"
  },
  {
    name: "CVT Deutschland",
    logo: getImagePath('/images/collaborations/cvt-deutschland.svg'),
    link: "https://cvtdeutschland.de/de"
  },
  // Second Row
  {
    name: "Jazz Institut Berlin",
    logo: getImagePath('/images/collaborations/jib.svg'),
    link: "https://www.jazz-institut-berlin.de"
  },
  {
    name: "Berliner Silber",
    logo: getImagePath('/images/collaborations/berliner-silber.svg'),
    link: "http://www.berlinersilber.de"
  },
  {
    name: "Planet Jazz",
    logo: getImagePath('/images/collaborations/planet-jazz.svg'),
    link: "https://www.planet-jazz-club-dueren.de"
  },
  {
    name: "BDG",
    logo: getImagePath('/images/collaborations/bdg.svg'),
    link: "https://www.bdg-online.org"
  }
]

// Memoized CollaborationLogo component to prevent unnecessary re-renders
const CollaborationLogo = memo(({ collab, isHovered, index, isMobile }: {
  collab: typeof collaborations[0],
  isHovered: boolean,
  index: number,
  isMobile: boolean
}) => {
  const filterClass = isHovered ? "filter-none" : "filter grayscale brightness-[1.5]";
  
  if (isMobile) {
    return (
      <div className="sm:hidden w-full h-full">
        <object
          data={collab.logo}
          type="image/svg+xml"
          aria-label={`${collab.name} logo`}
          className={`w-full h-full transition-all duration-500 ${filterClass}`}
        >
          {collab.name}
        </object>
      </div>
    );
  }
  
  return (
    <div className="hidden sm:block w-full h-full relative">
      <Image
        src={collab.logo}
        alt={`${collab.name} logo`}
        fill
        sizes="(max-width: 640px) 45vw, 17.5vw"
        quality={75}
        loading="lazy"
        className={`object-contain transition-all duration-500 ${filterClass}`}
      />
    </div>
  );
});

CollaborationLogo.displayName = 'CollaborationLogo';

const Collaborations = () => {
  const { currentLang } = useLanguage()
  const { t } = useTranslation()
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  // Split into two rows for original layout
  const firstRow = collaborations.slice(0, 4)
  const secondRow = collaborations.slice(4, 8)
  
  return (
    <section id="references" className="py-20 bg-[#040202]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="section-heading mb-4 text-white"
          >
            Referenzen <span className="amp">&</span> Kooperationen
          </motion.h2>
          <div className="w-24 h-0.5 bg-[#C8A97E] mx-auto opacity-80 mt-2"></div>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col space-y-8">
            {/* First Row */}
            <div className="flex flex-wrap justify-center items-center gap-8">
              {firstRow.map((collab, index) => (
                <motion.a
                  key={collab.name}
                  href={collab.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit ${collab.name} website`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="sm:flex sm:items-center sm:justify-center sm:w-[17.5%] 
                           flex-none w-[45%] mx-auto sm:mx-0"
                >
                  <div className="relative w-full aspect-[3/1]">
                    <CollaborationLogo 
                      collab={collab}
                      isHovered={hoveredIndex === index}
                      index={index}
                      isMobile={true}
                    />
                    <CollaborationLogo 
                      collab={collab}
                      isHovered={hoveredIndex === index}
                      index={index}
                      isMobile={false}
                    />
                  </div>
                </motion.a>
              ))}
            </div>

            {/* Second Row */}
            <div className="flex flex-wrap justify-center items-center gap-8">
              {secondRow.map((collab, index) => (
                <motion.a
                  key={collab.name}
                  href={collab.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit ${collab.name} website`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: (index + 4) * 0.1 }}
                  onMouseEnter={() => setHoveredIndex(index + 4)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="sm:flex sm:items-center sm:justify-center sm:w-[17.5%] 
                           flex-none w-[45%] mx-auto sm:mx-0"
                >
                  <div className="relative w-full aspect-[3/1]">
                    <CollaborationLogo 
                      collab={collab}
                      isHovered={hoveredIndex === index + 4}
                      index={index + 4}
                      isMobile={true}
                    />
                    <CollaborationLogo 
                      collab={collab}
                      isHovered={hoveredIndex === index + 4}
                      index={index + 4}
                      isMobile={false}
                    />
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default memo(Collaborations); 