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
      
      {/* Scoped CSS for image placeholder */}
      <style jsx>{`
        .article-page .image-placeholder {
          pointer-events: none;
        }
        .article-page .image-placeholder * {
          pointer-events: none;
        }
      `}</style>
      
      {/* Hero Section with Featured Image */}
      <section className="relative h-[600px] bg-gray-900 mt-20">
        {/* Featured Image Container */}
        <div className="image-placeholder absolute inset-0">
          {article.featuredImage ? (
            <Image
              src={getVersionedImagePath(article.featuredImage)}
              alt={`${article.title} - Expert analysis of Singapore property market trends and insights for investors and homebuyers`}
              fill
              priority
              unoptimized={true} // Temporarily for debugging
              className="object-cover"
              sizes="100vw"
              quality={95}
            />
          ) : (
            <Image
              src="/images/singapore-property-hero-v1.svg"
              alt="Singapore Property Hub - Default hero image showing Singapore skyline and property landscape"
              fill
              priority
              unoptimized={true} // Temporarily for debugging
              className="object-cover"
              sizes="100vw"
            />
          )}
        </div>
        
        {/* Title and metadata overlay at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/90 via-black/70 to-transparent">
          <div className="container mx-auto">
            <div className="max-w-4xl">
              <div className="flex items-center gap-4 mb-4">
                <span className="bg-blue-600 px-3 py-1 rounded text-sm font-semibold text-white">
                  {article.category.replace(/_/g, ' ')}
                </span>
                <span className="text-gray-200">{readTime}</span>
                {article.publishedAt && (
                  <span className="text-gray-200">
                    {new Date(article.publishedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                )}
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white drop-shadow-2xl font-inter">
                {article.title}
              </h1>
              <div className="mt-4 text-gray-200">
                By {article.author.name}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Article Body - with proper spacing to avoid overlap */}
      <article className="article-body relative z-20 bg-white pt-12">
        <div className={styles.articleContainer}>
          <div className="grid lg:grid-cols-12 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-8">
              <div className={styles.articleContent}>
                {/* Author Info */}
                <div className={`${styles.authorSection} flex items-center gap-4 mb-8`}>
                  {article.author.photo && (
                    <OptimizedImage
                      src={article.author.photo}
                      alt={`${article.author.name} profile photo`}
                      width={64}
                      height={64}
                      className="w-16 h-16 rounded-full"
                      priority={false}
                    />
                  )}
                  {!article.author.photo && (
                    <div className="w-16 h-16 bg-gray-300 rounded-full" aria-hidden="true"></div>
                  )}
                  <div>
                    <h3 className="font-semibold text-lg">{article.author.name}</h3>
                    {article.author.bio && (
                      <p className="text-gray-600 text-sm">{article.author.bio}</p>
                    )}
                  </div>
                </div>

                {/* Article Body with Enhanced Typography */}
                <div 
                  className={styles.articleBody}
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
                  />
                </div>

                {/* Tags */}
                {article.tags.length > 0 && (
                  <div className={styles.tagsSection}>
                    <h3 className={styles.subHeader}>Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {article.tags.map((tag) => (
                        <span
                          key={tag}
                          className={styles.tag}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Share */}
                <div className="mt-8 pt-8 border-t">
                  <h3 className={styles.subHeader}>Share this article</h3>
                  <div className="flex gap-4">
                    <a 
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=https://singaporepropertyhub.sg/articles/${article.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.linkedinButton}
                      aria-label="Share this article on LinkedIn"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                      Share on LinkedIn
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className={`lg:col-span-4 ${styles.sidebar}`}>
              <div className="sticky top-24 space-y-8">
                {/* Newsletter Signup */}
                <SidebarNewsletter />

                {/* Contact Form */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-semibold mb-4">Need Property Advice?</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Get personalized recommendations from our experts.
                  </p>
                  <LeadCaptureForm compact={true} />
                </div>

                {/* Article Stats */}
                <div className="bg-white border rounded-lg p-6">
                  <h3 className="font-semibold mb-4">Article Stats</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Views</span>
                      <span className="font-medium">{article.views.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Reading time</span>
                      <span className="font-medium">{readTime}</span>
                    </div>
                    {article.linkedInPosted && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">LinkedIn</span>
                        <span className="text-green-600">✓ Shared</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className={styles.articleContainer}>
            <h2 className={styles.sectionHeader}>Related Articles</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {relatedArticles.map((relatedArticle) => (
                <Link
                  key={relatedArticle.id}
                  href={`/articles/${relatedArticle.slug}`}
                  className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {relatedArticle.featuredImage && (
                    <div className="h-48 bg-gray-200">
                      <ArticleCardImage
                        src={relatedArticle.featuredImage}
                        alt={relatedArticle.title}
                        title={relatedArticle.title}
                        articleTitle={relatedArticle.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        unoptimized={true}
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="font-semibold mb-2 group-hover:text-blue-600 transition-colors">
                      {relatedArticle.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3">{relatedArticle.excerpt}</p>
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

      {/* Back to Articles */}
      <section className={`py-16 ${styles.articleEnd}`}>
        <div className={styles.articleContainer}>
          <div className={styles.articleContent}>
            <Link
              href="/articles"
              className="inline-flex items-center gap-2 text-blue-600 hover:underline font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to All Articles
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}