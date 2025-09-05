/**
 * Singapore Property Image Finder Agent - Finds contextually relevant property images
 * Enhanced with reliable multi-CDN fallback system and local assets
 */

import OpenAI from 'openai'
import { ReliableImageService } from './reliable-image-service'
import { ArticleCategory } from '@prisma/client'

interface ImageSearchResult {
  imageUrl: string
  description: string
  suggestedCaption: string
  attribution?: string
  alternativeOptions?: Array<{
    url: string
    description: string
  }>
  imageType: 'property-specific' | 'district' | 'neighborhood' | 'conceptual' | 'skyline'
  relevanceScore: number
  success: boolean
  error?: string
  generated?: boolean
  cost?: number
}

export class AgentPropertyImageFinder {
  private openai: OpenAI | null

  constructor() {
    // Skip initialization during build time
    if (typeof window === 'undefined' && !process.env.DATABASE_URL) {
      this.openai = null;
      return;
    }
    
    if (!process.env.OPENAI_API_KEY) {
      this.openai = null;
      return;
    }
    
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }
  
  async findPropertyImage(
    articleTitle: string,
    articleTopic: string,
    articleCategory: string,
    specificRequirements?: {
      propertyName?: string
      district?: string
      neighborhood?: string
      conceptType?: 'finance' | 'market' | 'regulation' | 'lifestyle'
    }
  ): Promise<ImageSearchResult> {
    try {
      console.log(`🇸🇬 Singapore Property Image Finder Agent: ${articleTitle}`)
      
      // Convert string category to ArticleCategory enum
      const categoryEnum = this.convertToArticleCategory(articleCategory)
      
      // Step 1: Use ReliableImageService for consistent, fast results
      const reliableImage = await ReliableImageService.getReliableImage(
        categoryEnum,
        articleTitle,
        true // Prefer local images for speed and reliability
      )
      
      if (reliableImage) {
        return {
          imageUrl: reliableImage.url,
          description: `Reliable ${reliableImage.source} image: ${reliableImage.alt}`,
          suggestedCaption: this.generateCaption(articleTitle),
          imageType: this.getImageType(articleCategory, specificRequirements),
          relevanceScore: reliableImage.fallbackIndex === 0 ? 0.98 : 0.95 - (reliableImage.fallbackIndex * 0.1),
          success: true,
          generated: reliableImage.source === 'local' ? false : true,
          cost: 0 // No cost for reliable images
        }
      }
      
      // Step 2: Only use DALL-E for very specific requirements (expensive)
      if (this.openai && specificRequirements?.propertyName && articleCategory === 'NEW_LAUNCH_REVIEW') {
        try {
          const generatedImage = await this.generateImageWithDALLE(
            articleTitle,
            articleCategory,
            specificRequirements
          )
          
          if (generatedImage.success) {
            return generatedImage
          }
        } catch (dalleError) {
          console.warn('DALL-E generation failed:', dalleError)
        }
      }
      
      // Step 3: Final fallback using reliable service emergency mode
      const emergencyImage = await ReliableImageService.getReliableImage(
        categoryEnum,
        articleTitle,
        true
      )
      
      return {
        imageUrl: emergencyImage.url,
        description: `Emergency fallback: ${emergencyImage.alt}`,
        suggestedCaption: this.generateCaption(articleTitle),
        imageType: 'skyline',
        relevanceScore: 0.8,
        success: true,
        generated: false
      }
      
    } catch (error) {
      console.error('Error in Singapore Property Image Finder Agent:', error)
      return this.getEmergencyFallback()
    }
  }
  
  // Generate image with DALL-E 3 using Singapore-specific prompts
  private async generateImageWithDALLE(
    articleTitle: string,
    articleCategory: string,
    requirements?: any
  ): Promise<ImageSearchResult> {
    if (!this.openai) {
      throw new Error('OpenAI API not available')
    }

    const prompt = this.buildDALLEPrompt(articleTitle, articleCategory, requirements)
    console.log(`🎨 Generating DALL-E image with prompt: ${prompt.substring(0, 100)}...`)

    try {
      const response = await this.openai.images.generate({
        model: "dall-e-3",
        size: "1792x1024", // Optimal for article headers
        quality: "standard",
        style: "natural", // Photorealistic, not artistic
        n: 1,
        prompt: prompt
      })

      const imageUrl = response.data[0]?.url
      if (!imageUrl) {
        throw new Error('No image URL returned from DALL-E')
      }

      return {
        imageUrl,
        description: `DALL-E 3 generated Singapore property image: ${prompt.substring(0, 150)}`,
        suggestedCaption: this.generateCaption(articleTitle),
        imageType: this.getImageType(articleCategory, requirements),
        relevanceScore: 0.95, // Generated specifically for content
        success: true,
        generated: true,
        cost: 0.04 // DALL-E 3 standard cost
      }

    } catch (error) {
      console.error('DALL-E generation failed:', error)
      throw error
    }
  }

  // Build DALL-E prompt based on your guidelines
  private buildDALLEPrompt(
    articleTitle: string,
    articleCategory: string,
    requirements?: any
  ): string {
    const title = articleTitle.toLowerCase()
    
    // District-specific prompts
    if (title.includes('district 1') || title.includes('marina bay') || title.includes('raffles place')) {
      return "Photorealistic Singapore CBD skyline, Marina Bay Sands in background, Singapore River, modern financial district, ArtScience Museum visible, evening golden hour, professional real estate photography, 16:9 aspect ratio"
    }
    
    if (title.includes('district 9') || title.includes('orchard')) {
      return "Singapore Orchard Road shopping district, ION Orchard and Ngee Ann City visible, bustling street with tropical trees, modern luxury condominiums in background, daytime, clear blue sky, professional architectural photography"
    }
    
    if (title.includes('district 10') || title.includes('bukit timah') || title.includes('holland')) {
      return "Upscale Singapore residential area, landed properties along tree-lined streets, tropical landscaping, low-rise luxury homes, Bukit Timah nature reserve in distance, morning light, professional real estate photography"
    }
    
    if (title.includes('district 12') || title.includes('toa payoh') || title.includes('balestier')) {
      return "Singapore HDB flat exterior, Toa Payoh town center, void deck with residents, covered walkways, nearby MRT station visible, hawker center in background, tropical afternoon light, authentic neighborhood atmosphere"
    }
    
    if (title.includes('district 15') || title.includes('east coast') || title.includes('marine parade')) {
      return "Singapore East Coast beachfront, modern condominiums facing the sea, East Coast Park cyclists and joggers, ships in Singapore Strait, coconut palms, sunset lighting, professional property photography"
    }

    // Property type specific prompts
    if (articleCategory === 'NEW_LAUNCH_REVIEW' || title.includes('condo')) {
      return "Modern Singapore condominium, luxury swimming pool with cabanas, sky garden, glass facade architecture, city skyline view, tropical landscaping, evening ambient lighting, professional real estate photography, high-end residential"
    }
    
    if (title.includes('hdb') || title.includes('public housing')) {
      return "Singapore HDB flat exterior, modern BTO development, colorful facade, void deck community space, playground and fitness corner, covered linkways, tropical landscaping, authentic heartland atmosphere, professional real estate photography, 16:9 ratio"
    }
    
    if (title.includes('shophouse')) {
      return "Traditional Singapore shophouse, Peranakan architecture, colorful facade with intricate details, five-foot way, heritage conservation area, Chinatown/Little India/Kampong Glam setting, late afternoon lighting, cultural authenticity"
    }

    // Investment/Market analysis
    if (articleCategory === 'INVESTMENT' || title.includes('market') || title.includes('investment')) {
      return "Singapore financial district skyline with data overlay visualization, modern architecture, Marina Bay Financial Centre, growth charts subtly integrated, professional business photography, blue hour lighting, prosperity theme"
    }

    // Default Singapore property scene
    return "Modern Singapore residential development, tropical architecture with balconies, lush landscaping, Singapore skyline in background, professional real estate photography, natural lighting, high quality, 16:9 aspect ratio"
  }
  
  // Fetch images from developer websites (for condo reviews)
  private async fetchDeveloperImage(propertyName: string): Promise<ImageSearchResult | null> {
    console.log(`🏢 Attempting to fetch developer image for: ${propertyName}`)
    
    const developers = {
      'CapitaLand': 'capitaland.com/sg/',
      'CDL': 'cdl.com.sg/',
      'GuocoLand': 'guocoland.com.sg/property/',
      'Frasers': 'frasersproperty.com/sg/',
      'Keppel Land': 'keppelland.com.sg/',
      'UOL': 'uol.com.sg/',
      'MCL Land': 'mclland.com.sg/',
      'Allgreen Properties': 'allgreen.com.sg/'
    }

    // This would need actual web scraping implementation
    // For now, return null to proceed to DALL-E generation
    console.log('Developer image fetching not yet implemented, proceeding to DALL-E')
    return null
  }

  // Helper methods
  private convertToArticleCategory(categoryString: string): ArticleCategory {
    const categoryMap: { [key: string]: ArticleCategory } = {
      'NEW_LAUNCH_REVIEW': ArticleCategory.NEW_LAUNCH_REVIEW,
      'MARKET_INSIGHTS': ArticleCategory.MARKET_INSIGHTS,
      'BUYING_GUIDE': ArticleCategory.BUYING_GUIDE,
      'SELLING_GUIDE': ArticleCategory.SELLING_GUIDE,
      'INVESTMENT': ArticleCategory.INVESTMENT,
      'NEIGHBORHOOD': ArticleCategory.NEIGHBORHOOD,
      'LOCATION_GUIDE': ArticleCategory.LOCATION_GUIDE,
      'PROPERTY_NEWS': ArticleCategory.PROPERTY_NEWS
    }
    
    return categoryMap[categoryString] || ArticleCategory.MARKET_INSIGHTS
  }

  private generateCaption(articleTitle: string): string {
    return `${articleTitle} - Singapore Property Hub`
  }

  private getImageType(category: string, requirements?: any): 'property-specific' | 'district' | 'neighborhood' | 'conceptual' | 'skyline' {
    if (requirements?.propertyName) return 'property-specific'
    if (requirements?.district) return 'district'
    if (category === 'NEW_LAUNCH_REVIEW') return 'property-specific'
    if (category === 'LOCATION_GUIDE') return 'district'
    if (category === 'INVESTMENT' || category === 'MARKET_INSIGHTS') return 'skyline'
    return 'conceptual'
  }

  // Emergency fallback - Singapore Marina Bay skyline
  private getEmergencyFallback(): ImageSearchResult {
    return {
      imageUrl: 'https://images.unsplash.com/photo-1567360425618-1594206637d2?w=1200&h=630&q=80',
      description: 'Singapore Marina Bay skyline - emergency fallback',
      suggestedCaption: 'Singapore Marina Bay skyline - Singapore Property Hub',
      imageType: 'skyline',
      relevanceScore: 0.7,
      success: true,
      generated: false
    }
  }
  
  // Keep existing utility methods for backwards compatibility
  extractPropertyName(title: string): string | null {
    const patterns = [
      /(?:review|guide|analysis)(?:\s+of)?\s+(.+?)(?:\s+condo|\s+condominium|\s+singapore)?$/i,
      /^(.+?)(?:\s+review|\s+guide|\s+analysis)/i,
      /(?:at|@)\s+(.+?)$/i
    ]
    
    for (const pattern of patterns) {
      const match = title.match(pattern)
      if (match && match[1]) {
        return match[1].trim()
      }
    }
    return null
  }
  
  identifyDistrict(content: string): number | null {
    const districtMatch = content.match(/district\s+(\d{1,2})/i)
    if (districtMatch) {
      return parseInt(districtMatch[1])
    }
    return null
  }
  
}