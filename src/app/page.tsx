import { Metadata } from 'next'
import ABTestHero from '@/components/home/ABTestHero'
import LatestArticles from '@/components/home/LatestArticles'
import MarketUpdates from '@/components/home/MarketUpdates'
import NewsletterSignup from '@/components/home/NewsletterSignup'
import TrustIndicators from '@/components/home/TrustIndicators'
import { ABTestPageLayout } from '@/components/forms/ABTestFormPosition'
import { prisma } from '@/lib/prisma'
import { ArticleStatus } from '@prisma/client'

export const metadata: Metadata = {
  title: 'Singapore Property Hub - New Launch Reviews & Market Insights | Property Lead Generation',
  description: 'Expert property reviews, daily market insights, and comprehensive guides for Singapore real estate. Get exclusive access to new launch floor plans and investment analysis.',
  keywords: 'Singapore property, new launch reviews, property investment, condo reviews, market insights, floor plans, property leads',
  alternates: {
    canonical: 'https://singaporepropertyhub.sg',
  },
}

async function getFeaturedArticle() {
  // Try to fetch from database (works in both dev and production)
  try {
    const article = await prisma.article.findFirst({
      where: {
        status: ArticleStatus.PUBLISHED,
        featuredImage: { not: null }
      },
      orderBy: { publishedAt: 'desc' }
    })
    
    if (article) {
      return {
        id: article.id,
        slug: article.slug,
        title: article.title,
        excerpt: article.excerpt,
        featuredImage: article.featuredImage ? `${article.featuredImage}${article.featuredImage.includes('?') ? '&' : '?'}cb=${Date.now()}` : '/images/default-hero.jpg',
        category: article.category.replace(/_/g, ' '),
        publishedAt: article.publishedAt || article.createdAt,
        readTime: Math.ceil(article.content.length / 1000) + ' min read'
      }
    }
  } catch (error) {
    console.error('Error fetching featured article:', error)
  }
  
  // Fallback featured article - using most current article
  return {
    id: '1',
    slug: 'unlocking-the-potential-of-singapore-s-property-ma',
    title: 'Unlocking the Potential of Singapore\'s Property Market: Weekend Picks and Expert Insights',
    excerpt: 'Dive into the latest trends, policies, and strategies shaping Singapore\'s real estate landscape in 2025, with expert analysis on emerging opportunities.',
    featuredImage: 'https://images.unsplash.com/photo-1567360425618-1594206637d2?w=1200&h=630&q=80',
    category: 'Market Insights',
    publishedAt: new Date('2025-08-25'),
    readTime: '7 min read'
  }
}

async function getLatestArticles() {
  // Try to fetch from database (works in both dev and production)
  try {
    const articles = await prisma.article.findMany({
      where: {
        status: ArticleStatus.PUBLISHED
      },
      orderBy: { publishedAt: 'desc' },
      take: 6
    })
    
    return articles.map(article => ({
      id: article.id,
      slug: article.slug,
      title: article.title,
      excerpt: article.excerpt || '',
      featuredImage: article.featuredImage ? `${article.featuredImage}${article.featuredImage.includes('?') ? '&' : '?'}cb=${Date.now()}` : 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&h=400&fit=crop',
      category: article.category || 'Market Insights',
      publishedAt: article.publishedAt || new Date(),
      readTime: '5 min read'
    }))
  } catch (error) {
    console.error('Error fetching latest articles:', error)
  }
  
  // Return empty array for fallback (LatestArticles component has its own fallback)
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
        category: true,
        publishedAt: true,
        createdAt: true
      }
    })
    
    const updates = articles.map(article => ({
      id: article.id,
      slug: article.slug,
      title: article.title,
      excerpt: article.excerpt || article.title.substring(0, 80) + '...',
      date: article.publishedAt || article.createdAt,
      category: article.category.replace(/_/g, ' ')
    }))
    
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