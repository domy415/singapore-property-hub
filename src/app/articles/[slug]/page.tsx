import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import LeadCaptureForm from '@/components/forms/LeadCaptureForm'
import SidebarNewsletter from '@/components/forms/SidebarNewsletter'
import { ArticleHeroImage, ArticleCardImage } from '@/components/ui/SEOOptimizedImage'
import OptimizedImage from '@/components/ui/OptimizedImage'
import { ArticleStatus } from '@prisma/client'
import { markdownToHtml, calculateReadingTime } from '@/utils/unified-markdown'
import styles from './article-styles.module.css'

interface Props {
  params: { slug: string }
}

async function getArticle(slug: string) {
  // Build-time guard: Skip database operations during build
  if (process.env.NODE_ENV !== 'production' && !process.env.DATABASE_URL) {
    return null
  }

  try {
    // Dynamic import to avoid build-time initialization
    const { prisma } = await import('@/lib/prisma')
    const article = await prisma.article.findFirst({
      where: {
        slug: slug,
        status: ArticleStatus.PUBLISHED
      },
      include: {
        author: true
      }
    })
    
    if (article) {
      // Increment view count
      await prisma.article.update({
        where: { id: article.id },
        data: { views: article.views + 1 }
      })
    }
    
    return article
  } catch (error) {
    console.error('Error fetching article:', error)
    return null
  }
}

async function getRelatedArticles(currentSlug: string, category: string) {
  // Build-time guard: Skip database operations during build
  if (process.env.NODE_ENV !== 'production' && !process.env.DATABASE_URL) {
    return []
  }

  try {
    // Dynamic import to avoid build-time initialization
    const { prisma } = await import('@/lib/prisma')
    return await prisma.article.findMany({
      where: {
        slug: { not: currentSlug },
        category: category as any,
        status: ArticleStatus.PUBLISHED
      },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        featuredImage: true,
        publishedAt: true
      },
      orderBy: { publishedAt: 'desc' },
      take: 2
    })
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
    title: `${article.seoTitle || article.title} | Singapore Property Hub`,
    description: article.seoDescription || article.excerpt,
    keywords: article.seoKeywords,
    alternates: {
      canonical: `https://singaporepropertyhub.sg/articles/${params.slug}`,
    },
    openGraph: {
      title: article.seoTitle || article.title,
      description: article.seoDescription || article.excerpt,
      images: article.featuredImage ? [{ url: article.featuredImage }] : [],
      type: 'article',
      publishedTime: article.publishedAt?.toISOString(),
      authors: [article.author.name],
    },
    other: {
      'article:author': article.author.name,
      'article:published_time': article.publishedAt?.toISOString() || '',
      'article:modified_time': article.updatedAt?.toISOString() || '',
      'article:section': article.category.replace(/_/g, ' ')
    }
  }
}

// Reading time calculation moved to unified-markdown.ts

export default async function ArticlePage({ params }: Props) {
  const article = await getArticle(params.slug)
  
  if (!article) {
    notFound()
  }

  const relatedArticles = await getRelatedArticles(params.slug, article.category)
  const readTime = calculateReadingTime(article.content)
  const htmlContent = await markdownToHtml(article.content)

  // Create JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.seoDescription || article.excerpt,
    image: article.featuredImage ? [article.featuredImage] : [],
    author: {
      '@type': 'Person',
      name: article.author.name
    },
    publisher: {
      '@type': 'Organization',
      name: 'Singapore Property Hub',
      logo: {
        '@type': 'ImageObject',
        url: 'https://singaporepropertyhub.sg/logo.png'
      }
    },
    datePublished: article.publishedAt?.toISOString(),
    dateModified: article.updatedAt?.toISOString(),
    articleSection: article.category.replace(/_/g, ' '),
    keywords: article.seoKeywords?.join(', '),
    wordCount: article.content.split(/\s+/).length,
    url: `https://singaporepropertyhub.sg/articles/${article.slug}`
  }

  // Use versioned filename pattern for images
  const getVersionedImagePath = (src: string) => {
    // If it's already a versioned path or external URL, return as-is
    if (src.includes('-v') || src.startsWith('http')) {
      return src
    }
    // Convert query string cache-busting to versioned filename
    const baseUrl = src.split('?')[0]
    const extension = baseUrl.split('.').pop()
    const nameWithoutExt = baseUrl.replace(`.${extension}`, '')
    return `${nameWithoutExt}-v1.${extension}`
  }

  return (
    <div className="article-page min-h-screen bg-white">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Article Content with International Standards */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Article Header */}
        <div className="max-w-[720px] mx-auto pt-16">
          {/* Breadcrumbs */}
          <nav className="mb-6 text-sm">
            <ol className="flex items-center space-x-2 text-gray-500">
              <li><Link href="/" className="hover:text-gray-700">Home</Link></li>
              <li>/</li>
              <li><Link href="/articles" className="hover:text-gray-700">Articles</Link></li>
              <li>/</li>
              <li className="text-gray-900 truncate">{article.title}</li>
            </ol>
          </nav>

          {/* Category Tag */}
          <div className="mb-4">
            <span className="inline-block bg-[#E3F2FD] text-[#0A66C2] text-sm font-semibold px-3 py-1 rounded uppercase tracking-wide">
              {article.category.replace(/_/g, ' ')}
            </span>
          </div>

          {/* Article Title */}
          <h1 className="text-gray-900 font-bold mb-6" style={{
            fontSize: 'clamp(2rem, 4vw, 2.625rem)',
            lineHeight: '1.2',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", Roboto, sans-serif'
          }}>
            {article.title}
          </h1>

          {/* Article Meta */}
          <div className="flex items-center text-gray-600 text-base space-x-2 mb-8">
            <span>{article.author.name}</span>
            <span>•</span>
            {article.publishedAt && (
              <>
                <span>{new Date(article.publishedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</span>
                <span>•</span>
              </>
            )}
            <span>{readTime}</span>
          </div>
        </div>

        {/* LinkedIn Share Button - Desktop Fixed Left */}
        <div className="hidden lg:block fixed left-8 top-1/2 -translate-y-1/2 z-50">
          <a 
            href={`https://www.linkedin.com/sharing/share-offsite/?url=https://singaporepropertyhub.sg/articles/${article.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-lg hover:bg-[#0A66C2] group transition-all duration-200"
            aria-label="Share on LinkedIn"
          >
            <svg className="w-6 h-6 text-[#0A66C2] group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </a>
        </div>

        {/* Article Body with International Typography */}
        <div className="max-w-[720px] mx-auto">
          <div className="article-content" style={{
            fontFamily: '-apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", Roboto, sans-serif'
          }}>
            {/* Article Body Content */}
            <div 
              className="prose prose-lg max-w-none"
              itemScope 
              itemType="https://schema.org/Article"
              style={{
                fontSize: '18px',
                lineHeight: '1.75',
                color: '#333333'
              }}
            >
              {/* Hidden structured data */}
              <meta itemProp="headline" content={article.title} />
              <meta itemProp="description" content={article.seoDescription || article.excerpt} />
              <meta itemProp="datePublished" content={article.publishedAt?.toISOString() || ''} />
              <meta itemProp="dateModified" content={article.updatedAt?.toISOString() || ''} />
              <meta itemProp="author" content={article.author.name} />
              {article.featuredImage && <meta itemProp="image" content={article.featuredImage} />}
              
              <div 
                itemProp="articleBody"
                dangerouslySetInnerHTML={{ __html: htmlContent }}
                className="article-typography"
              />
            </div>

            {/* Article Footer */}
            <div className="mt-16 pt-8 border-t border-gray-200">
              {/* Author Bio */}
              <div className="bg-gray-50 rounded-lg p-8 mb-12">
                <div className="flex items-start gap-4">
                  {article.author.photo ? (
                    <Image
                      src={article.author.photo}
                      alt={article.author.name}
                      width={80}
                      height={80}
                      className="w-20 h-20 rounded-full"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gray-300 rounded-full" />
                  )}
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{article.author.name}</h3>
                    {article.author.bio && (
                      <p className="text-gray-600 leading-relaxed">{article.author.bio}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Tags */}
              {article.tags.length > 0 && (
                <div className="mb-12">
                  <h3 className="text-lg font-semibold mb-4">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-[720px] mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-8">Related Articles</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {relatedArticles.map((relatedArticle) => (
                <Link
                  key={relatedArticle.id}
                  href={`/articles/${relatedArticle.slug}`}
                  className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden border"
                >
                  {relatedArticle.featuredImage && (
                    <div className="aspect-video relative overflow-hidden">
                      <Image
                        src={relatedArticle.featuredImage}
                        alt={relatedArticle.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="font-semibold mb-2 text-lg group-hover:text-[#0A66C2] transition-colors">
                      {relatedArticle.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{relatedArticle.excerpt}</p>
                    {relatedArticle.publishedAt && (
                      <span className="text-xs text-gray-500">
                        {new Date(relatedArticle.publishedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter Signup */}
      <section className="py-16 bg-[#0A66C2]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Get More Property Insights</h2>
          <p className="text-xl text-blue-100 mb-8">Weekly analysis delivered to your inbox</p>
          
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg border-none focus:ring-2 focus:ring-blue-300 text-gray-900"
            />
            <button className="px-6 py-3 bg-white text-[#0A66C2] font-semibold rounded-lg hover:bg-gray-100 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* LinkedIn Share Button - Mobile Fixed Bottom */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-50">
        <a 
          href={`https://www.linkedin.com/sharing/share-offsite/?url=https://singaporepropertyhub.sg/articles/${article.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full bg-[#0A66C2] text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
          Share on LinkedIn
        </a>
      </div>
    </div>
  )
}