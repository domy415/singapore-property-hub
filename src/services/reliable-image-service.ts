import { ArticleCategory } from '@prisma/client'

/**
 * Reliable Image Service - Multi-CDN fallback with local assets
 * Provides 100% reliable image loading for Singapore Property Hub
 */

// Curated local Singapore property images (stored in public/images/)
const LOCAL_IMAGES = {
  [ArticleCategory.MARKET_INSIGHTS]: [
    '/images/singapore-cbd-skyline-01.jpg',
    '/images/marina-bay-financial-district-02.jpg', 
    '/images/singapore-business-district-03.jpg',
    '/images/raffles-place-towers-04.jpg',
    '/images/singapore-cityscape-evening-05.jpg',
    '/images/marina-bay-sands-skyline-06.jpg',
    '/images/singapore-financial-center-07.jpg',
    '/images/cbd-architecture-modern-08.jpg'
  ],
  [ArticleCategory.BUYING_GUIDE]: [
    '/images/modern-condo-interior-01.jpg',
    '/images/property-viewing-keys-02.jpg',
    '/images/singapore-home-interior-03.jpg',
    '/images/luxury-apartment-living-04.jpg',
    '/images/property-contract-signing-05.jpg',
    '/images/home-inspection-checklist-06.jpg',
    '/images/modern-kitchen-design-07.jpg',
    '/images/property-walkthrough-08.jpg'
  ],
  [ArticleCategory.INVESTMENT]: [
    '/images/singapore-financial-charts-01.jpg',
    '/images/property-investment-analysis-02.jpg',
    '/images/real-estate-portfolio-03.jpg',
    '/images/singapore-market-data-04.jpg',
    '/images/investment-calculator-05.jpg',
    '/images/property-roi-graphs-06.jpg',
    '/images/financial-planning-singapore-07.jpg',
    '/images/real-estate-analytics-08.jpg'
  ],
  [ArticleCategory.NEIGHBORHOOD]: [
    '/images/singapore-hdb-estate-01.jpg',
    '/images/toa-payoh-neighborhood-02.jpg',
    '/images/singapore-residential-street-03.jpg',
    '/images/void-deck-community-04.jpg',
    '/images/singapore-playground-dragon-05.jpg',
    '/images/hdb-blocks-modern-06.jpg',
    '/images/neighborhood-amenities-07.jpg',
    '/images/singapore-heartland-08.jpg'
  ],
  [ArticleCategory.PROPERTY_NEWS]: [
    '/images/singapore-government-building-01.jpg',
    '/images/ura-policy-documents-02.jpg',
    '/images/property-news-singapore-03.jpg',
    '/images/mas-building-singapore-04.jpg',
    '/images/policy-announcement-05.jpg',
    '/images/singapore-parliament-06.jpg',
    '/images/regulatory-documents-07.jpg',
    '/images/official-statistics-08.jpg'
  ],
  [ArticleCategory.SELLING_GUIDE]: [
    '/images/for-sale-singapore-property-01.jpg',
    '/images/property-agent-meeting-02.jpg',
    '/images/house-valuation-singapore-03.jpg',
    '/images/property-marketing-materials-04.jpg',
    '/images/home-staging-singapore-05.jpg',
    '/images/property-negotiation-06.jpg',
    '/images/sale-completion-documents-07.jpg',
    '/images/handover-keys-singapore-08.jpg'
  ],
  [ArticleCategory.NEW_LAUNCH_REVIEW]: [
    '/images/singapore-condo-construction-01.jpg',
    '/images/new-development-showflat-02.jpg',
    '/images/modern-condo-facade-03.jpg',
    '/images/luxury-amenities-pool-04.jpg',
    '/images/new-launch-singapore-05.jpg',
    '/images/condo-gym-facilities-06.jpg',
    '/images/rooftop-garden-singapore-07.jpg',
    '/images/smart-home-features-08.jpg'
  ],
  [ArticleCategory.LOCATION_GUIDE]: [
    '/images/singapore-mrt-station-01.jpg',
    '/images/orchard-road-shopping-02.jpg',
    '/images/singapore-districts-map-03.jpg',
    '/images/transport-connectivity-04.jpg',
    '/images/singapore-landmarks-05.jpg',
    '/images/district-amenities-06.jpg',
    '/images/singapore-location-guide-07.jpg',
    '/images/neighborhood-lifestyle-08.jpg'
  ]
}

// Multi-CDN fallback sources
const IMAGE_SOURCES = {
  // Primary: Unsplash (current)
  primary: {
    name: 'Unsplash',
    baseUrl: 'https://images.unsplash.com',
    format: (id: string) => `https://images.unsplash.com/${id}?w=1200&h=630&fit=crop&q=80`
  },
  // Secondary: Pexels (free API)
  secondary: {
    name: 'Pexels',
    baseUrl: 'https://images.pexels.com',
    format: (id: string) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1200&h=630`
  },
  // Tertiary: Pixabay (free)
  tertiary: {
    name: 'Pixabay', 
    baseUrl: 'https://pixabay.com',
    format: (id: string) => `https://cdn.pixabay.com/photo/${id.split('-')[0]}/${id}.jpg`
  }
}

// Curated external image pools with multiple CDN sources
const EXTERNAL_IMAGE_POOLS = {
  [ArticleCategory.MARKET_INSIGHTS]: [
    {
      unsplash: 'photo-1567360425618-1594206637d2',
      pexels: '416405',
      pixabay: '2023-11-singapore-skyline-416405',
      alt: 'Singapore CBD skyline with Marina Bay'
    },
    {
      unsplash: 'photo-1533628635777-112b2239b1c7', 
      pexels: '302769',
      pixabay: '2023-11-marina-bay-sands-302769',
      alt: 'Marina Bay Sands Singapore'
    }
  ],
  [ArticleCategory.BUYING_GUIDE]: [
    {
      unsplash: 'photo-1560518883-ce09059eeffa',
      pexels: '259588',
      pixabay: '2023-11-modern-home-259588',
      alt: 'Modern home interior'
    }
  ]
}

interface ImageSource {
  url: string
  source: 'local' | 'unsplash' | 'pexels' | 'pixabay'
  alt: string
  fallbackIndex: number
}

export class ReliableImageService {
  private static imageUsageCache = new Map<string, number>()
  
  /**
   * Get a reliable image with automatic fallbacks
   */
  static async getReliableImage(
    category: ArticleCategory,
    title?: string,
    preferLocal: boolean = true
  ): Promise<ImageSource> {
    
    // Strategy 1: Try local images first (100% reliable)
    if (preferLocal) {
      const localImage = this.getLocalImage(category)
      if (localImage) {
        return {
          url: localImage,
          source: 'local',
          alt: this.generateAltText(category, title),
          fallbackIndex: 0
        }
      }
    }
    
    // Strategy 2: Try multi-CDN external images with fallbacks
    const externalImage = await this.getExternalImageWithFallback(category)
    if (externalImage) {
      return externalImage
    }
    
    // Strategy 3: Emergency local fallback
    return this.getEmergencyFallback(category, title)
  }
  
  /**
   * Get local image with rotation to avoid repetition
   */
  private static getLocalImage(category: ArticleCategory): string | null {
    const categoryImages = LOCAL_IMAGES[category]
    if (!categoryImages || categoryImages.length === 0) {
      return null
    }
    
    // Get usage count for this category
    const cacheKey = `local_${category}`
    const currentIndex = this.imageUsageCache.get(cacheKey) || 0
    
    // Select next image in rotation
    const selectedImage = categoryImages[currentIndex % categoryImages.length]
    
    // Update cache for next time
    this.imageUsageCache.set(cacheKey, currentIndex + 1)
    
    return selectedImage
  }
  
  /**
   * Get external image with automatic CDN fallback
   */
  private static async getExternalImageWithFallback(
    category: ArticleCategory
  ): Promise<ImageSource | null> {
    const imagePool = EXTERNAL_IMAGE_POOLS[category as keyof typeof EXTERNAL_IMAGE_POOLS]
    if (!imagePool || imagePool.length === 0) {
      return null
    }
    
    // Select random image from pool
    const selectedImage = imagePool[Math.floor(Math.random() * imagePool.length)]
    
    // Try each CDN source in order
    const cdnOrder = ['unsplash', 'pexels', 'pixabay'] as const
    
    for (let i = 0; i < cdnOrder.length; i++) {
      const cdn = cdnOrder[i]
      const imageId = selectedImage[cdn]
      
      if (!imageId) continue
      
      try {
        let imageUrl: string
        
        switch (cdn) {
          case 'unsplash':
            imageUrl = IMAGE_SOURCES.primary.format(imageId)
            break
          case 'pexels':
            imageUrl = IMAGE_SOURCES.secondary.format(imageId)
            break
          case 'pixabay':
            imageUrl = IMAGE_SOURCES.tertiary.format(imageId)
            break
          default:
            continue
        }
        
        // Test image availability (only in browser)
        if (typeof window !== 'undefined') {
          const isAvailable = await this.testImageAvailability(imageUrl)
          if (!isAvailable) {
            console.warn(`Image not available from ${cdn}: ${imageUrl}`)
            continue
          }
        }
        
        return {
          url: imageUrl,
          source: cdn,
          alt: selectedImage.alt,
          fallbackIndex: i
        }
      } catch (error) {
        console.warn(`CDN ${cdn} failed:`, error)
        continue
      }
    }
    
    return null
  }
  
  /**
   * Test if image URL is accessible
   */
  private static async testImageAvailability(url: string): Promise<boolean> {
    try {
      const response = await fetch(url, { 
        method: 'HEAD',
        signal: AbortSignal.timeout(5000) // 5 second timeout
      })
      return response.ok
    } catch {
      return false
    }
  }
  
  /**
   * Emergency local fallback - always works
   */
  private static getEmergencyFallback(
    category: ArticleCategory,
    title?: string
  ): ImageSource {
    // Default fallback images that always exist locally
    const fallbackMap = {
      [ArticleCategory.MARKET_INSIGHTS]: '/images/singapore-default-skyline.jpg',
      [ArticleCategory.BUYING_GUIDE]: '/images/singapore-default-home.jpg',
      [ArticleCategory.INVESTMENT]: '/images/singapore-default-finance.jpg',
      [ArticleCategory.NEIGHBORHOOD]: '/images/singapore-default-hdb.jpg',
      [ArticleCategory.PROPERTY_NEWS]: '/images/singapore-default-news.jpg',
      [ArticleCategory.SELLING_GUIDE]: '/images/singapore-default-sale.jpg',
      [ArticleCategory.NEW_LAUNCH_REVIEW]: '/images/singapore-default-condo.jpg',
      [ArticleCategory.LOCATION_GUIDE]: '/images/singapore-default-location.jpg'
    }
    
    return {
      url: fallbackMap[category] || '/images/singapore-default-skyline.jpg',
      source: 'local',
      alt: this.generateAltText(category, title),
      fallbackIndex: 99 // Indicates emergency fallback
    }
  }
  
  /**
   * Generate contextual alt text
   */
  private static generateAltText(category: ArticleCategory, title?: string): string {
    const categoryText = category.replace(/_/g, ' ').toLowerCase()
    
    if (title) {
      return `${title} - ${categoryText} Singapore property article`
    }
    
    const defaultAltTexts = {
      [ArticleCategory.MARKET_INSIGHTS]: 'Singapore property market analysis and insights',
      [ArticleCategory.BUYING_GUIDE]: 'Singapore property buying guide and tips',
      [ArticleCategory.INVESTMENT]: 'Singapore property investment analysis',
      [ArticleCategory.NEIGHBORHOOD]: 'Singapore neighborhood and district guide',
      [ArticleCategory.PROPERTY_NEWS]: 'Singapore property news and updates',
      [ArticleCategory.SELLING_GUIDE]: 'Singapore property selling guide',
      [ArticleCategory.NEW_LAUNCH_REVIEW]: 'Singapore new launch property review',
      [ArticleCategory.LOCATION_GUIDE]: 'Singapore location and district guide'
    }
    
    return defaultAltTexts[category] || 'Singapore property article'
  }
  
  /**
   * Batch preload images for better performance
   */
  static async preloadCriticalImages(): Promise<void> {
    if (typeof window === 'undefined') return
    
    const criticalImages = [
      '/images/singapore-default-skyline.jpg',
      '/images/singapore-cbd-skyline-01.jpg', 
      '/images/marina-bay-financial-district-02.jpg'
    ]
    
    const preloadPromises = criticalImages.map(url => {
      return new Promise((resolve) => {
        const img = new Image()
        img.onload = resolve
        img.onerror = resolve // Don't fail on error, just resolve
        img.src = url
      })
    })
    
    await Promise.allSettled(preloadPromises)
  }
  
  /**
   * Get image statistics for monitoring
   */
  static getImageStats(): {
    totalLocal: number
    totalExternal: number
    cacheSize: number
    fallbackUsage: number
  } {
    const totalLocal = Object.values(LOCAL_IMAGES).reduce(
      (sum, images) => sum + images.length, 0
    )
    
    const totalExternal = Object.values(EXTERNAL_IMAGE_POOLS).reduce(
      (sum, images) => sum + images.length, 0
    )
    
    return {
      totalLocal,
      totalExternal,
      cacheSize: this.imageUsageCache.size,
      fallbackUsage: 0 // TODO: Track fallback usage
    }
  }
}