"use client";

import React, { useState, useRef, useEffect } from 'react';
import { FaMusic, FaMicrophone, FaStar, FaMagic } from 'react-icons/fa';

interface FlipCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  backContent: string;
  funFact?: string;
}

const FlipCard: React.FC<FlipCardProps> = ({ 
  title, 
  description, 
  icon,
  backContent,
  funFact
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsFlipped(true);
  };

  const handleMouseLeave = () => {
    // Remove the delay before flipping back
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsFlipped(false);
  };

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div 
      className="w-full aspect-square" // Force square aspect ratio
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div 
        className="relative w-full h-full"
        style={{ 
          perspective: "1000px"
        }}
      >
        {/* Card container */}
        <div 
          className="w-full h-full"
          style={{ 
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
            transformStyle: "preserve-3d",
            transition: "transform 1.5s" // Slower animation (1.5s)
          }}
        >
          {/* Front side */}
          <div 
            className="absolute inset-0 flex flex-col items-center p-6 bg-[#0A0A0A] rounded-lg overflow-hidden cursor-pointer shadow-lg shadow-black/40"
            style={{ 
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              textAlign: "center"
            }}
          >
            <div className="flex-1"></div>
            <div className="flex items-center justify-center w-full mb-4">
              <div className="text-[#C8A97E] text-4xl">
                {icon}
              </div>
            </div>
            <div className="flex flex-col items-center justify-center w-full mb-8">
              <h3 className="text-white text-xl font-medium mb-2 text-center" style={{ textAlign: "center" }}>{title}</h3>
              <p className="text-[#C8A97E] text-sm text-center" style={{ textAlign: "center" }}>{description}</p>
            </div>
            <div className="flex-1"></div>
          </div>

          {/* Back side */}
          <div 
            className="absolute inset-0 flex flex-col items-center p-6 bg-[#0A0A0A] rounded-lg overflow-hidden cursor-pointer shadow-lg shadow-black/40"
            style={{ 
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              textAlign: "center"
            }}
          >
            <div className="flex-1"></div>
            <div className="flex flex-col items-center justify-center w-full mb-4">
              <p className="text-gray-300 text-sm text-center" style={{ textAlign: "center" }}>{backContent}</p>
              
              {funFact && (
                <div className="mt-4 w-full flex flex-col items-center justify-center">
                  <p className="text-[#C8A97E] text-xs font-bold text-center" style={{ textAlign: "center" }}>Wusstest du schon?</p>
                  <p className="text-gray-300 text-xs text-center" style={{ textAlign: "center" }}>{funFact}</p>
                </div>
              )}
            </div>
            <div className="flex-1"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FlipCards: React.FC = () => {
  return (
    <div className="w-full py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="aspect-square w-full">
            <FlipCard 
              title="Deine Stimme, Verstärkt"
              description="Entdecke dein volles Potenzial"
              icon={<FaMicrophone />}
              backContent="Die menschliche Stimme kann über 100 Instrumente imitieren. Lerne, deine für Konzerte, Studioaufnahmen oder intime Jazz-Auftritte zu nutzen."
            />
          </div>
          
          <div className="aspect-square w-full">
            <FlipCard 
              title="Das Geheimnis des Jazz-Flüsterers"
              description="Spoiler: Nicht mit Tonleitern"
              icon={<FaMusic />}
              backContent="Ella Fitzgerald sagte einmal, Jazz sei 'die einzige ungeplante Magie der Welt.' Beherrsche die Kunst der Improvisation und verwandle 'Fehler' in Soli."
            />
          </div>
          
          <div className="aspect-square w-full">
            <FlipCard 
              title="Bühnenphysik 101"
              description="Deine Stimme ist klüger als Methoden"
              icon={<FaStar />}
              backContent="90% der Bühnenpräsenz ist nicht deine Stimme—es ist Atemkontrolle, Augenkontakt und die Pause zwischen den Noten. Beherrsche Räume wie ein Profi."
              funFact="Nein, du brauchst kein 'natürliches Talent'—nur intelligentes Üben."
            />
          </div>
          
          <div className="aspect-square w-full">
            <FlipCard 
              title="Stimmliche Alchemie"
              description="Die 4-Uhr-Wahrheiten des stimmlichen Erfolgs"
              icon={<FaMagic />}
              backContent="Verwandle Flüstern in Kraft, Brüche in Charakter. Deine einzigartigen Makel? Sie sind deine Signatur. Lass uns sie verfeinern."
              funFact="Rockstars wie Freddie Mercury nutzten stimmliche 'Unvollkommenheiten' als Markenzeichen!"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlipCards; 