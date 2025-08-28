import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Simple test: just count published articles
    const articleCount = await prisma.article.count({
      where: { 
        status: 'PUBLISHED' 
      }
    })

    const articles = await prisma.article.findMany({
      where: { 
        status: 'PUBLISHED' 
      },
      select: {
        id: true,
        title: true,
        slug: true,
        content: true
      },
      take: 5 // Just get first 5 for testing
    })

    // Check for district-related issues
    const districtIssues = articles.filter(article => {
      const hasDistrictInTitle = article.title.toLowerCase().includes('district discovery') || 
                                article.title.toLowerCase().includes('district')
      
      if (!hasDistrictInTitle) return false

      const hasDistrictContent = /district \d+|district [a-z]+/i.test(article.content) ||
                               /\b(orchard|marina|sentosa|jurong|woodlands|tampines|punggol|sengkang|bishan|toa payoh|ang mo kio|bedok|clementi|bukit timah|newton|novena|dhoby ghaut|city hall|raffles place|marina bay|clarke quay|boat quay|chinatown|little india|arab street|bugis|beach road|lavender|kallang|geylang|katong|east coast|west coast|north|south|central)\b/i.test(article.content)
      
      return !hasDistrictContent
    }).map(article => ({
      id: article.id,
      title: article.title,
      slug: article.slug,
      issue: 'District title without district content'
    }))

    return NextResponse.json({
      success: true,
      totalPublishedArticles: articleCount,
      sampleArticlesChecked: articles.length,
      districtIssuesFound: districtIssues.length,
      issues: districtIssues
    })

  } catch (error) {
    console.error('Error in test article check:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to check articles',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}