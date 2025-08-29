import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Singapore Property Image Finder Agent - Enhanced Rules (Updated 2025-08-29)
const COMPREHENSIVE_IMAGE_MAP: { [key: string]: string } = {
  // District 12 - Toa Payoh, Balestier, Serangoon (HDB heartland) - Dragon Playground iconic
  'ultimate guide to living in district 12': 'https://images.unsplash.com/photo-zIp4YexPPhQ?w=1200&h=630&q=80', // Authentic Toa Payoh HDB blocks by Danist Soh  
  'district 12': 'https://images.unsplash.com/photo-zIp4YexPPhQ?w=1200&h=630&q=80', // Authentic Toa Payoh HDB blocks by Danist Soh
  'balestier': 'https://images.unsplash.com/photo-zIp4YexPPhQ?w=1200&h=630&q=80', // Singapore HDB with void decks
  'toa payoh': 'https://images.unsplash.com/photo-zIp4YexPPhQ?w=1200&h=630&q=80', // Toa Payoh Dragon Playground area
  'serangoon': 'https://images.unsplash.com/photo-zIp4YexPPhQ?w=1200&h=630&q=80', // Northeast HDB heartland
  
  // District 2 - CBD, Tanjong Pagar, Anson (Financial district) - Marina Bay Sands backdrop
  'ultimate guide to living in district 2': 'https://images.unsplash.com/photo-1567360425618-1594206637d2?w=1200&h=630&q=80', // Singapore CBD skyline with Marina Bay
  'district 2': 'https://images.unsplash.com/photo-1567360425618-1594206637d2?w=1200&h=630&q=80', // Singapore CBD skyline with Marina Bay
  'tanjong pagar': 'https://images.unsplash.com/photo-1567360425618-1594206637d2?w=1200&h=630&q=80', // CBD financial district
  'anson': 'https://images.unsplash.com/photo-1567360425618-1594206637d2?w=1200&h=630&q=80', // Singapore business district
  'cbd': 'https://images.unsplash.com/photo-1567360425618-1594206637d2?w=1200&h=630&q=80', // Central Business District
  
  // National Day themed - Singapore celebrations with Marina Bay Sands
  'celebrating national day': 'https://images.unsplash.com/photo-1533628635777-112b2239b1c7?w=1200&h=630&q=80', // Marina Bay Sands Singapore celebration
  'national day': 'https://images.unsplash.com/photo-1533628635777-112b2239b1c7?w=1200&h=630&q=80', // Marina Bay Sands Singapore celebration
  'independence': 'https://images.unsplash.com/photo-1533628635777-112b2239b1c7?w=1200&h=630&q=80', // Singapore skyline patriotic
  '59th independence': 'https://images.unsplash.com/photo-1533628635777-112b2239b1c7?w=1200&h=630&q=80', // National Day 2025
  'singapore independence': 'https://images.unsplash.com/photo-1533628635777-112b2239b1c7?w=1200&h=630&q=80', // Singapore flag Marina Bay
  'independence planning': 'https://images.unsplash.com/photo-1533628635777-112b2239b1c7?w=1200&h=630&q=80', // Singapore skyline
  'navigating singapore property market national day': 'https://images.unsplash.com/photo-1533628635777-112b2239b1c7?w=1200&h=630&q=80', // Marina Bay National Day
  
  // Market navigation themed 
  'navigating the waves': 'https://images.unsplash.com/photo-1533628635777-112b2239b1c7?w=1200&h=630&q=80', // Marina Bay for market navigation
  
  // Specific property types with authentic Singapore architecture
  'hdb': 'https://images.unsplash.com/photo-zIp4YexPPhQ?w=1200&h=630&q=80', // Authentic Singapore HDB flats
  'public housing': 'https://images.unsplash.com/photo-zIp4YexPPhQ?w=1200&h=630&q=80', // HDB with void decks
  'condo': 'https://images.unsplash.com/photo-kNzqXxlvmE4?w=1200&h=630&q=80', // Singapore condo development
  'condominium': 'https://images.unsplash.com/photo-kNzqXxlvmE4?w=1200&h=630&q=80', // Modern Singapore condos
  'cooling measures': 'https://images.unsplash.com/photo-1567360425618-1594206637d2?w=1200&h=630&q=80', // Government district CBD
  
  // Market insights with Marina Bay prominence
  'property market': 'https://images.unsplash.com/photo-1533628635777-112b2239b1c7?w=1200&h=630&q=80', // Singapore skyline Marina Bay Sands
  'market insight': 'https://images.unsplash.com/photo-1533628635777-112b2239b1c7?w=1200&h=630&q=80', // Iconic Singapore cityscape
  'market outlook': 'https://images.unsplash.com/photo-1533628635777-112b2239b1c7?w=1200&h=630&q=80', // Singapore financial center
  'weekend property': 'https://images.unsplash.com/photo-zIp4YexPPhQ?w=1200&h=630&q=80', // Singapore residential living
  
  // URA and government related
  'ura': 'https://images.unsplash.com/photo-1567360425618-1594206637d2?w=1200&h=630&q=80', // Singapore government district
  'urban redevelopment': 'https://images.unsplash.com/photo-kNzqXxlvmE4?w=1200&h=630&q=80', // Development construction
  'property price index': 'https://images.unsplash.com/photo-1533628635777-112b2239b1c7?w=1200&h=630&q=80', // Singapore economic center
  
  // Specific developments with Marina Bay backdrop
  'bloomsbury': 'https://images.unsplash.com/photo-kNzqXxlvmE4?w=1200&h=630&q=80', // New Singapore development
  'wallich residence': 'https://images.unsplash.com/photo-1567360425618-1594206637d2?w=1200&h=630&q=80', // Tallest residential CBD
  'greater southern waterfront': 'https://images.unsplash.com/photo-1533628635777-112b2239b1c7?w=1200&h=630&q=80', // Marina Bay waterfront
}

// Fallback images by category - Singapore Property Image Finder Agent Standards
const CATEGORY_FALLBACKS: { [key: string]: string } = {
  'MARKET_INSIGHTS': 'https://images.unsplash.com/photo-1533628635777-112b2239b1c7?w=1200&h=630&q=80', // Marina Bay Sands economic center
  'BUYING_GUIDE': 'https://images.unsplash.com/photo-kNzqXxlvmE4?w=1200&h=630&q=80', // Singapore condo development
  'NEIGHBORHOOD': 'https://images.unsplash.com/photo-zIp4YexPPhQ?w=1200&h=630&q=80', // Authentic HDB heartland by Danist Soh
  'LOCATION_GUIDE': 'https://images.unsplash.com/photo-1567360425618?w=1200&h=630&q=80', // Singapore CBD district
  'PROPERTY_NEWS': 'https://images.unsplash.com/photo-1533628635777-112b2239b1c7?w=1200&h=630&q=80', // Singapore skyline news
  'NEW_LAUNCH_REVIEW': 'https://images.unsplash.com/photo-kNzqXxlvmE4?w=1200&h=630&q=80', // New Singapore development
  'INVESTMENT': 'https://images.unsplash.com/photo-1567360425618?w=1200&h=630&q=80', // CBD financial district
  'SELLING_GUIDE': 'https://images.unsplash.com/photo-1533628635777-112b2239b1c7?w=1200&h=630&q=80', // Singapore property market
}

function getRelevantImage(title: string, content: string, category: string): string {
  const searchText = (title + ' ' + content.slice(0, 500)).toLowerCase()
  const timestamp = Date.now() // Cache-busting timestamp
  
  // Check for specific matches with priority scoring
  let bestMatch = { keyword: '', score: 0, imageUrl: '' }
  
  for (const [keyword, imageUrl] of Object.entries(COMPREHENSIVE_IMAGE_MAP)) {
    if (searchText.includes(keyword)) {
      const score = keyword.length // Longer matches get higher priority
      if (score > bestMatch.score) {
        bestMatch = { keyword, score, imageUrl }
      }
    }
  }
  
  if (bestMatch.imageUrl) {
    console.log(`Best match "${bestMatch.keyword}" (score: ${bestMatch.score}) for title: ${title}`)
    return `${bestMatch.imageUrl}&t=${timestamp}`
  }
  
  // Fall back to category-specific image
  console.log(`Using category fallback for: ${title}`)
  const fallbackImage = CATEGORY_FALLBACKS[category] || CATEGORY_FALLBACKS['MARKET_INSIGHTS']
  return `${fallbackImage}&t=${timestamp}`
}

export async function POST() {
  try {
    console.log('=== Starting Comprehensive Article Image Fix ===')
    
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