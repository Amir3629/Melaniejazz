"use client"

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

export default function Collaborations() {
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
          <div className="flex flex-col space-y-16">
            {/* First Row */}
            <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-8">
              {firstRow.map((collab, index) => (
                <motion.a
                  key={collab.name}
                  href={collab.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="flex items-center justify-center w-[35%] sm:w-[17.5%] max-w-[150px] sm:max-w-none"
                >
                  <div className="relative w-full aspect-[3/1]">
                    <Image
                      src={collab.logo}
                      alt={collab.name}
                      fill
                      className={`object-contain transition-all duration-500 scale-150 sm:scale-100 ${
                        hoveredIndex === index ? "filter-none" : "filter grayscale brightness-[1.5]"
                      }`}
                    />
                  </div>
                </motion.a>
              ))}
            </div>

            {/* Second Row */}
            <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-8">
              {secondRow.map((collab, index) => (
                <motion.a
                  key={collab.name}
                  href={collab.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: (index + 4) * 0.1 }}
                  onMouseEnter={() => setHoveredIndex(index + 4)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="flex items-center justify-center w-[35%] sm:w-[17.5%] max-w-[150px] sm:max-w-none"
                >
                  <div className="relative w-full aspect-[3/1]">
                    <Image
                      src={collab.logo}
                      alt={collab.name}
                      fill
                      className={`object-contain transition-all duration-500 scale-150 sm:scale-100 ${
                        hoveredIndex === index + 4 ? "filter-none" : "filter grayscale brightness-[1.5]"
                      }`}
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