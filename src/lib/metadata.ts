import { Metadata } from 'next'
import { SEOConfig, siteConfig } from './seo'

export function generateMetadata(config: SEOConfig): Metadata {
  const {
    title,
    description,
    canonical,
    ogImage,
    ogType,
    keywords
  } = config

  return {
    title,
    description,
    keywords: keywords?.join(', '),
    authors: [{ name: siteConfig.author }],
    publisher: siteConfig.name,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: canonical || siteConfig.url,
    },
    openGraph: {
      title,
      description,
      url: canonical || siteConfig.url,
      siteName: siteConfig.name,
      type: ogType as 'website' | 'article',
      images: ogImage ? [
        {
          url: `${siteConfig.url}${ogImage}`,
          width: 1200,
          height: 630,
          alt: title,
        }
      ] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImage ? [`${siteConfig.url}${ogImage}`] : [],
    },
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
    },
  }
}

export const defaultMetadata: Metadata = generateMetadata({
  title: 'Singapore Property Hub - Your Trusted Property Investment Guide',
  description: 'Expert insights, market analysis, and comprehensive guides for Singapore property investment. Discover condos, districts, and make informed property decisions.',
  ogImage: '/images/og-default.jpg',
  ogType: 'website',
})