import { NextRequest, NextResponse } from 'next/server'
import { PropertyCrawler } from '@/services/property-crawler'

export async function POST(request: NextRequest) {
  try {
    const { maxPages = 5, saveToDatabase = true } = await request.json()
    
    console.log('🚀 Starting property crawler...')
    
    const crawler = new PropertyCrawler({
      maxPages: Math.min(maxPages, 10), // Limit to prevent overload
      delayBetweenRequests: 3000, // 3 second delay
      userAgentRotation: true,
      saveToDatabase,
      retryOnFailure: 2
    })
    
    const result = await crawler.crawlAll()
    
    return NextResponse.json({
      success: result.success,
      message: result.success ? 'Crawl completed successfully' : 'Crawl completed with errors',
      stats: result.stats,
      totalProperties: result.stats.propertyGuru.total + result.stats.ninetyNine.total,
      crawlDuration: result.stats.endTime ? 
        Math.round((result.stats.endTime.getTime() - result.stats.startTime.getTime()) / 1000) : 0
    })
  } catch (error: any) {
    console.error('Crawler API error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Crawler failed to start',
        message: error.message
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  // Get crawler status/stats
  try {
    // You could add crawler status tracking here
    return NextResponse.json({
      success: true,
      message: 'Crawler API is ready',
      endpoints: {
        start: 'POST /api/crawler/start - Start crawling properties',
        search: 'GET /api/properties/search - Search crawled properties'
      }
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}