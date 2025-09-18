import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArticleStatus } from '@prisma/client'
import ImageWithFallback from '@/components/ui/ImageWithFallback'

export const metadata: Metadata = {
  title: 'Singapore Property Hub - Premier Property Intelligence Platform',
  description: 'Expert insights and unbiased reviews for serious property buyers. Comprehensive analysis of Singapore\'s real estate market with professional property intelligence.',
  keywords: 'Singapore property, property intelligence, market analysis, condo reviews, property insights, real estate Singapore',
}

// Featured articles data (will be replaced with database calls)
const featuredArticles = [
  {
    id: '1',
    title: 'Singapore Property Market Outlook 2025: What Buyers Need to Know',
    excerpt: 'Comprehensive analysis of the Singapore property market trends, government policies, and investment opportunities for 2025.',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&q=80&auto=format&fit=crop',
    category: 'Market Analysis',
    readTime: '8 min read',
    slug: 'singapore-property-market-outlook-2025',
    publishedAt: '2025-01-15',
  },
  {
    id: '2',
    title: 'Ultimate Guide to Property Investment in Singapore',
    excerpt: 'Everything you need to know about investing in Singapore real estate, from financing to market timing.',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&q=80&auto=format&fit=crop',
    category: 'Investment Guide',
    readTime: '12 min read',
    slug: 'ultimate-guide-property-investment-singapore',
    publishedAt: '2025-01-10',
  },
  {
    id: '3',
    title: 'New Launch Condos in Singapore 2025: Complete Analysis',
    excerpt: 'Detailed review of the most exciting new condo launches in Singapore with pricing, location analysis, and investment potential.',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&q=80&auto=format&fit=crop',
    category: 'New Launches',
    readTime: '10 min read',
    slug: 'new-launch-condos-singapore-2025',
    publishedAt: '2025-01-08',
  },
]

// Featured condos data
const featuredCondos = [
  {
    id: 'the-continuum',
    name: 'The Continuum',
    rating: 4.5,
    reviewCount: 23,
    priceFrom: 'From $1.6M',
    district: 'District 15',
    districtName: 'Marine Parade',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&q=80&auto=format&fit=crop',
    highlights: ['Waterfront Views', 'Premium Amenities', 'Excellent Location'],
  },
  {
    id: 'grand-dunman',
    name: 'Grand Dunman',
    rating: 4.3,
    reviewCount: 18,
    priceFrom: 'From $1.4M',
    district: 'District 15',
    districtName: 'Marine Parade',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&q=80&auto=format&fit=crop',
    highlights: ['Freehold', 'Near MRT', 'Family-Friendly'],
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section 
        className="relative min-h-screen pt-20 flex items-center justify-center overflow-hidden"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 100%), url("https://images.unsplash.com/photo-1565967511849-76a60a516170?w=1920&h=1080&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: '#1e40af'
        }}
      >

        {/* Hero Content */}
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Singapore's Premier
            <span className="block mt-2">
              Property Intelligence
            </span>
          </h1>
          <p className="text-lg sm:text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Expert insights, unbiased reviews, and comprehensive market analysis for serious property buyers
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/articles"
              className="px-8 py-3 bg-sky-500 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors text-center"
            >
              Explore Articles
            </Link>
            <Link 
              href="/condos"
              className="px-8 py-3 border-2 border-white/30 text-white font-semibold rounded-lg hover:bg-white/10 transition-colors text-center"
            >
              Browse Condos
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2" style={{ color: 'var(--primary)' }}>250+</div>
              <div className="text-sm uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Property Reviews</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2" style={{ color: 'var(--primary)' }}>50K+</div>
              <div className="text-sm uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Monthly Readers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2" style={{ color: 'var(--primary)' }}>180+</div>
              <div className="text-sm uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Projects Covered</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2" style={{ color: 'var(--primary)' }}>15+</div>
              <div className="text-sm uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Years Experience</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      <section className="py-20" style={{ backgroundColor: 'var(--surface)' }}>
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Latest Property Insights</h2>
            <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>Stay informed with our expert analysis and market intelligence</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {featuredArticles.map((article) => (
              <article key={article.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 card overflow-hidden">
                <div className="aspect-w-16 aspect-h-9 bg-gray-100 relative h-48">
                  <ImageWithFallback
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover"
                    fallbackText="Property Article"
                  />
                </div>
                
                <div className="p-6">
                  <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--accent)' }}>
                    {article.category}
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-2 line-clamp-2" style={{ color: 'var(--text-primary)' }}>
                    {article.title}
                  </h3>
                  
                  <p className="text-sm line-clamp-3 mb-4" style={{ color: 'var(--text-secondary)' }}>
                    {article.excerpt}
                  </p>
                  
                  <div className="flex items-center text-sm" style={{ color: 'var(--text-secondary)' }}>
                    <time>{new Date(article.publishedAt).toLocaleDateString()}</time>
                    <span className="mx-2">•</span>
                    <span>{article.readTime}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link 
              href="/articles"
              className="btn-primary px-8 py-3"
            >
              View All Articles
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Condos */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Top-Rated Condo Reviews</h2>
            <p className="text-xl text-gray-600">Unbiased reviews from Singapore's property experts</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {featuredCondos.map((condo) => (
              <div key={condo.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="relative h-64 overflow-hidden">
                  <ImageWithFallback
                    src={condo.image}
                    alt={condo.name}
                    fill
                    className="object-cover"
                    fallbackText="Condo Property"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1">
                    <div className="flex items-center">
                      <div className="flex text-yellow-400 mr-1">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className={`w-4 h-4 ${i < Math.floor(condo.rating) ? 'fill-current' : 'fill-gray-300'}`} viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-sm font-semibold text-gray-700">
                        {condo.rating} ({condo.reviewCount})
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-2xl font-bold text-gray-900">{condo.name}</h3>
                    <span className="text-lg font-bold text-blue-600">{condo.priceFrom}</span>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{condo.district} • {condo.districtName}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {condo.highlights.map((highlight, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                        {highlight}
                      </span>
                    ))}
                  </div>
                  
                  <Link 
                    href={`/condos/${condo.id}`}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-3 rounded-lg font-semibold transition-colors block"
                  >
                    Read Full Review
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link 
              href="/condos"
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
            >
              View All Condo Reviews
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gradient-to-r from-blue-900 to-purple-900">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Stay Ahead of the Market</h2>
          <p className="text-xl text-white/90 mb-8">
            Get weekly property insights and exclusive market analysis delivered to your inbox
          </p>
          
          <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-6 py-4 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
              required
            />
            <button
              type="submit"
              className="px-8 py-4 bg-white text-blue-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Subscribe
            </button>
          </form>
          
          <p className="text-white/70 text-sm mt-4">
            No spam. Unsubscribe anytime. Join 10,000+ property enthusiasts.
          </p>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Unbiased Reviews</h3>
              <p className="text-gray-600">Independent analysis with no developer partnerships</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Market Intelligence</h3>
              <p className="text-gray-600">Data-driven insights from 15+ years of market analysis</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Trusted Community</h3>
              <p className="text-gray-600">50,000+ readers trust our property recommendations</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}