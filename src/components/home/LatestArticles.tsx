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
      title: "Singapore Property Market Outlook 2025",
      excerpt: "Expert analysis on market trends, price predictions, and investment opportunities in Singapore's evolving real estate landscape.",
      category: "Market Insights",
      readTime: "5 min read",
      publishedAt: new Date(),
      featuredImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop'
    },
    {
      id: '2',
      slug: 'complete-guide-buying-first-condo',
      title: "Complete Guide to Buying Your First Condo",
      excerpt: "Everything first-time buyers need to know about purchasing a condominium in Singapore, from financing to legal requirements.",
      category: "Buying Guide",
      readTime: "8 min read",
      publishedAt: new Date(),
      featuredImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop'
    },
    {
      id: '3',
      slug: 'top-5-districts-property-investment',
      title: "Top 5 Districts for Property Investment",
      excerpt: "Discover the most promising areas for property investment in Singapore, with detailed analysis and growth potential.",
      category: "Investment",
      readTime: "6 min read",
      publishedAt: new Date(),
      featuredImage: 'https://images.unsplash.com/photo-1555636222-cae831e670b3?w=600&h=400&fit=crop'
    }
  ]

  const displayArticles = articles.length > 0 ? articles : fallbackArticles

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Latest Property Insights</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Stay informed with our expert analysis, market trends, and actionable advice from Singapore's property professionals.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayArticles.slice(0, 6).map((article) => (
            <article key={article.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow group">
              <div className="aspect-[4/3] overflow-hidden bg-gradient-to-br from-blue-100 to-blue-200">
                <img 
                  src={article.featuredImage} 
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                    {article.category}
                  </span>
                  <span className="text-gray-500 text-sm">{article.readTime}</span>
                </div>
                <h3 className="text-xl font-semibold mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {article.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">{article.excerpt}</p>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-sm">
                    {article.publishedAt.toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                  <Link 
                    href={`/articles/${article.slug}`} 
                    className="text-blue-600 font-medium hover:text-blue-700 transition-colors"
                  >
                    Read More →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link 
            href="/articles" 
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-block"
          >
            View All Articles
          </Link>
        </div>
      </div>
    </section>
  )
}