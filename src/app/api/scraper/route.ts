import { NextRequest, NextResponse } from 'next/server'
import { PropertyScraper } from '@/services/property-scraper'

export async function POST(request: NextRequest) {
  try {
    const criteria = await request.json()
    const scraper = new PropertyScraper()
    const results = await scraper.searchProperties(criteria)
    
    return NextResponse.json({
      success: true,
      count: results.length,
      properties: results
    })
  } catch (error) {
    console.error('Scraper API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to search properties' },
      { status: 500 }
    )
  }
}