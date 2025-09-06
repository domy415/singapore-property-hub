import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import LeadCaptureForm from '@/components/forms/LeadCaptureForm'
import SidebarNewsletter from '@/components/forms/SidebarNewsletter'
import { ArticleHeroImage, ArticleCardImage } from '@/components/ui/SEOOptimizedImage'
import OptimizedImage from '@/components/ui/OptimizedImage'
import { prisma } from '@/lib/prisma'
import { ArticleStatus } from '@prisma/client'
import { markdownToHtml, calculateReadingTime } from '@/utils/unified-markdown'

interface Props {
  params: { slug: string }
}

async function getArticle(slug: string) {
  try {
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
  try {
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

  return (
    <div className="min-h-screen bg-white">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Hero Section - Clean Version Without Overlay */}
      <section className="relative h-[480px] bg-gray-900 mt-20">
        {article.featuredImage && (
          <ArticleHeroImage
            src={article.featuredImage}
            alt={`Singapore property landscape analysis featuring ${article.title} - Expert insights on Singapore real estate market trends and investment opportunities`}
            title={article.title}
            articleTitle={article.title}
            category={article.category as any}
            author={article.author.name}
            publishedAt={article.publishedAt || undefined}
            className="w-full h-full object-cover image-placeholder"
            unoptimized={true}
          />
        )}
        {/* Title and metadata positioned absolutely at bottom without overlay background */}
        <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
          <div className="container">
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
            </div>
          </div>
        </div>
      </section>

      {/* Article Content with Enhanced Spacing */}
      <section className="py-12 article-content-spacing">
        <div className="container">
          <div className="grid lg:grid-cols-4 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Author Info */}
              <div className="flex items-center gap-4 mb-8 p-6 bg-gray-50 rounded-lg">
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
                  <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
                )}
                <div>
                  <h3 className="font-semibold text-lg">{article.author.name}</h3>
                  {article.author.bio && (
                    <p className="text-gray-600 text-sm">{article.author.bio}</p>
                  )}
                </div>
              </div>

              {/* Article Body with Enhanced Typography */}
              <article 
                className="article-typography-fix heading-spacing-fix paragraph-spacing-fix list-spacing-fix blockquote-fix code-fix table-fix link-fix image-fix hr-fix accessibility-fix"
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
                  className="prose prose-xl max-w-none font-inter"
                  itemProp="articleBody"
                  dangerouslySetInnerHTML={{ __html: htmlContent }}
                />
              </article>

              {/* Tags */}
              {article.tags.length > 0 && (
                <div className="mt-12 pt-8 border-t">
                  <h3 className="font-semibold mb-4">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Share */}
              <div className="mt-8 pt-8 border-t">
                <h3 className="font-semibold mb-4">Share this article</h3>
                <div className="flex gap-4">
                  <a 
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=https://singaporepropertyhub.sg/articles/${article.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                    Share on LinkedIn
                  </a>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-8">
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
      </section>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container">
            <h2 className="text-2xl font-bold mb-8">Related Articles</h2>
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
      <section className="py-8">
        <div className="container">
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 text-blue-600 hover:underline"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to All Articles
          </Link>
        </div>
      </section>
    </div>
  )
}