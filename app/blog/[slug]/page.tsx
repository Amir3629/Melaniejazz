import { getContentItem, getCollection } from '../../../lib/tina-content'
import RichText from '../../components/tina-rich-text'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  const posts = await getCollection('posts')
  return posts.map((post) => ({
    slug: post._id,
  }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getContentItem('posts', params.slug)
  
  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The requested post could not be found.',
    }
  }
  
  return {
    title: `${post.title} - Melanie Jazz Blog`,
    description: getPreviewText(post.body),
  }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getContentItem('posts', params.slug)
  
  if (!post) {
    notFound()
  }
  
  // Get more posts for the recommended section
  const allPosts = await getCollection('posts')
  const otherPosts = allPosts
    .filter((p) => p._id !== params.slug)
    .slice(0, 3)
  
  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        {/* Back link */}
        <Link 
          href="/blog" 
          className="inline-flex items-center mb-8 text-[#C8A97E] hover:text-[#E5C699] transition-colors"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="mr-2"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Blog
        </Link>
        
        {/* Post title */}
        <h1 className="text-3xl md:text-5xl font-light text-white mb-8 font-playfair">
          {post.title}
        </h1>
        
        {/* Post content */}
        <div className="bg-[#1A1A1A] rounded-lg p-8 shadow-xl">
          {post.body && <RichText content={post.body} />}
        </div>
      </div>
      
      {/* Recommended posts */}
      {otherPosts.length > 0 && (
        <div className="bg-black py-12">
          <div className="container mx-auto px-6 max-w-6xl">
            <h2 className="text-2xl md:text-3xl font-light text-white mb-8 font-playfair">
              More Articles
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {otherPosts.map((post) => (
                <Link 
                  key={post._id} 
                  href={`/blog/${post._id}`} 
                  className="block bg-[#1A1A1A] rounded-lg overflow-hidden shadow-xl transition-transform duration-300 hover:-translate-y-2"
                >
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-white mb-3 line-clamp-2">
                      {post.title}
                    </h3>
                    <div className="text-gray-400 line-clamp-2">
                      {getPreviewText(post.body)}
                    </div>
                    <div className="mt-4 text-[#C8A97E] font-medium">
                      Read more →
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
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