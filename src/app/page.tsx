import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArticleStatus } from '@prisma/client'
import { logDatabaseFallback } from '@/lib/monitoring'
import { ArticleImageService } from '@/services/ArticleImageService'

// Force Node.js runtime for Prisma compatibility
export const runtime = 'nodejs'

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
      {/* Hero Section */}
      <section className="relative h-[600px] md:h-[600px] flex items-center justify-center text-white">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1920&h=1080&fit=crop&q=90&fm=webp"
            alt="Singapore skyline with Marina Bay Sands and ArtScience Museum at sunset"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/50 to-black/60"></div>
        </div>
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-5xl font-bold mb-6" style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: '700',
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
          }}>
            Singapore&rsquo;s Premier Property Intelligence Platform
          </h1>
          <p className="text-lg sm:text-xl mb-8 max-w-2xl mx-auto" style={{
            fontSize: 'clamp(1.125rem, 2.5vw, 1.25rem)',
            fontWeight: '400',
            textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
          }}>
            Expert insights and unbiased reviews for serious property buyers
          </p>
        </div>
      </section>

      {/* Featured Content Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">Latest Insights</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Latest Article */}
            <FeaturedContentCard
              label="ARTICLE"
              href={`/articles/${featuredArticle.slug}`}
              imageSrc={featuredArticle.featuredImage}
              title={featuredArticle.title}
              excerpt={featuredArticle.excerpt}
            />
            
            {/* Featured Condo Review */}
            <FeaturedContentCard
              label="REVIEW"
              href="/condos/grand-dunman"
              imageSrc="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&h=630&fit=crop&q=80"
              title="Grand Dunman Comprehensive Review"
              excerpt="In-depth analysis of this luxury development in District 15 with our professional 5-star rating system and investment insights."
            />
            
            {/* Latest News */}
            <FeaturedContentCard
              label="NEWS"
              href="/news"
              imageSrc="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=630&fit=crop&q=80"
              title="September 2025 Property Market Update"
              excerpt="Latest cooling measures impact and market developments that serious property buyers need to know."
            />
          </div>
          
          <div className="flex justify-center space-x-8 mt-12">
            <Link href="/articles" className="text-[#0A66C2] hover:text-blue-800 font-medium">
              View All Articles →
            </Link>
            <Link href="/condos" className="text-[#0A66C2] hover:text-blue-800 font-medium">
              View All Condos →
            </Link>
            <Link href="/news" className="text-[#0A66C2] hover:text-blue-800 font-medium">
              View All News →
            </Link>
          </div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="py-16 bg-[#F8F9FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
            Why Property Professionals Trust Us
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-[#0A66C2] bg-opacity-10 rounded-full mb-6">
                <svg className="w-12 h-12 text-[#0A66C2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4">In-Depth Analysis</h3>
              <p className="text-gray-600 leading-relaxed">
                Comprehensive market analysis backed by data and expert insights to help you make informed decisions.
              </p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-[#0A66C2] bg-opacity-10 rounded-full mb-6">
                <svg className="w-12 h-12 text-[#0A66C2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4">Unbiased Reviews</h3>
              <p className="text-gray-600 leading-relaxed">
                Independent condo reviews that give you the complete picture, highlighting both strengths and considerations.
              </p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-[#0A66C2] bg-opacity-10 rounded-full mb-6">
                <svg className="w-12 h-12 text-[#0A66C2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4">Market Intelligence</h3>
              <p className="text-gray-600 leading-relaxed">
                Stay ahead with timely updates on policy changes, market trends, and investment opportunities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-r from-[#0A66C2] to-[#004182]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Stay Ahead of the Market</h2>
          <p className="text-xl text-blue-100 mb-8">Weekly insights delivered to your inbox</p>
          
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg border-none focus:ring-2 focus:ring-blue-300 text-gray-900"
            />
            <button className="px-6 py-3 bg-white text-[#0A66C2] font-semibold rounded-lg hover:bg-gray-100 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </>
  )
}

function FeaturedContentCard({ 
  label, 
  href, 
  imageSrc, 
  title, 
  excerpt 
}: { 
  label: string
  href: string
  imageSrc: string
  title: string
  excerpt: string 
}) {
  return (
    <div className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <div className="aspect-video relative overflow-hidden">
        <Image
          src={imageSrc}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-white/90 text-gray-800 text-xs font-semibold px-2 py-1 rounded uppercase tracking-wide">
            {label}
          </span>
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-3 text-gray-900 group-hover:text-[#0A66C2] transition-colors">
          {title}
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
          {excerpt}
        </p>
        <Link 
          href={href}
          className="inline-flex items-center text-[#0A66C2] hover:text-blue-800 font-medium text-sm"
        >
          Read More →
        </Link>
      </div>
    </div>
  )
}

