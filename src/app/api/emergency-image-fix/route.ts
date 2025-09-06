import { NextResponse } from 'next/server'

// EMERGENCY IMAGE FIX - Manual Singapore Property Image Assignments
// Based on actual Singapore Property Image Finder Agent guidelines
const EMERGENCY_IMAGE_FIXES: { [key: string]: string } = {
  // EXACT MANUAL FIXES - Singapore Property Image Finder Agent Compliant
  'navigating-the-waves-of-singapore-s-property-market-an-expert-analysis': 'https://images.unsplash.com/photo-ugr4n5X4YjI?w=1200&h=630&q=80', // Marina Bay twilight premium Singapore skyline
  'celebrating-national-day-insights-into-singapore-s-property-market-in-2025': 'https://images.unsplash.com/photo-1533628635777-112b2239b1c7?w=1200&h=630&q=80', // Marina Bay National Day celebration
  'navigating-the-singapore-property-market-a-national-day-2025-special': 'https://images.unsplash.com/photo-1626979555340-79bb014e9c99?w=1200&h=630&q=80', // Singapore Flyer patriotic view
  'ultimate-guide-to-living-in-district-12-balestier-toa-payoh-serangoon': 'https://images.unsplash.com/photo-zIp4YexPPhQ?w=1200&h=630&q=80', // Authentic Toa Payoh HDB blocks
  'ultimate-guide-to-living-in-district-2-anson-tanjong-pagar-singapore': 'https://images.unsplash.com/photo-1567360425618-1594206637d2?w=1200&h=630&q=80', // Singapore CBD skyline
  'navigating-singapore-s-property-market-a-guide-to-independence-planning': 'https://images.unsplash.com/photo-1565537449260-e3804e5fe018?w=1200&h=630&q=80', // Gardens by the Bay Singapore
  'weekend-property-picks-in-singapore-a-2025-market-': 'https://images.unsplash.com/photo-1543722530-d2c3201371e7?w=1200&h=630&q=80', // Singapore residential community
  'unlocking-the-potential-of-singapore-s-property-ma': 'https://images.unsplash.com/photo-1565967511849-76a60a516170?w=1200&h=630&q=80', // Singapore financial district
  'hdb-vs-private-property-in-2025-a-complete-compari-1755690686034': 'https://images.unsplash.com/photo-zIp4YexPPhQ?w=1200&h=630&q=80', // Singapore HDB blocks
  'navigating-singapore-s-cooling-measures-in-2025-a-': 'https://images.unsplash.com/photo-1575089976121-8ed7b2a54265?w=1200&h=630&q=80', // Singapore government district
  'hdb-vs-private-property-in-2025-a-complete-compari': 'https://images.unsplash.com/photo-zIp4YexPPhQ?w=1200&h=630&q=80', // Singapore HDB with void decks
  'understanding-singapore-s-cooling-measures-in-2025': 'https://images.unsplash.com/photo-1570372226816-51277b9c2b98?w=1200&h=630&q=80', // Singapore Parliament/government
  'bloomsbury-residences-2025-review': 'https://images.unsplash.com/photo-kNzqXxlvmE4?w=1200&h=630&q=80', // New Singapore development construction
  'hdb-vs-private-property-complete-comparison-guide-': 'https://images.unsplash.com/photo-zIp4YexPPhQ?w=1200&h=630&q=80', // Singapore public housing
  'singapore-property-market-trends-q3-2024-analysis': 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=630&q=80', // Singapore business district towers
  'navigating-singapore-s-property-landscape-in-q3-2025-insights-from-a-seasoned-expert': 'https://images.unsplash.com/photo-1567360425618-1594206637d2?w=1200&h=630&q=80', // Singapore Marina Bay navigation theme
}

export async function POST() {
  try {
    // Build-time guard: Skip database operations during build
    if (process.env.NODE_ENV !== 'production' && !process.env.DATABASE_URL) {
      return NextResponse.json({
        success: false,
        error: 'Database not available during build',
        message: 'This endpoint is only available in production or with DATABASE_URL set'
      })
    }

    console.log('🚨 EMERGENCY IMAGE FIX - Singapore Property Image Finder Agent Compliance')
    
    // Dynamic import to avoid build-time initialization
    const { prisma } = await import('@/lib/prisma')
    
    // Get all articles
    const articles = await prisma.article.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        featuredImage: true
      },
      orderBy: { createdAt: 'desc' }
    })

    console.log(`Found ${articles.length} articles to fix`)

    const fixes = []
    let fixedCount = 0
    
    for (const article of articles) {
      const correctImage = EMERGENCY_IMAGE_FIXES[article.slug]
      
      if (correctImage && correctImage !== article.featuredImage) {
        console.log(`🔧 FIXING: ${article.title}`)
        console.log(`  SLUG: ${article.slug}`)
        console.log(`  OLD: ${article.featuredImage}`)
        console.log(`  NEW: ${correctImage}`)
        
        await prisma.article.update({
          where: { id: article.id },
          data: { 
            featuredImage: `${correctImage}?t=${Date.now()}` // Cache-busting timestamp with proper query parameter
          }
        })
        
        fixes.push({
          title: article.title,
          slug: article.slug,
          oldImage: article.featuredImage,
          newImage: `${correctImage}?t=${Date.now()}`,
          url: `https://singapore-property-hub.vercel.app/articles/${article.slug}`
        })
        
        fixedCount++
      } else if (correctImage) {
        console.log(`✅ ALREADY CORRECT: ${article.title}`)
      } else {
        console.log(`⚠️  NO MAPPING: ${article.slug}`)
      }
    }

    console.log(`\n🎯 EMERGENCY FIX COMPLETE: ${fixedCount} articles fixed`)

    return NextResponse.json({
      success: true,
      message: `Emergency Singapore Property Image Finder fix completed`,
      articlesChecked: articles.length,
      articlesFixed: fixedCount,
      fixes: fixes,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ Emergency image fix failed:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Emergency image fix failed', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    // Build-time guard: Skip database operations during build
    if (process.env.NODE_ENV !== 'production' && !process.env.DATABASE_URL) {
      return NextResponse.json({
        message: 'Database not available during build',
        totalArticles: 0,
        articlesNeedingFix: 0,
        preview: []
      })
    }

    // Dynamic import to avoid build-time initialization
    const { prisma } = await import('@/lib/prisma')

    // Preview what would be fixed
    const articles = await prisma.article.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        featuredImage: true
      },
      orderBy: { createdAt: 'desc' }
    })

    const preview = articles.map(article => {
      const correctImage = EMERGENCY_IMAGE_FIXES[article.slug]
      return {
        title: article.title,
        slug: article.slug,
        currentImage: article.featuredImage,
        suggestedImage: correctImage || 'NO MAPPING AVAILABLE',
        needsFix: correctImage ? correctImage !== article.featuredImage : false,
        url: `https://singapore-property-hub.vercel.app/articles/${article.slug}`
      }
    })

    const needsFix = preview.filter(p => p.needsFix)

    return NextResponse.json({
      message: 'Emergency image fix preview',
      totalArticles: articles.length,
      articlesNeedingFix: needsFix.length,
      preview: preview
    })

  } catch (error) {
    console.error('Preview failed:', error)
    return NextResponse.json(
      { error: 'Preview failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}