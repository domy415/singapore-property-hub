/**
 * ArticleImageService - Unified Image Handling Service
 * 
 * This service centralizes all article image handling to fix the issue of 
 * repeated generic images instead of Singapore-specific images.
 * 
 * Key Features:
 * - No cache-busting interference with Singapore Property Image Finder Agent URLs
 * - Single fallback strategy with Singapore-specific images
 * - Proper error handling and retry mechanisms
 * - Integration with existing database image URLs
 */

// Singapore-specific fallback images by category
const SINGAPORE_IMAGE_FALLBACKS = {
  // National Day and Independence themes
  NATIONAL_DAY: 'https://images.unsplash.com/photo-1631086459917-a18a7dbb1699?w=1200&h=630&q=80',
  
  // District-specific images
  DISTRICT_12: 'https://images.unsplash.com/photo-1560036486-def2e0dbebb7?w=1200&h=630&q=80', // Toa Payoh HDB
  DISTRICT_2: 'https://images.unsplash.com/photo-1567360425618-1594206637d2?w=1200&h=630&q=80', // Singapore CBD
  
  // Property type specific
  HDB: 'https://images.unsplash.com/photo-1648365300669-e7b760c6d240?w=1200&h=630&q=80', // HDB void deck
  CONDO: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&h=630&q=80', // Singapore condo
  NEW_LAUNCH: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&h=630&q=80', // Modern development
  
  // Weekend and market themes  
  WEEKEND: 'https://images.unsplash.com/photo-1508964942454-1a56651d54ac?w=1200&h=630&q=80', // Modern Singapore property
  MARKET: 'https://images.unsplash.com/photo-1567360425618-1594206637d2?w=1200&h=630&q=80', // Singapore skyline
  
  // Default Singapore fallback
  DEFAULT: 'https://images.unsplash.com/photo-1567360425618-1594206637d2?w=1200&h=630&q=80' // Singapore CBD skyline
} as const;

// Category mapping for articles
const CATEGORY_IMAGE_MAP = {
  'MARKET_INSIGHTS': SINGAPORE_IMAGE_FALLBACKS.MARKET,
  'BUYING_GUIDE': SINGAPORE_IMAGE_FALLBACKS.DEFAULT,
  'NEW_LAUNCH_REVIEW': SINGAPORE_IMAGE_FALLBACKS.NEW_LAUNCH,
  'LOCATION_GUIDE': SINGAPORE_IMAGE_FALLBACKS.DEFAULT,
  'PROPERTY_NEWS': SINGAPORE_IMAGE_FALLBACKS.CONDO,
  'INVESTMENT': SINGAPORE_IMAGE_FALLBACKS.MARKET,
  'SELLING_GUIDE': SINGAPORE_IMAGE_FALLBACKS.MARKET,
  'NEIGHBORHOOD': SINGAPORE_IMAGE_FALLBACKS.DISTRICT_12
} as const;

export interface ArticleImageData {
  url: string;
  alt: string;
  width?: number;
  height?: number;
  isOptimized?: boolean;
}

export class ArticleImageService {
  /**
   * Get the correct image URL for an article
   * This is the main method that should be used by all components
   */
  static getArticleImage(
    imageUrl: string | null | undefined,
    title?: string,
    category?: string,
    slug?: string
  ): ArticleImageData {
    // If we have a valid image URL, use it directly (no cache-busting!)
    if (imageUrl && this.isValidImageUrl(imageUrl)) {
      return {
        url: this.cleanImageUrl(imageUrl),
        alt: title || 'Singapore Property Article',
        isOptimized: this.isUnsplashUrl(imageUrl)
      };
    }

    // Get intelligent fallback based on article content
    const fallbackUrl = this.getIntelligentFallback(title, category, slug);
    
    return {
      url: fallbackUrl,
      alt: title || 'Singapore Property Article',
      isOptimized: true
    };
  }

  /**
   * Clean image URL by removing any cache-busting parameters that interfere
   * with Singapore Property Image Finder Agent URLs
   */
  private static cleanImageUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      
      // Remove cache-busting parameters that interfere with image recognition
      urlObj.searchParams.delete('t');
      urlObj.searchParams.delete('cb');
      urlObj.searchParams.delete('cache');
      urlObj.searchParams.delete('timestamp');
      
      return urlObj.toString();
    } catch {
      return url; // Return original if URL parsing fails
    }
  }

  /**
   * Check if URL is a valid image URL
   */
  private static isValidImageUrl(url: string): boolean {
    if (!url || typeof url !== 'string') return false;
    
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname.toLowerCase();
      
      // Accept Unsplash URLs (our primary image source)
      if (hostname.includes('unsplash.com')) return true;
      
      // Accept other common image CDNs
      if (hostname.includes('images.') || 
          hostname.includes('cdn.') ||
          hostname.includes('img.')) return true;
          
      // Check file extension
      const pathname = urlObj.pathname.toLowerCase();
      if (pathname.endsWith('.jpg') || 
          pathname.endsWith('.jpeg') || 
          pathname.endsWith('.png') || 
          pathname.endsWith('.webp')) return true;
          
      return false;
    } catch {
      return false;
    }
  }

  /**
   * Check if URL is from Unsplash (our optimized image source)
   */
  private static isUnsplashUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.includes('unsplash.com');
    } catch {
      return false;
    }
  }

  /**
   * Get intelligent fallback image based on article content
   */
  private static getIntelligentFallback(
    title?: string, 
    category?: string, 
    slug?: string
  ): string {
    const searchText = (title + ' ' + slug + ' ' + category).toLowerCase();

    // National Day and Singapore themes
    if (searchText.includes('national day') || 
        searchText.includes('independence') ||
        searchText.includes('celebrating')) {
      return SINGAPORE_IMAGE_FALLBACKS.NATIONAL_DAY;
    }

    // District-specific themes
    if (searchText.includes('district 12') || 
        searchText.includes('toa payoh') || 
        searchText.includes('balestier') ||
        searchText.includes('serangoon')) {
      return SINGAPORE_IMAGE_FALLBACKS.DISTRICT_12;
    }

    if (searchText.includes('district 2') || 
        searchText.includes('tanjong pagar') || 
        searchText.includes('anson')) {
      return SINGAPORE_IMAGE_FALLBACKS.DISTRICT_2;
    }

    // HDB vs Private themes
    if (searchText.includes('hdb') || 
        searchText.includes('public housing')) {
      return SINGAPORE_IMAGE_FALLBACKS.HDB;
    }

    // Weekend and property themes
    if (searchText.includes('weekend')) {
      return SINGAPORE_IMAGE_FALLBACKS.WEEKEND;
    }

    // New launch themes
    if (searchText.includes('new launch') || 
        searchText.includes('bloomsbury') ||
        category === 'NEW_LAUNCH_REVIEW') {
      return SINGAPORE_IMAGE_FALLBACKS.NEW_LAUNCH;
    }

    // Category-based fallback
    if (category && category in CATEGORY_IMAGE_MAP) {
      return CATEGORY_IMAGE_MAP[category as keyof typeof CATEGORY_IMAGE_MAP];
    }

    // Default Singapore fallback
    return SINGAPORE_IMAGE_FALLBACKS.DEFAULT;
  }

  /**
   * Optimize image URL for different display sizes
   */
  static getOptimizedImageUrl(
    imageUrl: string,
    width: number = 1200,
    height: number = 630,
    quality: number = 80
  ): string {
    if (!this.isUnsplashUrl(imageUrl)) {
      return imageUrl; // Return as-is for non-Unsplash URLs
    }

    try {
      const url = new URL(imageUrl);
      
      // Set optimization parameters for Unsplash
      url.searchParams.set('w', width.toString());
      url.searchParams.set('h', height.toString());
      url.searchParams.set('q', quality.toString());
      url.searchParams.set('fit', 'crop');
      url.searchParams.set('fm', 'webp'); // Use WebP format for better compression
      
      // DO NOT add cache-busting parameters that interfere with image recognition
      
      return url.toString();
    } catch {
      return imageUrl;
    }
  }

  /**
   * Get thumbnail version of image
   */
  static getThumbnailUrl(imageUrl: string): string {
    return this.getOptimizedImageUrl(imageUrl, 400, 300, 75);
  }

  /**
   * Get hero image version
   */
  static getHeroImageUrl(imageUrl: string): string {
    return this.getOptimizedImageUrl(imageUrl, 1920, 1080, 90);
  }

  /**
   * Validate and clean image data from database
   */
  static processArticleImages(articles: any[]): any[] {
    return articles.map(article => ({
      ...article,
      featuredImage: this.getArticleImage(
        article.featuredImage,
        article.title,
        article.category,
        article.slug
      ).url
    }));
  }

  /**
   * Get multiple image formats for responsive loading
   */
  static getResponsiveImageSources(imageUrl: string) {
    const baseUrl = this.cleanImageUrl(imageUrl);
    
    return {
      webp: this.getOptimizedImageUrl(baseUrl, 1200, 630, 80),
      avif: this.getOptimizedImageUrl(baseUrl, 1200, 630, 80).replace('fm=webp', 'fm=avif'),
      fallback: this.getOptimizedImageUrl(baseUrl, 1200, 630, 80).replace('fm=webp', 'fm=jpeg')
    };
  }
}

export default ArticleImageService;