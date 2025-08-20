import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import LeadCaptureForm from '@/components/forms/LeadCaptureForm'
import { prisma } from '@/lib/prisma'
import { ArticleStatus } from '@prisma/client'

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
    }
  }
}

function calculateReadTime(content: string): string {
  const wordsPerMinute = 200
  const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length
  const readTime = Math.ceil(wordCount / wordsPerMinute)
  return `${readTime} min read`
}

export default async function ArticlePage({ params }: Props) {
  const article = await getArticle(params.slug)
  
  if (!article) {
    notFound()
  }

  const relatedArticles = await getRelatedArticles(params.slug, article.category)
  const readTime = calculateReadTime(article.content)

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-96 bg-gray-900">
        {article.featuredImage && (
          <img
            src={article.featuredImage}
            alt={article.title}
            className="w-full h-full object-cover opacity-70"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent">
          <div className="container h-full flex items-end pb-12">
            <div className="max-w-4xl text-white">
              <div className="flex items-center gap-4 mb-4">
                <span className="bg-blue-600 px-3 py-1 rounded text-sm font-semibold">
                  {article.category.replace(/_/g, ' ')}
                </span>
                <span className="text-blue-200">{readTime}</span>
                {article.publishedAt && (
                  <span className="text-blue-200">
                    {new Date(article.publishedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                )}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                {article.title}
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-16">
        <div className="container">
          <div className="grid lg:grid-cols-4 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Author Info */}
              <div className="flex items-center gap-4 mb-8 p-6 bg-gray-50 rounded-lg">
                {article.author.photo && (
                  <img 
                    src={article.author.photo} 
                    alt={article.author.name}
                    className="w-16 h-16 rounded-full"
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

              {/* Article Body */}
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />

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
                    href={`https://www.facebook.com/sharer/sharer.php?u=https://singaporepropertyhub.sg/articles/${article.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    Facebook
                  </a>
                  <a 
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=https://singaporepropertyhub.sg/articles/${article.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-400 text-white rounded hover:bg-blue-500"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                    Twitter
                  </a>
                  <a 
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=https://singaporepropertyhub.sg/articles/${article.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                    LinkedIn
                  </a>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-8">
                {/* Newsletter Signup */}
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="font-semibold mb-4">Stay Updated</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Get the latest property insights delivered to your inbox.
                  </p>
                  <div className="space-y-3">
                    <input
                      type="email"
                      placeholder="Your email"
                      className="w-full px-3 py-2 border rounded"
                    />
                    <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                      Subscribe
                    </button>
                  </div>
                </div>

                {/* Contact Form */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-semibold mb-4">Need Property Advice?</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Get personalized recommendations from our experts.
                  </p>
                  <LeadCaptureForm />
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
                      <img
                        src={relatedArticle.featuredImage}
                        alt={relatedArticle.title}
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