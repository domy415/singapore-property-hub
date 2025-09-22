import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArticleStatus } from '@prisma/client'

// Force Node.js runtime for Prisma compatibility
export const runtime = 'nodejs'

export const metadata: Metadata = {
  title: 'Property Insights & Analysis | Singapore Property Hub',
  description: 'Expert perspectives on Singapore\'s real estate market. In-depth analysis, market trends, and investment guides for serious property professionals.',
  alternates: {
    canonical: 'https://singaporepropertyhub.sg/articles',
  },
}

// Helper function to get appropriate image for article
function getArticleImage(article: any): string {
  // If article has a local image, use it
  if (article.featuredImage && article.featuredImage.startsWith('/images/')) {
    return article.featuredImage;
  }
  
  // Map categories to local default images
  const categoryDefaults: Record<string, string> = {
    'MARKET_INSIGHTS': '/images/singapore-cbd-skyline-default.jpg',
    'PROPERTY_NEWS': '/images/singapore-news-default.jpg',
    'BUYING_GUIDE': '/images/singapore-guide-default.jpg', 
    'NEW_LAUNCH_REVIEW': '/images/singapore-condo-default.jpg',
    'INVESTMENT': '/images/singapore-investment-default.jpg',
    'NEIGHBORHOOD': '/images/singapore-neighborhood-default.jpg'
  };
  
  return categoryDefaults[article.category] || '/images/singapore-default.jpg';
}

async function getArticles() {
  // Build-time guard: Skip database operations during build
  if (process.env.NODE_ENV !== 'production' && !process.env.DATABASE_URL) {
    return []
  }

  // Try to fetch from database (works in both dev and production)
  try {
    // Dynamic import to avoid build-time initialization
    const { prisma } = await import('@/lib/prisma')
    const articles = await prisma.article.findMany({
      where: {
        status: ArticleStatus.PUBLISHED
      },
      include: {
        author: true
      },
      orderBy: {
        publishedAt: 'desc'
      },
      take: 20
    })
  
    return articles.map(article => ({
      id: article.id,
      slug: article.slug,
      title: article.title,
      excerpt: article.excerpt,
      category: article.category.replace('_', ' '),
      author: article.author.name,
      publishedAt: article.publishedAt?.toISOString() || article.createdAt.toISOString(),
      readTime: Math.ceil(article.content.length / 1000) + ' min read',
      image: getArticleImage(article),
      featured: Math.random() > 0.7
    }))
  } catch (error) {
    console.error('Error fetching articles:', error)
  }
  
  // Return empty array for fallback (page has fallback data)
  return []
}

// Fallback data if no articles in database
const fallbackArticles = [
  {
    id: '1',
    slug: 'singapore-property-market-outlook-2024',
    title: 'Singapore Property Market Outlook 2024: What Buyers Need to Know',
    excerpt: 'Comprehensive analysis of the Singapore property market trends, government policies, and investment opportunities for 2024.',
    category: 'Market Insights',
    author: 'Sarah Chen',
    publishedAt: '2024-08-15',
    readTime: '8 min read',
    image: '/images/singapore-cbd-skyline-default.jpg',
    featured: true
  },
  {
    id: '2',
    slug: 'complete-guide-buying-first-condo-singapore',
    title: 'Complete Guide to Buying Your First Condo in Singapore',
    excerpt: 'Everything first-time buyers need to know about purchasing a condominium in Singapore, from financing to legal procedures.',
    category: 'Buying Guide',
    author: 'Marcus Lim',
    publishedAt: '2024-08-12',
    readTime: '12 min read',
    image: '/images/singapore-guide-default.jpg',
    featured: false
  },
  {
    id: '3',
    slug: 'district-9-vs-district-10-premium-location',
    title: 'District 9 vs District 10: Which Premium Location Should You Choose?',
    excerpt: 'Detailed comparison of Singapore\'s most prestigious districts, analyzing prices, amenities, and investment potential.',
    category: 'Investment',
    author: 'Jennifer Wong',
    publishedAt: '2024-08-10',
    readTime: '6 min read',
    image: '/images/singapore-investment-default.jpg',
    featured: false
  },
  {
    id: '4',
    slug: 'sentosa-cove-ultimate-luxury-living',
    title: 'Sentosa Cove: The Ultimate Luxury Living Experience',
    excerpt: 'Explore Singapore\'s only waterfront residential enclave and discover why it\'s becoming the top choice for luxury homebuyers.',
    category: 'Neighborhood',
    author: 'David Tan',
    publishedAt: '2024-08-08',
    readTime: '10 min read',
    image: '/images/singapore-neighborhood-default.jpg',
    featured: true
  },
  {
    id: '5',
    slug: 'property-investment-strategies-rising-rates',
    title: 'Property Investment Strategies in a Rising Interest Rate Environment',
    excerpt: 'How to adapt your property investment strategy when interest rates are climbing and what opportunities still exist.',
    category: 'Investment',
    author: 'Rachel Ng',
    publishedAt: '2024-08-05',
    readTime: '9 min read',
    image: '/images/singapore-investment-default.jpg',
    featured: false
  },
  {
    id: '6',
    slug: 'understanding-absd-2024',
    title: 'Understanding the Additional Buyer\'s Stamp Duty (ABSD) in 2024',
    excerpt: 'A comprehensive guide to Singapore\'s ABSD rates, exemptions, and how it affects your property purchase decisions.',
    category: 'Property News',
    author: 'Kevin Lee',
    publishedAt: '2024-08-03',
    readTime: '7 min read',
    image: '/images/singapore-news-default.jpg',
    featured: false
  }
]

const categories = [
  'All',
  'Market Analysis', 
  'Investment Guides',
  'Property Types',
  'Buyer Guides',
  'Location Guides',
  'Policy Updates'
]

export default async function ArticlesPage() {
  const articles = await getArticles()
  const displayArticles = articles.length > 0 ? articles : fallbackArticles
  
  const featuredArticle = displayArticles.find(article => article.featured) || displayArticles[0]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-12 bg-gradient-to-b from-[#F8F9FA] to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-4">
              Property Insights & Analysis
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Expert perspectives on Singapore&rsquo;s real estate market
            </p>
          </div>

          {/* Featured Article Card */}
          {featuredArticle && (
            <div className="max-w-4xl mx-auto">
              <Link 
                href={`/articles/${featuredArticle.slug || featuredArticle.id}`}
                className="group block bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="lg:flex">
                  <div className="lg:w-1/2">
                    <div className="relative h-64 lg:h-80">
                      <Image
                        src={featuredArticle.image}
                        alt={featuredArticle.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 left-4 bg-[#0A66C2] text-white px-3 py-1 rounded text-sm font-semibold">
                        FEATURED
                      </div>
                    </div>
                  </div>
                  <div className="lg:w-1/2 p-8 flex flex-col justify-center">
                    <div className="mb-3">
                      <span className="inline-block bg-[#E3F2FD] text-[#0A66C2] text-xs font-semibold px-2 py-1 rounded uppercase tracking-wide">
                        {featuredArticle.category}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-[#0A66C2] transition-colors">
                      {featuredArticle.title}
                    </h2>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {featuredArticle.excerpt}
                    </p>
                    <div className="flex items-center text-sm text-gray-500">
                      <span>{featuredArticle.readTime}</span>
                      <span className="mx-2">•</span>
                      <span>{new Date(featuredArticle.publishedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Category Filter Pills */}
      <section className="py-6 bg-white sticky top-[70px] z-40 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 overflow-x-auto scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  category === 'All'
                    ? 'bg-[#0A66C2] text-white'
                    : 'bg-[#E3F2FD] text-[#0A66C2] hover:bg-[#0A66C2] hover:text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {displayArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>

            {/* Load More Button */}
            <div className="text-center mt-12">
              <button className="bg-[#0A66C2] text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-800 transition-colors">
                Load More Articles
              </button>
            </div>
          </div>

          {/* Sidebar - Desktop Only */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-32 space-y-8">
              {/* Most Read */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center mb-6">
                  <div className="w-5 h-5 bg-[#0A66C2] rounded flex items-center justify-center mr-3">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Trending Now</h3>
                </div>
                <div className="space-y-4">
                  {displayArticles.slice(0, 5).map((article, index) => (
                    <Link
                      key={article.id}
                      href={`/articles/${article.slug || article.id}`}
                      className="group flex gap-4 hover:bg-[#F8F9FA] p-3 rounded-lg transition-all duration-300"
                    >
                      <div className="flex-shrink-0">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          index === 0 ? 'bg-yellow-400 text-black' : 
                          index === 1 ? 'bg-gray-300 text-gray-700' :
                          index === 2 ? 'bg-amber-600 text-white' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {index + 1}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-gray-900 group-hover:text-[#0A66C2] line-clamp-2 mb-1">
                          {article.title}
                        </h4>
                        <div className="flex items-center text-xs text-gray-500 space-x-2">
                          <span>{article.readTime}</span>
                          <span>•</span>
                          <span>{article.category}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center mb-6">
                  <div className="w-5 h-5 bg-[#0A66C2] rounded flex items-center justify-center mr-3">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Browse Topics</h3>
                </div>
                <div className="space-y-3">
                  {categories.slice(1).map((category, index) => (
                    <button
                      key={category}
                      className="group flex items-center justify-between w-full text-left p-3 rounded-lg hover:bg-[#0A66C2] hover:text-white transition-all duration-300"
                    >
                      <span className="text-sm font-medium">{category}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs opacity-70">{Math.floor(Math.random() * 20) + 5}</span>
                        <svg className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Newsletter Signup */}
              <div className="bg-gradient-to-br from-[#0A66C2] to-[#004182] p-6 rounded-xl text-white shadow-lg">
                <div className="text-center mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold mb-2">Weekly Market Intel</h3>
                  <p className="text-sm text-blue-100 leading-relaxed">
                    Get exclusive property insights and market analysis delivered straight to your inbox
                  </p>
                </div>
                <div className="space-y-3">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="w-full px-4 py-3 rounded-lg text-gray-900 text-sm border-0 focus:ring-2 focus:ring-white/50"
                  />
                  <button className="w-full bg-yellow-400 text-black py-3 rounded-lg font-bold text-sm hover:bg-yellow-300 transition-colors shadow-md">
                    🚀 Subscribe Now
                  </button>
                  <p className="text-xs text-blue-200 text-center">
                    Join 50,000+ property professionals • No spam, unsubscribe anytime
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ArticleCard({ article }: { article: any }) {
  return (
    <Link
      href={`/articles/${article.slug || article.id}`}
      className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden border"
    >
      <div className="aspect-video relative overflow-hidden">
        <Image
          src={article.image}
          alt={article.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-5">
        <div className="mb-3">
          <span className="inline-block bg-[#E3F2FD] text-[#0A66C2] text-xs font-semibold px-2 py-1 rounded uppercase tracking-wide">
            {article.category}
          </span>
        </div>
        <h3 className="text-lg font-semibold mb-2 text-gray-900 group-hover:text-[#0A66C2] transition-colors line-clamp-2">
          {article.title}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {article.excerpt}
        </p>
        <div className="flex items-center text-xs text-gray-500">
          <span>{article.readTime}</span>
          <span className="mx-2">•</span>
          <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
        </div>
      </div>
    </Link>
  )
}