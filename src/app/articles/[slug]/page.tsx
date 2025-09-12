import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
// Temporarily disable complex imports to isolate error
// import LeadCaptureForm from '@/components/forms/LeadCaptureForm'
// import SidebarNewsletter from '@/components/forms/SidebarNewsletter'
// import { ArticleHeroImage, ArticleCardImage } from '@/components/ui/SEOOptimizedImage'
// import OptimizedImage from '@/components/ui/OptimizedImage'
import { ArticleStatus } from '@prisma/client'
// import { safeMarkdownToHtml, calculateReadingTime } from '@/lib/markdown'
// import styles from './article-styles.module.css'

// Force Node.js runtime for Prisma compatibility
export const runtime = 'nodejs'

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
      // Skip view count update in article pages to prevent server-side exceptions
      console.log('Article retrieved successfully, skipping view count update')
    }
    
    return article
  } catch (error) {
    console.error('Error fetching article:', error)
    return null
  }
}

async function getRelatedArticles(currentSlug: string, category: any) {
  try {
    // Dynamic import to avoid build-time initialization
    const { prisma } = await import('@/lib/prisma')
    
    return await prisma.article.findMany({
      where: {
        slug: { not: currentSlug },
        category: category,
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
  // BYPASS DATABASE COMPLETELY - use mock data to isolate error
  const article = {
    id: 'test-id',
    title: 'Test Article',
    excerpt: 'Test excerpt',
    content: 'Test content',
    author: { name: 'Test Author' },
    publishedAt: new Date(),
    slug: params.slug,
    tags: ['test'],
    category: 'MARKET_INSIGHTS',
    featuredImage: 'https://via.placeholder.com/800x400'
  }

  const relatedArticles: any[] = []
  const readTime = '5 min read'
  const htmlContent = '<p>Content processing temporarily disabled for debugging</p>'

  // Minimal JSON-LD
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Test Article',
    description: 'Test description'
  }

  // Simplified image path processing - remove complex versioning
  const getVersionedImagePath = (src: string) => {
    // Just return the source as-is to avoid any processing issues
    return src
  }

  return (
    <div>
      <h1>MINIMAL TEST PAGE</h1>
      <p>Article: {article.title}</p>
      <p>This is the most minimal version possible</p>
    </div>
  )
}