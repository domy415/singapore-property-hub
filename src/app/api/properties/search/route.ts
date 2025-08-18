import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface SearchFilters {
  propertyType?: string
  district?: string
  minPrice?: number
  maxPrice?: number
  bedrooms?: number
  bathrooms?: number
  minArea?: number
  maxArea?: number
  keyword?: string
  source?: 'PropertyGuru' | '99.co'
  limit?: number
  offset?: number
}

export async function POST(request: NextRequest) {
  try {
    const filters: SearchFilters = await request.json()
    
    // Build the where clause for Prisma
    const whereClause: any = {
      AND: []
    }
    
    // Filter by external listings only (from crawler)
    whereClause.AND.push({
      externalId: { not: null }
    })
    
    // Property type filter
    if (filters.propertyType && filters.propertyType !== 'all') {
      whereClause.AND.push({
        propertyType: { contains: filters.propertyType, mode: 'insensitive' }
      })
    }
    
    // District filter
    if (filters.district && filters.district !== 'all') {
      whereClause.AND.push({
        OR: [
          { district: filters.district },
          { address: { contains: filters.district, mode: 'insensitive' } }
        ]
      })
    }
    
    // Price range filter
    if (filters.minPrice) {
      whereClause.AND.push({ price: { gte: filters.minPrice } })
    }
    if (filters.maxPrice) {
      whereClause.AND.push({ price: { lte: filters.maxPrice } })
    }
    
    // Bedroom filter
    if (filters.bedrooms) {
      whereClause.AND.push({ bedrooms: { gte: filters.bedrooms } })
    }
    
    // Bathroom filter
    if (filters.bathrooms) {
      whereClause.AND.push({ bathrooms: { gte: filters.bathrooms } })
    }
    
    // Area filter
    if (filters.minArea) {
      whereClause.AND.push({ area: { gte: filters.minArea } })
    }
    if (filters.maxArea) {
      whereClause.AND.push({ area: { lte: filters.maxArea } })
    }
    
    // Keyword search
    if (filters.keyword) {
      whereClause.AND.push({
        OR: [
          { title: { contains: filters.keyword, mode: 'insensitive' } },
          { address: { contains: filters.keyword, mode: 'insensitive' } },
          { description: { contains: filters.keyword, mode: 'insensitive' } }
        ]
      })
    }
    
    // Source filter
    if (filters.source) {
      whereClause.AND.push({ source: filters.source })
    }
    
    // Execute the search
    const limit = Math.min(filters.limit || 20, 100) // Max 100 results
    const offset = filters.offset || 0
    
    const [properties, totalCount] = await Promise.all([
      prisma.property.findMany({
        where: whereClause,
        orderBy: [
          { updatedAt: 'desc' }, // Most recently updated first
          { price: 'asc' }
        ],
        take: limit,
        skip: offset,
        select: {
          id: true,
          externalId: true,
          title: true,
          price: true,
          address: true,
          district: true,
          bedrooms: true,
          bathrooms: true,
          area: true,
          propertyType: true,
          tenure: true,
          listingUrl: true,
          imageUrl: true,
          source: true,
          psf: true,
          features: true,
          updatedAt: true,
          createdAt: true
        }
      }),
      prisma.property.count({ where: whereClause })
    ])
    
    // Calculate search statistics
    const stats = {
      totalResults: totalCount,
      currentPage: Math.floor(offset / limit) + 1,
      totalPages: Math.ceil(totalCount / limit),
      resultsPerPage: limit,
      hasNextPage: offset + limit < totalCount,
      hasPreviousPage: offset > 0
    }
    
    // Group by source for additional stats
    const sourceStats = await prisma.property.groupBy({
      by: ['source'],
      where: whereClause,
      _count: { source: true }
    })
    
    const sourceBreakdown = sourceStats.reduce((acc: any, stat) => {
      if (stat.source) {
        acc[stat.source] = stat._count.source
      }
      return acc
    }, {})
    
    return NextResponse.json({
      success: true,
      properties,
      stats,
      sourceBreakdown,
      filters: filters,
      message: `Found ${totalCount} properties matching your criteria`
    })
    
  } catch (error: any) {
    console.error('Property search error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to search properties',
        message: error.message 
      },
      { status: 500 }
    )
  }
}

// GET endpoint for quick searches
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const filters: SearchFilters = {
      propertyType: searchParams.get('type') || undefined,
      district: searchParams.get('district') || undefined,
      minPrice: searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')!) : undefined,
      maxPrice: searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!) : undefined,
      bedrooms: searchParams.get('bedrooms') ? parseInt(searchParams.get('bedrooms')!) : undefined,
      keyword: searchParams.get('q') || undefined,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20
    }
    
    // Remove undefined values
    Object.keys(filters).forEach(key => {
      if (filters[key as keyof SearchFilters] === undefined) {
        delete filters[key as keyof SearchFilters]
      }
    })
    
    // Use POST logic for consistency
    const response = await fetch(request.url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(filters)
    })
    
    return response
    
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}