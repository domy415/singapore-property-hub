'use client'

import Image from 'next/image'
import { useState } from 'react'
import { ArticleImageService, type ArticleImageData } from '@/services/ArticleImageService'
import { cn } from '@/lib/utils'

interface UnifiedArticleImageProps {
  src: string | null | undefined
  alt?: string
  title?: string
  category?: string
  slug?: string
  className?: string
  width?: number
  height?: number
  priority?: boolean
  sizes?: string
  fill?: boolean
  quality?: number
  variant?: 'thumbnail' | 'card' | 'hero' | 'full'
}

/**
 * UnifiedArticleImage - Single Image Component for All Article Images
 * 
 * This replaces all the complex image components and handles Singapore-specific
 * images correctly without cache-busting interference.
 */
export default function UnifiedArticleImage({
  src,
  alt,
  title,
  category,
  slug,
  className,
  width = 1200,
  height = 630,
  priority = false,
  sizes,
  fill = false,
  quality = 80,
  variant = 'card',
  ...props
}: UnifiedArticleImageProps) {
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)

  // Get the correct image using our unified service
  const imageData: ArticleImageData = ArticleImageService.getArticleImage(
    src,
    title,
    category,
    slug
  )

  // Get optimized URL based on variant
  let optimizedUrl: string
  switch (variant) {
    case 'thumbnail':
      optimizedUrl = ArticleImageService.getThumbnailUrl(imageData.url)
      break
    case 'hero':
      optimizedUrl = ArticleImageService.getHeroImageUrl(imageData.url)
      break
    case 'card':
    case 'full':
    default:
      optimizedUrl = ArticleImageService.getOptimizedImageUrl(imageData.url, width, height, quality)
      break
  }

  // Default sizes for responsive images
  const defaultSizes = sizes || 
    variant === 'thumbnail' ? '400px' :
    variant === 'hero' ? '100vw' :
    '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'

  const handleImageError = () => {
    console.warn(`Image failed to load: ${optimizedUrl}`)
    setImageError(true)
    setImageLoading(false)
  }

  const handleImageLoad = () => {
    setImageLoading(false)
    setImageError(false)
  }

  // If image failed to load, show a simple placeholder
  if (imageError) {
    return (
      <div 
        className={cn(
          'bg-gray-200 flex items-center justify-center text-gray-500 text-sm',
          fill ? 'w-full h-full' : '',
          className
        )}
        style={!fill ? { width, height } : undefined}
      >
        <div className="text-center">
          <svg className="w-8 h-8 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>Image not available</span>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('relative overflow-hidden', fill ? 'w-full h-full' : '', className)}>
      <Image
        src={optimizedUrl}
        alt={imageData.alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        priority={priority}
        sizes={defaultSizes}
        quality={quality}
        className={cn(
          'transition-opacity duration-300',
          imageLoading ? 'opacity-0' : 'opacity-100',
          fill ? 'object-cover' : ''
        )}
        onLoad={handleImageLoad}
        onError={handleImageError}
        {...props}
      />

      {/* Loading state */}
      {imageLoading && (
        <div className={cn(
          'absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center',
          fill ? 'w-full h-full' : ''
        )}>
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Development info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-2 left-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
          {variant} • {imageData.isOptimized ? 'Optimized' : 'Raw'}
        </div>
      )}
    </div>
  )
}

// Specific variants for easy use
export function ArticleThumbnail({ className, ...props }: UnifiedArticleImageProps) {
  return (
    <UnifiedArticleImage
      variant="thumbnail"
      width={400}
      height={300}
      className={cn('rounded-lg', className)}
      {...props}
    />
  )
}

export function ArticleCard({ className, ...props }: UnifiedArticleImageProps) {
  return (
    <UnifiedArticleImage
      variant="card"
      width={800}
      height={600}
      className={cn('w-full aspect-[4/3] rounded-lg', className)}
      {...props}
    />
  )
}

export function ArticleHero({ className, ...props }: UnifiedArticleImageProps) {
  return (
    <UnifiedArticleImage
      variant="hero"
      width={1920}
      height={1080}
      priority={true}
      className={cn('w-full aspect-[16/9]', className)}
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
  className,
  ...props 
}: UnifiedArticleImageProps & { articleTitle?: string }) {
  return (
    <UnifiedArticleImage
      src={src}
      alt={alt}
      title={articleTitle || title}
      category={category}
      variant="card"
      className={className}
      {...props}
    />
  )
}