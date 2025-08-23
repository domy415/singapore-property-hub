import { Metadata } from 'next'
import { generateMetadata } from './metadata'
import { 
  generatePageSEO, 
  generateArticleSEO, 
  generateDistrictSEO, 
  generateCondoSEO, 
  SEOConfig 
} from './seo'

// Page-specific SEO configurations
export const pageSEOConfigs = {
  home: {
    title: 'Singapore Property Hub - Your Trusted Property Investment Guide',
    description: 'Expert insights, market analysis, and comprehensive guides for Singapore property investment. Discover condos, districts, and make informed property decisions.',
    keywords: ['Singapore property', 'property investment', 'condos Singapore', 'real estate Singapore', 'property market analysis']
  },
  
  condos: {
    title: 'Singapore Condominiums - Complete Reviews & Analysis',
    description: 'Comprehensive reviews and analysis of Singapore condominiums. Expert insights on pricing, investment potential, pros & cons, and detailed development information.',
    keywords: ['Singapore condos', 'condo reviews', 'condominium analysis', 'property reviews Singapore', 'condo investment']
  },

  districts: {
    title: 'Singapore Property Districts Guide - Investment Analysis by District',
    description: 'Complete guide to Singapore property districts. Analysis of all 28 districts including top condos, price trends, schools, transportation, and investment outlook.',
    keywords: ['Singapore districts', 'property districts Singapore', 'district guide', 'Singapore property zones', 'district analysis']
  },

  guides: {
    title: 'Singapore Property Investment Guides - Expert Tips & Strategies',
    description: 'Comprehensive property investment guides for Singapore. Learn about buying strategies, market trends, financing options, and expert investment tips.',
    keywords: ['property investment guide', 'Singapore property tips', 'property buying guide', 'real estate strategies', 'property investment Singapore']
  },

  contact: {
    title: 'Contact Us - Singapore Property Hub',
    description: 'Get in touch with Singapore Property Hub for personalized property advice, investment consultations, and expert market insights. We\'re here to help you make informed decisions.',
    keywords: ['property consultation', 'Singapore property advice', 'property expert contact', 'real estate consultation']
  },

  privacy: {
    title: 'Privacy Policy - Singapore Property Hub',
    description: 'Read our privacy policy to understand how Singapore Property Hub collects, uses, and protects your personal information when using our services.',
    keywords: ['privacy policy', 'data protection', 'personal information']
  },

  terms: {
    title: 'Terms of Service - Singapore Property Hub',
    description: 'Terms of service and usage guidelines for Singapore Property Hub. Understanding our terms and conditions for using our property guides and services.',
    keywords: ['terms of service', 'terms and conditions', 'usage guidelines']
  }
}

// Generate metadata for static pages
export function generatePageMetadata(page: keyof typeof pageSEOConfigs, customConfig?: Partial<SEOConfig>): Metadata {
  const baseConfig = pageSEOConfigs[page]
  const seoConfig = generatePageSEO({ ...baseConfig, ...customConfig })
  return generateMetadata(seoConfig)
}

// URL utilities
export function getCanonicalUrl(path: string = ''): string {
  const baseUrl = 'https://singapore-property-hub.vercel.app'
  return path.startsWith('/') ? `${baseUrl}${path}` : `${baseUrl}/${path}`
}

export function getOGImageUrl(imagePath: string = '/images/og-default.jpg'): string {
  const baseUrl = 'https://singapore-property-hub.vercel.app'
  return imagePath.startsWith('/') ? `${baseUrl}${imagePath}` : `${baseUrl}/${imagePath}`
}

// SEO validation utilities
export function validateSEOConfig(config: SEOConfig): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!config.title || config.title.length < 10 || config.title.length > 60) {
    errors.push('Title should be between 10-60 characters')
  }

  if (!config.description || config.description.length < 120 || config.description.length > 160) {
    errors.push('Description should be between 120-160 characters')
  }

  if (config.keywords && config.keywords.length > 10) {
    errors.push('Keywords should not exceed 10 items')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

// Generate Open Graph tags for social sharing
export function generateOGTags(config: SEOConfig) {
  return {
    'og:title': config.title,
    'og:description': config.description,
    'og:type': config.ogType || 'website',
    'og:url': config.canonical,
    'og:image': config.ogImage ? getOGImageUrl(config.ogImage) : getOGImageUrl(),
    'og:image:alt': config.title,
    'og:site_name': 'Singapore Property Hub',
    'og:locale': 'en_SG'
  }
}

// Generate Twitter Card tags
export function generateTwitterTags(config: SEOConfig) {
  return {
    'twitter:card': 'summary_large_image',
    'twitter:title': config.title,
    'twitter:description': config.description,
    'twitter:image': config.ogImage ? getOGImageUrl(config.ogImage) : getOGImageUrl(),
    'twitter:image:alt': config.title
  }
}

// SEO checklist for content creators
export const seoChecklist = {
  title: [
    'Includes primary keyword',
    'Between 10-60 characters',
    'Compelling and clickable',
    'Unique across the site'
  ],
  description: [
    'Between 120-160 characters',
    'Includes primary and secondary keywords',
    'Clear call-to-action or value proposition',
    'Unique and compelling'
  ],
  content: [
    'H1 tag includes primary keyword',
    'H2-H6 tags structure content logically',
    'Images have descriptive alt text',
    'Internal links to related content',
    'External links to authoritative sources'
  ],
  technical: [
    'Canonical URL set correctly',
    'Schema markup implemented',
    'Open Graph tags present',
    'Page loads under 3 seconds',
    'Mobile-friendly design'
  ]
}

export default {
  generatePageMetadata,
  generateArticleSEO,
  generateDistrictSEO,
  generateCondoSEO,
  getCanonicalUrl,
  getOGImageUrl,
  validateSEOConfig,
  generateOGTags,
  generateTwitterTags,
  seoChecklist,
  pageSEOConfigs
}