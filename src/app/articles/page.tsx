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
      image: article.featuredImage ? `${article.featuredImage}${article.featuredImage.includes('?') ? '&' : '?'}cb=${Date.now()}` : 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=800&h=600&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&h=600&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1593696140826-c58b021acf8b?w=800&h=600&fit=crop',
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
      <section className="relative py-20 bg-gradient-to-br from-[#0A66C2]/5 via-white to-[#F8F9FA] overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230A66C2' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }} />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-white/80 backdrop-blur-sm border border-[#0A66C2]/20 rounded-full px-4 py-2 mb-6">
              <svg className="w-4 h-4 text-[#0A66C2] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <span className="text-sm font-medium text-[#0A66C2]">Market Intelligence</span>
            </div>
            
            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Property Insights &
              <span className="text-[#0A66C2] block">Expert Analysis</span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              In-depth market analysis, investment strategies, and professional insights 
              from Singapore&rsquo;s most trusted property intelligence platform
            </p>
            
            {/* Stats */}
            <div className="flex justify-center items-center gap-8 mt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#0A66C2]">50K+</div>
                <div className="text-sm text-gray-600">Monthly Readers</div>
              </div>
              <div className="w-px h-8 bg-gray-300"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#0A66C2]">250+</div>
                <div className="text-sm text-gray-600">Properties Analyzed</div>
              </div>
              <div className="w-px h-8 bg-gray-300"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#0A66C2]">15+</div>
                <div className="text-sm text-gray-600">Years Experience</div>
              </div>
            </div>
          </div>

          {/* Featured Article Card */}
          {featuredArticle && (
            <div className="max-w-5xl mx-auto">
              <Link 
                href={`/articles/${featuredArticle.slug || featuredArticle.id}`}
                className="group block bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
              >
                <div className="lg:flex">
                  <div className="lg:w-3/5">
                    <div className="relative h-72 lg:h-96">
                      <Image
                        src={featuredArticle.image}
                        alt={featuredArticle.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      <div className="absolute top-6 left-6">
                        <div className="bg-yellow-400 text-black px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide shadow-lg">
                          ⭐ Featured Article
                        </div>
                      </div>
                      <div className="absolute bottom-6 left-6">
                        <span className="inline-block bg-white/90 backdrop-blur-sm text-[#0A66C2] text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide">
                          {featuredArticle.category}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="lg:w-2/5 p-10 flex flex-col justify-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6 group-hover:text-[#0A66C2] transition-colors leading-tight">
                      {featuredArticle.title}
                    </h2>
                    <p className="text-gray-600 mb-6 line-clamp-4 text-lg leading-relaxed">
                      {featuredArticle.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500 space-x-4">
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{featuredArticle.readTime}</span>
                        </div>
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>{new Date(featuredArticle.publishedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="text-[#0A66C2] group-hover:translate-x-1 transition-transform">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Category Filter Pills */}
      <section className="py-8 bg-white/80 backdrop-blur-sm sticky top-[70px] z-40 border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 sm:mb-0">Browse by Category</h2>
            <div className="text-sm text-gray-500">
              {displayArticles.length} articles available
            </div>
          </div>
          <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide pb-2">
            {categories.map((category) => (
              <button
                key={category}
                className={`flex-shrink-0 px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105 ${
                  category === 'All'
                    ? 'bg-[#0A66C2] text-white shadow-lg ring-2 ring-[#0A66C2]/20'
                    : 'bg-white text-[#0A66C2] border border-[#0A66C2]/20 hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2]'
                }`}
              >
                {category}
                {category === 'All' && <span className="ml-2 bg-white/20 px-2 py-1 rounded text-xs">{displayArticles.length}</span>}
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
            <div className="text-center mt-16">
              <button className="group bg-gradient-to-r from-[#0A66C2] to-[#004182] text-white px-10 py-4 rounded-xl font-semibold hover:from-[#004182] hover:to-[#0A66C2] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center mx-auto">
                Load More Articles
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </button>
              <p className="text-sm text-gray-500 mt-3">Discover more property insights and market analysis</p>
            </div>
          </div>

          {/* Sidebar - Desktop Only */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-32 space-y-8">
              {/* Most Read */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center mb-6">
                  <div className="w-8 h-8 bg-gradient-to-r from-[#0A66C2] to-[#004182] rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  <div className="w-8 h-8 bg-gradient-to-r from-[#0A66C2] to-[#004182] rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                        <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-[#0A66C2]/20 transform hover:-translate-y-1"
    >
      <div className="aspect-[4/3] relative overflow-hidden">
        <Image
          src={article.image}
          alt={article.title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-4 left-4">
          <span className="inline-block bg-white/95 backdrop-blur-sm text-[#0A66C2] text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide shadow-sm">
            {article.category}
          </span>
        </div>
        {article.featured && (
          <div className="absolute top-4 right-4">
            <div className="bg-yellow-400 text-black p-1 rounded-full">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-[#0A66C2] transition-colors line-clamp-2 leading-snug">
          {article.title}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
          {article.excerpt}
        </p>
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center text-xs text-gray-500 space-x-3">
            <div className="flex items-center">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{article.readTime}</span>
            </div>
            <div className="flex items-center">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
            </div>
          </div>
          <div className="text-[#0A66C2] group-hover:translate-x-1 transition-transform">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  )
}