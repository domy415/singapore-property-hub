import { Metadata } from 'next'
import ABTestHero from '@/components/home/ABTestHero'
import LatestArticles from '@/components/home/LatestArticles'
import MarketUpdates from '@/components/home/MarketUpdates'
import NewsletterSignup from '@/components/home/NewsletterSignup'
import TrustIndicators from '@/components/home/TrustIndicators'
import { ABTestPageLayout } from '@/components/forms/ABTestFormPosition'
import { prisma } from '@/lib/prisma'
import { ArticleStatus } from '@prisma/client'
import { logDatabaseFallback, performanceMonitor } from '@/lib/monitoring'
import { ArticleImageService } from '@/services/ArticleImageService'

export const metadata: Metadata = {
  title: 'Singapore Property Hub - New Launch Reviews & Market Insights | Property Lead Generation',
  description: 'Expert property reviews, daily market insights, and comprehensive guides for Singapore real estate. Get exclusive access to new launch floor plans and investment analysis.',
  keywords: 'Singapore property, new launch reviews, property investment, condo reviews, market insights, floor plans, property leads',
  alternates: {
    canonical: 'https://singaporepropertyhub.sg',
  },
}

async function getFeaturedArticle() {
  console.log('🔍 Starting getFeaturedArticle - enhanced database connection')
  
  // Force database connection attempt with retry logic
  let attempts = 0
  const maxAttempts = 3
  
  while (attempts < maxAttempts) {
    attempts++
    console.log(`🔄 Database connection attempt ${attempts}/${maxAttempts}`)
    
    try {
      // Enhanced database connection test
      console.log('🔗 Testing database connectivity...')
      
      // Dynamic Prisma import to avoid initialization issues
      const { PrismaClient } = await import('@prisma/client')
      const directPrisma = new PrismaClient({
        datasources: {
          db: {
            url: process.env.DATABASE_URL
          }
        }
      })
      
      console.log('🎯 Executing database query for featured article...')
      const article = await directPrisma.article.findFirst({
        where: {
          status: ArticleStatus.PUBLISHED,
          featuredImage: { not: null }
        },
        orderBy: { publishedAt: 'desc' },
        select: {
          id: true,
          slug: true,
          title: true,
          excerpt: true,
          featuredImage: true,
          category: true,
          publishedAt: true,
          createdAt: true,
          content: true
        }
      })
      
      // Close the direct connection
      await directPrisma.$disconnect()
      
      if (article) {
        console.log(`✅ SUCCESS: Featured article fetched: "${article.title}"`)
        console.log(`🖼️ Original Image URL: ${article.featuredImage}`)
        
        // Use ArticleImageService to get the correct image
        const imageData = ArticleImageService.getArticleImage(
          article.featuredImage,
          article.title,
          article.category,
          article.slug
        )
        
        console.log(`🎯 Final Image URL: ${imageData.url}`)
        
        return {
          id: article.id,
          slug: article.slug,
          title: article.title,
          excerpt: article.excerpt,
          featuredImage: imageData.url,
          category: article.category.replace(/_/g, ' '),
          publishedAt: article.publishedAt || article.createdAt,
          readTime: Math.ceil(article.content.length / 1000) + ' min read'
        }
      } else {
        console.warn(`⚠️ No articles found on attempt ${attempts}`)
        if (attempts >= maxAttempts) break
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 1000))
        continue
      }
    } catch (error) {
      console.error(`❌ Database error on attempt ${attempts}:`, error)
      console.error('Error details:', {
        name: (error as any)?.name,
        message: (error as any)?.message,
        code: (error as any)?.code,
        stack: (error as any)?.stack?.split('\n').slice(0, 3)
      })
      
      if (attempts >= maxAttempts) {
        logDatabaseFallback('getFeaturedArticle', 'All database connection attempts failed', {
          error: error instanceof Error ? error.message : 'Unknown error',
          attempts: maxAttempts
        })
        break
      }
      
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  }
  
  console.log('📋 Using Singapore-specific fallback featured article')
  
  const fallbackTitle = 'Celebrating National Day: Insights into Singapore\'s Property Market in 2025'
  const fallbackCategory = 'MARKET_INSIGHTS'
  
  // Use ArticleImageService for consistent image handling
  const imageData = ArticleImageService.getArticleImage(
    null, // No database image
    fallbackTitle,
    fallbackCategory,
    'celebrating-national-day-insights-into-singapore-s-property-market-in-2025'
  )
  
  return {
    id: 'fallback-1',
    slug: 'celebrating-national-day-insights-into-singapore-s-property-market-in-2025',
    title: fallbackTitle,
    excerpt: 'As Singapore celebrates its independence, explore how the nation\'s property market reflects growth, stability, and promising investment opportunities for 2025.',
    featuredImage: imageData.url,
    category: 'Market Insights',
    publishedAt: new Date('2025-08-09'),
    readTime: '7 min read'
  }
}

async function getLatestArticles() {
  console.log('🔍 Starting getLatestArticles - enhanced database connection')
  
  // Enhanced database connection with retry logic
  let attempts = 0
  const maxAttempts = 3
  
  while (attempts < maxAttempts) {
    attempts++
    console.log(`🔄 Latest articles connection attempt ${attempts}/${maxAttempts}`)
    
    try {
      console.log('🔗 Testing database connectivity for latest articles...')
      
      // Direct Prisma client to bypass any proxy issues
      const { PrismaClient } = await import('@prisma/client')
      const directPrisma = new PrismaClient({
        datasources: {
          db: {
            url: process.env.DATABASE_URL
          }
        }
      })
      
      console.log('🎯 Executing query for latest 6 published articles...')
      const articles = await directPrisma.article.findMany({
        where: {
          status: ArticleStatus.PUBLISHED
        },
        orderBy: { publishedAt: 'desc' },
        take: 6,
        select: {
          id: true,
          slug: true,
          title: true,
          excerpt: true,
          featuredImage: true,
          category: true,
          publishedAt: true
        }
      })
      
      // Close the direct connection
      await directPrisma.$disconnect()
      
      console.log(`✅ SUCCESS: Fetched ${articles.length} articles from database`)
      
      if (articles.length > 0) {
        return articles.map((article, index) => {
          console.log(`🖼️ Article ${index + 1}: "${article.title.slice(0, 50)}..."`)
          console.log(`   Original Image: ${article.featuredImage}`)
          
          // Use ArticleImageService to get the correct image
          const imageData = ArticleImageService.getArticleImage(
            article.featuredImage,
            article.title,
            article.category,
            article.slug
          )
          
          console.log(`   Final Image: ${imageData.url}`)
          
          return {
            id: article.id,
            slug: article.slug,
            title: article.title,
            excerpt: article.excerpt || '',
            featuredImage: imageData.url,
            category: article.category || 'Market Insights',
            publishedAt: article.publishedAt || new Date(),
            readTime: '5 min read'
          }
        })
      } else {
        console.warn(`⚠️ No articles found on attempt ${attempts}`)
        if (attempts >= maxAttempts) break
        await new Promise(resolve => setTimeout(resolve, 1000))
        continue
      }
    } catch (error) {
      console.error(`❌ Database error on attempt ${attempts}:`, error)
      console.error('Error details:', {
        name: (error as any)?.name,
        message: (error as any)?.message,
        code: (error as any)?.code
      })
      
      if (attempts >= maxAttempts) {
        logDatabaseFallback('getLatestArticles', 'All database connection attempts failed', {
          error: error instanceof Error ? error.message : 'Unknown error',
          attempts: maxAttempts
        })
        break
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  }
  
  console.log('📋 Database connection failed - returning empty array for LatestArticles fallback')
  return []
}

async function getMarketUpdates() {
  // Fetch latest 3 articles for market updates
  try {
    const articles = await prisma.article.findMany({
      where: {
        status: ArticleStatus.PUBLISHED
      },
      orderBy: { publishedAt: 'desc' },
      take: 3,
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        featuredImage: true, // Include featuredImage field
        category: true,
        publishedAt: true,
        createdAt: true
      }
    })
    
    const updates = articles.map(article => {
      // Use ArticleImageService for consistent image handling
      const imageData = ArticleImageService.getArticleImage(
        article.featuredImage,
        article.title,
        article.category,
        article.slug
      )
      
      return {
        id: article.id,
        slug: article.slug,
        title: article.title,
        excerpt: article.excerpt || article.title.substring(0, 80) + '...',
        featuredImage: imageData.url, // Include processed image
        date: article.publishedAt || article.createdAt,
        category: article.category.replace(/_/g, ' ')
      }
    })
    
    return updates
  } catch (error) {
    console.error('Error fetching market updates:', error)
    
    // Fallback to empty array - MarketUpdates component should handle this gracefully
    return []
  }
}

async function getTrustIndicators() {
  return {
    testimonials: [
      {
        id: '1',
        name: 'Sarah Chen',
        role: 'First-time Buyer',
        content: 'The detailed reviews helped me choose the perfect condo. Their floor plan comparison tool saved me weeks of research!',
        avatar: '/images/testimonial-1.jpg'
      },
      {
        id: '2',
        name: 'Michael Tan',
        role: 'Property Investor',
        content: 'Best source for new launch analysis. The investment scoring system is spot-on. Made 3 profitable purchases based on their reviews.',
        avatar: '/images/testimonial-2.jpg'
      },
      {
        id: '3',
        name: 'Jennifer Wong',
        role: 'Upgrader',
        content: 'Their location guides are incredibly detailed. Found the perfect neighborhood for my family thanks to their insights.',
        avatar: '/images/testimonial-3.jpg'
      }
    ],
    stats: {
      reviewsPublished: '250+',
      monthlyReaders: '50,000+',
      projectsCovered: '180+',
      yearsExperience: '15+'
    }
  }
}

export default async function HomePage() {
  const featuredArticle = await getFeaturedArticle()
  const latestArticles = await getLatestArticles()
  const marketUpdates = await getMarketUpdates()
  const trustData = await getTrustIndicators()

  return (
    <>
      {/* A/B Test Hero */}
      <ABTestHero featuredArticle={featuredArticle} />
      
      <ABTestPageLayout>
        {/* Latest Articles */}
        <section id="latest-insights" className="py-16 bg-white">
          <LatestArticles articles={latestArticles} />
        </section>
        
        {/* Market Updates & Newsletter */}
        <section className="py-16 bg-white" id="newsletter-signup">
          <div className="grid lg:grid-cols-2 gap-12">
            <MarketUpdates updates={marketUpdates} />
            <NewsletterSignup />
          </div>
        </section>
        
        
        {/* SEO Content Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Singapore's Most Comprehensive Property Resource</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Daily Property Intelligence</h3>
                <p className="text-gray-600 mb-4">
                  Get ahead with our daily property content covering new launches, market trends, and investment opportunities. 
                  Our expert team analyzes every major development, providing detailed reviews with our proprietary 5-star rating system.
                </p>
                <p className="text-gray-600">
                  From luxury condos in District 9 to affordable launches in the OCR, we cover all segments of Singapore's property market.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Data-Driven Decisions</h3>
                <p className="text-gray-600 mb-4">
                  Make informed property decisions with our comprehensive market data, price analysis, and ROI calculations. 
                  Our location guides cover all 28 districts with transport connectivity, school information, and lifestyle amenities.
                </p>
                <p className="text-gray-600">
                  Whether you're a first-time buyer, upgrader, or seasoned investor, our insights help you navigate cooling measures, 
                  identify undervalued opportunities, and maximize returns.
                </p>
              </div>
            </div>
          </div>
        </section>
      </ABTestPageLayout>
    </>
  )
}