import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { ArticleStatus } from '@prisma/client'

async function getLatestArticles() {
  try {
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
      take: 3
    })
    
    return articles.map(article => ({
      id: article.id,
      slug: article.slug,
      title: article.title,
      excerpt: article.excerpt,
      category: article.category.replace(/_/g, ' '),
      readTime: Math.ceil(article.content.length / 1000) + ' min read',
      date: article.publishedAt?.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }) || article.createdAt.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }),
      image: article.featuredImage
    }))
  } catch (error) {
    console.error('Error fetching articles:', error)
    return []
  }
}

// Fallback data if no articles in database
const fallbackArticles = [
  {
    id: '1',
    slug: 'singapore-property-market-outlook-2025',
    title: "Singapore Property Market Outlook 2025",
    excerpt: "Expert analysis on market trends, price predictions, and investment opportunities in Singapore's evolving real estate landscape.",
    category: "Market Insights",
    readTime: "5 min read",
    date: "Jan 15, 2025",
    image: null
  },
  {
    id: '2',
    slug: 'complete-guide-buying-first-condo',
    title: "Complete Guide to Buying Your First Condo",
    excerpt: "Everything first-time buyers need to know about purchasing a condominium in Singapore, from financing to legal requirements.",
    category: "Buying Guide",
    readTime: "8 min read",
    date: "Jan 12, 2025",
    image: null
  },
  {
    id: '3',
    slug: 'top-5-districts-property-investment',
    title: "Top 5 Districts for Property Investment",
    excerpt: "Discover the most promising areas for property investment in Singapore, with detailed ROI analysis and growth potential.",
    category: "Investment",
    readTime: "6 min read",
    date: "Jan 10, 2025",
    image: null
  }
]

export default async function LatestArticles() {
  const articles = await getLatestArticles()
  const displayArticles = articles.length > 0 ? articles : fallbackArticles

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Latest Property Insights</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Stay informed with our expert analysis, market trends, and actionable advice from Singapore's property professionals.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayArticles.map((article) => (
            <article key={article.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gradient-to-br from-blue-100 to-blue-200">
                {article.image && (
                  <img 
                    src={article.image} 
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                    {article.category}
                  </span>
                  <span className="text-gray-500 text-sm">{article.readTime}</span>
                </div>
                <h3 className="text-xl font-semibold mb-3 line-clamp-2">{article.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3">{article.excerpt}</p>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-sm">{article.date}</span>
                  <Link 
                    href={`/articles/${article.slug}`} 
                    className="text-blue-600 font-medium hover:text-blue-700"
                  >
                    Read More →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link href="/articles" className="btn-secondary inline-block">
            View All Articles
          </Link>
        </div>
      </div>
    </section>
  )
}