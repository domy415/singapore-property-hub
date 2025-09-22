import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { safeMarkdownToHtml, calculateReadingTime } from '@/lib/markdown'
import ArticleSEO from '@/components/seo/ArticleSEO'
import { getArticleImage } from '@/lib/image-constants'

export const runtime = 'nodejs'

// REMOVED: getArticleImageForDetail function deleted to prevent conflicts
// Using centralized getArticleImage from lib/image-constants.ts

// Generate static params for known articles
export async function generateStaticParams() {
  try {
    const path = require('path')
    const fs = require('fs')
    const articlesPath = path.join(process.cwd(), 'database-articles-check.json')
    
    if (fs.existsSync(articlesPath)) {
      const articlesData = JSON.parse(fs.readFileSync(articlesPath, 'utf-8'))
      // Log the slugs for debugging
      console.log('Available article slugs:', articlesData.articles.map((a: any) => a.slug))
      return articlesData.articles.map((article: any) => ({
        slug: article.slug,
      }))
    }
    
    return []
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}

interface Props {
  params: { slug: string }
}

async function getArticle(slug: string) {
  // Build-time guard: Skip database operations during build
  if (process.env.NODE_ENV !== 'production' && !process.env.DATABASE_URL) {
    return getArticleFromJSON(slug)
  }

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
    
    if (article) {
      return article
    }
  } catch (error) {
    console.error('Error fetching article from database:', error)
  }
  
  // Fallback to JSON data if database fails
  return getArticleFromJSON(slug)
}

function getArticleFromJSON(slug: string) {
  try {
    const path = require('path')
    const fs = require('fs')
    const articlesPath = path.join(process.cwd(), 'database-articles-check.json')
    
    if (fs.existsSync(articlesPath)) {
      const articlesData = JSON.parse(fs.readFileSync(articlesPath, 'utf-8'))
      const article = articlesData.articles.find((a: any) => a.slug === slug)
      
      if (article) {
        return {
          ...article,
          author: { name: article.author?.name || 'Property Hub Team' },
          publishedAt: new Date(article.publishedAt),
          createdAt: new Date(article.createdAt),
          updatedAt: article.updatedAt ? new Date(article.updatedAt) : null
        }
      }
    }
    
    return null
  } catch (error) {
    console.error('Error loading article from JSON:', error)
    return null
  }
}

async function getRelatedArticles(currentSlug: string, category: any = null) {
  try {
    const { prisma } = await import('@/lib/prisma')
    const { ArticleStatus } = await import('@prisma/client')
    
    const relatedArticles = await prisma.article.findMany({
      where: {
        slug: { not: currentSlug },
        status: ArticleStatus.PUBLISHED,
        ...(category && { category })
      },
      include: {
        author: true
      },
      orderBy: {
        publishedAt: 'desc'
      },
      take: 3
    })
    
    return relatedArticles
  } catch (error) {
    console.error('Error fetching related articles:', error)
    return []
  }
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
    description: article.excerpt || 'Singapore property article',
  }
}

export default async function ArticlePage({ params }: Props) {
  const article = await getArticle(params.slug)
  
  if (!article) {
    notFound()
  }

  // Fetch related articles
  const relatedArticles = await getRelatedArticles(params.slug, article.category)

  // Safe markdown processing with comprehensive error handling
  const markdownResult = await safeMarkdownToHtml(article.content, {
    enableLogging: process.env.NODE_ENV === 'development'
  })
  
  const readTime = calculateReadingTime(article.content)

  return (
    <div className="min-h-screen bg-white">
      {/* Article SEO and Structured Data */}
      <ArticleSEO
        article={{
          title: article.title,
          description: article.excerpt || article.title,
          content: article.content,
          slug: article.slug,
          publishedAt: article.publishedAt?.toISOString() || article.createdAt.toISOString(),
          updatedAt: article.updatedAt?.toISOString(),
          author: article.author.name,
          image: article.featuredImage || undefined,
          category: article.category.replace('_', ' ')
        }}
      />
      
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Hero Image */}
        <div className="mb-8 rounded-lg overflow-hidden">
          <img 
            src={getArticleImage(article)} 
            alt={article.title}
            className="w-full h-96 object-cover"
          />
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          {article.title}
        </h1>
        
        <div className="mb-8">
          <p className="text-gray-600">
            By {article.author.name} | {readTime} | Published: {article.publishedAt?.toLocaleDateString()}
          </p>
        </div>
        
        <div 
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: markdownResult.html }}
        />
        
        {/* Related Articles Section */}
        {relatedArticles.length > 0 && (
          <div className="mt-16 pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Articles</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedArticles.map((relatedArticle) => (
                <div key={relatedArticle.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  {relatedArticle.featuredImage && (
                    <img 
                      src={relatedArticle.featuredImage} 
                      alt={relatedArticle.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                      <a 
                        href={`/articles/${relatedArticle.slug}`}
                        className="text-gray-900 hover:text-blue-600 transition-colors"
                      >
                        {relatedArticle.title}
                      </a>
                    </h3>
                    {relatedArticle.excerpt && (
                      <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                        {relatedArticle.excerpt}
                      </p>
                    )}
                    <p className="text-xs text-gray-500">
                      By {relatedArticle.author.name} • {relatedArticle.publishedAt?.toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {markdownResult.warnings.length > 0 && process.env.NODE_ENV === 'development' && (
          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded">
            <p className="font-semibold">Markdown Processing Warnings:</p>
            <ul className="text-sm">
              {markdownResult.warnings.map((warning, i) => (
                <li key={i}>• {warning}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}