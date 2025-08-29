import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST() {
  try {
    console.log('=== Fixing Specific Article Images ===')
    
    // Singapore Property Image Finder Agent - Authentic Singapore-Specific Image Mappings
    const imageMap: { [key: string]: string } = {
      // National Day articles - Marina Bay Sands Singapore celebrations
      'celebrating national day': 'https://images.unsplash.com/photo-1533628635777-112b2239b1c7?w=1200&h=630&q=80', // Marina Bay Sands celebration
      'navigating the singapore property market': 'https://images.unsplash.com/photo-1533628635777-112b2239b1c7?w=1200&h=630&q=80', // Singapore skyline Marina Bay
      'national day 2025': 'https://images.unsplash.com/photo-1533628635777-112b2239b1c7?w=1200&h=630&q=80', // National Day Marina Bay
      '59th independence': 'https://images.unsplash.com/photo-1533628635777-112b2239b1c7?w=1200&h=630&q=80', // Independence Day Singapore
      
      // District 12 - Toa Payoh HDB heartland with Dragon Playground area
      'ultimate guide to living in district 12': 'https://images.unsplash.com/photo-zIp4YexPPhQ?w=1200&h=630&q=80', // Authentic HDB by Danist Soh
      'district 12': 'https://images.unsplash.com/photo-zIp4YexPPhQ?w=1200&h=630&q=80', // Toa Payoh HDB blocks
      'balestier': 'https://images.unsplash.com/photo-zIp4YexPPhQ?w=1200&h=630&q=80', // HDB heartland
      'toa payoh': 'https://images.unsplash.com/photo-zIp4YexPPhQ?w=1200&h=630&q=80', // Dragon Playground area
      'serangoon': 'https://images.unsplash.com/photo-zIp4YexPPhQ?w=1200&h=630&q=80', // Northeast HDB
      
      // District 2 - CBD financial district with Marina Bay backdrop
      'ultimate guide to living in district 2': 'https://images.unsplash.com/photo-1567360425618?w=1200&h=630&q=80', // Singapore CBD skyline
      'district 2': 'https://images.unsplash.com/photo-1567360425618?w=1200&h=630&q=80', // CBD financial center
      'tanjong pagar': 'https://images.unsplash.com/photo-1567360425618?w=1200&h=630&q=80', // Tanjong Pagar financial
      'anson': 'https://images.unsplash.com/photo-1567360425618?w=1200&h=630&q=80', // Anson business district
      
      // Market insights - Singapore economic center
      'weekend property picks': 'https://images.unsplash.com/photo-zIp4YexPPhQ?w=1200&h=630&q=80', // Singapore residential living
      'property market': 'https://images.unsplash.com/photo-1533628635777-112b2239b1c7?w=1200&h=630&q=80', // Marina Bay economic center
      'market insight': 'https://images.unsplash.com/photo-1533628635777-112b2239b1c7?w=1200&h=630&q=80', // Singapore cityscape
      
      // HDB and public housing
      'hdb vs private': 'https://images.unsplash.com/photo-zIp4YexPPhQ?w=1200&h=630&q=80', // Authentic Singapore HDB
      'hdb': 'https://images.unsplash.com/photo-zIp4YexPPhQ?w=1200&h=630&q=80', // HDB with void decks
      
      // New developments
      'bloomsbury': 'https://images.unsplash.com/photo-kNzqXxlvmE4?w=1200&h=630&q=80', // Singapore development construction
      'cooling measures': 'https://images.unsplash.com/photo-1567360425618?w=1200&h=630&q=80', // Government district
    }

    // Get all articles that might have wrong images
    const articles = await prisma.article.findMany({
      select: {
        id: true,
        title: true,
        category: true,
        featuredImage: true,
        slug: true
      }
    })

    const updates = []
    
    for (const article of articles) {
      const titleLower = article.title.toLowerCase()
      
      // Find matching image based on title keywords
      let newImage = null
      
      for (const [keyword, imageUrl] of Object.entries(imageMap)) {
        if (titleLower.includes(keyword)) {
          newImage = imageUrl
          break
        }
      }
      
      // Apply Singapore Property Image Finder Agent fallback logic
      if (!newImage) {
        if (article.category === 'NEIGHBORHOOD' || titleLower.includes('district')) {
          newImage = 'https://images.unsplash.com/photo-zIp4YexPPhQ?w=1200&h=630&q=80' // Authentic HDB heartland by Danist Soh
        } else if (article.category === 'MARKET_INSIGHTS' || titleLower.includes('singapore') || titleLower.includes('property market')) {
          newImage = 'https://images.unsplash.com/photo-1533628635777-112b2239b1c7?w=1200&h=630&q=80' // Marina Bay Sands economic center
        } else if (article.category === 'BUYING_GUIDE' || titleLower.includes('hdb') || titleLower.includes('private property')) {
          newImage = 'https://images.unsplash.com/photo-zIp4YexPPhQ?w=1200&h=630&q=80' // Singapore HDB residential
        } else if (article.category === 'NEW_LAUNCH_REVIEW' || titleLower.includes('condo') || titleLower.includes('launch')) {
          newImage = 'https://images.unsplash.com/photo-kNzqXxlvmE4?w=1200&h=630&q=80' // Singapore development construction
        } else if (titleLower.includes('national day') || titleLower.includes('independence')) {
          newImage = 'https://images.unsplash.com/photo-1533628635777-112b2239b1c7?w=1200&h=630&q=80' // Marina Bay Sands celebration
        } else if (titleLower.includes('cbd') || titleLower.includes('financial')) {
          newImage = 'https://images.unsplash.com/photo-1567360425618?w=1200&h=630&q=80' // Singapore CBD financial center
        }
      }
      
      if (newImage && newImage !== article.featuredImage) {
        console.log(`Updating ${article.title}`)
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

    console.log(`Updated ${updates.length} article images`)

    return NextResponse.json({
      success: true,
      message: 'Specific article images fixed successfully',
      articlesChecked: articles.length,
      articlesUpdated: updates.length,
      updates: updates
    })

  } catch (error) {
    console.error('Error fixing specific article images:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fix specific article images', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    // Show current problematic articles
    const articles = await prisma.article.findMany({
      where: {
        OR: [
          { title: { contains: 'National Day', mode: 'insensitive' } },
          { title: { contains: 'District 12', mode: 'insensitive' } },
          { title: { contains: 'District 2', mode: 'insensitive' } },
          { title: { contains: 'Balestier', mode: 'insensitive' } },
          { title: { contains: 'Tanjong Pagar', mode: 'insensitive' } },
          { title: { contains: 'Anson', mode: 'insensitive' } }
        ]
      },
      select: {
        id: true,
        title: true,
        category: true,
        featuredImage: true,
        slug: true
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({
      message: 'Current problematic articles',
      articlesFound: articles.length,
      articles: articles.map(article => ({
        ...article,
        url: `https://singapore-property-hub.vercel.app/articles/${article.slug}`,
        needsUpdate: !article.featuredImage?.includes('singapore') && 
                    !article.featuredImage?.includes('photo-ugr4n5X4YjI') &&
                    !article.featuredImage?.includes('photo-zIp4YexPPhQ')
      }))
    })

  } catch (error) {
    console.error('Error getting problematic articles:', error)
    return NextResponse.json(
      { error: 'Failed to get articles', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}