import { getCollection } from '../../lib/tina-content'
import Link from 'next/link'
import Image from 'next/image'
import { getImagePath } from '../utils/image-path'

export const metadata = {
  title: 'Blog - Melanie Jazz',
  description: 'Articles and resources for vocalists and music enthusiasts by Melanie Jazz.',
}

export default async function BlogPage() {
  const posts = await getCollection('posts')
  
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[30vh] min-h-[250px]">
        <Image
          src={getImagePath('/images/backgrounds/services-bg.jpg')}
          alt="Blog"
          fill
          className="object-cover brightness-50"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
          <h1 className="text-4xl md:text-6xl font-light text-white drop-shadow-lg font-playfair mb-2">
            Blog
          </h1>
          <p className="text-xl text-white max-w-2xl mx-auto">
            Articles and resources for vocalists and music enthusiasts
          </p>
        </div>
      </div>
      
      {/* Blog Posts Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.length > 0 ? (
            posts.map((post) => (
              <Link 
                key={post._id} 
                href={`/blog/${post._id}`} 
                className="block bg-[#1A1A1A] rounded-lg overflow-hidden shadow-xl transition-transform duration-300 hover:-translate-y-2"
              >
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-white mb-3 line-clamp-2">
                    {post.title}
                  </h2>
                  <div className="text-gray-400 line-clamp-4">
                    {getPreviewText(post.body)}
                  </div>
                  <div className="mt-4 text-[#C8A97E] font-medium">
                    Read more →
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-gray-400">
              <p className="text-xl">No blog posts found.</p>
              <p className="mt-4">Check back soon for new content!</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

// Helper function to extract preview text from rich text content
function getPreviewText(content: any): string {
  if (!content || !content.children) {
    return ''
  }
  
  // Extract text from the first paragraph
  const paragraphs = content.children.filter((node: any) => node.type === 'p')
  if (paragraphs.length === 0) {
    return ''
  }
  
  const firstParagraph = paragraphs[0]
  return extractTextFromNode(firstParagraph)
}

function extractTextFromNode(node: any): string {
  if (!node) return ''
  
  if (node.text) {
    return node.text
  }
  
  if (node.children) {
    return node.children.map(extractTextFromNode).join('')
  }
  
  return ''
} 