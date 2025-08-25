import Link from 'next/link'

interface Article {
  id: string
  slug: string
  title: string
  excerpt: string
  featuredImage: string
  category: string
  publishedAt: Date
  readTime: string
}

interface LatestArticlesProps {
  articles: Article[]
}

export default function LatestArticles({ articles }: LatestArticlesProps) {
  // Fallback articles using actual working articles from database
  const fallbackArticles = [
    {
      id: '1',
      slug: 'weekend-property-picks-in-singapore-a-2025-market-',
      title: "Weekend Property Picks in Singapore: A 2025 Market Insight",
      excerpt: "Explore the latest trends and policies shaping Singapore's property market in 2025, and discover top picks for the weekend.",
      category: "Market Insights",
      readTime: "5 min read",
      publishedAt: new Date('2025-08-22'),
      featuredImage: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200&h=630&fit=crop'
    },
    {
      id: '2',
      slug: 'hdb-vs-private-property-in-2025-a-complete-compari-1755690686034',
      title: "HDB vs Private Property in 2025: A Complete Comparison Guide",
      excerpt: "Explore the definitive 2025 guide on HDB vs private property in Singapore, with the latest market insights.",
      category: "Buying Guide",
      readTime: "8 min read",
      publishedAt: new Date('2025-08-20'),
      featuredImage: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1200&h=630&fit=crop'
    },
    {
      id: '3',
      slug: 'navigating-singapore-s-cooling-measures-in-2025-a-',
      title: "Navigating Singapore's Cooling Measures in 2025",
      excerpt: "Explore the impact of Singapore's 2025 cooling measures on the property market, offering key insights and advice.",
      category: "Policy Update",
      readTime: "6 min read",
      publishedAt: new Date('2025-08-20'),
      featuredImage: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=400&fit=crop'
    },
    {
      id: '4',
      slug: 'unlocking-the-potential-of-singapore-s-property-ma',
      title: "Unlocking Singapore's Property Market Potential",
      excerpt: "Dive into the latest trends, policies, and strategies shaping Singapore's real estate landscape in 2025.",
      category: "Market Insights",
      readTime: "7 min read",
      publishedAt: new Date('2025-08-22'),
      featuredImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=630&fit=crop'
    },
    {
      id: '5',
      slug: 'hdb-vs-private-property-in-2025-a-complete-compari',
      title: "HDB vs Private Property: Complete Housing Guide",
      excerpt: "Explore the nuanced HDB vs private property landscape in Singapore as of 2025, featuring the latest trends and data.",
      category: "Buying Guide",
      readTime: "4 min read",
      publishedAt: new Date('2025-08-20'),
      featuredImage: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=600&h=400&fit=crop'
    },
    {
      id: '6',
      slug: 'singapore-property-market-outlook-2024',
      title: "Singapore Property Market Outlook 2024",
      excerpt: "Comprehensive analysis of the Singapore property market trends, government policies, and investment opportunities for 2024.",
      category: "Market Insights",
      readTime: "8 min read",
      publishedAt: new Date('2025-08-15'),
      featuredImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop'
    }
  ]

  const displayArticles = articles.length > 0 ? articles : fallbackArticles

  return (
    <section className="py-20 bg-light">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">Latest Property Insights</h2>
          <p className="text-secondary text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Stay informed with our expert analysis, market trends, and actionable advice from Singapore's most trusted property resource.
          </p>
        </div>
        
        {/* Articles Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {displayArticles.slice(0, 6).map((article) => (
            <article 
              key={article.id} 
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 group border border-gray-100"
            >
              {/* Featured Image */}
              <div className="aspect-[4/3] overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100">
                <img 
                  src={article.featuredImage} 
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              
              {/* Card Content */}
              <div className="p-6">
                {/* Category & Reading Time */}
                <div className="flex items-center justify-between mb-4">
                  <span className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-sm font-semibold uppercase tracking-wider">
                    {article.category}
                  </span>
                  <span className="text-secondary text-sm font-medium">{article.readTime}</span>
                </div>
                
                {/* Title */}
                <h3 className="text-xl font-bold text-primary mb-3 leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
                  {article.title}
                </h3>
                
                {/* Excerpt */}
                <p className="text-secondary mb-6 line-clamp-3 leading-relaxed">
                  {article.excerpt}
                </p>
                
                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="text-secondary text-sm font-medium">
                    {article.publishedAt.toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                  <Link 
                    href={`/articles/${article.slug}`} 
                    className="text-blue-600 font-semibold hover:text-blue-700 transition-colors duration-200 inline-flex items-center gap-2"
                  >
                    Read More
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
        
        {/* View All Articles Button */}
        <div className="text-center">
          <Link 
            href="/articles" 
            className="bg-navy text-white px-10 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200 inline-flex items-center gap-3 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            View All Articles
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}