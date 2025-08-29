/**
 * Singapore Property Image Finder Agent - Finds contextually relevant property images
 * This service interfaces with the singapore-property-image-finder agent via Task tool
 */

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
      console.log(`Calling singapore-property-image-finder agent for: ${articleTitle}`)
      
      // Prepare the detailed prompt for the image finder agent
      const agentPrompt = this.buildImageSearchPrompt(
        articleTitle,
        articleTopic,
        articleCategory,
        specificRequirements
      )
      
      // Call the image finder agent using Task tool
      try {
        const agentResult = await this.callImageFinderAgent(agentPrompt)
        return this.parseAgentResponse(agentResult)
      } catch (agentError) {
        console.warn('Image finder agent call failed, using fallback selection:', agentError)
        // Return fallback image
        return this.selectFallbackImage(articleTitle, articleCategory, specificRequirements)
      }
      
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
  
  private async callImageFinderAgent(prompt: string): Promise<string> {
    // This method would use Claude's Task tool to call the singapore-property-image-finder agent
    // For now, throwing error to trigger fallback
    throw new Error('Property image finder agent ready for Task tool integration')
  }

  private parseAgentResponse(agentResult: string): ImageSearchResult {
    try {
      const parsed = JSON.parse(agentResult)
      
      return {
        imageUrl: parsed.imageUrl || '',
        description: parsed.description || '',
        suggestedCaption: parsed.suggestedCaption || '',
        attribution: parsed.attribution,
        alternativeOptions: parsed.alternativeOptions || [],
        imageType: parsed.imageType || 'skyline',
        relevanceScore: parsed.relevanceScore || 0.8,
        success: true
      }
    } catch (error) {
      throw new Error(`Failed to parse agent response: ${error instanceof Error ? error.message : 'Invalid format'}`)
    }
  }
  
  private selectFallbackImage(
    articleTitle: string,
    articleCategory: string,
    requirements?: any
  ): ImageSearchResult {
    // Fallback image selection using agent-recommended high-quality images
    let imageUrl = ''
    let description = ''
    let imageType: any = 'skyline'
    
    // Check for specific property names with actual property images
    const propertyKeywords = [
      { name: 'The Sail', image: 'photo-ugr4n5X4YjI', desc: 'The Sail at Marina Bay' },
      { name: 'Marina One', image: 'photo-IRhO5KF0YVc', desc: 'Marina One Residences area' },
      { name: 'Grand Dunman', image: 'photo-kNzqXxlvmE4', desc: 'Modern condo development similar to Grand Dunman' },
      { name: 'Lentor', image: 'photo-zIp4YexPPhQ', desc: 'Singapore residential development' }
    ]
    
    const matchedProperty = propertyKeywords.find(p => 
      articleTitle.toLowerCase().includes(p.name.toLowerCase())
    )
    
    if (matchedProperty) {
      imageUrl = `https://images.unsplash.com/${matchedProperty.image}?w=1200&h=630&q=80`
      description = matchedProperty.desc
      imageType = 'property-specific'
    } else if (requirements?.district || requirements?.neighborhood) {
      // District/neighborhood - use authentic HDB image
      imageUrl = 'https://images.unsplash.com/photo-zIp4YexPPhQ?w=1200&h=630&q=80' // Authentic HDB by Danist Soh
      description = `Singapore ${requirements.neighborhood || `District ${requirements.district}`} residential area`
      imageType = requirements.neighborhood ? 'neighborhood' : 'district'
    } else if (articleCategory.includes('INVESTMENT') || requirements?.conceptType === 'finance') {
      // Financial/investment - use Singapore CBD imagery
      imageUrl = 'https://images.unsplash.com/photo-1567360425618-1594206637d2?w=1200&h=630&q=80'
      description = 'Singapore Central Business District representing property investment opportunities'
      imageType = 'conceptual'
    } else {
      // Default - premium Marina Bay skyline
      imageUrl = 'https://images.unsplash.com/photo-ugr4n5X4YjI?w=1200&h=630&q=80' // Agent recommended premium image
      description = 'Singapore Marina Bay skyline showcasing the dynamic property landscape'
      imageType = 'skyline'
    }
    
    return {
      imageUrl,
      description,
      suggestedCaption: `${description} - Singapore Property Hub`,
      attribution: 'Unsplash',
      alternativeOptions: [
        {
          url: 'https://images.unsplash.com/photo-1565967511849-76a60a516170?w=1200&h=630&q=80',
          description: 'Singapore CBD skyline alternative view'
        },
        {
          url: 'https://images.unsplash.com/photo-1508964942454-1a56651d54ac?w=1200&h=630&q=80',
          description: 'Singapore Marina Bay Sands and cityscape'
        }
      ],
      imageType,
      relevanceScore: 0.7,
      success: false,
      error: 'Agent unavailable - fallback image selected'
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