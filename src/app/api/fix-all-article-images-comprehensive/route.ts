import { NextResponse } from 'next/server'

// SINGAPORE PROPERTY IMAGE FINDER AGENT - COMPLIANT IMPLEMENTATION
// Following the agent guidelines with proper Singapore-specific imagery
const COMPREHENSIVE_IMAGE_MAP: { [key: string]: string } = {
  // EXACT TITLE MATCHES - Agent Guidelines Compliant
  'navigating the waves of singapore\'s property market: an expert analysis': 'https://images.unsplash.com/photo-1567360425618-1594206637d2?w=1200&h=630&q=80', // Singapore CBD skyline for navigation/market analysis
  'celebrating national day: insights into singapore\'s property market in 2025': 'https://images.unsplash.com/photo-1631086459917-a18a7dbb1699?w=1200&h=630&q=80', // Singapore flag by Danist Soh - patriotic content
  'navigating the singapore property market: a national day 2025 special': 'https://images.unsplash.com/photo-1631086459917-a18a7dbb1699?w=1200&h=630&q=80', // Singapore patriotic imagery
  'navigating singapore\'s property market: a guide to independence planning': 'https://images.unsplash.com/photo-1631086459917-a18a7dbb1699?w=1200&h=630&q=80', // Singapore independence celebration
  'navigating singapore\'s evolving family home market: an insider\'s analysis': 'https://images.unsplash.com/photo-1567360425618-1594206637d2?w=1200&h=630&q=80', // Singapore skyline for market analysis
  'navigating singapore property: an expert analysis of saturday showroom tours': 'https://images.unsplash.com/photo-1567360425618-1594206637d2?w=1200&h=630&q=80', // Singapore property market imagery
  
  // District-specific - Agent Guidelines Compliant
  'ultimate guide to living in district 12: balestier, toa payoh, serangoon': 'https://images.unsplash.com/photo-1560036486-def2e0dbebb7?w=1200&h=630&q=80', // Authentic Toa Payoh neighborhood by Rival Sitorus
  'ultimate guide to living in district 2: anson & tanjong pagar, singapore': 'https://images.unsplash.com/photo-1567360425618-1594206637d2?w=1200&h=630&q=80', // Singapore CBD skyline
  'district 12': 'https://images.unsplash.com/photo-1560036486-def2e0dbebb7?w=1200&h=630&q=80', // Toa Payoh authentic HDB community
  'balestier': 'https://images.unsplash.com/photo-1560036486-def2e0dbebb7?w=1200&h=630&q=80', // District 12 heartland
  'toa payoh': 'https://images.unsplash.com/photo-1560036486-def2e0dbebb7?w=1200&h=630&q=80', // Toa Payoh neighborhood
  'serangoon': 'https://images.unsplash.com/photo-1560036486-def2e0dbebb7?w=1200&h=630&q=80', // Northeast Singapore community
  
  // District 2 - CBD, Tanjong Pagar, Anson (Financial district)
  'ultimate guide to living in district 2': 'https://images.unsplash.com/photo-1567360425618-1594206637d2?w=1200&h=630&q=80', // Singapore CBD skyline
  'district 2': 'https://images.unsplash.com/photo-1567360425618-1594206637d2?w=1200&h=630&q=80', // Tanjong Pagar CBD
  'tanjong pagar': 'https://images.unsplash.com/photo-1567360425618-1594206637d2?w=1200&h=630&q=80', // Financial district
  'anson': 'https://images.unsplash.com/photo-1567360425618-1594206637d2?w=1200&h=630&q=80', // Singapore business core
  
  // Government and Policy - Singapore content (agent guidelines)
  'cooling measures': 'https://images.unsplash.com/photo-1567360425618-1594206637d2?w=1200&h=630&q=80', // Singapore CBD for government policy content
  'understanding singapore\'s cooling measures': 'https://images.unsplash.com/photo-1567360425618-1594206637d2?w=1200&h=630&q=80', // Singapore skyline for policy analysis
  'navigating singapore\'s cooling measures': 'https://images.unsplash.com/photo-1567360425618-1594206637d2?w=1200&h=630&q=80', // Singapore market analysis
  
  // HDB vs Private Property themed - Agent compliant 
  'hdb vs private property': 'https://images.unsplash.com/photo-1648365300669-e7b760c6d240?w=1200&h=630&q=80', // Singapore HDB void deck community space
  'hdb': 'https://images.unsplash.com/photo-1648365300669-e7b760c6d240?w=1200&h=630&q=80', // Authentic Singapore HDB with community space
  'public housing': 'https://images.unsplash.com/photo-1648365300669-e7b760c6d240?w=1200&h=630&q=80', // HDB void deck authentic
  
  // Weekend and Market Insights - Agent compliant
  'weekend property picks': 'https://images.unsplash.com/photo-1508964942454-1a56651d54ac?w=1200&h=630&q=80', // Modern Singapore property for weekend viewing
  'weekend property': 'https://images.unsplash.com/photo-1508964942454-1a56651d54ac?w=1200&h=630&q=80', // Singapore modern residential
  
  // New Launch and Development - Agent compliant
  'bloomsbury residences': 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&h=630&q=80', // Modern Singapore condo development
  'bloomsbury': 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&h=630&q=80', // Singapore condo construction
  'new launch': 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&h=630&q=80', // Singapore new development
  'condo': 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&h=630&q=80', // Singapore condominium
  
  // National Day and Independence - Agent compliant with Singapore flag
  'celebrating national day': 'https://images.unsplash.com/photo-1631086459917-a18a7dbb1699?w=1200&h=630&q=80', // Singapore flag by Danist Soh
  'national day': 'https://images.unsplash.com/photo-1631086459917-a18a7dbb1699?w=1200&h=630&q=80', // Singapore patriotic flag
  'independence': 'https://images.unsplash.com/photo-1631086459917-a18a7dbb1699?w=1200&h=630&q=80', // Singapore independence flag
  'singapore independence': 'https://images.unsplash.com/photo-1631086459917-a18a7dbb1699?w=1200&h=630&q=80', // Singapore flag celebration
  'independence planning': 'https://images.unsplash.com/photo-1631086459917-a18a7dbb1699?w=1200&h=630&q=80', // Singapore flag planning
  
  // Market Analysis - Agent compliant with Singapore skyline
  'property market trends': 'https://images.unsplash.com/photo-1567360425618-1594206637d2?w=1200&h=630&q=80', // Singapore CBD skyline for market trends
  'market insight': 'https://images.unsplash.com/photo-1567360425618-1594206637d2?w=1200&h=630&q=80', // Singapore financial district
  'market analysis': 'https://images.unsplash.com/photo-1567360425618-1594206637d2?w=1200&h=630&q=80', // Singapore CBD for market analysis
  'navigating': 'https://images.unsplash.com/photo-1567360425618-1594206637d2?w=1200&h=630&q=80', // Singapore skyline for navigation
}

// Singapore Property Image Finder Agent - Category Fallbacks (Agent Guidelines Compliant)
const CATEGORY_FALLBACKS: { [key: string]: string } = {
  'MARKET_INSIGHTS': 'https://images.unsplash.com/photo-1567360425618-1594206637d2?w=1200&h=630&q=80', // Singapore CBD skyline for market insights
  'BUYING_GUIDE': 'https://images.unsplash.com/photo-1508964942454-1a56651d54ac?w=1200&h=630&q=80', // Modern Singapore property for buyers
  'NEIGHBORHOOD': 'https://images.unsplash.com/photo-1560036486-def2e0dbebb7?w=1200&h=630&q=80', // Singapore residential neighborhood (Toa Payoh)
  'LOCATION_GUIDE': 'https://images.unsplash.com/photo-1560036486-def2e0dbebb7?w=1200&h=630&q=80', // Singapore district community
  'PROPERTY_NEWS': 'https://images.unsplash.com/photo-1648365300669-e7b760c6d240?w=1200&h=630&q=80', // Singapore HDB for property news
  'NEW_LAUNCH_REVIEW': 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&h=630&q=80', // Singapore new development
  'INVESTMENT': 'https://images.unsplash.com/photo-1567360425618-1594206637d2?w=1200&h=630&q=80', // Singapore CBD for investment content
  'SELLING_GUIDE': 'https://images.unsplash.com/photo-1567360425618-1594206637d2?w=1200&h=630&q=80', // Singapore property market skyline
}

// SINGAPORE PROPERTY IMAGE FINDER AGENT - Compliant Image Selection
function getRelevantImage(title: string, content: string, category: string): string {
  const normalizedTitle = title.toLowerCase()
  const timestamp = Date.now() // Cache-busting timestamp
  
  console.log(`🇸🇬 SINGAPORE PROPERTY IMAGE FINDER AGENT for: "${title}"`)
  
  // PRIORITY 1: EXACT TITLE MATCHES - Agent Guidelines Compliant
  for (const [keyword, imageUrl] of Object.entries(COMPREHENSIVE_IMAGE_MAP)) {
    if (normalizedTitle === keyword) {
      console.log(`✅ AGENT EXACT MATCH "${keyword}" → ${imageUrl}`)
      return `${imageUrl}&t=${timestamp}`
    }
  }
  
  // PRIORITY 2: Partial matches with high priority keywords (Agent Guidelines)
  for (const [keyword, imageUrl] of Object.entries(COMPREHENSIVE_IMAGE_MAP)) {
    if (normalizedTitle.includes(keyword) && keyword.length > 10) {
      console.log(`✅ AGENT PARTIAL MATCH "${keyword}" → ${imageUrl}`)
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
    console.log(`✅ AGENT CONTENT MATCH "${bestMatch.keyword}" (score: ${bestMatch.score}) for: ${title}`)
    return `${bestMatch.imageUrl}&t=${timestamp}`
  }
  
  // PRIORITY 4: Agent Category Fallbacks - Singapore-Specific
  console.log(`✅ AGENT CATEGORY FALLBACK: ${category} for: ${title}`)
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

    console.log('=== Singapore Property Image Finder Agent - Comprehensive Update ===')
    
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
      message: 'Singapore Property Image Finder Agent - All articles updated with compliant imagery',
      articlesChecked: articles.length,
      articlesUpdated: updates.length,
      compliance: 'All images now follow Singapore Property Image Finder Agent guidelines',
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