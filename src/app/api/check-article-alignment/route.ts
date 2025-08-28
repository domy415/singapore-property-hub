import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ArticleStatus } from '@prisma/client'

interface ArticleCheck {
  id: string
  title: string
  slug: string
  issues: string[]
  severity: 'high' | 'medium' | 'low'
}

export async function GET(request: NextRequest) {
  try {
    const articles = await prisma.article.findMany({
      where: { status: ArticleStatus.PUBLISHED },
      select: {
        id: true,
        title: true,
        slug: true,
        content: true,
        category: true
      }
    })

    const issues: ArticleCheck[] = []

    for (const article of articles) {
      const articleIssues: string[] = []
      let severity: 'high' | 'medium' | 'low' = 'low'

      // Check for district-specific titles without district content
      if (article.title.toLowerCase().includes('district discovery') || 
          article.title.toLowerCase().includes('district')) {
        const hasDistrictContent = /district \d+|district [a-z]+/i.test(article.content) ||
                                 /\b(orchard|marina|sentosa|jurong|woodlands|tampines|punggol|sengkang|bishan|toa payoh|ang mo kio|bedok|clementi|bukit timah|newton|novena|dhoby ghaut|city hall|raffles place|marina bay|clarke quay|boat quay|chinatown|little india|arab street|bugis|beach road|lavender|kallang|geylang|katong|east coast|west coast|north|south|central)\b/i.test(article.content)
        
        if (!hasDistrictContent) {
          articleIssues.push('Title suggests district focus but content lacks specific district analysis')
          severity = 'high'
        }
      }

      // Check for neighborhood-specific titles without neighborhood content
      if (article.title.toLowerCase().includes('neighborhood spotlight') || 
          article.title.toLowerCase().includes('neighborhood')) {
        const hasNeighborhoodContent = /\b(orchard|marina|sentosa|jurong|woodlands|tampines|punggol|sengkang|bishan|toa payoh|ang mo kio|bedok|clementi|bukit timah|newton|novena|dhoby ghaut|city hall|raffles place|marina bay|clarke quay|boat quay|chinatown|little india|arab street|bugis|beach road|lavender|kallang|geylang|katong|east coast|west coast)\b/i.test(article.content)
        
        if (!hasNeighborhoodContent) {
          articleIssues.push('Title suggests neighborhood focus but content lacks specific area analysis')
          severity = 'high'
        }
      }

      // Check for new launch titles without specific project mentions
      if (article.title.toLowerCase().includes('new launch') && 
          article.category === 'NEW_LAUNCH_REVIEW') {
        const hasProjectContent = /\b[A-Z][a-z]+ [A-Z][a-z]+( [A-Z][a-z]+)?\b/.test(article.content) && 
                                 /developer|launch|project|condo|development/i.test(article.content)
        
        if (!hasProjectContent) {
          articleIssues.push('New launch title but lacks specific project details')
          severity = 'high'
        }
      }

      // Check for investment guides without investment content
      if ((article.title.toLowerCase().includes('investment') || 
           article.category === 'INVESTMENT') && 
          !(/ROI|return|yield|rental|profit|investment|capital|appreciation|portfolio/i.test(article.content))) {
        articleIssues.push('Investment title but lacks investment-specific content')
        severity = 'medium'
      }

      // Check for buying guides without buying content
      if ((article.title.toLowerCase().includes('buying guide') || 
           article.category === 'BUYING_GUIDE') && 
          !(/purchase|buy|buyer|mortgage|loan|financing|down payment|HDB|BTO|resale|private|eligibility/i.test(article.content))) {
        articleIssues.push('Buying guide title but lacks buying-specific content')
        severity = 'medium'
      }

      // Check for generic titles with generic content
      if (article.title.toLowerCase().includes('navigating singapore\'s property market') &&
          article.content.length < 1500) {
        articleIssues.push('Generic title with insufficient content depth')
        severity = 'low'
      }

      if (articleIssues.length > 0) {
        issues.push({
          id: article.id,
          title: article.title,
          slug: article.slug,
          issues: articleIssues,
          severity: severity
        })
      }
    }

    // Sort by severity
    issues.sort((a, b) => {
      const severityOrder = { high: 3, medium: 2, low: 1 }
      return severityOrder[b.severity] - severityOrder[a.severity]
    })

    return NextResponse.json({
      success: true,
      totalArticles: articles.length,
      issuesFound: issues.length,
      issues: issues
    })

  } catch (error) {
    console.error('Error checking article alignment:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to check article alignment'
    }, { status: 500 })
  }
}