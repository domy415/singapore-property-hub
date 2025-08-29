import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Comprehensive image mapping based on article titles and content
const COMPREHENSIVE_IMAGE_MAP: { [key: string]: string } = {
  // District 12 - Toa Payoh, Balestier, Serangoon (HDB heartland)
  'district 12': 'https://images.unsplash.com/photo-1566275538930-52cf19ffd74a?w=1200&h=630&q=80', // Toa Payoh HDB blocks
  'balestier': 'https://images.unsplash.com/photo-1609173376510-88497b5a7a47?w=1200&h=630&q=80', // Singapore residential blocks
  'toa payoh': 'https://images.unsplash.com/photo-1566275538930-52cf19ffd74a?w=1200&h=630&q=80', // Toa Payoh HDB
  'serangoon': 'https://images.unsplash.com/photo-1571646035279-42148de342c0?w=1200&h=630&q=80', // Serangoon residential
  
  // District 2 - CBD, Tanjong Pagar, Anson (Financial district)
  'district 2': 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=1200&h=630&q=80', // Singapore CBD skyline
  'tanjong pagar': 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=1200&h=630&q=80', // Tanjong Pagar Centre
  'anson': 'https://images.unsplash.com/photo-1449034446853-66c86144b0ad?w=1200&h=630&q=80', // Singapore CBD buildings
  'cbd': 'https://images.unsplash.com/photo-1449034446853-66c86144b0ad?w=1200&h=630&q=80', // CBD skyline
  
  // National Day themed
  'national day': 'https://images.unsplash.com/photo-1565537449260-e3804e5fe018?w=1200&h=630&q=80', // Singapore National Day flag
  'independence': 'https://images.unsplash.com/photo-1596828325214-7cc80fab4fdf?w=1200&h=630&q=80', // Singapore flag celebration
  
  // Specific property types
  'hdb': 'https://images.unsplash.com/photo-1566275538930-52cf19ffd74a?w=1200&h=630&q=80', // HDB flats
  'condo': 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&h=630&q=80', // Singapore condos
  'cooling measures': 'https://images.unsplash.com/photo-1570372226816-51277b9c2b98?w=1200&h=630&q=80', // Government buildings
  
  // Market insights
  'property market': 'https://images.unsplash.com/photo-1519897831810-a9a01aceccd1?w=1200&h=630&q=80', // Singapore skyline overview
  'market insight': 'https://images.unsplash.com/photo-1533628635777-112b2239b1c7?w=1200&h=630&q=80', // Marina Bay Sands
  'weekend property': 'https://images.unsplash.com/photo-1565967511849-76a60a516170?w=1200&h=630&q=80', // Singapore residential
  
  // Specific developments
  'bloomsbury': 'https://images.unsplash.com/photo-1567684014761-b65e2e59b9eb?w=1200&h=630&q=80', // Modern condo
  'wallich residence': 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=1200&h=630&q=80', // Tallest building
  'greater southern waterfront': 'https://images.unsplash.com/photo-1596829325214-7cc80fab4fdf?w=1200&h=630&q=80', // Waterfront
}

// Fallback images by category
const CATEGORY_FALLBACKS: { [key: string]: string } = {
  'MARKET_INSIGHTS': 'https://images.unsplash.com/photo-1519897831810-a9a01aceccd1?w=1200&h=630&q=80',
  'BUYING_GUIDE': 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&h=630&q=80',
  'NEIGHBORHOOD': 'https://images.unsplash.com/photo-1566275538930-52cf19ffd74a?w=1200&h=630&q=80',
  'LOCATION_GUIDE': 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1200&h=630&q=80',
  'PROPERTY_NEWS': 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&h=630&q=80',
  'NEW_LAUNCH_REVIEW': 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&h=630&q=80',
  'INVESTMENT': 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=1200&h=630&q=80',
  'SELLING_GUIDE': 'https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=1200&h=630&q=80',
}

function getRelevantImage(title: string, content: string, category: string): string {
  const searchText = (title + ' ' + content.slice(0, 500)).toLowerCase()
  
  // Check for specific matches
  for (const [keyword, imageUrl] of Object.entries(COMPREHENSIVE_IMAGE_MAP)) {
    if (searchText.includes(keyword)) {
      console.log(`Matched "${keyword}" for title: ${title}`)
      return imageUrl
    }
  }
  
  // Fall back to category-specific image
  console.log(`Using category fallback for: ${title}`)
  return CATEGORY_FALLBACKS[category] || CATEGORY_FALLBACKS['MARKET_INSIGHTS']
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