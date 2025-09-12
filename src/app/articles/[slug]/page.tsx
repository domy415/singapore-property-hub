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
      // Increment view count - but handle potential errors gracefully
      try {
        await prisma.article.update({
          where: { id: article.id },
          data: { views: article.views + 1 }
        })
      } catch (updateError) {
        console.warn('Failed to update view count:', updateError)
        // Continue anyway - we have the article
      }
    }
    
    return article
  } catch (error) {
    console.error('Error fetching article:', error)
    return null
  }
}

async function getRelatedArticles(currentSlug: string, category: string) {
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
          <nav className="text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-[#0A66C2]">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/articles" className="hover:text-[#0A66C2]">Articles</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">Market Analysis</span>
          </nav>

          {/* Category */}
          <span className="inline-block px-3 py-1 bg-[#E3F2FD] text-[#1976D2] text-sm font-medium rounded-full mb-4">
            {article.category.replace(/_/g, ' ')}
          </span>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {article.title}
          </h1>

          {/* Meta info */}
          <div className="flex items-center text-gray-600 text-base space-x-4">
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
            <span>{readTime} min read</span>
          </div>
        </div>

        {/* LinkedIn Share Button - Desktop Floating Left */}
        <div className="hidden md:block fixed left-[calc(50%-420px)] top-1/2 transform -translate-y-1/2 -translate-x-full">
          <button 
            onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=https://singaporepropertyhub.sg/articles/${article.slug}`, '_blank')}
            className="bg-white shadow-lg rounded-full p-3 hover:bg-[#0A66C2] group transition-all duration-300"
            aria-label="Share on LinkedIn"
          >
            <svg className="w-6 h-6 text-[#0A66C2] group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </button>
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
                className="article-typography prose prose-lg max-w-none"
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
        <section className="mt-16 pt-16 border-t border-gray-200">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-8">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((relatedArticle) => (
                <article key={relatedArticle.id} className="group">
                  <Link href={`/articles/${relatedArticle.slug}`}>
                    <div className="aspect-video bg-gray-200 rounded-lg mb-4 overflow-hidden">
                      {relatedArticle.featuredImage && (
                        <Image
                          src={relatedArticle.featuredImage}
                          alt={relatedArticle.title}
                          width={400}
                          height={225}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      )}
                    </div>
                    <h3 className="font-semibold text-lg group-hover:text-[#0A66C2] transition-colors">
                      {relatedArticle.title}
                    </h3>
                    <p className="text-gray-600 text-sm mt-2">
                      {relatedArticle.publishedAt && new Date(relatedArticle.publishedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </Link>
                </article>
              ))}
              {/* Add placeholder article if only 2 related articles */}
              {relatedArticles.length === 2 && (
                <article className="group">
                  <Link href="/articles">
                    <div className="aspect-video bg-gradient-to-br from-[#0A66C2] to-[#1976D2] rounded-lg mb-4 overflow-hidden flex items-center justify-center">
                      <div className="text-white text-center p-6">
                        <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="font-semibold">View All Articles</p>
                      </div>
                    </div>
                    <h3 className="font-semibold text-lg group-hover:text-[#0A66C2] transition-colors">
                      Explore More Property Insights
                    </h3>
                    <p className="text-gray-600 text-sm mt-2">Browse our complete collection</p>
                  </Link>
                </article>
              )}
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
      <div className="md:hidden fixed bottom-6 right-6 z-50">
        <button 
          onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=https://singaporepropertyhub.sg/articles/${article.slug}`, '_blank')}
          className="bg-[#0A66C2] shadow-lg rounded-full p-4"
          aria-label="Share on LinkedIn"
        >
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        </button>
      </div>
    </div>
  )
}