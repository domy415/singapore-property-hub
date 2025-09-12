import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArticleStatus } from '@prisma/client'

// Force Node.js runtime for Prisma compatibility
export const runtime = 'nodejs'

interface Props {
  params: { slug?: string }
}

async function getArticleData() {
  try {
    // Dynamic import to avoid build-time initialization
    const { prisma } = await import('@/lib/prisma')
    
    const article = await prisma.article.findFirst({
      where: {
        status: ArticleStatus.PUBLISHED
      },
      include: {
        author: true
      },
      orderBy: { publishedAt: 'desc' }
    })
    
    return article
  } catch (error) {
    console.error('Error fetching article:', error)
    return null
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const article = await getArticleData()
  
  if (!article) {
    return {
      title: 'Test Article | Singapore Property Hub',
      description: 'Test article page'
    }
  }
  
  return {
    title: `${article.title} | Singapore Property Hub`,
    description: article.excerpt
  }
}

export default async function TestArticleSimplePage() {
  const article = await getArticleData()
  
  if (!article) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Simple Article Test
        </h1>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-green-800 mb-4">✅ Success!</h2>
          <p className="text-green-700">
            Article page loads without server-side exceptions. This confirms Prisma and runtime are working.
          </p>
        </div>
        
        <div className="prose max-w-none">
          <h2>Article Data Retrieved:</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p><strong>Title:</strong> {article.title}</p>
            <p><strong>Author:</strong> {article.author.name}</p>
            <p><strong>Published:</strong> {article.publishedAt?.toLocaleDateString()}</p>
            <p><strong>Content Length:</strong> {article.content?.length || 0} characters</p>
          </div>
          
          <h3>Next Steps:</h3>
          <p>
            If this page loads successfully, the issue is likely with:
          </p>
          <ul>
            <li>Markdown processing in the main article page</li>
            <li>Complex component rendering</li>
            <li>Import dependencies causing runtime conflicts</li>
          </ul>
        </div>
      </div>
    </div>
  )
}