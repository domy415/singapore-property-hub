import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Build-time guard: Skip database operations during build
    if (process.env.NODE_ENV !== 'production' && !process.env.DATABASE_URL) {
      return NextResponse.json({
        success: false,
        error: 'Database not available during build',
        message: 'This endpoint is only available in production or with DATABASE_URL set'
      })
    }

    // Dynamic import to avoid build-time initialization
    const { prisma } = await import('@/lib/prisma')
    
    const article = await prisma.article.findUnique({
      where: { 
        slug: 'navigating-singapore-s-property-landscape-in-q3-2025-insights-from-a-seasoned-expert' 
      }
    })

    if (!article) {
      return NextResponse.json({
        success: false,
        error: 'Article not found'
      })
    }

    // Fix the image URL to use the proper Unsplash URL
    const properImageUrl = 'https://images.unsplash.com/photo-1567360425618-1594206637d2?w=1200&h=630&q=80'

    await prisma.article.update({
      where: { id: article.id },
      data: { featuredImage: properImageUrl }
    })

    return NextResponse.json({
      success: true,
      message: 'Fixed article image URL',
      articleTitle: article.title,
      oldImage: article.featuredImage,
      newImage: properImageUrl,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Fix article image failed:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Fix article image failed', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}