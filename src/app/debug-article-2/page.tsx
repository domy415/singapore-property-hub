import { notFound } from 'next/navigation'
import { safeMarkdownToHtml } from '@/lib/markdown'

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

export default async function DebugArticle2Page() {
  const article = await getArticle()
  
  if (!article) {
    notFound()
  }

  // Test safe markdown processing
  let markdownResult
  let processingError = null
  
  try {
    markdownResult = await safeMarkdownToHtml(article.content, {
      enableLogging: false
    })
  } catch (error) {
    processingError = error instanceof Error ? error.message : 'Unknown error'
    markdownResult = { success: false, html: 'Markdown processing failed', warnings: [] }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Debug Article Test - Step 2: Markdown Processing
        </h1>
        
        <div className={`border rounded-lg p-6 mb-8 ${markdownResult.success && !processingError ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          <h2 className={`text-lg font-semibold mb-4 ${markdownResult.success && !processingError ? 'text-green-800' : 'text-red-800'}`}>
            {markdownResult.success && !processingError ? '✅ Markdown Success!' : '❌ Markdown Failed!'}
          </h2>
          <p className={`${markdownResult.success && !processingError ? 'text-green-700' : 'text-red-700'}`}>
            {processingError ? `Error: ${processingError}` : `Markdown processed successfully. HTML length: ${markdownResult.html.length}`}
          </p>
          {markdownResult.warnings.length > 0 && (
            <div className="mt-4">
              <p className="text-yellow-700 font-semibold">Warnings:</p>
              <ul className="text-yellow-600 text-sm">
                {markdownResult.warnings.map((warning, i) => (
                  <li key={i}>• {warning}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        <div className="prose max-w-none">
          <h2>Article Data:</h2>
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <p><strong>Title:</strong> {article.title}</p>
            <p><strong>Slug:</strong> {article.slug}</p>
            <p><strong>Author:</strong> {article.author.name}</p>
            <p><strong>Content Preview:</strong> {article.content?.substring(0, 200)}...</p>
          </div>
          
          <h2>Processed HTML Preview:</h2>
          <div className="bg-gray-50 p-4 rounded-lg text-sm">
            <code>{markdownResult.html.substring(0, 500)}...</code>
          </div>
        </div>
      </div>
    </div>
  )
}