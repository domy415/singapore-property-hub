import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArticleStatus } from '@prisma/client'
import SidebarNewsletter from '@/components/forms/SidebarNewsletter'
import { OrganizationSchema, BreadcrumbSchema } from '@/components/seo/SchemaMarkup'

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
      {/* SEO Structured Data */}
      <OrganizationSchema />
      <BreadcrumbSchema 
        items={[
          { name: 'Home', url: '/' },
          { name: 'Articles' }
        ]}
      />
      
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-b from-[#F8F9FA] to-white">
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
            <div className="sticky top-24 space-y-8">
              {/* Most Read */}
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Most Read</h3>
                <div className="space-y-4">
                  {displayArticles.slice(0, 5).map((article, index) => (
                    <Link
                      key={article.id}
                      href={`/articles/${article.slug || article.id}`}
                      className="group flex gap-3 hover:bg-gray-50 p-2 rounded"
                    >
                      <span className="text-2xl font-bold text-gray-300 flex-shrink-0">
                        {index + 1}
                      </span>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 group-hover:text-[#0A66C2] line-clamp-2">
                          {article.title}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">{article.readTime}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Categories</h3>
                <div className="space-y-2">
                  {categories.slice(1).map((category) => (
                    <button
                      key={category}
                      className="block w-full text-left text-sm text-gray-600 hover:text-[#0A66C2] py-1"
                    >
                      {category} <span className="text-gray-400">(12)</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Newsletter Signup */}
              <SidebarNewsletter />
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