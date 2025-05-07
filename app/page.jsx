import { getContentFile, getContentFiles } from '../lib/contentUtils';
import Image from 'next/image';

// Import existing components if needed
import ServiceCard from '../components/ServiceCard';
import TestimonialSlider from '../components/TestimonialSlider';

export async function generateStaticParams() {
  // This ensures Next.js knows to static render this page
  return [{}];
}

export default function Home() {
  // Get content from markdown files
  const { frontmatter, html } = getContentFile('content/pages/home.md');
  const services = getContentFiles('content/services', { featured: true });
  const testimonials = getContentFiles('content/testimonials', { featured: true });
  
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center">
        {frontmatter.heroImage && (
          <div className="absolute inset-0 z-0">
            <Image
              src={frontmatter.heroImage}
              alt={frontmatter.title}
              fill
              style={{ objectFit: 'cover', objectPosition: 'center' }}
              priority
            />
            <div className="absolute inset-0 bg-black opacity-50" />
          </div>
        )}
        
        <div className="container mx-auto px-4 z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            {frontmatter.title}
          </h1>
          <h2 className="text-xl md:text-2xl text-gray-200 mb-8">
            {frontmatter.subtitle}
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            {frontmatter.description}
          </p>
          
          {frontmatter.sampleAudio && (
            <div className="mt-8">
              <audio 
                className="mx-auto" 
                controls 
                src={frontmatter.sampleAudio}
              >
                Your browser does not support the audio element.
              </audio>
            </div>
          )}
          
          <div className="mt-8">
            <a 
              href="#services" 
              className="bg-[#C8A97E] text-black px-8 py-3 rounded-lg font-medium hover:bg-[#D4AF37] transition-colors"
            >
              Explore Services
            </a>
          </div>
        </div>
      </section>
      
      {/* Services Section */}
      <section id="services" className="py-16 bg-[#0A0A0A]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            Our Services
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service) => (
              <ServiceCard 
                key={service.id}
                title={service.title}
                description={service.description}
                icon={service.icon}
                image={service.image}
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-16 bg-[#121212]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            What Our Clients Say
          </h2>
          
          <TestimonialSlider testimonials={testimonials} />
        </div>
      </section>
      
      {/* Content Section */}
      <section className="py-16 bg-[#0A0A0A]">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto prose prose-invert" 
               dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      </section>
    </main>
  );
} 