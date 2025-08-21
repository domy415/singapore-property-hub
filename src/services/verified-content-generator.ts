import { BasicArticleCreator } from './basic-article-creator'
import { ArticleFactChecker } from './article-fact-checker'
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
  }
  saved: boolean
  articleId?: string
}

export class VerifiedContentGenerator {
  private articleCreator: BasicArticleCreator
  private factChecker: ArticleFactChecker

  constructor() {
    this.articleCreator = new BasicArticleCreator()
    this.factChecker = new ArticleFactChecker()
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

      // Generate initial article
      console.log('Generating initial article...')
      const initialArticle = await this.articleCreator.generateArticle(category, topicHint)
      
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
}