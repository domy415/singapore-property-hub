/**
 * LinkedIn Property Content Optimizer Agent - Social media optimization agent wrapper
 * This service interfaces with the linkedin-property-content-optimizer agent via Task tool
 */

interface LinkedInPost {
  content: string
  hashtags: string[]
  postType: 'main' | 'follow-up' | 'series'
  scheduledDate?: Date
  engagementHook: string
  callToAction: string
}

interface LinkedInOptimizationResult {
  posts: LinkedInPost[]
  postingSchedule: Array<{
    day: number
    time: string
    postIndex: number
  }>
  campaignStrategy: string
  expectedEngagementRate: string
  success: boolean
  error?: string
}

export class AgentLinkedInContentOptimizer {
  
  async optimizeForLinkedIn(
    articleTitle: string,
    articleContent: string,
    articleUrl: string,
    articleCategory: string,
    keyInsights?: string[]
  ): Promise<LinkedInOptimizationResult> {
    try {
      console.log(`Calling linkedin-property-content-optimizer agent for: ${articleTitle}`)
      
      // Prepare the detailed prompt for the LinkedIn optimizer agent
      const agentPrompt = this.buildLinkedInOptimizationPrompt(
        articleTitle,
        articleContent,
        articleUrl,
        articleCategory,
        keyInsights
      )
      
      // Call the LinkedIn optimizer agent using Task tool
      try {
        const agentResult = await this.callLinkedInOptimizerAgent(agentPrompt)
        return this.parseAgentResponse(agentResult)
      } catch (agentError) {
        console.warn('LinkedIn optimizer agent call failed, using fallback generation:', agentError)
        // Return fallback LinkedIn content
        return this.generateFallbackLinkedInContent(articleTitle, articleUrl, articleCategory)
      }
      
    } catch (error) {
      console.error('Error in LinkedIn optimization:', error)
      throw new Error(`LinkedIn optimization failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
  
  private buildLinkedInOptimizationPrompt(
    articleTitle: string,
    articleContent: string,
    articleUrl: string,
    articleCategory: string,
    keyInsights?: string[]
  ): string {
    const contentPreview = articleContent.substring(0, 1000) + '...'
    
    return `
# LinkedIn Content Optimization Request

## Article Information
- **Title**: ${articleTitle}
- **Category**: ${articleCategory}
- **URL**: ${articleUrl}
- **Key Insights**: ${keyInsights ? keyInsights.join(', ') : 'To be extracted from content'}

## Article Content Preview
${contentPreview}

## Optimization Requirements

As the linkedin-property-content-optimizer agent, create a strategic LinkedIn post series following these specifications:

### Post Series Strategy
Based on the article category (${articleCategory}), create the appropriate post series:

${this.getCategorySpecificStrategy(articleCategory)}

### Character Limits & Structure
- **Total post**: Maximum 1,300 characters
- **Hook (first 2 lines)**: Maximum 125 characters for preview optimization
- **Main content**: 800-1,000 characters
- **Call-to-action**: 100-150 characters
- **Hashtags**: Maximum 150 characters

### Engagement Optimization
1. Start with relevant emoji or symbol
2. Include specific numbers (ratings, percentages, prices)
3. Use action words: 'Discovered,' 'Revealed,' 'Analyzed'
4. Create urgency: 'Just reviewed,' 'Latest findings'
5. Ask subtle questions to encourage comments

### Hashtag Requirements
- Always include: #SingaporeProperty
- Category-specific: ${this.getCategoryHashtag(articleCategory)}
- Add 2-3 location or topic-specific tags
- Research trending Singapore property hashtags

### Expected Output
Return a JSON object with:
- posts: Array of post objects with content, hashtags, type
- postingSchedule: Optimal days and times for each post
- campaignStrategy: Brief explanation of the approach
- expectedEngagementRate: Target engagement percentage

### Performance Targets
- Engagement rate: 3-5% average
- Click-through rate: 2-3% to website
- Generate meaningful discussions
- Position as thought leader

Remember: Each post must balance information with intrigue, driving traffic back to the full article while establishing authority in Singapore property market.`
  }
  
  private getCategorySpecificStrategy(category: string): string {
    const strategies: Record<string, string> = {
      'NEW_LAUNCH_REVIEW': `
**Condo Review Series (3 posts over 5 days)**
- Day 1: Overall Review with star rating and key highlights
- Day 3: Location Deep Dive with transport and amenity details
- Day 5: Investment Analysis with rental yields and buyer recommendations`,
      
      'MARKET_INSIGHTS': `
**Market Insights Series (3 posts over 5 days)**
- Day 1: Key Insight or market change announcement
- Day 3: Data Analysis with statistics and trends
- Day 5: Expert Prediction and actionable advice`,
      
      'NEIGHBORHOOD': `
**Location Guide Series (2 posts over 3 days)**
- Day 1: Neighborhood Spotlight with lifestyle benefits
- Day 3: Investment Potential and property recommendations`,
      
      'PROPERTY_NEWS': `
**Property News Series (2 posts same day)**
- Morning: Breaking news announcement with key highlights
- Afternoon: Detailed impact analysis and market implications`,
      
      'LOCATION_GUIDE': `
**Location Guide Series (2 posts over 3 days)**
- Day 1: Area highlights and lifestyle benefits  
- Day 3: Property recommendations and investment tips`,
      
      default: `
**Standard Series (2 posts over 3 days)**
- Day 1: Main insights and key takeaways
- Day 3: Deep dive into implications and recommendations`
    }
    
    return strategies[category] || strategies.default
  }
  
  private getCategoryHashtag(category: string): string {
    const hashtags: Record<string, string> = {
      'NEW_LAUNCH_REVIEW': '#PropertyReview',
      'MARKET_INSIGHTS': '#MarketUpdate',
      'NEIGHBORHOOD': '#LocationGuide',
      'PROPERTY_NEWS': '#PropertyNews',
      'LOCATION_GUIDE': '#LocationGuide',
      'INVESTMENT': '#PropertyInvestment',
      'BUYING_GUIDE': '#BuyersGuide',
      'SELLING_GUIDE': '#SellersGuide'
    }
    
    return hashtags[category] || '#PropertyInsights'
  }
  
  private async callLinkedInOptimizerAgent(prompt: string): Promise<string> {
    // This method would use Claude's Task tool to call the linkedin-property-content-optimizer agent
    // For now, throwing error to trigger fallback
    throw new Error('LinkedIn content optimizer agent ready for Task tool integration')
  }

  private parseAgentResponse(agentResult: string): LinkedInOptimizationResult {
    try {
      const parsed = JSON.parse(agentResult)
      
      return {
        posts: parsed.posts || [],
        postingSchedule: parsed.postingSchedule || [],
        campaignStrategy: parsed.campaignStrategy || '',
        expectedEngagementRate: parsed.expectedEngagementRate || '3-5%',
        success: true
      }
    } catch (error) {
      throw new Error(`Failed to parse agent response: ${error instanceof Error ? error.message : 'Invalid format'}`)
    }
  }
  
  private generateFallbackLinkedInContent(
    articleTitle: string,
    articleUrl: string,
    category: string
  ): LinkedInOptimizationResult {
    // Generate basic LinkedIn content as fallback
    const mainPost: LinkedInPost = {
      content: `🏢 ${articleTitle}

Discover our latest analysis on Singapore's property market. This comprehensive guide provides valuable insights for property buyers and investors.

Key highlights:
• Market trends and analysis
• Expert recommendations
• Investment opportunities

Read the full article for detailed insights that can shape your property decisions.

${articleUrl}`,
      hashtags: ['#SingaporeProperty', this.getCategoryHashtag(category), '#PropertyInvestment', '#RealEstate'],
      postType: 'main',
      engagementHook: `🏢 ${articleTitle}`,
      callToAction: 'Read the full article for detailed insights'
    }
    
    return {
      posts: [mainPost],
      postingSchedule: [{
        day: 0,
        time: '09:00',
        postIndex: 0
      }],
      campaignStrategy: 'Single post strategy due to service unavailability',
      expectedEngagementRate: '2-3%',
      success: false,
      error: 'Agent unavailable - fallback content generated'
    }
  }
  
  formatPostForAPI(post: LinkedInPost): string {
    // Format the post for LinkedIn API submission
    const hashtagString = post.hashtags.map(tag => tag.startsWith('#') ? tag : `#${tag}`).join(' ')
    return `${post.content}\n\n${hashtagString}`
  }
  
  getOptimalPostingTime(dayOffset: number = 0): Date {
    const postDate = new Date()
    postDate.setDate(postDate.getDate() + dayOffset)
    
    // Set to 9 AM SGT (optimal posting time)
    postDate.setHours(9, 0, 0, 0)
    
    // Adjust for weekends - move to next Monday
    if (postDate.getDay() === 0) postDate.setDate(postDate.getDate() + 1) // Sunday -> Monday
    if (postDate.getDay() === 6) postDate.setDate(postDate.getDate() + 2) // Saturday -> Monday
    
    return postDate
  }
}