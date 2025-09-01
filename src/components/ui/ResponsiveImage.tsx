'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface ResponsiveImageProps {
  src: string
  alt: string
  className?: string
  priority?: boolean
  quality?: number
  // Responsive configurations
  breakpoints?: {
    mobile: { width: number; height: number }
    tablet: { width: number; height: number }
    desktop: { width: number; height: number }
  }
  // Advanced options
  aspectRatio?: 'square' | '4:3' | '16:9' | '3:2' | 'auto'
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'
  loading?: 'lazy' | 'eager'
  placeholder?: 'blur' | 'empty'
  fallbackSrc?: string
  onLoad?: () => void
  onError?: () => void
}

interface ViewportSize {
  width: number
  height: number
  deviceType: 'mobile' | 'tablet' | 'desktop'
}

const DEFAULT_BREAKPOINTS = {
  mobile: { width: 400, height: 300 },
  tablet: { width: 600, height: 400 },
  desktop: { width: 1200, height: 630 }
}

const ASPECT_RATIOS = {
  'square': 1,
  '4:3': 4 / 3,
  '16:9': 16 / 9,
  '3:2': 3 / 2,
  'auto': 0
}

export default function ResponsiveImage({
  src,
  alt,
  className,
  priority = false,
  quality = 80,
  breakpoints = DEFAULT_BREAKPOINTS,
  aspectRatio = 'auto',
  objectFit = 'cover',
  loading = 'lazy',
  placeholder = 'blur',
  fallbackSrc,
  onLoad,
  onError,
  ...props
}: ResponsiveImageProps) {
  const [viewportSize, setViewportSize] = useState<ViewportSize>({
    width: 1200,
    height: 630,
    deviceType: 'desktop'
  })
  const [imageError, setImageError] = useState(false)
  const [currentSrc, setCurrentSrc] = useState(src)

  // Detect viewport size and device type
  useEffect(() => {
    const updateViewportSize = () => {
      const width = window.innerWidth
      const height = window.innerHeight

      let deviceType: 'mobile' | 'tablet' | 'desktop'
      if (width < 768) {
        deviceType = 'mobile'
      } else if (width < 1024) {
        deviceType = 'tablet'
      } else {
        deviceType = 'desktop'
      }

      setViewportSize({ width, height, deviceType })
    }

    // Initial call
    updateViewportSize()

    // Add event listener
    window.addEventListener('resize', updateViewportSize)
    
    // Cleanup
    return () => window.removeEventListener('resize', updateViewportSize)
  }, [])

  // Generate optimized image URL for current viewport
  const getOptimizedImageUrl = (originalSrc: string): string => {
    if (!originalSrc.includes('images.unsplash.com')) {
      return originalSrc
    }

    try {
      const url = new URL(originalSrc)
      const currentBreakpoint = breakpoints[viewportSize.deviceType]
      
      // Set dimensions based on current viewport
      url.searchParams.set('w', currentBreakpoint.width.toString())
      url.searchParams.set('h', currentBreakpoint.height.toString())
      
      // Optimize for device pixel ratio
      const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1
      if (dpr > 1) {
        url.searchParams.set('dpr', Math.min(dpr, 2).toString()) // Cap at 2x for performance
      }
      
      // Set format and quality
      url.searchParams.set('auto', 'format')
      url.searchParams.set('fit', 'crop')
      url.searchParams.set('q', quality.toString())
      
      // Add cache-busting parameter
      url.searchParams.set('cb', Date.now().toString())

      return url.toString()
    } catch {
      return originalSrc
    }
  }

  // Calculate responsive dimensions
  const getResponsiveDimensions = () => {
    const currentBreakpoint = breakpoints[viewportSize.deviceType]
    
    if (aspectRatio === 'auto') {
      return currentBreakpoint
    }

    const ratio = ASPECT_RATIOS[aspectRatio]
    const width = currentBreakpoint.width
    const height = Math.round(width / ratio)

    return { width, height }
  }

  const dimensions = getResponsiveDimensions()
  const optimizedSrc = getOptimizedImageUrl(currentSrc)

  // Generate responsive sizes string
  const responsiveSizes = `
    (max-width: 767px) ${breakpoints.mobile.width}px,
    (max-width: 1023px) ${breakpoints.tablet.width}px,
    ${breakpoints.desktop.width}px
  `.trim()

  // Handle image loading error
  const handleImageError = () => {
    if (!imageError && fallbackSrc) {
      setImageError(true)
      setCurrentSrc(fallbackSrc)
    }
    onError?.()
  }

  // Handle successful image load
  const handleImageLoad = () => {
    onLoad?.()
  }

  return (
    <div 
      className={cn(
        'relative overflow-hidden bg-gray-100',
        className
      )}
      style={{
        aspectRatio: aspectRatio !== 'auto' ? ASPECT_RATIOS[aspectRatio] : undefined
      }}
    >
      <Image
        src={optimizedSrc}
        alt={alt}
        width={dimensions.width}
        height={dimensions.height}
        className={cn(
          'transition-all duration-300 ease-in-out',
          objectFit === 'cover' && 'object-cover',
          objectFit === 'contain' && 'object-contain',
          objectFit === 'fill' && 'object-fill',
          objectFit === 'none' && 'object-none',
          objectFit === 'scale-down' && 'object-scale-down'
        )}
        priority={priority}
        loading={priority ? 'eager' : loading}
        placeholder={placeholder}
        sizes={responsiveSizes}
        quality={quality}
        onLoad={handleImageLoad}
        onError={handleImageError}
        {...props}
      />

      {/* Loading indicator for mobile devices */}
      {viewportSize.deviceType === 'mobile' && (
        <div className="absolute top-2 right-2 text-xs text-white bg-black bg-opacity-50 px-2 py-1 rounded">
          {viewportSize.width}×{viewportSize.height}
        </div>
      )}

      {/* Error indicator */}
      {imageError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
          <div className="text-center text-gray-500">
            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm">Image unavailable</p>
          </div>
        </div>
      )}
    </div>
  )
}

// Pre-configured responsive image components
export function HeroResponsiveImage(props: Omit<ResponsiveImageProps, 'breakpoints' | 'aspectRatio'>) {
  return (
    <ResponsiveImage
      breakpoints={{
        mobile: { width: 400, height: 300 },
        tablet: { width: 800, height: 450 },
        desktop: { width: 1200, height: 600 }
      }}
      aspectRatio="16:9"
      priority={true}
      quality={90}
      {...props}
    />
  )
}

export function CardResponsiveImage(props: Omit<ResponsiveImageProps, 'breakpoints' | 'aspectRatio'>) {
  return (
    <ResponsiveImage
      breakpoints={{
        mobile: { width: 300, height: 200 },
        tablet: { width: 400, height: 250 },
        desktop: { width: 500, height: 300 }
      }}
      aspectRatio="4:3"
      priority={false}
      quality={75}
      {...props}
    />
  )
}

export function ThumbnailResponsiveImage(props: Omit<ResponsiveImageProps, 'breakpoints' | 'aspectRatio'>) {
  return (
    <ResponsiveImage
      breakpoints={{
        mobile: { width: 100, height: 100 },
        tablet: { width: 150, height: 150 },
        desktop: { width: 200, height: 200 }
      }}
      aspectRatio="square"
      priority={false}
      quality={70}
      {...props}
    />
  )
}