import { NextResponse } from 'next/server'
import { VerifiedContentGenerator } from '@/services/verified-content-generator'
import { ArticleCategory } from '@prisma/client'

export async function GET() {
  try {
    console.log('=== Testing Multi-Agent Content Generation Pipeline ===')
    
    // Initialize with agents enabled
    const generator = new VerifiedContentGenerator(true)
    
    // Test with a condo review topic to trigger all agents
    const testTopic = 'Grand Dunman Comprehensive Review'
    const category = ArticleCategory.NEW_LAUNCH_REVIEW
    
    console.log(`Test Topic: ${testTopic}`)
    console.log(`Category: ${category}`)
    console.log('\nStarting multi-agent pipeline...\n')
    
    // Generate article using multi-agent system
    const result = await generator.generateVerifiedArticle(category, false)
    
    // Prepare response summary
    const summary = {
      success: result.saved,
      articleGenerated: !!result.article.content,
      factCheckPassed: result.review.factCheckPassed,
      qualityScore: result.review.qualityScore,
      propertyScoreGenerated: !!result.propertyScore,
      reportGenerated: !!result.htmlReport,
      linkedInOptimized: !!result.linkedInPosts,
      
      // Agent results
      agentResults: {
        propertyScorer: result.propertyScore ? {
          success: true,
          overallRating: result.propertyScore.overallRating,
          hasStrengths: result.propertyScore.strengths?.length > 0,
          hasConcerns: result.propertyScore.concerns?.length > 0
        } : { success: false },
        
        articleWriter: {
          success: result.article.content.length > 100,
          wordCount: result.article.content.split(/\s+/).length,
          hasTitle: !!result.article.title,
          hasSEO: !!result.article.seoTitle
        },
        
        imageFinder: {
          success: !!result.article.featuredImage,
          imageUrl: result.article.featuredImage || 'Not found',
          hasCustomImage: !result.article.featuredImage?.includes('singapore-skyline')
        },
        
        reportGenerator: result.htmlReport ? {
          success: true,
          reportLength: result.htmlReport.length,
          isHTML: result.htmlReport.includes('<html')
        } : { success: false },
        
        linkedInOptimizer: result.linkedInPosts ? {
          success: true,
          postCount: result.linkedInPosts.posts?.length || 0,
          hasSchedule: !!result.linkedInPosts.postingSchedule
        } : { success: false }
      },
      
      // Article preview
      articlePreview: {
        title: result.article.title,
        excerpt: result.article.excerpt,
        category: result.article.category,
        tags: result.article.tags,
        seoKeywords: result.article.seoKeywords
      },
      
      // Issues if any
      issues: result.review.issues
    }
    
    console.log('\n=== Multi-Agent Pipeline Summary ===')
    console.log(`Article Generated: ${summary.articleGenerated ? 'Yes' : 'No'}`)
    console.log(`Quality Score: ${summary.qualityScore}/100`)
    console.log(`Property Score Generated: ${summary.propertyScoreGenerated ? 'Yes' : 'No'}`)
    console.log(`Image Found: ${summary.agentResults.imageFinder.success ? 'Yes' : 'No'}`)
    console.log(`Report Generated: ${summary.reportGenerated ? 'Yes' : 'No'}`)
    console.log(`LinkedIn Optimized: ${summary.linkedInOptimized ? 'Yes' : 'No'}`)
    console.log(`Article Saved: ${summary.success ? 'Yes' : 'No'}`)
    
    return NextResponse.json({
      message: 'Multi-agent content generation test completed',
      ...summary
    })
    
  } catch (error) {
    console.error('Multi-agent test error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to test multi-agent pipeline',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { topic, category, useAgents = true } = body
    
    console.log('=== Testing Multi-Agent Pipeline with Custom Topic ===')
    console.log(`Topic: ${topic || 'Auto-generated'}`)
    console.log(`Category: ${category || 'Auto-selected'}`)
    console.log(`Use Agents: ${useAgents}`)
    
    // Initialize generator
    const generator = new VerifiedContentGenerator(useAgents)
    
    // Generate article
    const result = await generator.generateVerifiedArticle(
      category || ArticleCategory.MARKET_INSIGHTS,
      !topic // Use calendar suggestions if no topic provided
    )
    
    return NextResponse.json({
      message: 'Multi-agent content generation completed',
      success: result.saved,
      article: {
        title: result.article.title,
        excerpt: result.article.excerpt,
        wordCount: result.article.content.split(/\s+/).length
      },
      qualityScore: result.review.qualityScore,
      agentsUsed: {
        propertyScorer: !!result.propertyScore,
        imageFinder: !!result.article.featuredImage,
        reportGenerator: !!result.htmlReport,
        linkedInOptimizer: !!result.linkedInPosts
      }
    })
    
  } catch (error) {
    console.error('Multi-agent test error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to test multi-agent pipeline',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}