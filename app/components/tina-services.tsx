import React from 'react'
import { getCollection } from '../../lib/tina-content'
import Image from 'next/image'
import { getImagePath } from '../utils/image-path'

interface Service {
  _id: string
  title: string
  description: string
  image: string
  price: string
  featured: boolean
}

// Component to display all services or featured services
export async function TinaServices({ featuredOnly = false }: { featuredOnly?: boolean }) {
  const services = await getCollection('services')
  const filteredServices = featuredOnly 
    ? services.filter(service => service.featured) 
    : services

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {filteredServices.map((service: Service) => (
        <ServiceCard key={service._id} service={service} />
      ))}
    </div>
  )
}

// Individual service card component
function ServiceCard({ service }: { service: Service }) {
  const imagePath = service.image || '/images/services/placeholder.jpg'

  return (
    <div className="bg-[#1A1A1A] rounded-lg overflow-hidden shadow-xl">
      <div className="relative h-48">
        <Image 
          src={getImagePath(imagePath)}
          alt={service.title}
          className="object-cover"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-white mb-2">{service.title}</h3>
        <p className="text-gray-300 mb-4">{service.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-yellow-500 font-semibold">{service.price}</span>
          <a 
            href="/booking" 
            className="px-4 py-2 bg-[#C8A97E] hover:bg-[#B8996E] text-white rounded transition duration-300"
          >
            Book Now
          </a>
        </div>
      </div>
    </div>
  )
} 