import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { safeMarkdownToHtml, calculateReadingTime } from '@/lib/markdown'
import ArticleSEO from '@/components/seo/ArticleSEO'
import { getArticleImage } from '@/lib/image-constants'
import { ARTICLES_DATA } from '@/data/static-articles'

// REMOVED: getArticleImageForDetail function deleted to prevent conflicts
// Using centralized getArticleImage from lib/image-constants.ts

// Generate static params for known articles
export async function generateStaticParams() {
  return ARTICLES_DATA.map((article) => ({
    slug: article.slug
  }))
}

interface Props {
  params: { slug: string }
}

function getArticle(slug: string) {
  const article = ARTICLES_DATA.find((a) => 
    a.slug === slug || 
    a.slug === decodeURIComponent(slug) ||
    a.id === slug
  )
  
  if (article) {
    return {
      ...article,
      author: { name: article.author?.name || 'Property Hub Team' },
      publishedAt: new Date(article.publishedAt || Date.now()),
      createdAt: new Date(article.publishedAt || Date.now()),
      updatedAt: null
    }
  }
  
  return null
}

function getRelatedArticles(currentSlug: string, category: string | null = null) {
  const otherArticles = ARTICLES_DATA
    .filter((a) => a.slug !== currentSlug)
    .filter((a) => !category || a.category === category)
    .slice(0, 3)
  
  return otherArticles.map((article) => ({
    ...article,
    author: { name: article.author?.name || 'Property Hub Team' }
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = getArticle(params.slug)
  
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
  const article = getArticle(params.slug)
  
  if (!article) {
    notFound()
  }

  // Fetch related articles
  const relatedArticles = getRelatedArticles(params.slug, article.category)

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
          publishedAt: article.publishedAt?.toISOString() || article.createdAt?.toISOString() || new Date().toISOString(),
          updatedAt: undefined,
          author: article.author.name,
          image: getArticleImage(article),
          category: article.category.replace('_', ' ')
        }}
      />
      
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Hero Image */}
        <div className="mb-8 rounded-lg overflow-hidden">
          <img 
            src={getArticleImage(article)} 
            alt={article.title}
            className="w-full h-96 object-cover"
          />
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          {article.title}
        </h1>
        
        <div className="mb-8">
          <p className="text-gray-600">
            By {article.author.name} | {readTime} | Published: {article.publishedAt?.toLocaleDateString()}
          </p>
        </div>
        
        <div 
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: markdownResult.html }}
        />
        
        {/* Related Articles Section */}
        {relatedArticles.length > 0 && (
          <div className="mt-16 pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Articles</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedArticles.map((relatedArticle) => (
                <div key={relatedArticle.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  <img 
                    src={getArticleImage(relatedArticle)} 
                    alt={relatedArticle.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                      <a 
                        href={`/articles/${relatedArticle.slug}`}
                        className="text-gray-900 hover:text-blue-600 transition-colors"
                      >
                        {relatedArticle.title}
                      </a>
                    </h3>
                    {relatedArticle.excerpt && (
                      <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                        {relatedArticle.excerpt}
                      </p>
                    )}
                    <p className="text-xs text-gray-500">
                      By {relatedArticle.author.name} • {relatedArticle.publishedAt ? new Date(relatedArticle.publishedAt).toLocaleDateString() : 'Recent'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
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