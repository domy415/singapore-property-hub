import { Metadata } from 'next'
import Link from 'next/link'
import { ArticleStatus } from '@prisma/client'
import { getArticleImage } from '@/lib/image-constants'
import articlesData from '../../database-articles-check.json'

// Force Node.js runtime for Prisma compatibility
export const runtime = 'nodejs'
// Add cache control to prevent stale images
export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
  title: 'Property Insights & Analysis | Singapore Property Hub',
  description: 'Expert perspectives on Singapore\'s real estate market. In-depth analysis, market trends, and investment guides for serious property professionals.',
  alternates: {
    canonical: 'https://singaporepropertyhub.sg/articles',
  },
}

// REMOVED: Multiple image helper functions deleted to prevent conflicts
// Using centralized getArticleImage from lib/image-constants.ts

async function getArticles() {
  try {
    // Use imported data, not file system
    const articles = articlesData.articles || []
    console.log('Loaded articles from imported data:', articles.length)
    
    return articles.map((article: any) => ({
      id: article.id,
      slug: article.slug,
      title: article.title,
      excerpt: article.excerpt,
      category: article.category?.replace('_', ' ') || 'Market Insights',
      author: article.author?.name || 'Property Hub Team',
      publishedAt: article.publishedAt,
      readTime: '5 min read',
      image: getArticleImage({
        slug: article.slug,
        title: article.title,
        category: article.category
      }),
      featured: false
    }))
  } catch (error) {
    console.error('Error processing articles:', error)
    return []
  }
}

// Removed fallback articles - using only real data from database

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
  const displayArticles = articles // Use only real data, no fallbacks
  
  // If no articles, show empty state
  if (!displayArticles || displayArticles.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">No Articles Available</h1>
          <p className="text-gray-600">Articles are being loaded. Please check back soon.</p>
        </div>
      </div>
    )
  }
  
  const featuredArticle = displayArticles[0] // First article is featured

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
                href={`/articles/${encodeURIComponent(featuredArticle.slug || featuredArticle.id)}`}
                className="group block bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="lg:flex">
                  <div className="lg:w-1/2">
                    <div className="relative h-64 lg:h-80">
                      <img
                        src={featuredArticle.image || 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1200&h=630&fit=crop&q=80'}
                        alt={featuredArticle.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
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
              {displayArticles.map((article: any) => (
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
                  {displayArticles.slice(0, 5).map((article: any, index: number) => (
                    <Link
                      key={article.id}
                      href={`/articles/${encodeURIComponent(article.slug || article.id)}`}
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
  // Ensure we're using the article.image that was set with getArticleImage
  // If for some reason it's missing, recalculate it
  const imageUrl = article.image || getArticleImage({ 
    slug: article.slug || '', 
    title: article.title || '',
    category: article.category || ''
  })
  
  return (
    <Link
      href={`/articles/${encodeURIComponent(article.slug || article.id)}`}
      className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden border"
    >
      <div className="aspect-video relative overflow-hidden">
        <img
          src={imageUrl}
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
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
