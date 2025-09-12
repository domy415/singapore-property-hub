import { notFound } from 'next/navigation'

// Force Node.js runtime for Prisma compatibility  
export const runtime = 'nodejs'

interface Props {
  params: { slug: string }
}

async function getArticle(slug: string) {
  try {
    const { prisma } = await import('@/lib/prisma')
    const { ArticleStatus } = await import('@prisma/client')
    
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
}

export default async function ArticlePage({ params }: Props) {
  // COMPLETELY bypass database to test if it's a database issue
  // const article = await getArticle(params.slug)
  
  // if (!article) {
  //   notFound()
  // }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          TEST ARTICLE: {params.slug}
        </h1>
        
        <div className="mb-8">
          <p className="text-gray-600">
            Testing dynamic route without database queries
          </p>
        </div>
        
        <div className="prose max-w-none">
          <p>If this loads, the issue is with the database query or Prisma connection.</p>
          <p>If this doesn't load, the issue is with Next.js dynamic routing itself.</p>
        </div>
      </div>
    </div>
  )
}