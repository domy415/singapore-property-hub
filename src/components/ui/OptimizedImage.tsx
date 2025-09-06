'use client'

import Image from 'next/image'
import { useState, useCallback } from 'react'
import { cn } from '@/lib/utils'

type ImageSize = 'thumbnail' | 'medium' | 'large' | 'hero' | 'social'
type ImageFormat = 'webp' | 'jpeg' | 'avif'

interface OptimizedImageProps {
  src: string
  alt: string
  width: number
  height: number
  className?: string
  priority?: boolean
  loading?: 'lazy' | 'eager'
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
  sizes?: string
  fill?: boolean
  quality?: number
  fallbackSrc?: string
  retryAttempts?: number
  onError?: () => void
  showLoadingState?: boolean
  imageSize?: ImageSize
  preferredFormat?: ImageFormat
  preload?: boolean
  compressionLevel?: 'low' | 'medium' | 'high'
  unoptimized?: boolean
}

// Responsive image size configurations
const IMAGE_SIZE_CONFIG: Record<ImageSize, { width: number; height: number; quality: number; sizes: string }> = {
  thumbnail: {
    width: 400,
    height: 300,
    quality: 75,
    sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px'
  },
  medium: {
    width: 800,
    height: 600,
    quality: 80,
    sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 800px'
  },
  large: {
    width: 1200,
    height: 800,
    quality: 85,
    sizes: '(max-width: 768px) 100vw, 1200px'
  },
  hero: {
    width: 1920,
    height: 1080,
    quality: 90,
    sizes: '100vw'
  },
  social: {
    width: 1200,
    height: 630,
    quality: 85,
    sizes: '1200px'
  }
}

// Quality settings for different compression levels
const COMPRESSION_QUALITY: Record<string, number> = {
  low: 60,
  medium: 80,
  high: 95
}

// Default fallback images for different categories - now using local reliable images
const DEFAULT_FALLBACKS = {
  singapore: '/images/singapore-default-skyline.jpg',
  property: '/images/singapore-default-home.jpg',
  condo: '/images/singapore-default-condo.jpg',
  hdb: '/images/singapore-default-hdb.jpg',
  finance: '/images/singapore-default-finance.jpg'
}

// Generate a simple blur placeholder
function generateBlurDataURL(width: number, height: number): string {
  const canvas = typeof window !== 'undefined' ? document.createElement('canvas') : null
  if (!canvas) {
    // Server-side fallback - simple gray blur data URL
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjZjNmNGY2Ii8+Cjwvc3ZnPgo='
  }
  
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) return ''
  
  // Create a subtle gradient blur
  const gradient = ctx.createLinearGradient(0, 0, width, height)
  gradient.addColorStop(0, '#f8fafc')
  gradient.addColorStop(0.5, '#f1f5f9')
  gradient.addColorStop(1, '#e2e8f0')
  
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)
  
  return canvas.toDataURL('image/jpeg', 0.1)
}

// Enhanced image URL optimization with multiple formats and sizes
function optimizeImageUrl(
  src: string, 
  imageSize: ImageSize = 'medium', 
  quality?: number,
  format?: ImageFormat
): string {
  if (!src) return DEFAULT_FALLBACKS.singapore
  
  // If it's already an Unsplash URL, ensure proper parameters
  if (src.includes('images.unsplash.com')) {
    const url = new URL(src)
    const config = IMAGE_SIZE_CONFIG[imageSize]
    
    // Set dimensions and quality based on image size
    url.searchParams.set('w', config.width.toString())
    url.searchParams.set('h', config.height.toString())
    url.searchParams.set('fit', 'crop')
    url.searchParams.set('q', (quality || config.quality).toString())
    
    // Format optimization for better compression
    if (format === 'webp') {
      url.searchParams.set('fm', 'webp')
    } else if (format === 'avif') {
      url.searchParams.set('fm', 'avif')
    }
    
    // Preserve Singapore Property Image Finder Agent URLs without cache-busting interference
    return url.toString()
  }
  
  return src
}

// Generate optimized image sources for different formats
function generateImageSources(
  src: string, 
  imageSize: ImageSize = 'medium', 
  quality?: number
): { webp: string; avif: string; jpeg: string } {
  return {
    webp: optimizeImageUrl(src, imageSize, quality, 'webp'),
    avif: optimizeImageUrl(src, imageSize, quality, 'avif'),
    jpeg: optimizeImageUrl(src, imageSize, quality, 'jpeg')
  }
}

// Preload critical images with proper fetchpriority
function preloadImage(src: string, priority: boolean = false): void {
  if (typeof window !== 'undefined' && priority) {
    // Check if already preloaded to avoid duplicates
    const existing = document.querySelector(`link[href="${src}"]`)
    if (existing) return
    
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = src
    link.fetchPriority = 'high' // Fixes the preload warning
    link.type = 'image/webp'
    
    // Add event listener to track usage
    link.onload = () => {
      console.debug(`Preloaded image: ${src}`)
    }
    
    document.head.appendChild(link)
  }
}

// Smart fallback selection based on alt text
function getSmartFallback(alt: string, fallbackSrc?: string): string {
  if (fallbackSrc) return fallbackSrc
  
  const altLower = alt.toLowerCase()
  if (altLower.includes('hdb')) return DEFAULT_FALLBACKS.hdb
  if (altLower.includes('condo') || altLower.includes('condominium')) return DEFAULT_FALLBACKS.condo
  if (altLower.includes('property') || altLower.includes('real estate')) return DEFAULT_FALLBACKS.property
  
  return DEFAULT_FALLBACKS.singapore
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  loading = 'lazy',
  placeholder = 'blur',
  blurDataURL,
  sizes,
  fill = false,
  quality,
  fallbackSrc,
  retryAttempts = 2,
  onError,
  showLoadingState = true,
  imageSize = 'medium',
  preferredFormat = 'webp',
  preload = false,
  compressionLevel = 'medium',
  unoptimized = false,
  ...props
}: OptimizedImageProps) {
  const [imageLoading, setImageLoading] = useState(true)
  const [imageError, setImageError] = useState(false)
  const [currentFormat, setCurrentFormat] = useState<ImageFormat>(preferredFormat)
  const [attempts, setAttempts] = useState(0)

  // Get image configuration based on size
  const config = IMAGE_SIZE_CONFIG[imageSize]
  const effectiveQuality = quality || COMPRESSION_QUALITY[compressionLevel] || config.quality
  const effectiveSizes = sizes || config.sizes
  const effectiveWidth = width || config.width
  const effectiveHeight = height || config.height

  // Generate optimized image sources
  const imageSources = generateImageSources(src, imageSize, effectiveQuality)
  const [currentSrc, setCurrentSrc] = useState(() => {
    const sourceKey = currentFormat as keyof typeof imageSources
    return imageSources[sourceKey] || optimizeImageUrl(src, imageSize, effectiveQuality)
  })

  // Preload critical images
  if (preload || priority) {
    preloadImage(currentSrc, true)
  }

  // Use provided blur data URL or generate one
  const effectiveBlurDataURL = blurDataURL || generateBlurDataURL(40, 40)
  
  const handleImageError = useCallback(() => {
    if (attempts < retryAttempts) {
      // First try different format (WebP -> JPEG -> AVIF)
      if (currentFormat === 'webp') {
        setCurrentFormat('jpeg')
        setCurrentSrc(imageSources.jpeg)
      } else if (currentFormat === 'jpeg') {
        setCurrentFormat('avif')
        setCurrentSrc(imageSources.avif)
      } else {
        // Try fallback or smart fallback
        const fallback = getSmartFallback(alt, fallbackSrc)
        setCurrentSrc(optimizeImageUrl(fallback, imageSize, effectiveQuality))
      }
      setAttempts(prev => prev + 1)
    } else {
      setImageError(true)
      setImageLoading(false)
      onError?.()
    }
  }, [attempts, retryAttempts, alt, fallbackSrc, onError, currentFormat, imageSources, imageSize, effectiveQuality])
  
  const handleImageLoad = useCallback(() => {
    setImageLoading(false)
    setImageError(false)
  }, [])

  return (
    <div 
      className={cn(
        'relative overflow-hidden',
        fill ? 'w-full h-full' : '',
        className
      )}
      style={!fill ? { width, height } : undefined}
    >
      {imageError ? (
        // Error fallback
        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      ) : (
        <Image
          src={currentSrc}
          alt={alt}
          width={fill ? undefined : effectiveWidth}
          height={fill ? undefined : effectiveHeight}
          fill={fill}
          priority={priority}
          loading={priority ? 'eager' : loading}
          placeholder={placeholder}
          blurDataURL={effectiveBlurDataURL}
          sizes={effectiveSizes}
          quality={effectiveQuality}
          unoptimized={unoptimized}
          className={cn(
            'transition-all duration-300 ease-in-out',
            imageLoading && showLoadingState ? 'blur-sm scale-105' : 'blur-0 scale-100',
            fill ? 'object-cover' : ''
          )}
          onLoad={handleImageLoad}
          onError={handleImageError}
          {...props}
        />
      )}

      {/* Loading overlay */}
      {imageLoading && !imageError && showLoadingState && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      )}
      
      {/* Format and retry indicator */}
      {attempts > 0 && attempts < retryAttempts && !imageError && (
        <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
          {currentFormat.toUpperCase()} {attempts}/{retryAttempts}
        </div>
      )}
      
      {/* Performance indicator for development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute bottom-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded opacity-75">
          {imageSize} • {currentFormat} • Q{effectiveQuality}
        </div>
      )}
    </div>
  )
}

// Hero Image component for above-the-fold images
export function HeroImage({
  src,
  alt,
  className,
  ...props
}: Omit<OptimizedImageProps, 'priority' | 'loading' | 'placeholder'>) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      className={className}
      priority={true}
      loading="eager"
      placeholder="blur"
      imageSize="hero"
      preferredFormat="webp"
      preload={true}
      compressionLevel="high"
      {...props}
    />
  )
}

// Gallery Image component with intersection observer for lazy loading
export function GalleryImage({
  src,
  alt,
  className,
  ...props
}: OptimizedImageProps) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      className={className}
      priority={false}
      loading="lazy"
      placeholder="blur"
      imageSize="large"
      preferredFormat="webp"
      compressionLevel="medium"
      {...props}
    />
  )
}

// Card Image component for property cards
export function CardImage({
  src,
  alt,
  className,
  ...props
}: OptimizedImageProps) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      className={cn('rounded-lg', className)}
      priority={false}
      loading="lazy"
      placeholder="blur"
      imageSize="medium"
      preferredFormat="webp"
      compressionLevel="medium"
      {...props}
    />
  )
}

// Thumbnail Image component for small previews
export function ThumbnailImage({
  src,
  alt,
  className,
  ...props
}: OptimizedImageProps) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      className={className}
      priority={false}
      loading="lazy"
      placeholder="blur"
      imageSize="thumbnail"
      preferredFormat="webp"
      compressionLevel="low"
      {...props}
    />
  )
}

// Social Media Image component with specific dimensions
export function SocialImage({
  src,
  alt,
  className,
  ...props
}: OptimizedImageProps) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      className={className}
      priority={false}
      loading="lazy"
      placeholder="blur"
      imageSize="social"
      preferredFormat="webp"
      compressionLevel="high"
      {...props}
    />
  )
}