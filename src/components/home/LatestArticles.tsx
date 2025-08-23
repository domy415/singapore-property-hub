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
  // Fallback articles if database is empty
  const fallbackArticles = [
    {
      id: '1',
      slug: 'singapore-property-market-outlook-2025',
      title: "Singapore Property Market Outlook 2025: What Investors Need to Know",
      excerpt: "Expert analysis on market trends, cooling measures impact, and prime investment opportunities in Singapore's evolving real estate landscape.",
      category: "Market Insights",
      readTime: "5 min read",
      publishedAt: new Date('2025-08-23'),
      featuredImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop'
    },
    {
      id: '2',
      slug: 'complete-guide-buying-first-condo-singapore',
      title: "Complete Guide to Buying Your First Condo in Singapore",
      excerpt: "Everything first-time buyers need to know about purchasing a condominium in Singapore, from ABSD calculations to loan approvals.",
      category: "Buying Guide",
      readTime: "8 min read",
      publishedAt: new Date('2025-08-22'),
      featuredImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop'
    },
    {
      id: '3',
      slug: 'top-5-districts-condo-investment-2025',
      title: "Top 5 Districts for Condo Investment in 2025",
      excerpt: "Discover the most promising areas for property investment in Singapore, with detailed ROI analysis and growth potential.",
      category: "Investment",
      readTime: "6 min read",
      publishedAt: new Date('2025-08-21'),
      featuredImage: 'https://images.unsplash.com/photo-1555636222-cae831e670b3?w=600&h=400&fit=crop'
    },
    {
      id: '4',
      slug: 'lentor-mansion-comprehensive-review',
      title: "Lentor Mansion Review: Is This Freehold Gem Worth It?",
      excerpt: "In-depth analysis of GuocolLand's latest launch, including pricing, unit mix, and investment potential in the upcoming Lentor Hills area.",
      category: "New Launch",
      readTime: "7 min read",
      publishedAt: new Date('2025-08-20'),
      featuredImage: 'https://images.unsplash.com/photo-1565967511849-76a60a516170?w=600&h=400&fit=crop'
    },
    {
      id: '5',
      slug: 'singapore-cooling-measures-impact-analysis',
      title: "How Latest Cooling Measures Affect Your Property Purchase",
      excerpt: "Breaking down the recent ABSD changes and LTV limits - what property buyers and investors need to know right now.",
      category: "Policy Update",
      readTime: "4 min read",
      publishedAt: new Date('2025-08-19'),
      featuredImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop'
    },
    {
      id: '6',
      slug: 'orchard-sophia-investment-analysis',
      title: "Orchard Sophia: Premium Condo Investment Analysis",
      excerpt: "Detailed review of Far East Organization's luxury development in District 9, including rental yield projections and resale potential.",
      category: "Investment",
      readTime: "6 min read",
      publishedAt: new Date('2025-08-18'),
      featuredImage: 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=600&h=400&fit=crop'
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