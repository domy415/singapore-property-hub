import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArticleStatus } from '@prisma/client'

// Force Node.js runtime for Prisma compatibility
export const runtime = 'nodejs'

interface Props {
  params: { slug: string }
}

async function getArticle(slug: string) {
  // Return mock data to test if database query is the issue
  return {
    id: 'test-id',
    title: 'Test Article - Database Bypassed',
    slug: slug,
    content: 'This is test content to isolate the server-side exception issue.',
    excerpt: 'Test excerpt',
    publishedAt: new Date(),
    author: {
      name: 'Test Author'
    }
  }
  
  /* Temporarily commented out to test
  try {
    // Dynamic import to avoid build-time initialization
    const { prisma } = await import('@/lib/prisma')
    
    const article = await prisma.article.findFirst({
      where: {
        slug: slug,
        status: ArticleStatus.PUBLISHED
      },
      include: {
        author: true
      }
    })
    
    return article
  } catch (error) {
    console.error('Error fetching article:', error)
    return null
  }
  */
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await getArticle(params.slug)
  
  if (!article) {
    return {
      title: 'Article Not Found | Singapore Property Hub',
      description: 'The requested article could not be found.'
    }
  }
  
  return {
    title: `${article.title} | Singapore Property Hub`,
    description: article.excerpt
  }
}

export default async function ArticlePageMinimal({ params }: Props) {
  const article = await getArticle(params.slug)
  
  if (!article) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-green-800 mb-4">✅ Minimal Article Page Working!</h2>
          <p className="text-green-700">
            This confirms the server-side exception was caused by a specific import or component.
          </p>
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          {article.title}
        </h1>
        
        <div className="prose max-w-none">
          <p><strong>Author:</strong> {article.author.name}</p>
          <p><strong>Published:</strong> {article.publishedAt?.toLocaleDateString()}</p>
          <p><strong>Excerpt:</strong> {article.excerpt}</p>
          
          <h3>Raw Content Preview:</h3>
          <div className="bg-gray-50 p-4 rounded-lg" style={{whiteSpace: 'pre-wrap'}}>
            {article.content.substring(0, 500)}...
          </div>
        </div>
      </div>
    </div>
  )
}