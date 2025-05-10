import { getPageBySlug, getCollection } from '../../../lib/tina-content'
import RichText from '../../components/tina-rich-text'
import Image from 'next/image'
import { getImagePath } from '../../utils/image-path'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  const pages = await getCollection('pages')
  return pages.map((page) => ({
    slug: page._id,
  }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const page = await getPageBySlug(params.slug)
  
  if (!page) {
    return {
      title: 'Page Not Found',
      description: 'The requested page could not be found.',
    }
  }
  
  return {
    title: `${page.title} - Melanie Jazz`,
    description: page.heroSubheading || 'Melanie Jazz - Professional Vocal Coach',
  }
}

export default async function DynamicPage({ params }: { params: { slug: string } }) {
  const page = await getPageBySlug(params.slug)
  
  if (!page) {
    notFound()
  }
  
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      {page.heroImage && (
        <div className="relative h-[50vh] min-h-[400px]">
          <Image
            src={getImagePath(page.heroImage)}
            alt={page.title}
            fill
            className="object-cover brightness-75"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center p-6">
            <h1 className="text-4xl md:text-6xl font-light text-white drop-shadow-lg font-playfair mb-4">
              {page.heroHeading || page.title}
            </h1>
            {page.heroSubheading && (
              <p className="text-xl text-white max-w-2xl mx-auto">
                {page.heroSubheading}
              </p>
            )}
          </div>
        </div>
      )}
      
      {/* Content Section */}
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        {!page.heroImage && (
          <h1 className="text-4xl md:text-5xl font-light text-white mb-8 font-playfair">
            {page.title}
          </h1>
        )}
        
        {page.content && <RichText content={page.content} />}
      </div>
    </main>
  )
} 