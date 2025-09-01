/**
 * Singapore Property Image Finder Agent - Finds contextually relevant property images
 * Enhanced with web search capabilities and Claude integration
 */

import Anthropic from '@anthropic-ai/sdk'

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
}

export class AgentPropertyImageFinder {
  private anthropic: Anthropic | null

  constructor() {
    // Skip initialization during build time
    if (typeof window === 'undefined' && !process.env.DATABASE_URL) {
      this.anthropic = null;
      return;
    }
    
    if (!process.env.ANTHROPIC_API_KEY) {
      this.anthropic = null;
      return;
    }
    
    this.anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
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
      console.log(`Finding contextual image for: ${articleTitle}`)
      
      // Use Claude with web search to find appropriate image
      if (this.anthropic) {
        try {
          const webSearchResult = await this.findImageWithWebSearch(
            articleTitle,
            articleTopic,
            articleCategory,
            specificRequirements
          )
          
          if (webSearchResult.success) {
            return webSearchResult
          }
        } catch (agentError) {
          console.warn('Web image search failed, using content-based selection:', agentError)
        }
      }
      
      // Enhanced content-based fallback
      return this.selectContentAppropriateImage(articleTitle, articleCategory, specificRequirements)
      
    } catch (error) {
      console.error('Error in image finding:', error)
      throw new Error(`Image finding failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
  
  private buildImageSearchPrompt(
    articleTitle: string,
    articleTopic: string,
    articleCategory: string,
    requirements?: any
  ): string {
    return `
# Image Search Request for Singapore Property Article

## Article Context
- **Title**: ${articleTitle}
- **Topic**: ${articleTopic}
- **Category**: ${articleCategory}

## Specific Requirements
${requirements?.propertyName ? `- **Property Name**: ${requirements.propertyName}` : ''}
${requirements?.district ? `- **District**: District ${requirements.district}` : ''}
${requirements?.neighborhood ? `- **Neighborhood**: ${requirements.neighborhood}` : ''}
${requirements?.conceptType ? `- **Concept Type**: ${requirements.conceptType}` : ''}

## Search Instructions

As the singapore-property-image-finder agent, find the most appropriate image following these priorities:

1. **For Specific Properties** (e.g., "The Sail", "Marina One Residences"):
   - Search for actual images of that exact property
   - Prioritize exterior architectural shots
   - Include property name + "Singapore" in search

2. **For Districts/Neighborhoods**:
   - Capture the area's distinctive character
   - Balance landmarks with everyday scenes
   - Show what makes this location unique

3. **For Conceptual Topics**:
   - Finance: CPF building, Singapore currency, local banks
   - Market trends: Singapore skyline, property showrooms
   - Regulations: Government buildings, HDB headquarters
   - Maintain Singapore context in all selections

## Image Requirements
- Minimum resolution: 1200x630 pixels
- Professional quality with good composition
- Recent images (within last 3-5 years)
- No watermarks or copyright issues
- Suitable for web and social media use

## Expected Output
Please provide:
1. Primary image URL
2. Why this image was selected
3. Suggested caption for the article
4. Any attribution requirements
5. 2-3 alternative image options

Remember: Prioritize authenticity and local relevance. The image should immediately convey "Singapore property" to viewers and enhance the article's credibility and engagement.`
  }
  
  private async findImageWithWebSearch(
    articleTitle: string,
    articleTopic: string,
    articleCategory: string,
    requirements?: any
  ): Promise<ImageSearchResult> {
    if (!this.anthropic) {
      throw new Error('Claude API not available')
    }

    const webSearchPrompt = `You are the singapore-property-image-finder agent with web search capabilities.

TASK: Find the most appropriate high-quality image for this Singapore property article:

ARTICLE DETAILS:
- Title: "${articleTitle}"
- Topic: "${articleTopic}" 
- Category: ${articleCategory}
${requirements?.district ? `- District: ${requirements.district}` : ''}
${requirements?.propertyName ? `- Property: ${requirements.propertyName}` : ''}

SEARCH STRATEGY:
1. **For District Articles**: Search for authentic Singapore district imagery
   - District 12 (Toa Payoh/Balestier): Search "Toa Payoh HDB Singapore authentic" 
   - District 2 (CBD/Tanjong Pagar): Search "Singapore CBD skyline Tanjong Pagar"
   - Focus on real places, not generic imagery

2. **For National Day/Celebration**: Search "Singapore National Day celebration Marina Bay"
   - Prioritize Singapore flag, Marina Bay Sands backdrop, patriotic themes

3. **For Market Analysis**: Search "Singapore property market analysis professional"
   - CBD skylines, property graphs, financial district imagery

4. **For Property Reviews**: Search specific property name + "Singapore condo"
   - If property not found, use modern Singapore condo imagery

5. **For HDB Content**: Search "Singapore HDB authentic Danist Soh"
   - Authentic public housing with void decks and heartland character

QUALITY REQUIREMENTS:
- Minimum 1200x630 resolution
- Professional photography quality  
- Authentic Singapore context (recognizable landmarks/architecture)
- Recent imagery (2020+)
- Free license or properly attributed

Return ONLY this JSON format:
{
  "imageUrl": "https://images.unsplash.com/photo-ID?w=1200&h=630&q=80",
  "description": "Detailed description of the image and why it was selected",
  "suggestedCaption": "Caption for article use",
  "imageType": "property-specific|district|neighborhood|conceptual|skyline",
  "relevanceScore": 0.95,
  "searchQuery": "Query used to find this image",
  "whySelected": "Explanation of why this image perfectly matches the article content"
}`

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-3-haiku-20240307',
        max_tokens: 2000,
        messages: [{
          role: 'user',
          content: `<context>
You are a Singapore property image specialist with web search access. Find the perfect image that matches the article content exactly.
</context>

<task>
${webSearchPrompt}
</task>

<requirements>
- Use web search to find appropriate images
- Return valid JSON only
- Prioritize content relevance over generic beauty
- Ensure Singapore authenticity
</requirements>`
        }],
        temperature: 0.3
      })

      const responseText = (response.content[0] as any).text
      
      // Clean and parse response
      const cleanedText = responseText
        .replace(/[\x00-\x1F\x7F]/g, '')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r')
        .replace(/\t/g, '\\t')
      
      const result = JSON.parse(cleanedText)
      
      return {
        imageUrl: result.imageUrl,
        description: result.description,
        suggestedCaption: result.suggestedCaption,
        imageType: result.imageType,
        relevanceScore: result.relevanceScore,
        success: true
      }
    } catch (error) {
      console.error('Web search image finding failed:', error)
      throw error
    }
  }
  
  private selectContentAppropriateImage(
    articleTitle: string,
    articleCategory: string,
    requirements?: any
  ): ImageSearchResult {
    let imageUrl = ''
    let description = ''
    let imageType: any = 'skyline'
    let relevanceScore = 0.8
    
    const title = articleTitle.toLowerCase()
    
    // DISTRICT-SPECIFIC MAPPING (highest priority)
    if (title.includes('district 12') || title.includes('toa payoh') || title.includes('balestier')) {
      imageUrl = 'https://images.unsplash.com/photo-1560036486-def2e0dbebb7?w=1200&h=630&q=80' // Toa Payoh neighborhood by Rival Sitorus
      description = 'Iconic Toa Payoh District 12 neighborhood with authentic Singapore HDB architecture and community spaces'
      imageType = 'district'
      relevanceScore = 0.95
    } else if (title.includes('district 2') || title.includes('cbd') || title.includes('tanjong pagar') || title.includes('anson')) {
      imageUrl = 'https://images.unsplash.com/photo-1567360425618-1594206637d2?w=1200&h=630&q=80' // Singapore CBD
      description = 'Singapore CBD skyline featuring Tanjong Pagar financial district'
      imageType = 'district'
      relevanceScore = 0.95
    } 
    // NATIONAL DAY/CELEBRATION CONTENT
    else if (title.includes('national day') || title.includes('celebrating') || title.includes('independence')) {
      imageUrl = 'https://images.unsplash.com/photo-1631086459917-a18a7dbb1699?w=1200&h=630&q=80' // Singapore flag by Danist Soh
      description = 'Singapore flag against iconic architecture celebrating National Day and patriotic property market insights'
      imageType = 'conceptual'
      relevanceScore = 0.95
    }
    // HDB-SPECIFIC CONTENT
    else if (title.includes('hdb') || title.includes('public housing') || title.includes('bto')) {
      imageUrl = 'https://images.unsplash.com/photo-1648365300669-e7b760c6d240?w=1200&h=630&q=80' // HDB void deck by Singapore Stock Photos
      description = 'Singapore HDB void deck with community spaces showcasing authentic heartland living and public housing architecture'
      imageType = 'conceptual'
      relevanceScore = 0.9
    }
    // SPECIFIC PROPERTY NAMES
    else if (title.includes('grand dunman')) {
      imageUrl = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&h=630&q=80' // Modern development construction
      description = 'Modern Singapore condominium development representing Grand Dunman'
      imageType = 'property-specific'
      relevanceScore = 0.85
    } else if (title.includes('bloomsbury')) {
      imageUrl = 'https://images.unsplash.com/photo-1592898918831-cc7eea4ea57c?w=1200&h=630&q=80' // Modern Singapore condo development
      description = 'Modern Singapore condominium development with contemporary architecture representing Bloomsbury Residences in One-North'
      imageType = 'property-specific'
      relevanceScore = 0.85
    }
    // INVESTMENT/FINANCE CONTENT
    else if (articleCategory.includes('INVESTMENT') || title.includes('investment') || title.includes('roi')) {
      imageUrl = 'https://images.unsplash.com/photo-1567360425618-1594206637d2?w=1200&h=630&q=80' // CBD financial
      description = 'Singapore financial district representing property investment opportunities'
      imageType = 'conceptual'
      relevanceScore = 0.9
    }
    // BUYING GUIDE CONTENT  
    else if (articleCategory.includes('BUYING') || title.includes('buyer') || title.includes('purchase')) {
      imageUrl = 'https://images.unsplash.com/photo-1508964942454-1a56651d54ac?w=1200&h=630&q=80' // Modern Singapore
      description = 'Modern Singapore property development for home buyers'
      imageType = 'conceptual'
      relevanceScore = 0.85
    }
    // MARKET ANALYSIS (default for most content)
    else {
      imageUrl = 'https://images.unsplash.com/photo-1567360425618-1594206637d2?w=1200&h=630&q=80' // Singapore CBD skyline
      description = 'Singapore Marina Bay skyline representing dynamic property market'
      imageType = 'skyline'
      relevanceScore = 0.8
    }
    
    return {
      imageUrl,
      description,
      suggestedCaption: `${description} - Singapore Property Hub`,
      attribution: 'Unsplash',
      alternativeOptions: [
        {
          url: 'https://images.unsplash.com/photo-1648365304143-9aa30adbf8e4?w=1200&h=630&q=80',
          description: 'Singapore HDB void deck community space by Singapore Stock Photos'
        },
        {
          url: 'https://images.unsplash.com/photo-1561037719-6affdd56efb2?w=1200&h=630&q=80',
          description: 'Singapore modern residential towers reflection photography'
        },
        {
          url: 'https://images.unsplash.com/photo-1628127598848-fd9ffec5bc99?w=1200&h=630&q=80',
          description: 'Singapore flag under blue sky by Ahmad Faiz'
        }
      ],
      imageType,
      relevanceScore,
      success: true
    }
  }
  
  extractPropertyName(title: string): string | null {
    // Extract property names from titles
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
    // Extract district numbers from content
    const districtMatch = content.match(/district\s+(\d{1,2})/i)
    if (districtMatch) {
      return parseInt(districtMatch[1])
    }
    return null
  }
}