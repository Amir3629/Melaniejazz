import React from 'react';
import Image from 'next/image';
import { Mic, Music, Users, Star } from 'lucide-react';

const iconMap = {
  mic: Mic,
  music: Music,
  users: Users,
  star: Star,
};

export default function ServiceCard({ title, description, icon, image }) {
  const IconComponent = iconMap[icon] || Mic;
  
  return (
    <div className="bg-[#1A1A1A] rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      {image && (
        <div className="relative h-48 w-full">
          <Image
            src={image}
            alt={title}
            fill
            style={{ objectFit: 'cover' }}
          />
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-center mb-4">
          <div className="bg-[#C8A97E] p-2 rounded-lg mr-3">
            <IconComponent className="h-5 w-5 text-black" />
          </div>
          <h3 className="text-xl font-bold text-white">{title}</h3>
        </div>
        
        <p className="text-gray-300">{description}</p>
        
        <div className="mt-6">
          <a 
            href="#contact" 
            className="inline-block px-4 py-2 border border-[#C8A97E] text-[#C8A97E] rounded hover:bg-[#C8A97E] hover:text-black transition-colors"
          >
            Learn More
          </a>
        </div>
      </div>
    </div>
  );
} 