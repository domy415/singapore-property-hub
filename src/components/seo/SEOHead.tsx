'use client'

import Head from 'next/head'
import { SEOConfig, siteConfig } from '@/lib/seo'

interface SEOHeadProps {
  config: SEOConfig
  schema?: object | object[]
}

export default function SEOHead({ config, schema }: SEOHeadProps) {
  const {
    title,
    description,
    canonical,
    ogImage,
    ogType,
    articlePublishedTime,
    articleAuthor,
    keywords
  } = config

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
      
      {/* Keywords */}
      {keywords && keywords.length > 0 && (
        <meta name="keywords" content={keywords.join(', ')} />
      )}
      
      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonical} />}
      
      {/* Open Graph Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonical || siteConfig.url} />
      <meta property="og:site_name" content={siteConfig.name} />
      {ogImage && <meta property="og:image" content={`${siteConfig.url}${ogImage}`} />}
      {ogImage && <meta property="og:image:alt" content={title} />}
      
      {/* Article specific OG tags */}
      {ogType === 'article' && (
        <>
          {articlePublishedTime && (
            <meta property="article:published_time" content={articlePublishedTime} />
          )}
          {articleAuthor && (
            <meta property="article:author" content={articleAuthor} />
          )}
        </>
      )}
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {ogImage && <meta name="twitter:image" content={`${siteConfig.url}${ogImage}`} />}
      
      {/* Additional Meta Tags */}
      <meta name="robots" content="index, follow, max-image-preview:large" />
      <meta name="googlebot" content="index, follow" />
      <meta name="author" content={siteConfig.author} />
      <meta name="publisher" content={siteConfig.name} />
      
      {/* Schema.org JSON-LD */}
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(Array.isArray(schema) ? schema : [schema])
          }}
        />
      )}
    </Head>
  )
}