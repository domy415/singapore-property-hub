import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Build-time guard: Skip database operations during build
    if (process.env.NODE_ENV !== 'production' && !process.env.DATABASE_URL) {
      return NextResponse.json({
        success: false,
        error: 'Database not available during build',
        message: 'This endpoint is only available in production or with DATABASE_URL set'
      })
    }

    // Dynamic import to avoid build-time initialization
    const { prisma } = await import('@/lib/prisma')
    
    const article = await prisma.article.findUnique({
      where: { 
        slug: 'navigating-singapore-s-property-landscape-in-q3-2025-insights-from-a-seasoned-expert' 
      }
    })

    if (!article) {
      return NextResponse.json({
        success: false,
        error: 'Article not found'
      })
    }

    // Fix the specific content formatting issues
    let fixedContent = article.content

    // Fix the merged headings with proper markdown
    const fixes = [
      // Fix "### Market ContextIt's" pattern  
      {
        from: /### Market ContextIt's/g,
        to: '### Market Context\n\nIt\'s'
      },
      // Fix "### Current Market DynamicsThe Singapore" pattern
      {
        from: /### Current Market DynamicsThe Singapore/g,
        to: '### Current Market Dynamics\n\nThe Singapore'
      },
      // Fix "### Policy Impacts and Regulatory LandscapeThe Singapore" pattern
      {
        from: /### Policy Impacts and Regulatory LandscapeThe Singapore/g,
        to: '### Policy Impacts and Regulatory Landscape\n\nThe Singapore'
      },
      // Fix "### Segment-Specific AnalysisThe HDB" pattern
      {
        from: /### Segment-Specific AnalysisThe HDB/g,
        to: '### Segment-Specific Analysis\n\nThe HDB'
      },
      // Fix "### Investment Considerations and Market PositioningFor property" pattern
      {
        from: /### Investment Considerations and Market PositioningFor property/g,
        to: '### Investment Considerations and Market Positioning\n\nFor property'
      },
      // Fix "### Expert Market Outlook and Strategic RecommendationsAs we look" pattern
      {
        from: /### Expert Market Outlook and Strategic RecommendationsAs we look/g,
        to: '### Expert Market Outlook and Strategic Recommendations\n\nAs we look'
      }
    ]

    let changeCount = 0
    fixes.forEach(fix => {
      const before = fixedContent
      fixedContent = fixedContent.replace(fix.from, fix.to)
      if (fixedContent !== before) {
        changeCount++
      }
    })

    if (changeCount > 0) {
      await prisma.article.update({
        where: { id: article.id },
        data: { content: fixedContent }
      })

      return NextResponse.json({
        success: true,
        message: `Fixed ${changeCount} content formatting issues`,
        articleTitle: article.title,
        changesApplied: changeCount,
        timestamp: new Date().toISOString()
      })
    } else {
      return NextResponse.json({
        success: true,
        message: 'No formatting issues found or already fixed',
        articleTitle: article.title,
        changesApplied: 0
      })
    }

  } catch (error) {
    console.error('Fix article failed:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Fix article failed', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}