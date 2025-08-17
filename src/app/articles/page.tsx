import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Singapore Property Articles | Market Insights & Investment Guides',
  description: 'Stay updated with the latest Singapore property market trends, investment guides, and expert insights. Your source for property market intelligence.',
  alternates: {
    canonical: 'https://singaporepropertyhub.sg/articles',
  },
}

// Mock data for now - will be replaced with database queries
const mockArticles = [
  {
    id: '1',
    title: 'Singapore Property Market Outlook 2024: What Buyers Need to Know',
    excerpt: 'Comprehensive analysis of the Singapore property market trends, government policies, and investment opportunities for 2024.',
    category: 'Market Insights',
    author: 'Sarah Chen',
    publishedAt: '2024-08-15',
    readTime: '8 min read',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop',
    featured: true
  },
  {
    id: '2',
    title: 'Complete Guide to Buying Your First Condo in Singapore',
    excerpt: 'Everything first-time buyers need to know about purchasing a condominium in Singapore, from financing to legal procedures.',
    category: 'Buying Guide',
    author: 'Marcus Lim',
    publishedAt: '2024-08-12',
    readTime: '12 min read',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
    featured: false
  },
  {
    id: '3',
    title: 'District 9 vs District 10: Which Premium Location Should You Choose?',
    excerpt: 'Detailed comparison of Singapore\'s most prestigious districts, analyzing prices, amenities, and investment potential.',
    category: 'Investment',
    author: 'Jennifer Wong',
    publishedAt: '2024-08-10',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop',
    featured: false
  },
  {
    id: '4',
    title: 'Sentosa Cove: The Ultimate Luxury Living Experience',
    excerpt: 'Explore Singapore\'s only waterfront residential enclave and discover why it\'s becoming the top choice for luxury homebuyers.',
    category: 'Neighborhood',
    author: 'David Tan',
    publishedAt: '2024-08-08',
    readTime: '10 min read',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
    featured: true
  },
  {
    id: '5',
    title: 'Property Investment Strategies in a Rising Interest Rate Environment',
    excerpt: 'How to adapt your property investment strategy when interest rates are climbing and what opportunities still exist.',
    category: 'Investment',
    author: 'Rachel Ng',
    publishedAt: '2024-08-05',
    readTime: '9 min read',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop',
    featured: false
  },
  {
    id: '6',
    title: 'Understanding the Additional Buyer\'s Stamp Duty (ABSD) in 2024',
    excerpt: 'A comprehensive guide to Singapore\'s ABSD rates, exemptions, and how it affects your property purchase decisions.',
    category: 'Property News',
    author: 'Kevin Lee',
    publishedAt: '2024-08-03',
    readTime: '7 min read',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
    featured: false
  }
]

const categories = ['All', 'Market Insights', 'Buying Guide', 'Selling Guide', 'Investment', 'Neighborhood', 'Property News']

export default function ArticlesPage() {
  const featuredArticles = mockArticles.filter(article => article.featured)
  const regularArticles = mockArticles.filter(article => !article.featured)

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-16">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Property Market Insights
            </h1>
            <p className="text-xl text-gray-600">
              Stay informed with expert analysis, market trends, and investment strategies
            </p>
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-2xl font-bold mb-8">Featured Articles</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {featuredArticles.map((article) => (
              <Link
                key={article.id}
                href={`/articles/${article.id}`}
                className="group bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="relative h-64 bg-gray-200">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4 bg-yellow-500 text-white px-3 py-1 rounded text-sm font-semibold">
                    Featured
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                      {article.category}
                    </span>
                    <span>{article.readTime}</span>
                    <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-blue-600 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                    <span>By {article.author}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 border-b bg-gray-50">
        <div className="container">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    category === 'All' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white text-gray-600 hover:bg-gray-100 border'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
            <p className="text-gray-600">
              {mockArticles.length} articles
            </p>
          </div>
        </div>
      </section>

      {/* All Articles */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-2xl font-bold mb-8">Latest Articles</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockArticles.map((article) => (
              <Link
                key={article.id}
                href={`/articles/${article.id}`}
                className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative h-48 bg-gray-200">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {article.featured && (
                    <div className="absolute top-3 left-3 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-semibold">
                      Featured
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-3 text-xs text-gray-600 mb-2">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {article.category}
                    </span>
                    <span>{article.readTime}</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>By {article.author}</span>
                    <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Pagination */}
      <section className="py-8">
        <div className="container">
          <div className="flex justify-center gap-2">
            <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">Previous</button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">1</button>
            <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">2</button>
            <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">3</button>
            <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">Next</button>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Stay Updated</h2>
            <p className="text-xl mb-8 text-blue-100">
              Get the latest property market insights delivered to your inbox weekly
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900"
              />
              <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Subscribe
              </button>
            </div>
            <p className="text-sm text-blue-200 mt-4">
              No spam, unsubscribe anytime
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}