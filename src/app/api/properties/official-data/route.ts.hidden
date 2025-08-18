import { NextRequest, NextResponse } from 'next/server'
import { PropertyDataAPI } from '@/services/property-data-api'

export async function POST(request: NextRequest) {
  try {
    const searchCriteria = await request.json()
    
    // Initialize the API client with credentials from environment variables
    const propertyAPI = new PropertyDataAPI({
      uraAccessKey: process.env.URA_ACCESS_KEY,
      oneMapEmail: process.env.ONEMAP_EMAIL,
      oneMapPassword: process.env.ONEMAP_PASSWORD
    })
    
    // Get aggregated data from official sources
    const data = await propertyAPI.getAggregatedPropertyData(searchCriteria)
    
    // Transform the data into a consistent format
    const transformedResults = {
      transactions: [
        ...data.uraTransactions.map((t: any) => ({
          type: 'sale',
          source: 'URA',
          project: t.project,
          area: t.area,
          price: t.price,
          contractDate: t.contractDate,
          propertyType: t.propertyType || 'Private Residential',
          district: t.district,
          tenure: t.tenure,
          floorRange: t.floorRange,
          noOfUnits: t.noOfUnits
        })),
        ...data.hdbTransactions.map((t: any) => ({
          type: 'sale',
          source: 'HDB',
          project: `${t.block} ${t.streetName}`,
          area: `${t.floorAreaSqm} sqm`,
          price: t.resalePrice,
          contractDate: t.month,
          propertyType: 'HDB',
          flatType: t.flatType,
          flatModel: t.flatModel,
          town: t.town,
          storey: t.storey,
          remainingLease: t.remainingLease
        }))
      ],
      locations: data.addressInfo,
      summary: {
        totalTransactions: data.uraTransactions.length + data.hdbTransactions.length,
        averagePrice: calculateAveragePrice(data.uraTransactions, data.hdbTransactions),
        priceRange: calculatePriceRange(data.uraTransactions, data.hdbTransactions)
      }
    }
    
    return NextResponse.json({
      success: true,
      data: transformedResults,
      message: 'Data retrieved from official government sources'
    })
  } catch (error: any) {
    console.error('Official data API error:', error)
    
    // Provide helpful error messages
    if (error.message.includes('Access Key')) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'URA API credentials not configured. Please add URA_ACCESS_KEY to environment variables.',
          setup: 'Visit https://www.ura.gov.sg/maps/api/ to register for API access'
        },
        { status: 401 }
      )
    }
    
    if (error.message.includes('OneMap')) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'OneMap API credentials not configured. Please add ONEMAP_EMAIL and ONEMAP_PASSWORD to environment variables.',
          setup: 'Visit https://www.onemap.gov.sg/apidocs/ to register for API access'
        },
        { status: 401 }
      )
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to fetch property data' },
      { status: 500 }
    )
  }
}

function calculateAveragePrice(uraData: any[], hdbData: any[]): number {
  const allPrices = [
    ...uraData.map(t => t.price),
    ...hdbData.map(t => t.resalePrice)
  ].filter(p => p > 0)
  
  if (allPrices.length === 0) return 0
  
  const sum = allPrices.reduce((acc, price) => acc + price, 0)
  return Math.round(sum / allPrices.length)
}

function calculatePriceRange(uraData: any[], hdbData: any[]): { min: number, max: number } {
  const allPrices = [
    ...uraData.map(t => t.price),
    ...hdbData.map(t => t.resalePrice)
  ].filter(p => p > 0)
  
  if (allPrices.length === 0) return { min: 0, max: 0 }
  
  return {
    min: Math.min(...allPrices),
    max: Math.max(...allPrices)
  }
}