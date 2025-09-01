import { ImageSelector } from './image-selector'
import { ArticleCategory } from '@prisma/client'

export interface ImageValidationResult {
  isValid: boolean
  originalUrl: string
  fixedUrl?: string
  category?: string
  confidence: number
  reason?: string
}

export class ImageValidationService {
  private static readonly TIMEOUT = 10000 // 10 seconds
  private static readonly USER_AGENT = 'Mozilla/5.0 (compatible; Singapore Property Hub Image Validator/1.0)'
  
  /**
   * Validate if an image URL is accessible and working
   */
  static async validateImageUrl(url: string): Promise<ImageValidationResult> {
    if (!url) {
      return {
        isValid: false,
        originalUrl: url,
        confidence: 0,
        reason: 'Empty URL'
      }
    }

    try {
      // Basic URL validation
      new URL(url)
      
      // For server-side validation, we'll use a more conservative approach
      if (typeof window === 'undefined') {
        // Server-side: basic Unsplash URL format validation
        if (url.includes('images.unsplash.com')) {
          const hasRequiredParams = url.includes('w=') && url.includes('h=')
          return {
            isValid: hasRequiredParams,
            originalUrl: url,
            fixedUrl: hasRequiredParams ? url : this.fixUnsplashUrl(url),
            confidence: hasRequiredParams ? 0.9 : 0.7,
            reason: hasRequiredParams ? 'Valid Unsplash URL' : 'Fixed Unsplash URL parameters'
          }
        }
        
        return {
          isValid: true,
          originalUrl: url,
          confidence: 0.8,
          reason: 'URL format appears valid'
        }
      }

      // Client-side: actual HTTP check
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), this.TIMEOUT)

      try {
        const response = await fetch(url, {
          method: 'HEAD',
          signal: controller.signal,
          headers: {
            'User-Agent': this.USER_AGENT
          }
        })

        clearTimeout(timeoutId)

        if (response.ok && response.headers.get('content-type')?.startsWith('image/')) {
          return {
            isValid: true,
            originalUrl: url,
            confidence: 0.95,
            reason: 'Image accessible and valid'
          }
        } else {
          return {
            isValid: false,
            originalUrl: url,
            confidence: 0.3,
            reason: `HTTP ${response.status} - ${response.statusText}`
          }
        }
      } catch (fetchError) {
        clearTimeout(timeoutId)
        throw fetchError
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      
      return {
        isValid: false,
        originalUrl: url,
        confidence: 0.1,
        reason: `Validation failed: ${errorMessage}`
      }
    }
  }

  /**
   * Fix common issues with Unsplash URLs
   */
  private static fixUnsplashUrl(url: string): string {
    if (!url.includes('images.unsplash.com')) return url

    try {
      const urlObj = new URL(url)
      
      // Ensure required parameters
      if (!urlObj.searchParams.has('w')) urlObj.searchParams.set('w', '1200')
      if (!urlObj.searchParams.has('h')) urlObj.searchParams.set('h', '630')
      if (!urlObj.searchParams.has('fit')) urlObj.searchParams.set('fit', 'crop')
      if (!urlObj.searchParams.has('q')) urlObj.searchParams.set('q', '80')
      
      // Add cache-busting parameter
      urlObj.searchParams.set('cb', Date.now().toString())

      return urlObj.toString()
    } catch {
      return url
    }
  }

  /**
   * Get a smart replacement image based on content analysis
   */
  static async getSmartReplacement(
    originalUrl: string, 
    articleTitle: string, 
    category: ArticleCategory
  ): Promise<string> {
    try {
      // First try to get topic-based image
      const topicImage = await ImageSelector.getTopicBasedImage(articleTitle, category)
      
      // Validate the suggested image
      const validation = await this.validateImageUrl(topicImage)
      
      if (validation.isValid && validation.confidence > 0.7) {
        return validation.fixedUrl || topicImage
      }

      // Fall back to category-based selection
      const categoryImage = await ImageSelector.getUniqueImage(category)
      const categoryValidation = await this.validateImageUrl(categoryImage)
      
      return categoryValidation.fixedUrl || categoryImage

    } catch (error) {
      console.warn('Smart replacement failed, using default fallback:', error)
      
      // Ultimate fallback - Singapore skyline
      return 'https://images.unsplash.com/photo-1519897831810-a9a01aceccd1?w=1200&h=630&fit=crop&q=80'
    }
  }

  /**
   * Batch validate multiple image URLs
   */
  static async validateImageUrls(urls: string[]): Promise<ImageValidationResult[]> {
    const validationPromises = urls.map(url => this.validateImageUrl(url))
    
    try {
      return await Promise.allSettled(validationPromises).then(results =>
        results.map((result, index) => {
          if (result.status === 'fulfilled') {
            return result.value
          } else {
            return {
              isValid: false,
              originalUrl: urls[index],
              confidence: 0,
              reason: `Promise rejected: ${result.reason}`
            }
          }
        })
      )
    } catch (error) {
      console.error('Batch validation failed:', error)
      return urls.map(url => ({
        isValid: false,
        originalUrl: url,
        confidence: 0,
        reason: 'Batch validation error'
      }))
    }
  }

  /**
   * Generate improved alt text for images based on context
   */
  static generateImprovedAltText(
    originalAlt: string,
    articleTitle: string,
    category: ArticleCategory
  ): string {
    if (!originalAlt || originalAlt.trim().length === 0) {
      // Generate alt text from article title and category
      const categoryText = category.replace(/_/g, ' ').toLowerCase()
      return `${articleTitle} - ${categoryText} article featured image`
    }

    // Improve existing alt text
    const improved = originalAlt.trim()
    
    // Add Singapore context if missing
    if (!improved.toLowerCase().includes('singapore') && 
        (articleTitle.toLowerCase().includes('singapore') || 
         improved.toLowerCase().includes('property'))) {
      return `Singapore ${improved}`
    }

    return improved
  }

  /**
   * Check if an image needs optimization for web performance
   */
  static analyzeImagePerformance(url: string): {
    needsOptimization: boolean
    suggestions: string[]
    optimizedUrl?: string
  } {
    const suggestions: string[] = []
    let needsOptimization = false

    try {
      const urlObj = new URL(url)

      // Check for Unsplash optimizations
      if (url.includes('images.unsplash.com')) {
        if (!urlObj.searchParams.has('auto') || urlObj.searchParams.get('auto') !== 'format') {
          urlObj.searchParams.set('auto', 'format')
          needsOptimization = true
          suggestions.push('Add auto=format for better compression')
        }

        const quality = urlObj.searchParams.get('q')
        if (!quality || parseInt(quality) > 85) {
          urlObj.searchParams.set('q', '80')
          needsOptimization = true
          suggestions.push('Optimize quality parameter')
        }

        if (!urlObj.searchParams.has('fit')) {
          urlObj.searchParams.set('fit', 'crop')
          needsOptimization = true
          suggestions.push('Add fit=crop for consistent sizing')
        }
      }

      return {
        needsOptimization,
        suggestions,
        optimizedUrl: needsOptimization ? urlObj.toString() : undefined
      }
    } catch {
      return {
        needsOptimization: false,
        suggestions: ['Invalid URL format'],
        optimizedUrl: undefined
      }
    }
  }
}