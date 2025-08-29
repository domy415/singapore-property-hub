import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Singapore-specific images with cache-busting timestamps
const SINGAPORE_IMAGES: { [key: string]: string } = {
  // National Day articles - Singapore skylines and flags
  'national_day': `https://images.unsplash.com/photo-1565537449260-e3804e5fe018?w=1200&h=630&q=80&t=${Date.now()}`,
  'independence': `https://images.unsplash.com/photo-1596828325214-7cc80fab4fdf?w=1200&h=630&q=80&t=${Date.now()}`,
  
  // District 12 - HDB heartland imagery
  'district_12': `https://images.unsplash.com/photo-1566275538930-52cf19ffd74a?w=1200&h=630&q=80&t=${Date.now()}`,
  'toa_payoh': `https://images.unsplash.com/photo-1566275538930-52cf19ffd74a?w=1200&h=630&q=80&t=${Date.now()}`,
  
  // District 2 - CBD skyline
  'district_2': `https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=1200&h=630&q=80&t=${Date.now()}`,
  'cbd': `https://images.unsplash.com/photo-1449034446853-66c86144b0ad?w=1200&h=630&q=80&t=${Date.now()}`,
  
  // Property market insights
  'property_market': `https://images.unsplash.com/photo-1519897831810-a9a01aceccd1?w=1200&h=630&q=80&t=${Date.now()}`,
  'market_insight': `https://images.unsplash.com/photo-1533628635777-112b2239b1c7?w=1200&h=630&q=80&t=${Date.now()}`,
  
  // HDB and buying guides
  'hdb': `https://images.unsplash.com/photo-1566275538930-52cf19ffd74a?w=1200&h=630&q=80&t=${Date.now()}`,
  'buying_guide': `https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&h=630&q=80&t=${Date.now()}`,
  
  // Cooling measures and government
  'cooling_measures': `https://images.unsplash.com/photo-1570372226816-51277b9c2b98?w=1200&h=630&q=80&t=${Date.now()}`
}

function getImageForArticle(title: string, content: string): string {
  const searchText = (title + ' ' + content.slice(0, 500)).toLowerCase()
  
  // National Day themed
  if (searchText.includes('national day') || searchText.includes('independence')) {
    return SINGAPORE_IMAGES.national_day
  }
  
  // District specific
  if (searchText.includes('district 12') || searchText.includes('toa payoh') || searchText.includes('balestier')) {
    return SINGAPORE_IMAGES.district_12
  }
  
  if (searchText.includes('district 2') || searchText.includes('tanjong pagar') || searchText.includes('anson')) {
    return SINGAPORE_IMAGES.district_2
  }
  
  // Property types
  if (searchText.includes('hdb') || searchText.includes('buying guide')) {
    return SINGAPORE_IMAGES.hdb
  }
  
  if (searchText.includes('cooling measures')) {
    return SINGAPORE_IMAGES.cooling_measures
  }
  
  // Default to property market
  return SINGAPORE_IMAGES.property_market
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