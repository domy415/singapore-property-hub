import { NextRequest, NextResponse } from 'next/server'
import { BasicArticleCreator } from '@/services/basic-article-creator'
import { EnhancedContentGenerator } from '@/services/enhanced-content-generator'
import { ArticleCategory } from '@prisma/client'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, category, generateContent = true } = body
    
    console.log('Starting article creation with Anthropic Claude...')
    
    if (generateContent) {
      // Use enhanced generator with fact-checking
      const generator = new EnhancedContentGenerator()
      const result = await generator.generateEnhancedArticle(
        category as ArticleCategory || ArticleCategory.MARKET_INSIGHTS,
        true
      )
      
      if (!result.saved) {
        return NextResponse.json({
          success: false,
          message: 'Article generation failed quality checks',
          review: result.review
        }, { status: 400 })
      }
      
      return NextResponse.json({
        success: true,
        message: 'Article created successfully with fact-checking',
        articleId: result.articleId,
        article: result.article,
        qualityScore: result.review.qualityScore,
        timestamp: new Date().toISOString()
      })
    } else {
      // Use basic creator without fact-checking
      const creator = new BasicArticleCreator()
      const articleSlug = await creator.createArticle()
      
      if (!articleSlug) {
        return NextResponse.json({
          success: false,
          message: 'Article creation not available'
        }, { status: 503 })
      }
      
      console.log(`Article created successfully: ${articleSlug}`)
      
      return NextResponse.json({
        success: true,
        message: 'Article created successfully',
        articleSlug,
        articleUrl: `https://singapore-property-hub.vercel.app/articles/${articleSlug}`,
        timestamp: new Date().toISOString()
      })
    }
  } catch (error: any) {
    console.error('Article creation failed:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create article',
        details: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    available: !!process.env.ANTHROPIC_API_KEY,
    message: process.env.ANTHROPIC_API_KEY 
      ? 'Article creation with Claude AI is available' 
      : 'Article creation requires Anthropic API key',
    features: {
      factChecking: true,
      qualityGate: true,
      singaporeSpecificContent: true,
      multiAgentSystem: true
    }
  })
}