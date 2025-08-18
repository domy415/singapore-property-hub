import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const properties = await prisma.property.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        images: true
      }
    })
    
    return NextResponse.json({
      success: true,
      properties
    })
  } catch (error) {
    console.error('Error fetching properties:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch properties' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // Generate slug from title
    const slug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim() + '-' + Date.now()
    
    const property = await prisma.property.create({
      data: {
        slug,
        title: data.title,
        description: data.description,
        type: data.type,
        status: data.status,
        price: data.price,
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        area: data.area,
        address: data.address,
        district: data.district,
        postalCode: data.postalCode,
        features: data.features || [],
        imageUrl: data.imageUrl,
        propertyType: data.type,
        source: data.source || 'Manual Entry'
      }
    })
    
    return NextResponse.json({
      success: true,
      property
    })
  } catch (error: any) {
    console.error('Error creating property:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}