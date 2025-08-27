import { NextRequest, NextResponse } from 'next/server'
import { EnhancedContentGenerator } from '@/services/enhanced-content-generator'
import { ArticleCategory } from '@prisma/client'

export async function POST(request: NextRequest) {
  try {
    const { category, topicHint, useCalendarSuggestions = true } = await request.json()
    
    console.log('Testing enhanced content generator...')
    console.log('Category:', category)
    console.log('Topic Hint:', topicHint)
    
    const enhancedGenerator = new EnhancedContentGenerator()
    
    // Parse category if provided
    let articleCategory: ArticleCategory | undefined
    if (category && Object.values(ArticleCategory).includes(category)) {
      articleCategory = category as ArticleCategory
    }
    
    const result = await enhancedGenerator.generateEnhancedArticle(
      articleCategory,
      useCalendarSuggestions
    )
    
    return NextResponse.json({
      success: true,
      message: 'Enhanced content generated successfully',
      data: {
        article: result.article,
        review: result.review,
        saved: result.saved,
        articleId: result.articleId,
        usedScoringEngine: result.usedScoringEngine
      },
      timestamp: new Date().toISOString()
    })
    
  } catch (error: any) {
    console.error('Enhanced content generation test failed:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to generate enhanced content',
        details: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

// Allow GET for simple testing
export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const category = url.searchParams.get('category') as ArticleCategory
  const topicHint = url.searchParams.get('topic') || 'condo review new launch Singapore'
  
  try {
    console.log('GET test for enhanced content generator...')
    console.log('Category:', category)
    console.log('Topic Hint:', topicHint)
    
    const enhancedGenerator = new EnhancedContentGenerator()
    const result = await enhancedGenerator.generateEnhancedArticle(
      category,
      true
    )
    
    return NextResponse.json({
      success: true,
      message: 'Enhanced content generated successfully via GET',
      data: {
        title: result.article.title,
        category: result.article.category,
        tags: result.article.tags,
        qualityScore: result.review.qualityScore,
        factCheckPassed: result.review.factCheckPassed,
        saved: result.saved,
        articleId: result.articleId,
        usedScoringEngine: result.usedScoringEngine,
        contentPreview: result.article.content.substring(0, 500) + '...'
      },
      timestamp: new Date().toISOString()
    })
    
  } catch (error: any) {
    console.error('Enhanced content generation GET test failed:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to generate enhanced content via GET',
        details: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}