import { NextRequest, NextResponse } from 'next/server'
import { PropertyCrawler } from '@/services/property-crawler'

// This endpoint can be called by Vercel Cron Jobs or external schedulers
export async function GET(request: NextRequest) {
  try {
    // Verify this is a legitimate cron request
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    console.log('🕒 Scheduled crawler starting...')
    
    const crawler = new PropertyCrawler({
      maxPages: 20, // More pages for scheduled crawls
      delayBetweenRequests: 2000,
      userAgentRotation: true,
      saveToDatabase: true,
      retryOnFailure: 3
    })
    
    const result = await crawler.crawlAll()
    
    // Log results
    const logData = {
      timestamp: new Date().toISOString(),
      success: result.success,
      totalProperties: result.stats.propertyGuru.total + result.stats.ninetyNine.total,
      propertyGuru: result.stats.propertyGuru,
      ninetyNine: result.stats.ninetyNine,
      duration: result.stats.endTime ? 
        Math.round((result.stats.endTime.getTime() - result.stats.startTime.getTime()) / 1000) : 0
    }
    
    console.log('📊 Scheduled crawl completed:', logData)
    
    return NextResponse.json({
      success: true,
      message: 'Scheduled crawl completed',
      ...logData
    })
    
  } catch (error: any) {
    console.error('❌ Scheduled crawler error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Scheduled crawl failed',
        message: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

// Also support POST for manual triggers
export async function POST(request: NextRequest) {
  return GET(request)
}