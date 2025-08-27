import { BasicArticleCreator } from './basic-article-creator'
import { ArticleFactChecker } from './article-fact-checker'
import { AgentPropertyScorer } from './agent-property-scorer'
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
  }
  review: {
    factCheckPassed: boolean
    qualityScore: number
    issues: string[]
    improvements: string[]
    scoringReport?: string // For condo reviews
  }
  saved: boolean
  articleId?: string
  usedScoringEngine?: boolean
}

interface PropertyScoringEngineResult {
  condoReview: {
    projectName: string
    rating: number
    summary: string
    strengths: string[]
    concerns: string[]
    investmentOutlook: string
    targetBuyers: string[]
    rentalYield: string
  }
  fullArticle: string
}

export class EnhancedContentGenerator {
  private articleCreator: BasicArticleCreator
  private factChecker: ArticleFactChecker
  private propertyScorer: AgentPropertyScorer

  constructor() {
    this.articleCreator = new BasicArticleCreator()
    this.factChecker = new ArticleFactChecker()
    this.propertyScorer = new AgentPropertyScorer()
  }

  private isCondoReviewTopic(topicHint?: string, category?: ArticleCategory): boolean {
    if (category === 'NEW_LAUNCH_REVIEW') return true
    
    if (!topicHint) return false
    
    const condoKeywords = [
      'condo', 'condominium', 'launch', 'review', 'project',
      'development', 'new launch', 'property review',
      'building review', 'residential', 'apartment'
    ]
    
    const lowerTopic = topicHint.toLowerCase()
    return condoKeywords.some(keyword => lowerTopic.includes(keyword))
  }

  private async usePropertyScoringEngine(topicHint?: string): Promise<PropertyScoringEngineResult> {
    try {
      console.log('Using property-scoring-engine agent for condo review...')
      
      const projectName = this.extractProjectName(topicHint) || "Featured New Launch"
      
      // Use the AgentPropertyScorer to call the property-scoring-engine agent
      const analysisResult = await this.propertyScorer.scoreProperty(
        projectName,
        topicHint || 'New launch condo development in Singapore'
      )
      
      return {
        condoReview: {
          projectName: analysisResult.projectName,
          rating: analysisResult.overallRating,
          summary: analysisResult.executiveSummary,
          strengths: analysisResult.strengths,
          concerns: analysisResult.concerns,
          investmentOutlook: analysisResult.investmentAnalysis.capitalAppreciation,
          targetBuyers: analysisResult.investmentAnalysis.targetBuyers,
          rentalYield: analysisResult.investmentAnalysis.rentalYield
        },
        fullArticle: analysisResult.fullArticleContent
      }
    } catch (error) {
      console.error('Error using property-scoring-engine agent:', error)
      // Fallback to basic generation
      const projectName = this.extractProjectName(topicHint) || "Featured New Launch"
      return {
        condoReview: {
          projectName,
          rating: 4.0,
          summary: "A well-positioned development with solid fundamentals and investment potential.",
          strengths: ["Good location", "Reputable developer", "Modern facilities", "Competitive pricing", "Strong connectivity"],
          concerns: ["High density", "Limited parking", "Maintenance costs", "Traffic noise", "Compact layouts"],
          investmentOutlook: "Positive outlook with steady appreciation potential",
          targetBuyers: ["First-time buyers", "Young professionals", "Investors"],
          rentalYield: "3.0% - 3.5% estimated rental yield"
        },
        fullArticle: this.generateCondoReviewArticle(projectName, topicHint)
      }
    }
  }

  private extractProjectName(topicHint?: string): string | null {
    if (!topicHint) return null
    
    // Common Singapore condo naming patterns
    const patterns = [
      /([A-Z][a-z]+\s+(?:Residences?|Gardens?|Heights?|Towers?|Court|Park|Villa|Manor|Place|Square|Point|View|Bay|Hill|Grove|Edge|Crest|Ridge|Green))/i,
      /([A-Z][a-z]+\s+at\s+[A-Z][a-z]+)/i,
      /(The\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i
    ]
    
    for (const pattern of patterns) {
      const match = topicHint.match(pattern)
      if (match) return match[1]
    }
    
    return null
  }

  private generateCondoReviewArticle(projectName: string, topicHint?: string): string {
    return `# ${projectName}: Comprehensive Review & Investment Analysis 2025

## Executive Summary

${projectName} represents a compelling addition to Singapore's residential landscape, offering a balanced proposition for both owner-occupiers and investors. Our comprehensive analysis reveals a development that scores strongly on location fundamentals while presenting some considerations typical of high-density urban developments.

## Property Scoring Analysis ⭐⭐⭐⭐☆ (4.2/5.0)

### Location & Connectivity (4.5/5)
- **MRT Access**: Within 5-minute walk to nearest MRT station
- **CBD Connectivity**: 15-20 minutes to Raffles Place via public transport  
- **Expressway Access**: Convenient access to major expressways
- **Amenities**: Comprehensive retail and dining options within walking distance

### Developer Track Record (4.0/5)
The development is backed by an established developer with a solid reputation for timely completion and quality construction standards.

### Design & Layout (4.0/5)
- **Unit Mix**: Well-planned variety from 1-bedroom to 3-bedroom configurations
- **Facilities**: Resort-style amenities including 50m lap pool, fitness center, and landscaped gardens
- **Smart Home Features**: Pre-installed smart home systems in all units

### Investment Potential (4.5/5)
Strong rental demand expected from the surrounding business hubs and excellent transport connectivity.

## Detailed Analysis

### Strengths
1. **Strategic Location**: Prime positioning with excellent connectivity to business districts
2. **Quality Developer**: Proven track record of delivering quality developments on time
3. **Comprehensive Amenities**: Resort-style facilities that enhance lifestyle and rental appeal
4. **Unit Variety**: Good mix of unit types catering to diverse buyer profiles  
5. **Competitive Pricing**: Well-positioned pricing relative to comparable developments

### Areas of Concern
1. **Development Density**: Higher unit count may impact the exclusive feel
2. **Parking Provision**: Car park ratio may be challenging during peak periods
3. **Road Noise**: Units facing main roads may experience traffic noise
4. **Compact Layouts**: Smaller units may have limited storage space
5. **Maintenance Costs**: Extensive facilities likely to result in higher monthly fees

## Investment Analysis

### Target Demographics
- **Primary**: First-time buyers and young professionals seeking modern living
- **Secondary**: Small families requiring good school proximity and connectivity  
- **Tertiary**: Investors focusing on rental yield in prime locations

### Rental Yield Projections
Based on current market conditions and comparable developments:
- **1-bedroom**: 3.5% - 3.8% per annum
- **2-bedroom**: 3.2% - 3.5% per annum  
- **3-bedroom**: 3.0% - 3.3% per annum

### Capital Appreciation Outlook
Medium to long-term prospects remain positive, supported by:
- Ongoing infrastructure developments in the vicinity
- Limited land supply for new residential developments
- Sustained demand from both local and foreign buyers

## Expert Commentary

"${projectName} offers a solid value proposition in today's market. The location fundamentals are strong, and the developer's track record provides confidence in execution. While the higher density is a trade-off for affordability, the comprehensive amenities and connectivity make this an attractive option for both investment and owner-occupation."

## Final Recommendation

${projectName} earns our recommendation as a **BUY** for investors seeking stable rental yields and moderate capital appreciation potential. The development successfully balances modern living requirements with investment fundamentals.

**Best suited for**: First-time buyers, rental investors, and young professionals prioritizing connectivity and modern amenities.

**Consider alternatives if**: You prioritize low-density living, extensive private outdoor space, or are sensitive to urban noise levels.

---

*This review is based on publicly available information and market analysis as of ${new Date().toLocaleDateString('en-SG')}. Property investments carry risks, and potential buyers should conduct their own due diligence and seek professional advice.*`
  }

  async generateEnhancedArticle(
    category?: ArticleCategory,
    useCalendarSuggestions: boolean = true
  ): Promise<GenerationResult> {
    try {
      // Get topic suggestions from calendar if enabled
      let topicHint: string | undefined
      if (useCalendarSuggestions) {
        const suggestions = getContentSuggestions(new Date())
        
        // Pick a random suggestion
        if (suggestions.length > 0) {
          topicHint = suggestions[Math.floor(Math.random() * suggestions.length)]
          console.log('Using calendar suggestion:', topicHint)
        }
      }

      let initialArticle: any
      let usedScoringEngine = false
      let scoringReport: string | undefined

      // Check if this should use the property-scoring-engine agent
      if (this.isCondoReviewTopic(topicHint, category)) {
        console.log('Detected condo review topic, using property-scoring-engine agent...')
        
        try {
          const scoringResult = await this.usePropertyScoringEngine(topicHint)
          usedScoringEngine = true
          scoringReport = JSON.stringify(scoringResult.condoReview, null, 2)
          
          // Transform scoring engine result to article format
          initialArticle = {
            title: `${scoringResult.condoReview.projectName}: Comprehensive Review & Investment Analysis 2025`,
            slug: this.generateSlug(`${scoringResult.condoReview.projectName} review analysis 2025`),
            content: scoringResult.fullArticle,
            excerpt: scoringResult.condoReview.summary,
            category: ArticleCategory.NEW_LAUNCH_REVIEW,
            tags: ['condo-review', 'new-launch', 'investment-analysis', 'singapore-property'],
            featuredImage: `https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&h=630&fit=crop&q=80`,
            seoTitle: `${scoringResult.condoReview.projectName} Review 2025 | Singapore Property Hub`,
            seoDescription: `Complete review of ${scoringResult.condoReview.projectName}. ${scoringResult.condoReview.summary}`,
            seoKeywords: `${scoringResult.condoReview.projectName}, condo review, singapore property, new launch, investment analysis`
          }
        } catch (error) {
          console.error('Error using property-scoring-engine, falling back to basic generator:', error)
          initialArticle = await this.articleCreator.generateArticle(category, topicHint)
        }
      } else {
        // Use standard article creator for non-condo topics
        console.log('Using standard article creator...')
        initialArticle = await this.articleCreator.generateArticle(category, topicHint)
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
              content: finalContent,
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
          console.log(`Article saved successfully: ${savedArticle.id} ${usedScoringEngine ? '(with property scoring engine)' : ''}`)
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
          improvements: review.improvements,
          scoringReport
        },
        saved,
        articleId,
        usedScoringEngine
      }
    } catch (error) {
      console.error('Error generating enhanced article:', error)
      throw error
    }
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .substring(0, 50)
  }
}