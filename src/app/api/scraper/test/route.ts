import { NextRequest, NextResponse } from 'next/server'
import { EnhancedPropertyScraper } from '@/services/enhanced-property-scraper'

export async function POST(request: NextRequest) {
  try {
    const options = await request.json()
    
    // Initialize the scraper
    const scraper = new EnhancedPropertyScraper()
    
    // Get current listings without saving to database
    console.log('Starting property scraping with options:', options)
    const listings = await scraper.searchProperties({
      ...options,
      maxResults: options.maxResults || 10 // Limit for testing
    })
    
    return NextResponse.json({
      success: true,
      count: listings.length,
      listings: listings,
      message: `Found ${listings.length} current property listings`,
      sources: {
        propertyGuru: listings.filter(l => l.source === 'PropertyGuru').length,
        ninetyNine: listings.filter(l => l.source === '99.co').length
      },
      note: 'This is a test endpoint - listings are not saved to database'
    })
  } catch (error: any) {
    console.error('Scraper test API error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to scrape property listings',
        message: error.message,
        tip: 'The scraper may be blocked. Try again later or use different search criteria.'
      },
      { status: 500 }
    )
  }
}