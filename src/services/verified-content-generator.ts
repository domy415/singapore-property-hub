import { BasicArticleCreator } from './basic-article-creator'
import { ArticleFactChecker } from './article-fact-checker'
import { DistrictArticleCreator } from './district-article-creator'
import { AgentPropertyArticleWriter } from './agent-property-article-writer'
import { AgentPropertyScorer } from './agent-property-scorer'
import { AgentPropertyReportGenerator } from './agent-property-report-generator'
import { AgentLinkedInContentOptimizer } from './agent-linkedin-content-optimizer'
import { AgentPropertyImageFinder } from './agent-property-image-finder'
import { prisma } from '@/lib/prisma'
import { ArticleStatus, ArticleCategory } from '@prisma/client'
import { getContentSuggestions, getTrendingKeywords } from '@/data/content-calendar'

interface GenerationResult {
  article: {
    title: string
    content: string
    excerpt: string
    category: ArticleCategory
    tags: string[]
    seoTitle: string
    seoDescription: string
    seoKeywords: string
    featuredImage?: string
  }
  review: {
    factCheckPassed: boolean
    qualityScore: number
    issues: string[]
    improvements: string[]
  }
  propertyScore?: any // Property scoring data if applicable
  htmlReport?: string // HTML report for email/download
  linkedInPosts?: any // LinkedIn optimization data
  saved: boolean
  articleId?: string
}

export class VerifiedContentGenerator {
  private articleCreator: BasicArticleCreator
  private districtCreator: DistrictArticleCreator
  private factChecker: ArticleFactChecker
  private agentArticleWriter: AgentPropertyArticleWriter
  private agentPropertyScorer: AgentPropertyScorer
  private agentReportGenerator: AgentPropertyReportGenerator
  private agentLinkedInOptimizer: AgentLinkedInContentOptimizer
  private agentImageFinder: AgentPropertyImageFinder
  private useAgents: boolean

  constructor(useAgents: boolean = true) {
    this.articleCreator = new BasicArticleCreator()
    this.districtCreator = new DistrictArticleCreator()
    this.factChecker = new ArticleFactChecker()
    this.agentArticleWriter = new AgentPropertyArticleWriter()
    this.agentPropertyScorer = new AgentPropertyScorer()
    this.agentReportGenerator = new AgentPropertyReportGenerator()
    this.agentLinkedInOptimizer = new AgentLinkedInContentOptimizer()
    this.agentImageFinder = new AgentPropertyImageFinder()
    this.useAgents = useAgents
  }

  async generateVerifiedArticle(
    category?: ArticleCategory,
    useCalendarSuggestions: boolean = true
  ): Promise<GenerationResult> {
    try {
      // Get topic suggestions from calendar if enabled
      let topicHint: string | undefined
      if (useCalendarSuggestions) {
        const suggestions = getContentSuggestions(new Date())
        const keywords = getTrendingKeywords(new Date().getMonth() + 1)
        
        // Pick a random suggestion
        if (suggestions.length > 0) {
          topicHint = suggestions[Math.floor(Math.random() * suggestions.length)]
          console.log('Using calendar suggestion:', topicHint)
        }
      }

      // Determine if this is a condo review topic
      const isCondoReview = category === ArticleCategory.NEW_LAUNCH_REVIEW || 
                          (topicHint && (topicHint.toLowerCase().includes('review') || 
                                       topicHint.toLowerCase().includes('condo') ||
                                       topicHint.toLowerCase().includes('condominium')))
      
      // Multi-agent pipeline
      let propertyScore = undefined
      let initialArticle
      
      // Step 1: Property Scoring (for condo reviews only)
      if (isCondoReview && this.useAgents) {
        try {
          console.log('Step 1: Calling singapore-property-scorer agent...')
          const projectName = this.extractProjectName(topicHint || '')
          if (projectName) {
            propertyScore = await this.agentPropertyScorer.scoreProperty(projectName, topicHint || '', category)
            console.log('Property scoring completed:', propertyScore.overallRating)
          }
        } catch (error) {
          console.warn('Property scorer agent failed:', error)
        }
      }
      
      // Step 2: Article Generation
      if (this.useAgents) {
        try {
          console.log('Step 2: Calling property-article-writer agent...')
          const wordCountReqs = this.agentArticleWriter['getWordCountRequirements'](category || ArticleCategory.MARKET_INSIGHTS)
          const agentResult = await this.agentArticleWriter.generateArticle(
            topicHint || 'Singapore property market insights',
            category || ArticleCategory.MARKET_INSIGHTS,
            wordCountReqs,
            propertyScore ? `Property Score: ${propertyScore.overallRating}/5` : undefined
          )
          
          if (agentResult.success) {
            initialArticle = {
              title: agentResult.title,
              content: agentResult.content,
              excerpt: agentResult.excerpt,
              category: agentResult.category,
              tags: agentResult.tags,
              seoTitle: agentResult.seoTitle,
              seoDescription: agentResult.seoDescription,
              seoKeywords: agentResult.seoKeywords,
              slug: agentResult.slug,
              featuredImage: agentResult.featuredImage
            }
            console.log('Agent article generation successful')
          } else {
            throw new Error(agentResult.error || 'Agent generation failed')
          }
        } catch (error) {
          console.warn('Article writer agent failed, using fallback:', error)
          // Fallback to traditional generation
          initialArticle = await this.generateFallbackArticle(topicHint, category, propertyScore)
        }
      } else {
        // Use traditional generation if agents disabled
        initialArticle = await this.generateFallbackArticle(topicHint, category, propertyScore)
      }
      
      // Step 2.5: Find appropriate image (for all articles)
      if (this.useAgents) {
        try {
          console.log('Step 2.5: Calling singapore-property-image-finder agent...')
          const imageResult = await this.agentImageFinder.findPropertyImage(
            initialArticle.title,
            topicHint || initialArticle.title,
            initialArticle.category,
            {
              propertyName: this.extractProjectName(initialArticle.title) || undefined,
              district: this.extractDistrictFromContent(initialArticle.content)?.toString(),
              conceptType: this.getConceptType(initialArticle.category)
            }
          )
          
          if (imageResult.success) {
            initialArticle.featuredImage = imageResult.imageUrl
            console.log('Image finding successful:', imageResult.imageType)
          } else {
            console.log('Using fallback image:', imageResult.error)
            initialArticle.featuredImage = imageResult.imageUrl // Still use fallback
          }
        } catch (error) {
          console.warn('Image finder agent failed:', error)
          // Keep existing featured image
        }
      }
      
      // Review and fact-check
      console.log('Reviewing article for accuracy...')
      const review = await this.factChecker.reviewArticle(
        initialArticle.title,
        initialArticle.content,
        initialArticle.category
      )
      
      // Use revised content if available, otherwise original
      const finalContent = review.revisedContent || initialArticle.content
      
      // Quick validation of critical facts
      const criticalWarnings = await this.factChecker.validateCriticalFacts(finalContent)
      
      // Determine if article passes quality checks
      const factCheckPassed = review.factCheck.isAccurate && 
                             review.qualityScore >= 80 && 
                             criticalWarnings.length === 0
      
      // Step 4: Generate Report (for all articles)
      let htmlReport = undefined
      if (this.useAgents && factCheckPassed) {
        try {
          console.log('Step 4: Calling singapore-property-report-generator agent...')
          const reportResult = await this.agentReportGenerator.generateArticleReport(
            initialArticle.title,
            finalContent,
            initialArticle.excerpt,
            propertyScore
          )
          
          if (reportResult.success) {
            htmlReport = reportResult.htmlReport
            console.log('Report generation successful')
          }
        } catch (error) {
          console.warn('Report generator agent failed:', error)
        }
      }
      
      // Step 5: LinkedIn Optimization (for all articles)
      let linkedInPosts = undefined
      if (this.useAgents && factCheckPassed) {
        try {
          console.log('Step 5: Calling linkedin-property-content-optimizer agent...')
          const articleUrl = `https://singapore-property-hub.vercel.app/articles/${initialArticle.slug}`
          const linkedInResult = await this.agentLinkedInOptimizer.optimizeForLinkedIn(
            initialArticle.title,
            finalContent,
            articleUrl,
            initialArticle.category,
            propertyScore ? [`Property Rating: ${propertyScore.overallRating}/5`] : undefined
          )
          
          if (linkedInResult.success) {
            linkedInPosts = linkedInResult
            console.log('LinkedIn optimization successful')
          }
        } catch (error) {
          console.warn('LinkedIn optimizer agent failed:', error)
        }
      }
      
      // Only save if quality is good
      let saved = false
      let articleId: string | undefined
      
      if (factCheckPassed) {
        try {
          // Check for existing author
          let author = await prisma.author.findFirst({
            where: { email: 'ai@singaporepropertyhub.sg' }
          })
          
          if (!author) {
            author = await prisma.author.create({
              data: {
                name: 'Property Insights Team',
                email: 'ai@singaporepropertyhub.sg',
                bio: 'Expert analysis and insights from our property research team.'
              }
            })
          }
          
          // Save to database
          const savedArticle = await prisma.article.create({
            data: {
              title: initialArticle.title,
              slug: initialArticle.slug,
              content: finalContent, // Use fact-checked content
              excerpt: initialArticle.excerpt,
              category: initialArticle.category,
              tags: [...initialArticle.tags, ...getTrendingKeywords(new Date().getMonth() + 1)],
              status: ArticleStatus.PUBLISHED,
              featuredImage: initialArticle.featuredImage,
              seoTitle: initialArticle.seoTitle,
              seoDescription: initialArticle.seoDescription,
              seoKeywords: [...initialArticle.seoKeywords.split(','), ...getTrendingKeywords(new Date().getMonth() + 1)],
              authorId: author.id,
              publishedAt: new Date(),
              views: 0,
              linkedInPosted: false
            }
          })
          
          saved = true
          articleId = savedArticle.id
          console.log('Article saved successfully:', savedArticle.id)
        } catch (error) {
          console.error('Error saving article:', error)
        }
      } else {
        console.log('Article did not pass quality checks, not saving.')
        console.log('Quality Score:', review.qualityScore)
        console.log('Issues:', [...review.factCheck.issues, ...criticalWarnings])
      }
      
      return {
        article: {
          ...initialArticle,
          content: finalContent
        },
        review: {
          factCheckPassed,
          qualityScore: review.qualityScore,
          issues: [...review.factCheck.issues, ...criticalWarnings],
          improvements: review.improvements
        },
        propertyScore,
        htmlReport,
        linkedInPosts,
        saved,
        articleId
      }
    } catch (error) {
      console.error('Error generating verified article:', error)
      throw error
    }
  }

  async generateBatchArticles(
    count: number = 5,
    categories?: ArticleCategory[]
  ): Promise<GenerationResult[]> {
    const results: GenerationResult[] = []
    const availableCategories = categories || [
      ArticleCategory.MARKET_INSIGHTS,
      ArticleCategory.INVESTMENT,
      ArticleCategory.BUYING_GUIDE,
      ArticleCategory.SELLING_GUIDE,
      ArticleCategory.NEIGHBORHOOD
    ]
    
    for (let i = 0; i < count; i++) {
      try {
        // Rotate through categories
        const category = availableCategories[i % availableCategories.length]
        
        console.log(`Generating article ${i + 1}/${count} in category: ${category}`)
        const result = await this.generateVerifiedArticle(category, true)
        
        results.push(result)
        
        // Add delay to avoid rate limits
        if (i < count - 1) {
          await new Promise(resolve => setTimeout(resolve, 2000))
        }
      } catch (error) {
        console.error(`Error generating article ${i + 1}:`, error)
      }
    }
    
    // Summary
    const savedCount = results.filter(r => r.saved).length
    const avgQuality = results.reduce((sum, r) => sum + r.review.qualityScore, 0) / results.length
    
    console.log('\n=== Batch Generation Summary ===')
    console.log(`Total articles generated: ${results.length}`)
    console.log(`Articles saved: ${savedCount}`)
    console.log(`Average quality score: ${avgQuality.toFixed(1)}`)
    console.log(`Failed quality checks: ${results.length - savedCount}`)
    
    return results
  }
  
  private extractProjectName(topic: string): string | null {
    // Extract condo/project names from topics like "Grand Dunman Review" or "Review: Marina One Residences"
    const reviewPattern = /(?:review|analysis|overview)\s*:?\s*(.+?)(?:\s*review|\s*analysis|\s*condo|\s*condominium)?$/i
    const match = topic.match(reviewPattern)
    
    if (match && match[1]) {
      return match[1].trim()
    }
    
    // Check for direct condo names
    const condoNames = [
      'Grand Dunman', 'Lentor Mansion', 'Orchard Sophia', 
      'Avenue South Residence', 'Normanton Park', 'Marina One Residences',
      'The Watergardens', 'Parc Central Residences', 'The Landmark'
    ]
    
    for (const name of condoNames) {
      if (topic.toLowerCase().includes(name.toLowerCase())) {
        return name
      }
    }
    
    return null
  }
  
  private async generateFallbackArticle(
    topicHint: string | undefined,
    category: ArticleCategory | undefined,
    propertyScore?: any
  ): Promise<any> {
    // Check if this is a district/neighborhood topic
    const isDistrictTopic = topicHint && (
      topicHint.toLowerCase().includes('district') ||
      topicHint.toLowerCase().includes('neighborhood') ||
      topicHint.toLowerCase().includes('neighbourhood')
    )
    
    let article
    
    if (isDistrictTopic) {
      console.log('Using district article creator for fallback')
      article = await this.districtCreator.generateDistrictArticle(topicHint)
    } else {
      console.log('Using basic article creator for fallback')
      article = await this.articleCreator.generateArticle(category, topicHint)
    }
    
    // If we have property score data, integrate it into the content
    if (propertyScore && propertyScore.fullArticleContent) {
      article.content = propertyScore.fullArticleContent
    }
    
    // Ensure featuredImage is set
    if (!article.featuredImage) {
      article.featuredImage = 'singapore-skyline-property'
    }
    
    return article
  }
  
  private extractDistrictFromContent(content: string): number | undefined {
    // Extract district numbers from content
    const districtMatch = content.match(/district\s+(\d{1,2})/i)
    if (districtMatch) {
      return parseInt(districtMatch[1])
    }
    return undefined
  }
  
  private getConceptType(category: ArticleCategory): 'finance' | 'market' | 'regulation' | 'lifestyle' | undefined {
    switch (category) {
      case ArticleCategory.INVESTMENT:
        return 'finance'
      case ArticleCategory.MARKET_INSIGHTS:
        return 'market'
      case ArticleCategory.PROPERTY_NEWS:
        return 'regulation'
      case ArticleCategory.NEIGHBORHOOD:
      case ArticleCategory.LOCATION_GUIDE:
        return 'lifestyle'
      default:
        return undefined
    }
  }
}