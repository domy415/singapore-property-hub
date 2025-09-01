'use client'

import Image from 'next/image'
import { useState, useCallback } from 'react'
import { cn } from '@/lib/utils'

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
}

// Default fallback images for different categories
const DEFAULT_FALLBACKS = {
  singapore: 'https://images.unsplash.com/photo-1519897831810-a9a01aceccd1?w=1200&h=630&fit=crop&q=80',
  property: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&h=630&fit=crop&q=80',
  condo: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&h=630&fit=crop&q=80',
  hdb: 'https://images.unsplash.com/photo-1566275538930-52cf19ffd74a?w=1200&h=630&fit=crop&q=80'
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

// Enhanced image URL validation and optimization
function optimizeImageUrl(src: string): string {
  if (!src) return DEFAULT_FALLBACKS.singapore
  
  // If it's already an Unsplash URL, ensure proper parameters
  if (src.includes('images.unsplash.com')) {
    const url = new URL(src)
    // Ensure proper crop and quality parameters
    if (!url.searchParams.has('fit')) url.searchParams.set('fit', 'crop')
    if (!url.searchParams.has('q')) url.searchParams.set('q', '80')
    // Add cache-busting parameter to force refresh
    url.searchParams.set('cb', Date.now().toString())
    return url.toString()
  }
  
  return src
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
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  fill = false,
  quality = 85,
  fallbackSrc,
  retryAttempts = 2,
  onError,
  showLoadingState = true,
  ...props
}: OptimizedImageProps) {
  const [imageLoading, setImageLoading] = useState(true)
  const [imageError, setImageError] = useState(false)
  const [currentSrc, setCurrentSrc] = useState(() => optimizeImageUrl(src))
  const [attempts, setAttempts] = useState(0)

  // Use provided blur data URL or generate one
  const effectiveBlurDataURL = blurDataURL || generateBlurDataURL(40, 40)
  
  const handleImageError = useCallback(() => {
    if (attempts < retryAttempts) {
      // Try fallback or smart fallback
      const fallback = getSmartFallback(alt, fallbackSrc)
      setCurrentSrc(fallback)
      setAttempts(prev => prev + 1)
    } else {
      setImageError(true)
      setImageLoading(false)
      onError?.()
    }
  }, [attempts, retryAttempts, alt, fallbackSrc, onError])
  
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
          width={fill ? undefined : width}
          height={fill ? undefined : height}
          fill={fill}
          priority={priority}
          loading={priority ? 'eager' : loading}
          placeholder={placeholder}
          blurDataURL={effectiveBlurDataURL}
          sizes={sizes}
          quality={quality}
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
      
      {/* Retry indicator for fallback attempts */}
      {attempts > 0 && attempts < retryAttempts && !imageError && (
        <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
          Retry {attempts}/{retryAttempts}
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
      quality={90}
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
      quality={80}
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
      quality={75}
      {...props}
    />
  )
}