import Link from 'next/link'

interface FeaturedArticle {
  id: string
  slug: string
  title: string
  excerpt: string
  featuredImage: string
  category: string
  publishedAt: Date
  readTime: string
}

interface HeroFeaturedProps {
  article: FeaturedArticle
}

export default function HeroFeatured({ article }: HeroFeaturedProps) {
  return (
    <section className="relative h-[600px] w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src={article.featuredImage} 
          alt={article.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      </div>
      
      {/* Content Overlay */}
      <div className="relative container h-full flex items-end pb-12">
        <div className="max-w-3xl text-white">
          <div className="flex items-center gap-4 mb-4">
            <span className="bg-blue-600 px-4 py-1 rounded-full text-sm font-semibold uppercase tracking-wide">
              Featured
            </span>
            <span className="text-blue-200 text-sm">
              {article.category} • {article.readTime}
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            {article.title}
          </h1>
          
          <p className="text-xl text-gray-200 mb-8 leading-relaxed">
            {article.excerpt}
          </p>
          
          <div className="flex items-center gap-6">
            <Link 
              href={`/articles/${article.slug}`}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors inline-flex items-center gap-2"
            >
              Read Full Article
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            
            <Link 
              href="/newsletter"
              className="bg-white/10 backdrop-blur hover:bg-white/20 text-white px-6 py-4 rounded-lg font-semibold transition-colors border border-white/20"
            >
              Get Daily Updates
            </Link>
          </div>
        </div>
      </div>
      
      {/* Featured Badge */}
      <div className="absolute top-8 right-8">
        <div className="bg-yellow-500 text-black px-6 py-2 rounded-full font-bold text-sm uppercase tracking-wide shadow-lg">
          Today's Top Story
        </div>
      </div>
    </section>
  )
}