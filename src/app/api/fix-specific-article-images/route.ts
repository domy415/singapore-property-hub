import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST() {
  try {
    console.log('=== Fixing Specific Article Images ===')
    
    // Define specific image fixes for problematic articles
    const imageMap: { [key: string]: string } = {
      // National Day articles - Singapore skyline/flag imagery
      'celebrating national day': 'https://images.unsplash.com/photo-ugr4n5X4YjI?w=1200&h=630&q=80', // Premium Marina Bay skyline
      'navigating the singapore property market': 'https://images.unsplash.com/photo-IRhO5KF0YVc?w=1200&h=630&q=80', // Marina Bay twilight
      
      // District guides - HDB and district imagery  
      'ultimate guide to living in district 12': 'https://images.unsplash.com/photo-zIp4YexPPhQ?w=1200&h=630&q=80', // Authentic HDB by Danist Soh
      'ultimate guide to living in district 2': 'https://images.unsplash.com/photo-1567360425618-1594206637d2?w=1200&h=630&q=80', // Singapore CBD
      
      // Market insights - Singapore property related
      'weekend property picks': 'https://images.unsplash.com/photo-1519897831810-a9a01aceccd1?w=1200&h=630&q=80', // Singapore skyline
      'navigating singapore\'s property market': 'https://images.unsplash.com/photo-1533628635777-112b2239b1c7?w=1200&h=630&q=80', // Singapore Marina Bay
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
      
      // Apply specific fixes for categories
      if (!newImage) {
        if (article.category === 'NEIGHBORHOOD' || titleLower.includes('district')) {
          newImage = 'https://images.unsplash.com/photo-zIp4YexPPhQ?w=1200&h=630&q=80' // HDB residential
        } else if (article.category === 'MARKET_INSIGHTS' && (titleLower.includes('national') || titleLower.includes('singapore'))) {
          newImage = 'https://images.unsplash.com/photo-ugr4n5X4YjI?w=1200&h=630&q=80' // Marina Bay skyline
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