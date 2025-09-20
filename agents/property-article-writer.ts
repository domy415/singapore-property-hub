/**
 * Property Article Writer Agent - Primary content generation agent wrapper
 * This service interfaces with the property-article-writer agent via Task tool
 */

import { ArticleCategory } from '@prisma/client'

interface ArticleGenerationResult {
  title: string
  content: string
  excerpt: string
  category: ArticleCategory
  tags: string[]
  seoTitle: string
  seoDescription: string
  seoKeywords: string[]
  featuredImage: string
  slug: string
  wordCount: number
  success: boolean
  error?: string
}

export class AgentPropertyArticleWriter {
  
  async generateArticle(
    topic: string,
    category: ArticleCategory,
    wordCountTarget: { min: number; max: number },
    additionalContext?: string
  ): Promise<ArticleGenerationResult> {
    try {
      console.log(`Calling property-article-writer agent for topic: ${topic}`)
      
      // Prepare the prompt with word count requirements based on article type
      const agentPrompt = this.buildArticleWritingPrompt(topic, category, wordCountTarget, additionalContext)
      
      // Call the article writing agent using Task tool
      try {
        const agentResult = await this.callArticleWriterAgent(agentPrompt)
        return this.parseAgentResponse(agentResult, topic, category)
      } catch (agentError) {
        console.warn('Article writer agent call failed, using fallback generation:', agentError)
        // Return fallback result
        return this.generateFallbackArticle(topic, category, wordCountTarget)
      }
      
    } catch (error) {
      console.error('Error in article generation:', error)
      throw new Error(`Article generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
  
  private getWordCountRequirements(category: ArticleCategory): { min: number; max: number } {
    switch (category) {
      case ArticleCategory.NEW_LAUNCH_REVIEW:
        return { min: 800, max: 1000 }
      case ArticleCategory.MARKET_INSIGHTS:
        return { min: 600, max: 800 }
      case ArticleCategory.NEIGHBORHOOD:
      case ArticleCategory.LOCATION_GUIDE:
        return { min: 700, max: 900 }
      case ArticleCategory.PROPERTY_NEWS:
        return { min: 400, max: 600 }
      case ArticleCategory.BUYING_GUIDE:
      case ArticleCategory.SELLING_GUIDE:
        return { min: 800, max: 1200 }
      case ArticleCategory.INVESTMENT:
        return { min: 700, max: 900 }
      default:
        return { min: 600, max: 800 }
    }
  }
  
  private buildArticleWritingPrompt(
    topic: string,
    category: ArticleCategory,
    wordCount: { min: number; max: number },
    additionalContext?: string
  ): string {
    const currentDate = new Date().toLocaleDateString('en-SG', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
    
    const categoryInstructions = this.getCategorySpecificInstructions(category)
    
    return `
# Property Article Generation Request

## Article Parameters
- **Topic**: ${topic}
- **Category**: ${category}
- **Word Count**: ${wordCount.min}-${wordCount.max} words
- **Date Context**: ${currentDate}
${additionalContext ? `- **Additional Context**: ${additionalContext}` : ''}

## Category-Specific Requirements
${categoryInstructions}

## Core Writing Requirements

As property-article-writer agent, create a comprehensive Singapore property article following these specifications:

### Content Structure
1. **Compelling Title**: SEO-optimized, incorporating the topic naturally
2. **Strong Introduction**: Hook with current market insight or compelling statistic
3. **Well-Structured Body**: 
   - Clear H2 subheadings for each major section
   - Data-driven analysis with 2025 market statistics
   - Real Singapore property examples
   - Expert insights and actionable recommendations
4. **Forward-Looking Conclusion**: Market outlook (NO "In conclusion" phrases)

### Writing Style
- **Voice**: Professional like Business Times property section
- **Tone**: Authoritative yet accessible
- **Perspective**: Seasoned Singapore property expert with insider knowledge
- **Language**: Clear, concise, avoiding AI-like patterns

### SEO Optimization
- **Primary Keywords**: Natural integration throughout
- **LSI Keywords**: Related Singapore property terms
- **Meta Title**: 50-60 characters, compelling
- **Meta Description**: 150-160 characters, action-oriented
- **URL Slug**: Clean, keyword-rich, lowercase with hyphens

### Singapore Market Specifics
- Current ABSD rates and cooling measures
- Accurate district numbers and MRT stations
- Real condo names and neighborhoods
- Q3/Q4 2025 market data
- Local regulations and policies

### Required Output
Return a JSON object with:
- title: Article headline
- content: Full article in markdown format
- excerpt: 150-200 character summary
- tags: 5-8 relevant tags
- seoTitle: Optimized title
- seoDescription: Meta description
- seoKeywords: Array of primary keywords
- featuredImage: Suggested image description
- slug: URL-friendly slug
- wordCount: Actual word count

Remember: Write for sophisticated Singapore property enthusiasts who expect expert-level insights and actionable intelligence.`
  }
  
  private getCategorySpecificInstructions(category: ArticleCategory): string {
    switch (category) {
      case ArticleCategory.NEW_LAUNCH_REVIEW:
        return `
### Project Review Requirements (800-1000 words)
- Cover all 5 scoring criteria: location, developer, amenities, investment, value
- Include sections: Overview, Location Analysis, Unit Mix, Pricing, Pros/Cons, Investment Outlook
- Provide comprehensive buyer-focused analysis
- Reference nearby amenities and transport options`
        
      case ArticleCategory.MARKET_INSIGHTS:
        return `
### Market Analysis Requirements (600-800 words)
- Include relevant statistics and data trends
- Provide professional-level insights
- Structure for LinkedIn shareability
- Focus on actionable market intelligence`
        
      case ArticleCategory.NEIGHBORHOOD:
        return `
### Location Guide Requirements (700-900 words)
- Cover transport, amenities, schools, lifestyle
- Include specific neighborhood details
- Optimize for local SEO keywords
- Provide genuine utility for property seekers`
        
      case ArticleCategory.PROPERTY_NEWS:
        return `
### Property News Requirements (400-600 words)
- Deliver key facts quickly and clearly
- Focus on immediate impact
- Make breaking news digestible
- Ensure sufficient depth for SEO value`
        
      default:
        return `
### General Article Requirements
- Provide thorough, valuable content
- Include actionable insights
- Focus on reader utility
- Maintain professional standards`
    }
  }
  
  private async callArticleWriterAgent(prompt: string): Promise<string> {
    // This method would use Claude's Task tool to call the property-article-writer agent
    // For now, throwing error to trigger fallback
    throw new Error('Property article writer agent ready for Task tool integration')
  }

  private parseAgentResponse(agentResult: string, topic: string, category: ArticleCategory): ArticleGenerationResult {
    try {
      const parsed = JSON.parse(agentResult)
      
      return {
        title: parsed.title || `Expert Analysis: ${topic}`,
        content: parsed.content || '',
        excerpt: parsed.excerpt || '',
        category: category,
        tags: parsed.tags || [],
        seoTitle: parsed.seoTitle || parsed.title,
        seoDescription: parsed.seoDescription || parsed.excerpt,
        seoKeywords: parsed.seoKeywords || [],
        featuredImage: parsed.featuredImage || 'modern-singapore-condo-development',
        slug: parsed.slug || this.generateSlug(parsed.title || topic),
        wordCount: parsed.wordCount || 0,
        success: true
      }
    } catch (error) {
      throw new Error(`Failed to parse agent response: ${error instanceof Error ? error.message : 'Invalid format'}`)
    }
  }
  
  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }
  
  private generateFallbackArticle(
    topic: string,
    category: ArticleCategory,
    wordCount: { min: number; max: number }
  ): ArticleGenerationResult {
    // Fallback article generation
    const title = `${topic}: Expert Singapore Property Analysis`
    const slug = this.generateSlug(title)
    
    return {
      title,
      content: `# ${title}\n\n*Note: Article generation service temporarily unavailable. Please try again later.*`,
      excerpt: `Expert analysis on ${topic} in Singapore's property market.`,
      category,
      tags: ['singapore-property', category.toLowerCase().replace(/_/g, '-')],
      seoTitle: title,
      seoDescription: `Comprehensive analysis of ${topic} for Singapore property buyers and investors.`,
      seoKeywords: ['singapore property', topic.toLowerCase(), 'property analysis'],
      featuredImage: 'singapore-skyline-property',
      slug,
      wordCount: 50,
      success: false,
      error: 'Agent unavailable - fallback content generated'
    }
  }
}