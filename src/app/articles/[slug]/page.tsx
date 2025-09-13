import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { safeMarkdownToHtml, calculateReadingTime } from '@/lib/markdown'
import ArticleSEO from '@/components/seo/ArticleSEO'

export const runtime = 'nodejs'

interface Props {
  params: { slug: string }
}

async function getArticle(slug: string) {
  try {
    const { prisma } = await import('@/lib/prisma')
    const { ArticleStatus } = await import('@prisma/client')
    
    const article = await prisma.article.findFirst({
      where: {
        slug: slug,
        status: ArticleStatus.PUBLISHED
      },
      include: {
        author: true
      }
    })
    
    return article
  } catch (error) {
    console.error('Error fetching article:', error)
    return null
  }
}

async function getRelatedArticles(currentSlug: string, category: any = null) {
  try {
    const { prisma } = await import('@/lib/prisma')
    const { ArticleStatus } = await import('@prisma/client')
    
    const relatedArticles = await prisma.article.findMany({
      where: {
        slug: { not: currentSlug },
        status: ArticleStatus.PUBLISHED,
        ...(category && { category })
      },
      include: {
        author: true
      },
      orderBy: {
        publishedAt: 'desc'
      },
      take: 3
    })
    
    return relatedArticles
  } catch (error) {
    console.error('Error fetching related articles:', error)
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await getArticle(params.slug)
  
  if (!article) {
    return {
      title: 'Article Not Found | Singapore Property Hub',
      description: 'The requested article could not be found.'
    }
  }
  
  return {
    title: `${article.title} | Singapore Property Hub`,
    description: article.excerpt || 'Singapore property article',
  }
}

export default async function ArticlePage({ params }: Props) {
  const article = await getArticle(params.slug)
  
  if (!article) {
    notFound()
  }

  // Fetch related articles
  const relatedArticles = await getRelatedArticles(params.slug, article.category)

  // Safe markdown processing with comprehensive error handling
  const markdownResult = await safeMarkdownToHtml(article.content, {
    enableLogging: process.env.NODE_ENV === 'development'
  })
  
  const readTime = calculateReadingTime(article.content)

  return (
    <div className="min-h-screen bg-white">
      {/* Article SEO and Structured Data */}
      <ArticleSEO
        article={{
          title: article.title,
          description: article.excerpt || article.title,
          content: article.content,
          slug: article.slug,
          publishedAt: article.publishedAt?.toISOString() || article.createdAt.toISOString(),
          updatedAt: article.updatedAt?.toISOString(),
          author: article.author.name,
          image: article.featuredImage || undefined,
          category: article.category.replace('_', ' ')
        }}
      />
      
      {/* Hero Section */}
      <section className="relative">
        {/* Hero Image */}
        {article.featuredImage && (
          <div className="relative h-[70vh] overflow-hidden">
            <img 
              src={article.featuredImage} 
              alt={article.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            
            {/* Article Header Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <div className="max-w-4xl mx-auto">
                {/* Breadcrumb */}
                <nav className="flex items-center space-x-2 text-sm mb-4 opacity-90">
                  <a href="/" className="hover:text-yellow-400 transition-colors">Home</a>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <a href="/articles" className="hover:text-yellow-400 transition-colors">Articles</a>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <span className="text-yellow-400">{article.category.replace('_', ' ')}</span>
                </nav>
                
                {/* Category Badge */}
                <div className="mb-6">
                  <span className="inline-block bg-yellow-400 text-black px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide">
                    {article.category.replace('_', ' ')}
                  </span>
                </div>
                
                {/* Title */}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                  {article.title}
                </h1>
                
                {/* Excerpt */}
                {article.excerpt && (
                  <p className="text-xl text-gray-200 mb-6 max-w-3xl leading-relaxed">
                    {article.excerpt}
                  </p>
                )}
                
                {/* Article Meta */}
                <div className="flex flex-wrap items-center gap-6 text-sm">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mr-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold">{article.author.name}</div>
                      <div className="text-gray-300">Property Expert</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{readTime}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{article.publishedAt?.toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Fallback for articles without featured image */}
        {!article.featuredImage && (
          <div className="bg-gradient-to-br from-[#0A66C2] to-[#004182] py-20">
            <div className="max-w-4xl mx-auto px-4 text-white">
              <div className="mb-6">
                <span className="inline-block bg-yellow-400 text-black px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide">
                  {article.category.replace('_', ' ')}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                {article.title}
              </h1>
              <div className="flex flex-wrap items-center gap-6 text-sm">
                <span>By {article.author.name}</span>
                <span>{readTime}</span>
                <span>{article.publishedAt?.toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        )}
      </section>
      
      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-4 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div 
              className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-headings:font-bold prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-[#0A66C2] prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-ul:text-gray-700 prose-ol:text-gray-700 prose-blockquote:border-l-[#0A66C2] prose-blockquote:bg-[#F8F9FA] prose-blockquote:p-6 prose-blockquote:rounded-r-lg"
              dangerouslySetInnerHTML={{ __html: markdownResult.html }}
            />
            
            {/* Article Actions */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">Share this article:</span>
                  <div className="flex space-x-3">
                    <button className="p-2 bg-[#0A66C2] text-white rounded-full hover:bg-blue-800 transition-colors">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </button>
                    <button className="p-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <span>Last updated:</span>
                  <span>{article.updatedAt ? new Date(article.updatedAt).toLocaleDateString() : new Date(article.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-8">
              {/* Table of Contents */}
              <div className="bg-[#F8F9FA] p-6 rounded-xl">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                  Table of Contents
                </h3>
                <nav className="space-y-2 text-sm">
                  <a href="#introduction" className="block text-gray-600 hover:text-[#0A66C2] transition-colors">Introduction</a>
                  <a href="#market-analysis" className="block text-gray-600 hover:text-[#0A66C2] transition-colors">Market Analysis</a>
                  <a href="#investment-insights" className="block text-gray-600 hover:text-[#0A66C2] transition-colors">Investment Insights</a>
                  <a href="#conclusion" className="block text-gray-600 hover:text-[#0A66C2] transition-colors">Key Takeaways</a>
                </nav>
              </div>
              
              {/* Newsletter Signup */}
              <div className="bg-gradient-to-br from-[#0A66C2] to-[#004182] p-6 rounded-xl text-white">
                <h3 className="text-lg font-semibold mb-2">Stay Informed</h3>
                <p className="text-sm text-blue-100 mb-4">
                  Get weekly property insights delivered to your inbox
                </p>
                <div className="space-y-3">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="w-full px-3 py-2 rounded-lg text-gray-900 text-sm"
                  />
                  <button className="w-full bg-yellow-400 text-black py-2 rounded-lg font-semibold text-sm hover:bg-yellow-300 transition-colors">
                    Subscribe Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
        
      {/* Related Articles Section */}
      {relatedArticles.length > 0 && (
        <section className="bg-[#F8F9FA] py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Related Articles</h2>
              <p className="text-lg text-gray-600">Continue exploring Singapore property insights</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {relatedArticles.map((relatedArticle) => (
                <a 
                  key={relatedArticle.id}
                  href={`/articles/${relatedArticle.slug}`}
                  className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2"
                >
                  {relatedArticle.featuredImage && (
                    <div className="aspect-[4/3] relative overflow-hidden">
                      <img 
                        src={relatedArticle.featuredImage} 
                        alt={relatedArticle.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="mb-3">
                      <span className="inline-block bg-[#E3F2FD] text-[#0A66C2] text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide">
                        {relatedArticle.category.replace('_', ' ')}
                      </span>
                    </div>
                    <h3 className="font-bold text-xl mb-3 text-gray-900 group-hover:text-[#0A66C2] transition-colors line-clamp-2 leading-snug">
                      {relatedArticle.title}
                    </h3>
                    {relatedArticle.excerpt && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                        {relatedArticle.excerpt}
                      </p>
                    )}
                    <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-100">
                      <span>By {relatedArticle.author.name}</span>
                      <span>{relatedArticle.publishedAt?.toLocaleDateString()}</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <a 
                href="/articles" 
                className="inline-flex items-center bg-[#0A66C2] text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-800 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                View All Articles
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </div>
        </section>
      )}
        
        {markdownResult.warnings.length > 0 && process.env.NODE_ENV === 'development' && (
          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded">
            <p className="font-semibold">Markdown Processing Warnings:</p>
            <ul className="text-sm">
              {markdownResult.warnings.map((warning, i) => (
                <li key={i}>• {warning}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}