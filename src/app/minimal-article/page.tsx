import { notFound } from 'next/navigation'

// Force Node.js runtime for Prisma compatibility  
export const runtime = 'nodejs'

async function getArticle() {
  try {
    const { prisma } = await import('@/lib/prisma')
    const { ArticleStatus } = await import('@prisma/client')
    
    const article = await prisma.article.findFirst({
      where: { status: ArticleStatus.PUBLISHED },
      include: { author: true },
      orderBy: { publishedAt: 'desc' }
    })
    
    return article
  } catch (error) {
    console.error('Error fetching article:', error)
    return null
  }
}

export default async function MinimalArticlePage() {
  const article = await getArticle()
  
  if (!article) {
    notFound()
  }

  // NO markdown processing, NO complex operations, NO JSON-LD, NO related articles
  // Just basic article display to isolate the issue

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          {article.title}
        </h1>
        
        <div className="mb-8">
          <p className="text-gray-600">
            By {article.author.name} | Published: {article.publishedAt?.toLocaleDateString()}
          </p>
        </div>
        
        <div className="prose max-w-none">
          <p><strong>Raw Content Preview (first 500 chars):</strong></p>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {article.content.substring(0, 500)}...
          </pre>
        </div>
      </div>
    </div>
  )
}