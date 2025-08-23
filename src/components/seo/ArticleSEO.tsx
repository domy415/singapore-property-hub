'use client'

import { ArticleSchema, BreadcrumbSchema, FAQSchema } from './SchemaMarkup'
import { generateMetadata } from '@/lib/metadata'
import { generateArticleSEO } from '@/lib/seo'
import { Metadata } from 'next'

interface ArticleSEOProps {
  article: {
    title: string
    description: string
    content: string
    slug: string
    publishedAt: string
    updatedAt?: string
    author?: string
    image?: string
    category?: string
  }
  breadcrumbs?: Array<{ name: string; url?: string }>
  faqs?: Array<{ question: string; answer: string }>
}

export default function ArticleSEO({ article, breadcrumbs = [], faqs = [] }: ArticleSEOProps) {
  const defaultBreadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Articles', url: '/articles' },
    { name: article.title }
  ]

  const breadcrumbItems = breadcrumbs.length > 0 ? breadcrumbs : defaultBreadcrumbs

  return (
    <>
      {/* Article Schema */}
      <ArticleSchema
        title={article.title}
        description={article.description}
        content={article.content}
        slug={article.slug}
        publishedAt={article.publishedAt}
        updatedAt={article.updatedAt}
        author={article.author}
        image={article.image}
        category={article.category}
      />

      {/* Breadcrumb Schema */}
      <BreadcrumbSchema items={breadcrumbItems} />

      {/* FAQ Schema (if FAQs provided) */}
      {faqs.length > 0 && <FAQSchema faqs={faqs} />}
    </>
  )
}

// Helper function to generate article metadata for Next.js App Router
export function generateArticleMetadata(article: {
  title: string
  description: string
  slug: string
  publishedAt: string
  author?: string
  image?: string
}): Metadata {
  const seoConfig = generateArticleSEO(article)
  return generateMetadata(seoConfig)
}