import { NextRequest, NextResponse } from 'next/server'
import { EnhancedPropertyScraper } from '@/services/enhanced-property-scraper'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const options = await request.json()
    
    // Initialize the scraper
    const scraper = new EnhancedPropertyScraper()
    
    // Get current listings
    console.log('Starting property scraping with options:', options)
    const listings = await scraper.searchProperties(options)
    
    // Optional: Save to database for caching
    if (options.saveToDb && listings.length > 0) {
      try {
        // Save listings to database
        const savedListings = await Promise.all(
          listings.map(async (listing) => {
            return prisma.property.upsert({
              where: { 
                externalId: listing.id 
              },
              update: {
                title: listing.title,
                price: listing.priceValue || 0,
                address: listing.address,
                bedrooms: parseInt(listing.bedrooms || '0'),
                bathrooms: parseInt(listing.bathrooms || '0'),
                area: listing.sqft || 0,
                propertyType: listing.propertyType,
                listingUrl: listing.url,
                imageUrl: listing.image,
                source: listing.source,
                updatedAt: new Date()
              },
              create: {
                externalId: listing.id,
                title: listing.title,
                price: listing.priceValue || 0,
                address: listing.address,
                bedrooms: parseInt(listing.bedrooms || '0'),
                bathrooms: parseInt(listing.bathrooms || '0'),
                area: listing.sqft || 0,
                propertyType: listing.propertyType,
                listingUrl: listing.url,
                imageUrl: listing.image,
                source: listing.source,
                description: listing.description || '',
                features: []
              }
            })
          })
        )
        console.log(`Saved ${savedListings.length} listings to database`)
      } catch (dbError) {
        console.error('Error saving to database:', dbError)
        // Continue even if database save fails
      }
    }
    
    return NextResponse.json({
      success: true,
      count: listings.length,
      listings: listings,
      message: `Found ${listings.length} current property listings`,
      sources: {
        propertyGuru: listings.filter(l => l.source === 'PropertyGuru').length,
        ninetyNine: listings.filter(l => l.source === '99.co').length
      }
    })
  } catch (error: any) {
    console.error('Scraper API error:', error)
    
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

export async function GET(request: NextRequest) {
  try {
    // Get recent scraped listings from database
    const recentListings = await prisma.property.findMany({
      where: {
        source: {
          in: ['PropertyGuru', '99.co']
        }
      },
      orderBy: {
        updatedAt: 'desc'
      },
      take: 20
    })
    
    return NextResponse.json({
      success: true,
      count: recentListings.length,
      listings: recentListings,
      message: 'Recent scraped listings from database'
    })
  } catch (error: any) {
    console.error('Database fetch error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch listings from database',
        message: error.message
      },
      { status: 500 }
    )
  }
}