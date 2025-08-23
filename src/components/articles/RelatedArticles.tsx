import Link from 'next/link'

interface RelatedArticle {
  id: string
  title: string
  excerpt: string
  slug: string
  category: string
  readTime: string
  image: string
  publishedAt: Date
}

interface RelatedArticlesProps {
  articles: RelatedArticle[]
  className?: string
}

export default function RelatedArticles({ articles, className = "" }: RelatedArticlesProps) {
  return (
    <div className={className}>
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-primary mb-3">Related Articles</h2>
        <p className="text-secondary">Explore more insights and property reviews</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {articles.map((article) => (
          <Link key={article.id} href={`/articles/${article.slug}`}>
            <article className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group">
              <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                <img 
                  src={article.image} 
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                    {article.category}
                  </span>
                  <span className="text-secondary text-xs">{article.readTime}</span>
                </div>
                
                <h3 className="font-bold text-primary mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors leading-tight">
                  {article.title}
                </h3>
                
                <p className="text-secondary text-sm mb-4 line-clamp-2 leading-relaxed">
                  {article.excerpt}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-secondary text-xs">
                    {article.publishedAt.toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                  <div className="text-blue-600 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                    Read More
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  )
}