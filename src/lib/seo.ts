export interface SEOConfig {
  title: string
  description: string
  canonical?: string
  ogImage?: string
  ogType?: 'website' | 'article'
  articlePublishedTime?: string
  articleAuthor?: string
  keywords?: string[]
}

export const defaultSEO: SEOConfig = {
  title: 'Singapore Property Hub - Your Trusted Property Investment Guide',
  description: 'Expert insights, market analysis, and comprehensive guides for Singapore property investment. Discover condos, districts, and make informed property decisions.',
  ogImage: '/images/og-default.jpg',
  ogType: 'website',
  keywords: ['Singapore property', 'property investment', 'condos Singapore', 'real estate Singapore']
}

export const siteConfig = {
  name: 'Singapore Property Hub',
  url: 'https://singapore-property-hub.vercel.app',
  description: 'Singapore\'s most trusted property investment guide with expert insights and comprehensive market analysis.',
  author: 'Singapore Property Hub Team',
  social: {
    linkedin: 'https://linkedin.com/company/singapore-property-hub'
  }
}

export function generatePageSEO(config: Partial<SEOConfig> & { title: string }): SEOConfig {
  return {
    ...defaultSEO,
    ...config,
    title: `${config.title} | Singapore Property Hub`,
    canonical: config.canonical || `${siteConfig.url}${config.canonical || ''}`,
  }
}

export function generateArticleSEO(article: {
  title: string
  description: string
  slug: string
  publishedAt: string
  author?: string
  image?: string
}): SEOConfig {
  return {
    title: `${article.title} | Singapore Property Hub`,
    description: article.description.length > 160 ? 
      article.description.substring(0, 157) + '...' : 
      article.description,
    canonical: `${siteConfig.url}/articles/${article.slug}`,
    ogImage: article.image || defaultSEO.ogImage,
    ogType: 'article',
    articlePublishedTime: article.publishedAt,
    articleAuthor: article.author || siteConfig.author,
    keywords: extractKeywords(article.title, article.description)
  }
}

export function generateDistrictSEO(district: {
  number: number
  name: string
  region: string
}): SEOConfig {
  return {
    title: `District ${district.number} ${district.name} Property Guide`,
    description: `Complete investment guide for District ${district.number} (${district.name}). Top condos, price trends, schools, transportation, and expert analysis for ${district.region} properties.`,
    canonical: `${siteConfig.url}/districts/${district.number}`,
    ogImage: `/images/districts/district-${district.number}.jpg`,
    keywords: [
      `District ${district.number}`, 
      district.name, 
      `${district.name} condos`,
      `${district.name} property`,
      `Singapore ${district.region}`,
      'property investment',
      'Singapore real estate'
    ]
  }
}

export function generateCondoSEO(condo: {
  name: string
  district: number
  developer: string
  completionYear: string
}): SEOConfig {
  return {
    title: `${condo.name} Review 2025 - Complete Analysis & Investment Guide`,
    description: `Comprehensive review of ${condo.name} by ${condo.developer}. Analysis of pros & cons, investment potential, pricing, and expert insights for this District ${condo.district} development.`,
    canonical: `${siteConfig.url}/condos/${condo.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}/review-2025`,
    ogImage: `/images/condos/${condo.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.jpg`,
    keywords: [
      condo.name,
      `${condo.name} review`,
      `${condo.name} analysis`,
      `District ${condo.district} condo`,
      condo.developer,
      'Singapore condo review',
      'property investment analysis'
    ]
  }
}

function extractKeywords(title: string, description: string): string[] {
  const text = `${title} ${description}`.toLowerCase()
  const commonKeywords = [
    'singapore property', 'condo', 'investment', 'district', 'real estate',
    'property market', 'rental yield', 'capital growth', 'mrt', 'school'
  ]
  
  return commonKeywords.filter(keyword => text.includes(keyword))
}

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": siteConfig.name,
  "url": siteConfig.url,
  "description": siteConfig.description,
  "logo": `${siteConfig.url}/images/logo.png`,
  "sameAs": [
    siteConfig.social.linkedin
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "email": "hello@singaporepropertyhub.sg",
    "contactType": "customer service"
  }
}

export function generateArticleSchema(article: {
  title: string
  description: string
  content: string
  slug: string
  publishedAt: string
  updatedAt?: string
  author?: string
  image?: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.description,
    "articleBody": article.content,
    "url": `${siteConfig.url}/articles/${article.slug}`,
    "datePublished": article.publishedAt,
    "dateModified": article.updatedAt || article.publishedAt,
    "author": {
      "@type": "Organization",
      "name": article.author || siteConfig.author
    },
    "publisher": {
      "@type": "Organization",
      "name": siteConfig.name,
      "logo": {
        "@type": "ImageObject",
        "url": `${siteConfig.url}/images/logo.png`
      }
    },
    "image": article.image ? {
      "@type": "ImageObject",
      "url": `${siteConfig.url}${article.image}`
    } : undefined,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${siteConfig.url}/articles/${article.slug}`
    }
  }
}

export function generateBreadcrumbSchema(items: Array<{ name: string, url?: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url ? `${siteConfig.url}${item.url}` : undefined
    }))
  }
}