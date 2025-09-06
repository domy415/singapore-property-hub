'use client'

import OptimizedImage from './OptimizedImage'
import { ImageValidationService } from '@/services/image-validation'
import { ArticleCategory } from '@prisma/client'

type ImageSize = 'thumbnail' | 'medium' | 'large' | 'hero' | 'social'
type ImageFormat = 'webp' | 'jpeg' | 'avif'

interface SEOOptimizedImageProps {
  src: string
  alt: string
  title: string
  width: number
  height: number
  className?: string
  priority?: boolean
  // SEO enhancements
  articleTitle?: string
  category?: ArticleCategory
  author?: string
  publishedAt?: Date
  // Schema.org structured data
  includeStructuredData?: boolean
  // Accessibility enhancements
  longDescription?: string
  // Performance
  fetchPriority?: 'high' | 'low' | 'auto'
  // Additional image properties
  imageSize?: ImageSize
  preferredFormat?: ImageFormat
  compressionLevel?: 'low' | 'medium' | 'high'
  preload?: boolean
  unoptimized?: boolean
}

interface ImageStructuredData {
  '@context': string
  '@type': string
  contentUrl: string
  description: string
  name: string
  author?: {
    '@type': string
    name: string
  }
  datePublished?: string
  isPartOf?: {
    '@type': string
    name: string
    url: string
  }
}

export default function SEOOptimizedImage({
  src,
  alt,
  title,
  width,
  height,
  className,
  priority = false,
  articleTitle,
  category,
  author,
  publishedAt,
  includeStructuredData = true,
  longDescription,
  fetchPriority = 'auto',
  ...props
}: SEOOptimizedImageProps) {
  // Generate enhanced alt text
  const enhancedAlt = articleTitle && category 
    ? ImageValidationService.generateImprovedAltText(alt, articleTitle, category)
    : alt

  // Generate structured data for the image
  const generateStructuredData = (): ImageStructuredData => {
    const structuredData: ImageStructuredData = {
      '@context': 'https://schema.org',
      '@type': 'ImageObject',
      contentUrl: src,
      description: longDescription || enhancedAlt,
      name: title || enhancedAlt
    }

    if (author) {
      structuredData.author = {
        '@type': 'Person',
        name: author
      }
    }

    if (publishedAt) {
      structuredData.datePublished = publishedAt.toISOString()
    }

    if (articleTitle) {
      structuredData.isPartOf = {
        '@type': 'Article',
        name: articleTitle,
        url: typeof window !== 'undefined' ? window.location.href : ''
      }
    }

    return structuredData
  }

  return (
    <figure className="relative" role="img" aria-labelledby="image-title" aria-describedby="image-description">
      {/* Structured Data */}
      {includeStructuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateStructuredData())
          }}
        />
      )}

      {/* The optimized image */}
      <OptimizedImage
        src={src}
        alt={enhancedAlt}
        width={width}
        height={height}
        className={className}
        priority={priority}
        imageSize={width >= 1200 ? 'large' : width >= 800 ? 'medium' : 'thumbnail'}
        preferredFormat="webp"
        compressionLevel="medium"
        preload={priority}
        {...props}
      />

      {/* Hidden elements for screen readers */}
      <span id="image-title" className="sr-only">{title}</span>
      {longDescription && (
        <span id="image-description" className="sr-only">{longDescription}</span>
      )}

      {/* Caption if title is different from alt */}
      {title && title !== enhancedAlt && (
        <figcaption className="text-sm text-gray-600 mt-2 text-center italic">
          {title}
        </figcaption>
      )}
    </figure>
  )
}

// Specialized components for different use cases
export function ArticleHeroImage({
  src,
  alt,
  title,
  articleTitle,
  category,
  author,
  publishedAt,
  className = 'w-full h-96 object-cover',
  ...props
}: Omit<SEOOptimizedImageProps, 'width' | 'height'>) {
  return (
    <SEOOptimizedImage
      src={src}
      alt={alt}
      title={title || articleTitle || alt}
      width={1920}
      height={1080}
      className={className}
      priority={true}
      articleTitle={articleTitle}
      category={category}
      author={author}
      publishedAt={publishedAt}
      fetchPriority="high"
      imageSize="hero"
      preferredFormat="webp"
      compressionLevel="high"
      preload={true}
      {...props}
    />
  )
}

export function ArticleCardImage({
  src,
  alt,
  title,
  articleTitle,
  category,
  className = 'w-full h-48 object-cover',
  ...props
}: Omit<SEOOptimizedImageProps, 'width' | 'height'>) {
  return (
    <SEOOptimizedImage
      src={src}
      alt={alt}
      title={title || articleTitle || alt}
      width={400}
      height={300}
      className={className}
      priority={false}
      articleTitle={articleTitle}
      category={category}
      fetchPriority="low"
      includeStructuredData={false} // Don't include structured data for card images
      imageSize="thumbnail"
      preferredFormat="webp"
      compressionLevel="medium"
      {...props}
    />
  )
}

export function PropertyImage({
  src,
  alt,
  propertyName,
  location,
  className = 'w-full h-64 object-cover',
  ...props
}: {
  src: string
  alt: string
  propertyName?: string
  location?: string
  className?: string
}) {
  const enhancedAlt = propertyName && location
    ? `${propertyName} in ${location} - Singapore property`
    : alt

  return (
    <SEOOptimizedImage
      src={src}
      alt={enhancedAlt}
      title={propertyName || alt}
      width={800}
      height={600}
      className={className}
      longDescription={`Property image showing ${propertyName || 'residential development'} located in ${location || 'Singapore'}`}
      imageSize="medium"
      preferredFormat="webp"
      compressionLevel="medium"
      {...props}
    />
  )
}