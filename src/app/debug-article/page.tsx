import { notFound } from 'next/navigation'

// Force Node.js runtime for Prisma compatibility
export const runtime = 'nodejs'

async function getArticle() {
  try {
    // Dynamic import to avoid build-time initialization
    const { prisma } = await import('@/lib/prisma')
    const { ArticleStatus } = await import('@prisma/client')
    
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

export default async function DebugArticlePage() {
  const article = await getArticle()
  
  if (!article) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Debug Article Test - Step 1: Basic Data
        </h1>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-green-800 mb-4">✅ Success!</h2>
          <p className="text-green-700">
            Article data retrieved successfully. Basic Prisma operations work.
          </p>
        </div>
        
        <div className="prose max-w-none">
          <h2>Article Data Retrieved:</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p><strong>Title:</strong> {article.title}</p>
            <p><strong>Slug:</strong> {article.slug}</p>
            <p><strong>Author:</strong> {article.author.name}</p>
            <p><strong>Published:</strong> {article.publishedAt?.toLocaleDateString()}</p>
            <p><strong>Content Length:</strong> {article.content?.length || 0} characters</p>
            <p><strong>Category:</strong> {article.category}</p>
          </div>
        </div>
      </div>
    </div>
  )
}