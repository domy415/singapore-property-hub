import { NextResponse } from 'next/server'

// EMERGENCY SINGAPORE PROPERTY IMAGE FINDER FIX (2025-08-29)
// Manual override to fix vegetables/food images with proper Singapore property imagery
const COMPREHENSIVE_IMAGE_MAP: { [key: string]: string } = {
  // EXACT TITLE MATCHES - EMERGENCY OVERRIDES
  'navigating the waves of singapore\'s property market: an expert analysis': 'https://images.unsplash.com/photo-ugr4n5X4YjI?w=1200&h=630&q=80', // Marina Bay twilight premium Singapore skyline
  'celebrating national day: insights into singapore\'s property market in 2025': 'https://images.unsplash.com/photo-1533628635777-112b2239b1c7?w=1200&h=630&q=80', // Marina Bay National Day Singapore celebration
  'navigating the singapore property market: a national day 2025 special': 'https://images.unsplash.com/photo-1626979555340-79bb014e9c99?w=1200&h=630&q=80', // Singapore Flyer patriotic view
  'navigating singapore\'s property market: a guide to independence planning': 'https://images.unsplash.com/photo-1565537449260-e3804e5fe018?w=1200&h=630&q=80', // Gardens by the Bay Singapore
  'unlocking the potential of singapore\'s property market: weekend picks and expert insights': 'https://images.unsplash.com/photo-1565967511849-76a60a516170?w=1200&h=630&q=80', // Singapore financial district
  'singapore property market trends: q3 2024 analysis and investment outlook': 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=630&q=80', // Singapore business towers
  
  // District-specific EMERGENCY overrides
  'ultimate guide to living in district 12: balestier, toa payoh, serangoon': 'https://images.unsplash.com/photo-zIp4YexPPhQ?w=1200&h=630&q=80', // Authentic Toa Payoh HDB blocks
  'ultimate guide to living in district 2: anson & tanjong pagar, singapore': 'https://images.unsplash.com/photo-1567360425618-1594206637d2?w=1200&h=630&q=80', // Singapore CBD skyline
  'district 12': 'https://images.unsplash.com/photo-zIp4YexPPhQ?w=1200&h=630&q=80', // Dragon Playground area HDB
  'balestier': 'https://images.unsplash.com/photo-zIp4YexPPhQ?w=1200&h=630&q=80', // Singapore HDB with void decks
  'toa payoh': 'https://images.unsplash.com/photo-zIp4YexPPhQ?w=1200&h=630&q=80', // Toa Payoh heartland
  'serangoon': 'https://images.unsplash.com/photo-zIp4YexPPhQ?w=1200&h=630&q=80', // Northeast Singapore HDB
  
  // District 2 - CBD, Tanjong Pagar, Anson (Financial district)
  'ultimate guide to living in district 2': 'https://images.unsplash.com/photo-1567360425618-1594206637d2?w=1200&h=630&q=80', // Singapore CBD skyline
  'district 2': 'https://images.unsplash.com/photo-1567360425618-1594206637d2?w=1200&h=630&q=80', // Tanjong Pagar CBD
  'tanjong pagar': 'https://images.unsplash.com/photo-1567360425618-1594206637d2?w=1200&h=630&q=80', // Financial district
  'anson': 'https://images.unsplash.com/photo-1567360425618-1594206637d2?w=1200&h=630&q=80', // Singapore business core
  
  // Government and Policy - Singapore Government Buildings
  'cooling measures': 'https://images.unsplash.com/photo-1575089976121-8ed7b2a54265?w=1200&h=630&q=80', // Singapore government district
  'understanding singapore\'s cooling measures': 'https://images.unsplash.com/photo-1570372226816-51277b9c2b98?w=1200&h=630&q=80', // Singapore Parliament/government
  'navigating singapore\'s cooling measures': 'https://images.unsplash.com/photo-1575089976121-8ed7b2a54265?w=1200&h=630&q=80', // Civic district Singapore
  
  // HDB vs Private Property themed 
  'hdb vs private property': 'https://images.unsplash.com/photo-zIp4YexPPhQ?w=1200&h=630&q=80', // Authentic Singapore HDB
  'hdb': 'https://images.unsplash.com/photo-zIp4YexPPhQ?w=1200&h=630&q=80', // Public housing Singapore
  'public housing': 'https://images.unsplash.com/photo-zIp4YexPPhQ?w=1200&h=630&q=80', // HDB with void decks
  
  // Weekend and Market Insights - Gardens by the Bay/Singapore Flyer variety
  'weekend property picks': 'https://images.unsplash.com/photo-1543722530-d2c3201371e7?w=1200&h=630&q=80', // Singapore residential neighborhood
  'weekend property': 'https://images.unsplash.com/photo-1543722530-d2c3201371e7?w=1200&h=630&q=80', // Singapore living
  
  // New Launch and Development
  'bloomsbury residences': 'https://images.unsplash.com/photo-kNzqXxlvmE4?w=1200&h=630&q=80', // New Singapore development
  'bloomsbury': 'https://images.unsplash.com/photo-kNzqXxlvmE4?w=1200&h=630&q=80', // Modern Singapore condo
  'new launch': 'https://images.unsplash.com/photo-kNzqXxlvmE4?w=1200&h=630&q=80', // Development construction
  'condo': 'https://images.unsplash.com/photo-kNzqXxlvmE4?w=1200&h=630&q=80', // Singapore condominiums
  
  // National Day and Independence - Diverse Singapore landmarks
  'celebrating national day': 'https://images.unsplash.com/photo-1533628635777-112b2239b1c7?w=1200&h=630&q=80', // Marina Bay celebration
  'national day': 'https://images.unsplash.com/photo-1626979555340-79bb014e9c99?w=1200&h=630&q=80', // Singapore Flyer patriotic
  'independence': 'https://images.unsplash.com/photo-1565537449260-e3804e5fe018?w=1200&h=630&q=80', // Gardens by the Bay independence
  'singapore independence': 'https://images.unsplash.com/photo-1533628635777-112b2239b1c7?w=1200&h=630&q=80', // Marina Bay flag
  'independence planning': 'https://images.unsplash.com/photo-1565537449260-e3804e5fe018?w=1200&h=630&q=80', // Singapore landmarks
  
  // Market Analysis - Diverse Singapore economic centers
  'property market trends': 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=630&q=80', // Singapore business towers
  'market insight': 'https://images.unsplash.com/photo-1565967511849-76a60a516170?w=1200&h=630&q=80', // Singapore financial center
  'market analysis': 'https://images.unsplash.com/photo-ugr4n5X4YjI?w=1200&h=630&q=80', // Premium Marina Bay view
  'navigating': 'https://images.unsplash.com/photo-ugr4n5X4YjI?w=1200&h=630&q=80', // Marina Bay navigation view
}

// Enhanced Fallback System - Diverse Singapore Property Image Finder Agent Standards
const CATEGORY_FALLBACKS: { [key: string]: string } = {
  'MARKET_INSIGHTS': 'https://images.unsplash.com/photo-1565967511849-76a60a516170?w=1200&h=630&q=80', // Singapore CBD financial district
  'BUYING_GUIDE': 'https://images.unsplash.com/photo-zIp4YexPPhQ?w=1200&h=630&q=80', // Authentic Singapore HDB for buyers
  'NEIGHBORHOOD': 'https://images.unsplash.com/photo-1543722530-d2c3201371e7?w=1200&h=630&q=80', // Singapore residential community
  'LOCATION_GUIDE': 'https://images.unsplash.com/photo-1567360425618-1594206637d2?w=1200&h=630&q=80', // Singapore district skyline
  'PROPERTY_NEWS': 'https://images.unsplash.com/photo-kNzqXxlvmE4?w=1200&h=630&q=80', // Singapore development news
  'NEW_LAUNCH_REVIEW': 'https://images.unsplash.com/photo-kNzqXxlvmE4?w=1200&h=630&q=80', // New Singapore condo launch
  'INVESTMENT': 'https://images.unsplash.com/photo-ugr4n5X4YjI?w=1200&h=630&q=80', // Premium Marina Bay investment
  'SELLING_GUIDE': 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=630&q=80', // Singapore property market towers
}

// EMERGENCY IMAGE SELECTION - Force correct Singapore Property Images
function getRelevantImage(title: string, content: string, category: string): string {
  const normalizedTitle = title.toLowerCase()
  const timestamp = Date.now() // Cache-busting timestamp
  
  console.log(`🔍 EMERGENCY IMAGE SELECTION for: "${title}"`)
  
  // PRIORITY 1: EMERGENCY EXACT TITLE MATCHES - Force correct images
  for (const [keyword, imageUrl] of Object.entries(COMPREHENSIVE_IMAGE_MAP)) {
    if (normalizedTitle === keyword) {
      console.log(`✅ EMERGENCY EXACT MATCH "${keyword}" → ${imageUrl}`)
      return `${imageUrl}&t=${timestamp}`
    }
  }
  
  // PRIORITY 2: Partial matches with high priority keywords  
  for (const [keyword, imageUrl] of Object.entries(COMPREHENSIVE_IMAGE_MAP)) {
    if (normalizedTitle.includes(keyword) && keyword.length > 10) {
      console.log(`✅ EMERGENCY PARTIAL MATCH "${keyword}" → ${imageUrl}`)
      return `${imageUrl}&t=${timestamp}`
    }
  }
  
  // PRIORITY 3: Content-based matches with enhanced scoring
  const searchText = (title + ' ' + content.slice(0, 500)).toLowerCase()
  let bestMatch = { keyword: '', score: 0, imageUrl: '' }
  
  for (const [keyword, imageUrl] of Object.entries(COMPREHENSIVE_IMAGE_MAP)) {
    if (searchText.includes(keyword)) {
      // Enhanced scoring: exact matches get bonus, longer phrases get higher priority
      let score = keyword.length
      if (normalizedTitle.includes(keyword)) score += 20 // Title match bonus
      if (keyword.includes('national day') || keyword.includes('independence')) score += 15 // Patriotic bonus
      if (keyword.includes('district')) score += 10 // Location specificity bonus
      
      if (score > bestMatch.score) {
        bestMatch = { keyword, score, imageUrl }
      }
    }
  }
  
  if (bestMatch.imageUrl) {
    console.log(`Enhanced match "${bestMatch.keyword}" (score: ${bestMatch.score}) for: ${title}`)
    return `${bestMatch.imageUrl}&t=${timestamp}`
  }
  
  // PRIORITY 3: Category-specific diverse fallbacks
  console.log(`Using enhanced category fallback for: ${title}`)
  const fallbackImage = CATEGORY_FALLBACKS[category] || CATEGORY_FALLBACKS['MARKET_INSIGHTS']
  return `${fallbackImage}&t=${timestamp}`
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

    console.log('=== Starting Comprehensive Article Image Fix ===')
    
    // Dynamic import to avoid build-time initialization
    const { prisma } = await import('@/lib/prisma')
    
    // Get all articles
    const articles = await prisma.article.findMany({
      select: {
        id: true,
        title: true,
        content: true,
        category: true,
        featuredImage: true,
        slug: true
      },
      orderBy: { createdAt: 'desc' }
    })

    console.log(`Found ${articles.length} articles to process`)

    const updates = []
    
    for (const article of articles) {
      const newImage = getRelevantImage(article.title, article.content, article.category)
      
      if (newImage !== article.featuredImage) {
        console.log(`\nUpdating: ${article.title}`)
        console.log(`  FROM: ${article.featuredImage}`)
        console.log(`  TO:   ${newImage}`)
        
        await prisma.article.update({
          where: { id: article.id },
          data: { featuredImage: newImage }
        })
        
        updates.push({
          id: article.id,
          title: article.title,
          category: article.category,
          oldImage: article.featuredImage,
          newImage: newImage,
          url: `https://singapore-property-hub.vercel.app/articles/${article.slug}`
        })
      }
    }

    console.log(`\n✅ Updated ${updates.length} articles`)

    return NextResponse.json({
      success: true,
      message: 'Comprehensive article image fix completed',
      articlesChecked: articles.length,
      articlesUpdated: updates.length,
      updates: updates
    })

  } catch (error) {
    console.error('Error fixing article images:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fix article images', 
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
        changesNeeded: 0,
        preview: []
      })
    }

    // Dynamic import to avoid build-time initialization
    const { prisma } = await import('@/lib/prisma')
    
    // Preview what would be changed
    const articles = await prisma.article.findMany({
      select: {
        id: true,
        title: true,
        content: true,
        category: true,
        featuredImage: true,
        slug: true
      },
      orderBy: { createdAt: 'desc' }
    })

    const preview = articles.map(article => {
      const suggestedImage = getRelevantImage(article.title, article.content, article.category)
      return {
        id: article.id,
        title: article.title,
        category: article.category,
        currentImage: article.featuredImage,
        suggestedImage: suggestedImage,
        wouldChange: suggestedImage !== article.featuredImage,
        url: `https://singapore-property-hub.vercel.app/articles/${article.slug}`
      }
    })

    const changesNeeded = preview.filter(p => p.wouldChange)

    return NextResponse.json({
      message: 'Preview of image changes',
      totalArticles: articles.length,
      changesNeeded: changesNeeded.length,
      preview: changesNeeded
    })

  } catch (error) {
    console.error('Error previewing article images:', error)
    return NextResponse.json(
      { error: 'Failed to preview images', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}