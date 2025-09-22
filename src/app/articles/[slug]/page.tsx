import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { safeMarkdownToHtml, calculateReadingTime } from '@/lib/markdown'
import ArticleSEO from '@/components/seo/ArticleSEO'

export const runtime = 'nodejs'

// Helper function to get appropriate image for article detail page
function getArticleImageForDetail(article: any): string {
  // Specific mappings for known articles to create variety
  const specificImages: Record<string, string> = {
    // Market analysis articles
    'singapore-s-property-market-poised-for-continued-growth-amid-evolving-regulatory-landscape': '/images/singapore-cbd-skyline.jpg',
    'singapore-property-market-resilience-navigating-evolving-trends': '/images/singapore-financial-district.jpg',
    'singapore-property-q3-2025-market-analysis': '/images/marina-bay-sands.jpg',
    'navigating-singapore-s-property-landscape-in-q3-2025-insights-from-a-seasoned-expert': '/images/singapore-financial-district.jpg',
    'singapore-property-market-trends-q3-2024-analysis': '/images/singapore-cbd-skyline.jpg',
    
    // HDB vs Private articles
    'hdb-vs-private-property-complete-comparison-guide-2025': '/images/hdb-flats.jpg',
    'hdb-vs-private-property-in-2025-a-complete-compari': '/images/hdb-flats.jpg',
    'hdb-vs-private-property-in-2025-a-complete-compari-1755690686034': '/images/hdb-flats.jpg',
    
    // Policy articles
    'understanding-singapore-s-cooling-measures-in-2025': '/images/singapore-parliament.jpg',
    'navigating-singapore-s-cooling-measures-in-2025-a-': '/images/singapore-parliament.jpg',
    
    // District guides
    'ultimate-guide-to-living-in-district-12-balestier-toa-payoh-serangoon': '/images/district-12.jpg',
    'ultimate-guide-to-living-in-district-2-anson-tanjong-pagar-singapore': '/images/district-2.jpg',
    
    // New launch reviews
    'bloomsbury-residences-2025-review': '/images/singapore-cbd-skyline.jpg',
    
    // National Day themed
    'celebrating-national-day-insights-into-singapore-s-property-market-in-2025': '/images/marina-bay-sands.jpg',
    'navigating-the-singapore-property-market-a-national-day-2025-special': '/images/marina-bay-sands.jpg',
    'navigating-singapore-s-property-market-a-guide-to-independence-planning': '/images/marina-bay-sands.jpg',
    
    // Weekend/general articles
    'weekend-property-picks-in-singapore-a-2025-market-': '/images/singapore-cbd-skyline.jpg',
    'unlocking-the-potential-of-singapore-s-property-ma': '/images/singapore-financial-district.jpg',
    'navigating-the-waves-of-singapore-s-property-market-an-expert-analysis': '/images/marina-bay-sands.jpg'
  };
  
  // Return specific image if available
  if (specificImages[article.slug]) {
    return specificImages[article.slug];
  }
  
  // If article has a local image that starts with /images/, use it
  if (article.featuredImage && article.featuredImage.startsWith('/images/')) {
    return article.featuredImage;
  }
  
  // Map categories to local default images
  const categoryDefaults: Record<string, string> = {
    'MARKET_INSIGHTS': '/images/singapore-cbd-default.jpg',
    'PROPERTY_NEWS': '/images/singapore-news-default.jpg',
    'BUYING_GUIDE': '/images/singapore-guide-default.jpg', 
    'NEW_LAUNCH_REVIEW': '/images/singapore-condo-default.jpg',
    'INVESTMENT': '/images/singapore-investment-default.jpg',
    'NEIGHBORHOOD': '/images/singapore-neighborhood-default.jpg'
  };
  
  return categoryDefaults[article.category] || '/images/singapore-default.jpg';
}

// Generate static params for known articles
export async function generateStaticParams() {
  try {
    const path = require('path')
    const fs = require('fs')
    const articlesPath = path.join(process.cwd(), 'database-articles-check.json')
    
    if (fs.existsSync(articlesPath)) {
      const articlesData = JSON.parse(fs.readFileSync(articlesPath, 'utf-8'))
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
            src={getArticleImageForDetail(article)} 
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