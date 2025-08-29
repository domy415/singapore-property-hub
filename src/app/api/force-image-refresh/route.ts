import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Singapore Property Image Finder Agent - Authentic Singapore-Specific Images with Cache-Busting
const SINGAPORE_IMAGES: { [key: string]: string } = {
  // National Day articles - Marina Bay Sands Singapore celebrations
  'national_day': `https://images.unsplash.com/photo-1533628635777-112b2239b1c7?w=1200&h=630&q=80&t=${Date.now()}`, // Marina Bay Sands celebration
  'independence': `https://images.unsplash.com/photo-1533628635777-112b2239b1c7?w=1200&h=630&q=80&t=${Date.now()}`, // Singapore skyline patriotic
  
  // District 12 - Toa Payoh HDB heartland with Dragon Playground area (Authentic by Danist Soh)
  'district_12': `https://images.unsplash.com/photo-zIp4YexPPhQ?w=1200&h=630&q=80&t=${Date.now()}`, // Authentic Toa Payoh HDB blocks by Danist Soh - FREE LICENSE
  'toa_payoh': `https://images.unsplash.com/photo-zIp4YexPPhQ?w=1200&h=630&q=80&t=${Date.now()}`, // Dragon Playground area HDB
  'balestier': `https://images.unsplash.com/photo-zIp4YexPPhQ?w=1200&h=630&q=80&t=${Date.now()}`, // HDB heartland with void decks
  
  // District 2 - CBD financial district with Marina Bay backdrop
  'district_2': `https://images.unsplash.com/photo-1567360425618?w=1200&h=630&q=80&t=${Date.now()}`, // Singapore CBD skyline with Marina Bay
  'cbd': `https://images.unsplash.com/photo-1567360425618?w=1200&h=630&q=80&t=${Date.now()}`, // Central Business District financial center
  'tanjong_pagar': `https://images.unsplash.com/photo-1567360425618?w=1200&h=630&q=80&t=${Date.now()}`, // Tanjong Pagar financial district
  
  // Property market insights - Singapore economic center with Marina Bay Sands
  'property_market': `https://images.unsplash.com/photo-1533628635777-112b2239b1c7?w=1200&h=630&q=80&t=${Date.now()}`, // Marina Bay Sands economic center
  'market_insight': `https://images.unsplash.com/photo-1533628635777-112b2239b1c7?w=1200&h=630&q=80&t=${Date.now()}`, // Iconic Singapore cityscape
  'singapore_property': `https://images.unsplash.com/photo-1533628635777-112b2239b1c7?w=1200&h=630&q=80&t=${Date.now()}`, // Singapore financial center
  
  // HDB and buying guides - Authentic Singapore public housing
  'hdb': `https://images.unsplash.com/photo-zIp4YexPPhQ?w=1200&h=630&q=80&t=${Date.now()}`, // Authentic Singapore HDB by Danist Soh
  'buying_guide': `https://images.unsplash.com/photo-zIp4YexPPhQ?w=1200&h=630&q=80&t=${Date.now()}`, // Singapore residential HDB
  'weekend_property': `https://images.unsplash.com/photo-zIp4YexPPhQ?w=1200&h=630&q=80&t=${Date.now()}`, // Singapore residential living
  
  // New developments and construction
  'condo_development': `https://images.unsplash.com/photo-kNzqXxlvmE4?w=1200&h=630&q=80&t=${Date.now()}`, // Singapore development construction - FREE LICENSE
  'new_launch': `https://images.unsplash.com/photo-kNzqXxlvmE4?w=1200&h=630&q=80&t=${Date.now()}`, // Active Singapore development
  
  // Cooling measures and government
  'cooling_measures': `https://images.unsplash.com/photo-1567360425618?w=1200&h=630&q=80&t=${Date.now()}`, // Government district CBD
}

function getImageForArticle(title: string, content: string): string {
  const searchText = (title + ' ' + content.slice(0, 500)).toLowerCase()
  
  // Singapore Property Image Finder Agent - Decision Tree Logic
  
  // Priority 1: National Day themed - Marina Bay Sands Singapore celebrations
  if (searchText.includes('national day') || searchText.includes('independence') || searchText.includes('59th independence')) {
    return SINGAPORE_IMAGES.national_day
  }
  
  // Priority 2: District-specific with iconic elements
  if (searchText.includes('district 12') || searchText.includes('toa payoh') || searchText.includes('balestier') || searchText.includes('serangoon')) {
    return SINGAPORE_IMAGES.district_12 // Dragon Playground area, HDB with void decks
  }
  
  if (searchText.includes('district 2') || searchText.includes('tanjong pagar') || searchText.includes('anson') || searchText.includes('cbd')) {
    return SINGAPORE_IMAGES.district_2 // Marina Bay backdrop, financial center
  }
  
  // Priority 3: Property types with architectural intelligence
  if (searchText.includes('hdb') || searchText.includes('public housing') || searchText.includes('buying guide')) {
    return SINGAPORE_IMAGES.hdb // Authentic HDB with void decks by Danist Soh
  }
  
  if (searchText.includes('condo') || searchText.includes('condominium') || searchText.includes('new launch') || searchText.includes('bloomsbury')) {
    return SINGAPORE_IMAGES.condo_development // Singapore development construction
  }
  
  if (searchText.includes('cooling measures') || searchText.includes('government') || searchText.includes('ura')) {
    return SINGAPORE_IMAGES.cooling_measures // Government district CBD
  }
  
  // Priority 4: Market content - Marina Bay prominence
  if (searchText.includes('weekend property') || searchText.includes('weekend picks')) {
    return SINGAPORE_IMAGES.weekend_property // Singapore residential living
  }
  
  if (searchText.includes('property market') || searchText.includes('market insight') || searchText.includes('singapore property')) {
    return SINGAPORE_IMAGES.property_market // Marina Bay Sands economic center
  }
  
  // Default fallback - Singapore economic center
  return SINGAPORE_IMAGES.market_insight // Iconic Singapore cityscape with Marina Bay Sands
}

export async function POST() {
  try {
    console.log('=== Force Image Refresh with Cache Busting ===')
    
    const articles = await prisma.article.findMany({
      select: {
        id: true,
        title: true,
        content: true,
        featuredImage: true,
        slug: true
      },
      orderBy: { createdAt: 'desc' }
    })

    console.log(`Found ${articles.length} articles to refresh`)

    const updates = []
    
    for (const article of articles) {
      const newImage = getImageForArticle(article.title, article.content)
      
      console.log(`\nRefreshing: ${article.title}`)
      console.log(`  New URL: ${newImage}`)
      
      await prisma.article.update({
        where: { id: article.id },
        data: { featuredImage: newImage }
      })
      
      updates.push({
        id: article.id,
        title: article.title,
        oldImage: article.featuredImage,
        newImage: newImage,
        url: `https://singapore-property-hub.vercel.app/articles/${article.slug}`
      })
    }

    console.log(`\n✅ Refreshed ${updates.length} articles with cache-busting URLs`)

    return NextResponse.json({
      success: true,
      message: 'Force image refresh completed with cache busting',
      articlesRefreshed: updates.length,
      timestamp: new Date().toISOString(),
      updates: updates
    })

  } catch (error) {
    console.error('Error forcing image refresh:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to force image refresh', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}