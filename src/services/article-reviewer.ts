import OpenAI from 'openai'
import { PrismaClient, ArticleStatus } from '@prisma/client'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const prisma = new PrismaClient()

interface ReviewCriteria {
  factualAccuracy: boolean
  seoOptimization: boolean
  readability: boolean
  singaporeContext: boolean
  suggestions: string[]
  score: number
}

export class ArticleReviewer {
  async reviewArticle(articleId: string): Promise<ReviewCriteria> {
    const article = await prisma.article.findUnique({
      where: { id: articleId }
    })
    
    if (!article) {
      throw new Error('Article not found')
    }
    
    const review = await this.performReview(article)
    
    if (review.score >= 85) {
      await this.approveArticle(articleId)
    } else {
      await this.requestRevisions(articleId, review)
    }
    
    return review
  }
  
  private async performReview(article: any): Promise<ReviewCriteria> {
    const prompt = `You are an expert content reviewer for Singapore property articles. Review the following article and provide detailed feedback.

Title: ${article.title}
Content: ${article.content}
Keywords: ${article.seoKeywords.join(', ')}

Evaluate the article based on:
1. Factual Accuracy - Are all Singapore property facts, laws, and figures accurate and up-to-date?
2. SEO Optimization - Is the article well-optimized for the target keywords without keyword stuffing?
3. Readability - Is the content engaging, well-structured, and easy to understand?
4. Singapore Context - Does it properly reflect Singapore's property market, culture, and regulations?

Provide your review in JSON format:
{
  "factualAccuracy": true/false,
  "seoOptimization": true/false,
  "readability": true/false,
  "singaporeContext": true/false,
  "suggestions": ["suggestion1", "suggestion2"],
  "score": 0-100,
  "detailedFeedback": {
    "strengths": ["strength1", "strength2"],
    "improvements": ["improvement1", "improvement2"],
    "factChecks": ["fact that needs verification"]
  }
}`

    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are a meticulous content reviewer specializing in Singapore real estate content with expertise in SEO and factual accuracy."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      response_format: { type: "json_object" }
    })
    
    const reviewData = JSON.parse(response.choices[0].message.content || '{}')
    
    return {
      factualAccuracy: reviewData.factualAccuracy,
      seoOptimization: reviewData.seoOptimization,
      readability: reviewData.readability,
      singaporeContext: reviewData.singaporeContext,
      suggestions: reviewData.suggestions,
      score: reviewData.score
    }
  }
  
  private async approveArticle(articleId: string) {
    await prisma.article.update({
      where: { id: articleId },
      data: {
        status: ArticleStatus.PUBLISHED,
        publishedAt: new Date()
      }
    })
  }
  
  private async requestRevisions(articleId: string, review: ReviewCriteria) {
    const article = await prisma.article.findUnique({
      where: { id: articleId }
    })
    
    if (!article) return
    
    const improvedContent = await this.improveArticle(article, review.suggestions)
    
    await prisma.article.update({
      where: { id: articleId },
      data: {
        content: improvedContent,
        status: ArticleStatus.REVIEW
      }
    })
    
    // Re-review after improvements
    await this.reviewArticle(articleId)
  }
  
  private async improveArticle(article: any, suggestions: string[]): Promise<string> {
    const prompt = `Improve the following Singapore property article based on these suggestions:

Suggestions:
${suggestions.map((s, i) => `${i + 1}. ${s}`).join('\n')}

Original Article:
${article.content}

Please rewrite the article addressing all suggestions while maintaining:
- Factual accuracy about Singapore property market
- SEO optimization for keywords: ${article.seoKeywords.join(', ')}
- Engaging and professional tone
- Singapore-specific context and regulations

Return only the improved article content.`

    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are an expert Singapore property content writer focused on accuracy and SEO optimization."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.5,
      max_tokens: 3000
    })
    
    return response.choices[0].message.content || article.content
  }
  
  async reviewAllPendingArticles() {
    const pendingArticles = await prisma.article.findMany({
      where: { status: ArticleStatus.REVIEW }
    })
    
    for (const article of pendingArticles) {
      try {
        await this.reviewArticle(article.id)
      } catch (error) {
        console.error(`Error reviewing article ${article.id}:`, error)
      }
    }
  }
}