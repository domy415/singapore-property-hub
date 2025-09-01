// Comprehensive image optimization service for Singapore Property Hub
import { ImageValidationService } from './image-validation'

type ImageFormat = 'webp' | 'avif' | 'jpeg' | 'png'
type ImageSize = 'thumbnail' | 'medium' | 'large' | 'hero' | 'social'
type CompressionLevel = 'low' | 'medium' | 'high'

export interface OptimizedImageConfig {
  src: string
  width: number
  height: number
  format: ImageFormat
  quality: number
  sizes: string
  alt: string
  priority: boolean
}

export interface ImageOptimizationOptions {
  size: ImageSize
  format?: ImageFormat
  compression?: CompressionLevel
  responsive?: boolean
  webpFallback?: boolean
  priority?: boolean
}

export class ImageOptimizationService {
  private static readonly SIZE_CONFIGS = {
    thumbnail: { width: 400, height: 300, quality: 75, sizes: '(max-width: 640px) 100vw, 400px' },
    medium: { width: 800, height: 600, quality: 80, sizes: '(max-width: 768px) 100vw, 800px' },
    large: { width: 1200, height: 800, quality: 85, sizes: '(max-width: 768px) 100vw, 1200px' },
    hero: { width: 1920, height: 1080, quality: 90, sizes: '100vw' },
    social: { width: 1200, height: 630, quality: 85, sizes: '1200px' }
  }

  private static readonly COMPRESSION_QUALITY = {
    low: 60,
    medium: 80,
    high: 95
  }

  private static readonly FORMAT_PRIORITIES: ImageFormat[] = ['avif', 'webp', 'jpeg', 'png']

  /**
   * Generate optimized image configuration
   */
  static generateConfig(
    src: string,
    alt: string,
    options: ImageOptimizationOptions
  ): OptimizedImageConfig {
    const sizeConfig = this.SIZE_CONFIGS[options.size]
    const quality = options.compression 
      ? this.COMPRESSION_QUALITY[options.compression] 
      : sizeConfig.quality

    return {
      src: this.optimizeUrl(src, options.size, quality, options.format),
      width: sizeConfig.width,
      height: sizeConfig.height,
      format: options.format || 'webp',
      quality,
      sizes: sizeConfig.sizes,
      alt,
      priority: options.priority || false
    }
  }

  /**
   * Optimize Unsplash URL with proper parameters
   */
  private static optimizeUrl(
    src: string,
    size: ImageSize,
    quality: number,
    format?: ImageFormat
  ): string {
    if (!src || !src.includes('images.unsplash.com')) {
      return src
    }

    try {
      const url = new URL(src)
      const config = this.SIZE_CONFIGS[size]
      
      // Set dimensions and quality
      url.searchParams.set('w', config.width.toString())
      url.searchParams.set('h', config.height.toString())
      url.searchParams.set('fit', 'crop')
      url.searchParams.set('q', quality.toString())
      
      // Set format if specified
      if (format && format !== 'jpeg') {
        url.searchParams.set('fm', format)
      }
      
      // Add cache-busting parameter
      url.searchParams.set('cb', Date.now().toString())
      
      return url.toString()
    } catch (error) {
      console.error('Error optimizing image URL:', error)
      return src
    }
  }

  /**
   * Generate multiple format sources for progressive enhancement
   */
  static generateSourceSet(
    src: string,
    size: ImageSize,
    quality?: number
  ): Record<ImageFormat, string> {
    const config = this.SIZE_CONFIGS[size]
    const effectiveQuality = quality || config.quality

    const sources: Record<string, string> = {}
    
    this.FORMAT_PRIORITIES.forEach(format => {
      sources[format] = this.optimizeUrl(src, size, effectiveQuality, format)
    })

    return sources as Record<ImageFormat, string>
  }

  /**
   * Generate responsive sizes attribute
   */
  static generateSizes(size: ImageSize, customSizes?: string): string {
    if (customSizes) return customSizes
    return this.SIZE_CONFIGS[size].sizes
  }

  /**
   * Validate and enhance alt text for SEO
   */
  static enhanceAltText(
    alt: string,
    context?: {
      articleTitle?: string
      category?: string
      location?: string
      propertyType?: string
    }
  ): string {
    let enhancedAlt = alt

    if (context) {
      // Add Singapore context if missing
      if (!enhancedAlt.toLowerCase().includes('singapore')) {
        enhancedAlt += ' - Singapore'
      }

      // Add property context
      if (context.propertyType && !enhancedAlt.toLowerCase().includes(context.propertyType)) {
        enhancedAlt = `${context.propertyType} ${enhancedAlt}`
      }

      // Add location context
      if (context.location && !enhancedAlt.toLowerCase().includes(context.location)) {
        enhancedAlt = enhancedAlt.replace(' - Singapore', ` in ${context.location}, Singapore`)
      }
    }

    return enhancedAlt
  }

  /**
   * Calculate image performance score
   */
  static calculatePerformanceScore(config: OptimizedImageConfig): number {
    let score = 100

    // Format scoring (lower is better for performance)
    if (config.format === 'avif') score += 20
    else if (config.format === 'webp') score += 10
    else if (config.format === 'jpeg') score += 5
    else score -= 10 // PNG penalty

    // Quality scoring
    if (config.quality > 90) score -= 20
    else if (config.quality > 80) score -= 10
    else if (config.quality < 60) score -= 15

    // Size scoring
    const pixels = config.width * config.height
    if (pixels > 2073600) score -= 30 // 1920x1080
    else if (pixels > 921600) score -= 15 // 1200x768
    else score += 10

    // Priority scoring
    if (config.priority) score += 10

    return Math.max(0, Math.min(100, score))
  }

  /**
   * Generate blur placeholder data URL
   */
  static generateBlurPlaceholder(width: number = 40, height: number = 40): string {
    // Simple SVG blur placeholder
    const svg = `
      <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="${width}" height="${height}" fill="url(#blur)"/>
        <defs>
          <linearGradient id="blur" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" style="stop-color:#f8fafc"/>
            <stop offset="50%" style="stop-color:#f1f5f9"/>
            <stop offset="100%" style="stop-color:#e2e8f0"/>
          </linearGradient>
        </defs>
      </svg>
    `
    
    return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`
  }

  /**
   * Preload critical images
   */
  static preloadCriticalImages(images: Array<{ src: string; format: ImageFormat }>): void {
    if (typeof window === 'undefined') return

    images.forEach(({ src, format }) => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.href = src
      link.type = `image/${format}`
      link.fetchPriority = 'high'
      document.head.appendChild(link)
    })
  }

  /**
   * Test image loading and format support
   */
  static async testFormatSupport(): Promise<Record<ImageFormat, boolean>> {
    const formats: ImageFormat[] = ['avif', 'webp', 'jpeg', 'png']
    const support: Record<string, boolean> = {}

    await Promise.all(formats.map(async (format) => {
      try {
        const testImage = new Image()
        const testPromise = new Promise<boolean>((resolve) => {
          testImage.onload = () => resolve(true)
          testImage.onerror = () => resolve(false)
          setTimeout(() => resolve(false), 1000) // Timeout after 1s
        })

        // Test with a small data URL for each format
        const testUrls = {
          avif: 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A=',
          webp: 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA',
          jpeg: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==',
          png: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAFklEQVQIHWPY//8/AzYwirkTmwBcBQAAfgIBBVbGpQAAAABJRU5ErkJggg=='
        }

        testImage.src = testUrls[format]
        support[format] = await testPromise
      } catch {
        support[format] = false
      }
    }))

    return support as Record<ImageFormat, boolean>
  }
}

// Export commonly used configurations
export const COMMON_IMAGE_CONFIGS = {
  heroArticle: (src: string, alt: string): OptimizedImageConfig => 
    ImageOptimizationService.generateConfig(src, alt, {
      size: 'hero',
      format: 'webp',
      compression: 'high',
      priority: true
    }),

  articleCard: (src: string, alt: string): OptimizedImageConfig =>
    ImageOptimizationService.generateConfig(src, alt, {
      size: 'thumbnail',
      format: 'webp',
      compression: 'medium',
      priority: false
    }),

  propertyGallery: (src: string, alt: string): OptimizedImageConfig =>
    ImageOptimizationService.generateConfig(src, alt, {
      size: 'large',
      format: 'webp',
      compression: 'medium',
      priority: false
    }),

  socialShare: (src: string, alt: string): OptimizedImageConfig =>
    ImageOptimizationService.generateConfig(src, alt, {
      size: 'social',
      format: 'webp',
      compression: 'high',
      priority: false
    })
}