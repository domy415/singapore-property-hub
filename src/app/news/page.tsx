import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Property News & Market Updates | Singapore Property Hub',
  description: 'Stay informed with the latest Singapore property market news, policy changes, and investment opportunities. Breaking news and expert analysis.',
  alternates: {
    canonical: 'https://singaporepropertyhub.sg/news',
  },
}

// Sample news data
const newsItems = [
  {
    id: '1',
    title: 'Singapore Property Prices Rise 3.2% in Q3 2025 Despite Cooling Measures',
    excerpt: 'Private residential property prices increased for the third consecutive quarter, driven by strong demand for prime district condominiums and limited supply in popular developments.',
    category: 'Market Updates',
    image: 'https://images.unsplash.com/photo-1567360425618-1594206637d2?w=1200&h=600&fit=crop&q=80',
    publishedAt: '2025-09-08',
    readTime: '4 min read',
    featured: true
  },
  {
    id: '2',
    title: 'New ABSD Rates Announced: Foreign Buyers Face 65% Stamp Duty',
    excerpt: 'MAS introduces additional measures to further cool the property market, with foreign buyers now facing the highest stamp duty rates in Singapore\'s history.',
    category: 'Policy Changes',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=400&fit=crop&q=80',
    publishedAt: '2025-09-07',
    readTime: '5 min read',
    featured: false
  },
  {
    id: '3',
    title: 'Marina Bay Residences Launches with Record $4,500 PSF Pricing',
    excerpt: 'The highly anticipated luxury development in Marina Bay sets new pricing benchmarks, with units starting from $3.2 million for a 2-bedroom apartment.',
    category: 'New Launches',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=400&fit=crop&q=80',
    publishedAt: '2025-09-06',
    readTime: '6 min read',
    featured: false
  },
  {
    id: '4',
    title: 'Orchard Road Commercial Properties See 8% Rental Increase',
    excerpt: 'Prime retail spaces along Singapore\'s premier shopping street command higher rents as tourism recovery drives demand for premium locations.',
    category: 'Investment Tips',
    image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=400&fit=crop&q=80',
    publishedAt: '2025-09-05',
    readTime: '3 min read',
    featured: false
  },
  {
    id: '5',
    title: 'HDB Resale Prices Hit New High in Mature Estates',
    excerpt: 'Resale prices for HDB flats in mature estates like Toa Payoh and Queenstown reach record levels as upgraders compete for limited inventory.',
    category: 'Market Updates',
    image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&h=400&fit=crop&q=80',
    publishedAt: '2025-09-04',
    readTime: '5 min read',
    featured: false
  },
  {
    id: '6',
    title: 'Green Building Incentives Drive Sustainable Development Boom',
    excerpt: 'New government incentives for environmentally-friendly developments lead to surge in green building certifications across Singapore.',
    category: 'Policy Changes',
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=400&fit=crop&q=80',
    publishedAt: '2025-09-03',
    readTime: '4 min read',
    featured: false
  }
]

const categories = ['All', 'Market Updates', 'Policy Changes', 'New Launches', 'Investment Tips']

export default function NewsPage() {
  const featuredNews = newsItems.find(item => item.featured)
  const regularNews = newsItems.filter(item => !item.featured)

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Featured News */}
      {featuredNews && (
        <section className="relative h-[400px] overflow-hidden">
          <Image
            src={featuredNews.image}
            alt={featuredNews.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>
          
          <div className="absolute inset-0 flex items-end">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full">
              <div className="max-w-2xl">
                <div className="mb-3">
                  <span className="inline-block bg-[#0A66C2] text-white text-sm font-semibold px-3 py-1 rounded uppercase tracking-wide">
                    BREAKING
                  </span>
                  <span className="inline-block bg-white/20 text-white text-sm font-medium px-3 py-1 rounded ml-2">
                    {featuredNews.category}
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                  {featuredNews.title}
                </h1>
                <p className="text-lg text-gray-200 mb-4">
                  {featuredNews.excerpt}
                </p>
                <div className="flex items-center text-sm text-gray-300">
                  <span>{new Date(featuredNews.publishedAt).toLocaleDateString()}</span>
                  <span className="mx-2">•</span>
                  <span>{featuredNews.readTime}</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* News Categories */}
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

      {/* News List */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {regularNews.map((newsItem, index) => (
              <NewsListItem 
                key={newsItem.id} 
                newsItem={newsItem} 
                imagePosition={index % 2 === 0 ? 'left' : 'right'}
              />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center gap-2 mt-12">
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600">
              Previous
            </button>
            <button className="px-4 py-2 bg-[#0A66C2] text-white rounded-lg">1</button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600">2</button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600">3</button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600">
              Next
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

function NewsListItem({ 
  newsItem, 
  imagePosition 
}: { 
  newsItem: typeof newsItems[0]
  imagePosition: 'left' | 'right' 
}) {
  return (
    <Link
      href={`/news/${newsItem.id}`}
      className="group block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border overflow-hidden"
    >
      <div className={`md:flex ${imagePosition === 'right' ? 'md:flex-row-reverse' : ''}`}>
        <div className="md:w-1/3">
          <div className="relative h-64 md:h-full min-h-[200px]">
            <Image
              src={newsItem.image}
              alt={newsItem.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
        <div className="md:w-2/3 p-6 md:p-8 flex flex-col justify-center">
          <div className="mb-3">
            <span className={`inline-block text-xs font-semibold px-2 py-1 rounded uppercase tracking-wide ${
              newsItem.category === 'Market Updates' 
                ? 'bg-green-100 text-green-800'
                : newsItem.category === 'Policy Changes'
                ? 'bg-red-100 text-red-800'
                : newsItem.category === 'New Launches'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {newsItem.category}
            </span>
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 group-hover:text-[#0A66C2] transition-colors">
            {newsItem.title}
          </h3>
          <p className="text-gray-600 mb-4 line-clamp-3">
            {newsItem.excerpt}
          </p>
          <div className="flex items-center text-sm text-gray-500">
            <span>{new Date(newsItem.publishedAt).toLocaleDateString()}</span>
            <span className="mx-2">•</span>
            <span>{newsItem.readTime}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}