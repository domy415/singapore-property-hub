import { NextRequest, NextResponse } from 'next/server'
import { VerifiedContentGenerator } from '@/services/verified-content-generator'
import { ArticleCategory } from '@prisma/client'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { category, batchSize, useCalendar } = body
    
    console.log('Testing verified content generation...')
    
    const generator = new VerifiedContentGenerator()
    
    if (batchSize && batchSize > 1) {
      // Generate multiple articles
      const results = await generator.generateBatchArticles(
        batchSize,
        category ? [category] : undefined
      )
      
      return NextResponse.json({
        success: true,
        message: `Generated ${results.length} articles`,
        results: results.map(r => ({
          title: r.article.title,
          category: r.article.category,
          saved: r.saved,
          qualityScore: r.review.qualityScore,
          factChecked: r.review.factCheckPassed,
          issues: r.review.issues,
          articleId: r.articleId
        })),
        timestamp: new Date().toISOString()
      })
    } else {
      // Generate single article
      const result = await generator.generateVerifiedArticle(
        category as ArticleCategory,
        useCalendar !== false
      )
      
      return NextResponse.json({
        success: true,
        message: 'Verified content generated',
        article: {
          title: result.article.title,
          category: result.article.category,
          excerpt: result.article.excerpt,
          wordCount: result.article.content.split(' ').length,
          tags: result.article.tags
        },
        review: result.review,
        saved: result.saved,
        articleId: result.articleId,
        timestamp: new Date().toISOString()
      })
    }
  } catch (error: any) {
    console.error('Test verified content generation failed:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to generate verified content',
        details: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Verified Content Generator Test API',
    usage: {
      POST: {
        description: 'Generate verified articles',
        body: {
          category: 'Optional ArticleCategory',
          batchSize: 'Optional number (for batch generation)',
          useCalendar: 'Optional boolean (default: true)'
        }
      }
    },
    availableCategories: [
      'NEW_LAUNCHES',
      'MARKET_ANALYSIS', 
      'INVESTMENT',
      'LOCATION_GUIDES',
      'BUYING_GUIDE'
    ]
  })
}