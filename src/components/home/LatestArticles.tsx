// Updated with Unified Image System - 2025-09-04
import Link from 'next/link'
import { ArticleCardImage } from '@/components/ui/UnifiedArticleImage'

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
  console.log(`📊 LatestArticles: Received ${articles?.length || 0} articles`)
  
  // Log the images we're about to display
  articles?.forEach((article, index) => {
    console.log(`🖼️ Article ${index + 1}: "${article.title}" → ${article.featuredImage}`)
  })

  // Singapore Property Image Finder Agent compliant fallback articles
  const fallbackArticles = [
    {
      id: '1',
      slug: 'celebrating-national-day-insights-into-singapore-s-property-market-in-2025',
      title: "Celebrating National Day: Insights into Singapore's Property Market in 2025",
      excerpt: "As we celebrate Singapore's independence, explore how our property market reflects the nation's growth, stability, and investment opportunities.",
      category: "Market Insights",
      readTime: "5 min read",
      publishedAt: new Date('2025-08-09'),
      featuredImage: 'https://images.unsplash.com/photo-1631086459917-a18a7dbb1699?w=1200&h=630&q=80' // Singapore flag - National Day specific
    },
    {
      id: '2',
      slug: 'ultimate-guide-to-living-in-district-12-balestier-toa-payoh-serangoon',
      title: "Ultimate Guide to Living in District 12: Balestier, Toa Payoh, Serangoon",
      excerpt: "Discover the heartland charm of District 12, featuring authentic Singapore neighborhoods with rich heritage and modern amenities.",
      category: "Location Guide",
      readTime: "8 min read",
      publishedAt: new Date('2025-08-28'),
      featuredImage: 'https://images.unsplash.com/photo-1560036486-def2e0dbebb7?w=1200&h=630&q=80' // Toa Payoh HDB - District 12 specific
    },
    {
      id: '3',
      slug: 'navigating-singapore-s-cooling-measures-in-2025-comprehensive-analysis',
      title: "Navigating Singapore's Cooling Measures: A 2025 Comprehensive Analysis",
      excerpt: "Understanding how government cooling measures continue to shape Singapore's property landscape and investment strategies.",
      category: "Policy Update",
      readTime: "6 min read",
      publishedAt: new Date('2025-08-20'),
      featuredImage: 'https://images.unsplash.com/photo-1567360425618-1594206637d2?w=1200&h=630&q=80' // Singapore CBD for policy content
    },
    {
      id: '4',
      slug: 'hdb-vs-private-property-2025-complete-comparison-guide',
      title: "HDB vs Private Property 2025: Complete Comparison Guide",
      excerpt: "A detailed analysis of public housing versus private property options, helping Singaporeans make informed housing decisions.",
      category: "Buying Guide",
      readTime: "7 min read",
      publishedAt: new Date('2025-08-20'),
      featuredImage: 'https://images.unsplash.com/photo-1648365300669-e7b760c6d240?w=1200&h=630&q=80' // HDB void deck community space
    },
    {
      id: '5',
      slug: 'weekend-property-picks-singapore-expert-recommendations',
      title: "Weekend Property Picks: Singapore's Expert Recommendations",
      excerpt: "Curated weekend property viewing suggestions from Singapore's most promising developments and investment opportunities.",
      category: "Property Picks",
      readTime: "4 min read",
      publishedAt: new Date('2025-08-25'),
      featuredImage: 'https://images.unsplash.com/photo-1508964942454-1a56651d54ac?w=1200&h=630&q=80' // Modern Singapore property
    },
    {
      id: '6',
      slug: 'ultimate-guide-to-living-in-district-2-anson-tanjong-pagar-singapore',
      title: "Ultimate Guide to Living in District 2: Anson & Tanjong Pagar",
      excerpt: "Explore Singapore's central business district residential options, from luxury condos to heritage conservation projects.",
      category: "Location Guide",
      readTime: "8 min read",
      publishedAt: new Date('2025-08-28'),
      featuredImage: 'https://images.unsplash.com/photo-1567360425618-1594206637d2?w=1200&h=630&q=80' // Singapore CBD skyline for District 2
    }
  ]

  // Enhanced fallback logic with logging
  const displayArticles = articles && articles.length > 0 ? articles : fallbackArticles
  
  if (!articles || articles.length === 0) {
    console.warn('⚠️ LatestArticles: Using fallback articles - database query may have failed')
  }

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
                <ArticleCardImage
                  src={article.featuredImage}
                  alt={article.title}
                  title={article.title}
                  articleTitle={article.title}
                  category={article.category as any}
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