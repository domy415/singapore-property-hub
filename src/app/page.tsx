import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArticleStatus } from '@prisma/client'
import { logDatabaseFallback } from '@/lib/monitoring'
import { ArticleImageService } from '@/services/ArticleImageService'

// Force Node.js runtime for Prisma compatibility
export const runtime = 'nodejs'
// Build trigger for updated layouts

export const metadata: Metadata = {
  title: 'Singapore\'s Premier Property Intelligence Platform | Singapore Property Hub',
  description: 'Expert insights and unbiased reviews for serious property buyers. Comprehensive analysis of Singapore\'s real estate market with professional property intelligence.',
  keywords: 'Singapore property, property intelligence, market analysis, condo reviews, property insights, real estate Singapore',
  alternates: {
    canonical: 'https://singaporepropertyhub.sg',
  },
}

async function getFeaturedArticle() {
  console.log('🔍 Starting getFeaturedArticle - enhanced database connection')
  
  // Build-time guard: Skip database operations during build
  if (process.env.NODE_ENV !== 'production' && !process.env.DATABASE_URL) {
    console.log('⏭️ Skipping database operations during build - using fallback article')
    return {
      id: 'build-fallback',
      slug: 'singapore-property-market-outlook-2024',
      title: 'Singapore Property Market Outlook 2024: What Buyers Need to Know',
      excerpt: 'Comprehensive analysis of the Singapore property market trends, government policies, and investment opportunities.',
      featuredImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=630&q=80',
      category: 'MARKET_INSIGHTS',
      publishedAt: new Date(),
      readTime: '5 min read'
    }
  }
  
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
  // Build-time guard: Skip database operations during build
  if (process.env.NODE_ENV !== 'production' && !process.env.DATABASE_URL) {
    return []
  }

  // Fetch latest 3 articles for market updates
  try {
    // Dynamic import to avoid build-time initialization
    const { prisma } = await import('@/lib/prisma')
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

  return (
    <>
      {/* Navigation Header */}
      <header className="sticky top-0 bg-white shadow-sm z-50 border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold">Singapore Property Hub</h1>
            <nav className="hidden md:flex space-x-8">
              <a href="/" className="text-gray-700 hover:text-[#0A66C2]">Home</a>
              <a href="/articles" className="text-gray-700 hover:text-[#0A66C2]">Articles</a>
              <a href="/condos" className="text-gray-700 hover:text-[#0A66C2]">Condos</a>
              <a href="/news" className="text-gray-700 hover:text-[#0A66C2]">News</a>
              <a href="/contact" className="text-gray-700 hover:text-[#0A66C2]">Contact</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Singapore&rsquo;s Premier Property Intelligence Platform
          </h1>
          <p className="text-xl">
            Expert insights and unbiased reviews for serious property buyers
          </p>
        </div>
      </section>

      {/* Featured Content Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Latest Insights</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Article Card */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <span className="text-xs uppercase text-blue-600 font-bold">ARTICLE</span>
              <h3 className="text-xl font-semibold mt-2 mb-3">
                {featuredArticle.title}
              </h3>
              <p className="text-gray-600 mb-4">
                {featuredArticle.excerpt}
              </p>
              <a href={`/articles/${featuredArticle.slug}`} className="text-[#0A66C2] hover:underline">
                Read More →
              </a>
            </div>
            
            {/* Condo Review Card */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <span className="text-xs uppercase text-green-600 font-bold">REVIEW</span>
              <h3 className="text-xl font-semibold mt-2 mb-3">
                Latest Condo Review
              </h3>
              <div className="text-yellow-400 mb-2">★★★★☆ <span className="text-gray-600 text-sm">4.5/5</span></div>
              <p className="text-gray-600 mb-4">
                Comprehensive review of Singapore's newest condominium developments.
              </p>
              <a href="/condos" className="text-[#0A66C2] hover:underline">
                Read Review →
              </a>
            </div>
            
            {/* News Card */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <span className="text-xs uppercase text-purple-600 font-bold">NEWS</span>
              <h3 className="text-xl font-semibold mt-2 mb-3">
                Latest Property News
              </h3>
              <p className="text-gray-600 mb-4">
                Stay updated with the latest property market news and policy changes.
              </p>
              <a href="/news" className="text-[#0A66C2] hover:underline">
                Read More →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Property Professionals Trust Us</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div style={{width: '64px', height: '64px', backgroundColor: 'rgba(10,102,194,0.1)'}} 
                   className="rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">In-Depth Analysis</h3>
              <p className="text-gray-600">Comprehensive market analysis backed by data</p>
            </div>
            
            <div>
              <div style={{width: '64px', height: '64px', backgroundColor: 'rgba(10,102,194,0.1)'}} 
                   className="rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">✓</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Unbiased Reviews</h3>
              <p className="text-gray-600">Independent condo reviews you can trust</p>
            </div>
            
            <div>
              <div style={{width: '64px', height: '64px', backgroundColor: 'rgba(10,102,194,0.1)'}} 
                   className="rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">💡</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Market Intelligence</h3>
              <p className="text-gray-600">Stay ahead with timely market updates</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-r from-[#0A66C2] to-[#004182]">
        <div className="max-w-2xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Stay Ahead of the Market</h2>
          <p className="mb-8 text-white/90">Weekly insights delivered to your inbox</p>
          
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input type="email" 
                   placeholder="Enter your email" 
                   className="flex-1 px-4 py-3 rounded text-gray-900"
                   required />
            <button type="submit" 
                    className="px-6 py-3 bg-white text-[#0A66C2] font-semibold rounded hover:bg-gray-100">
              Subscribe
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>&copy; 2025 Singapore Property Hub. All rights reserved.</p>
        </div>
      </footer>
    </>
  )
}


