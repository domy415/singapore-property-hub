import { Metadata } from 'next'
import HeroFeatured from '@/components/home/HeroFeatured'
import LatestArticles from '@/components/home/LatestArticles'
import MarketUpdates from '@/components/home/MarketUpdates'
import NewsletterSignup from '@/components/home/NewsletterSignup'
import TrustIndicators from '@/components/home/TrustIndicators'
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
        featuredImage: article.featuredImage || '/images/default-hero.jpg',
        category: article.category.replace(/_/g, ' '),
        publishedAt: article.publishedAt || article.createdAt,
        readTime: Math.ceil(article.content.length / 1000) + ' min read'
      }
    }
  } catch (error) {
    console.error('Error fetching featured article:', error)
  }
  
  // Fallback featured article
  return {
    id: '1',
    slug: 'singapore-property-market-outlook-2025',
    title: 'Singapore Property Market Outlook 2025: Expert Analysis & Investment Opportunities',
    excerpt: 'Comprehensive analysis of cooling measures, price trends, and emerging hotspots. Discover where smart money is moving in Singapore\'s property market.',
    featuredImage: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1200&h=600&fit=crop',
    category: 'Market Insights',
    publishedAt: new Date(),
    readTime: '8 min read'
  }
}

async function getLatestArticles() {
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
      featuredImage: article.featuredImage || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop',
      category: article.category || 'Market Insights',
      publishedAt: article.publishedAt || new Date(),
      readTime: '5 min read'
    }))
  } catch (error) {
    console.error('Error fetching latest articles:', error)
    return []
  }
}

async function getMarketUpdates() {
  // TODO: Fetch latest market news
  return [
    {
      id: '1',
      title: 'URA Releases Q3 2025 Property Price Index',
      excerpt: 'Private property prices rise 2.1% quarter-on-quarter',
      date: new Date(),
      category: 'Market Data'
    },
    {
      id: '2', 
      title: 'New Cooling Measures Analysis',
      excerpt: 'How the latest ABSD changes affect investors',
      date: new Date(),
      category: 'Policy Update'
    },
    {
      id: '3',
      title: 'Top 5 Districts for Capital Growth',
      excerpt: 'Data reveals surprising winners in 2025',
      date: new Date(),
      category: 'Investment'
    }
  ]
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
      {/* Hero Featured Article */}
      <HeroFeatured article={featuredArticle} />
      
      {/* Latest Articles */}
      <LatestArticles articles={latestArticles} />
      
      {/* Market Updates & Newsletter */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12">
            <MarketUpdates updates={marketUpdates} />
            <NewsletterSignup />
          </div>
        </div>
      </section>
      
      {/* Trust Indicators */}
      <TrustIndicators data={trustData} />
      
      {/* SEO Content Section */}
      <section className="py-16 bg-gray-50">
        <div className="container">
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
            <div className="mt-8 text-center">
              <a 
                href="/new-launches" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold inline-flex items-center gap-2 transition-colors"
              >
                Explore All New Launches
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}