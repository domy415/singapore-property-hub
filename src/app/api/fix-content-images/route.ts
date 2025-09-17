import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // Build guard: Prevent execution during Next.js build phase
  if (process.env.NEXT_PHASE === 'phase-production-build' || process.env.NODE_ENV === 'test') {
    return NextResponse.json({
      success: false,
      error: 'Image fix not available during build phase'
    }, { status: 503 });
  }

  try {
    // Dynamic import to prevent build-time issues
    const { prisma } = await import('@/lib/prisma')
    
    console.log('Analyzing and fixing content-inappropriate images...')
    
    // Get all articles that need image fixes
    const articles = await prisma.article.findMany({
      select: { id: true, title: true, category: true, featuredImage: true },
      orderBy: { publishedAt: 'desc' }
    })
    
    const updates = []
    
    for (const article of articles) {
      const title = article.title.toLowerCase()
      let newImageUrl = null
      let reason = ''
      
      // DISTRICT-SPECIFIC FIXES
      if (title.includes('district 12') || title.includes('toa payoh') || title.includes('balestier')) {
        newImageUrl = 'https://images.unsplash.com/photo-zIp4YexPPhQ?w=1200&h=630&q=80'
        reason = 'District 12 needs authentic Toa Payoh HDB imagery'
      } else if (title.includes('district 2') || title.includes('cbd') || title.includes('tanjong pagar') || title.includes('anson')) {
        newImageUrl = 'https://images.unsplash.com/photo-1567360425618-1594206637d2?w=1200&h=630&q=80'
        reason = 'District 2 needs Singapore CBD skyline imagery'
      }
      // NATIONAL DAY/CELEBRATION FIXES
      else if (title.includes('national day') || title.includes('celebrating') || title.includes('independence')) {
        newImageUrl = 'https://images.unsplash.com/photo-1533628635777-112b2239b1c7?w=1200&h=630&q=80'
        reason = 'National Day content needs Singapore celebration imagery'
      }
      // HDB CONTENT FIXES
      else if (title.includes('hdb') || title.includes('public housing') || title.includes('vs private')) {
        newImageUrl = 'https://images.unsplash.com/photo-zIp4YexPPhQ?w=1200&h=630&q=80'
        reason = 'HDB content needs authentic Singapore public housing imagery'
      }
      // PROPERTY-SPECIFIC FIXES
      else if (title.includes('bloomsbury')) {
        newImageUrl = 'https://images.unsplash.com/photo-1565967511849-76a60a516170?w=1200&h=630&q=80'
        reason = 'Bloomsbury review needs luxury condo imagery'
      } else if (title.includes('grand dunman')) {
        newImageUrl = 'https://images.unsplash.com/photo-kNzqXxlvmE4?w=1200&h=630&q=80'
        reason = 'Grand Dunman needs modern development imagery'
      }
      
      // Update if new image needed
      if (newImageUrl && newImageUrl !== article.featuredImage) {
        try {
          await prisma.article.update({
            where: { id: article.id },
            data: { 
              featuredImage: newImageUrl + `&t=${Date.now()}` // Cache busting
            }
          })
          
          updates.push({
            title: article.title,
            oldImage: article.featuredImage,
            newImage: newImageUrl,
            reason,
            updated: true
          })
          
          console.log(`✅ Fixed: ${article.title}`)
        } catch (error) {
          console.error(`Failed to update ${article.title}:`, error)
          updates.push({
            title: article.title,
            reason,
            error: error instanceof Error ? error.message : 'Unknown error',
            updated: false
          })
        }
      } else {
        updates.push({
          title: article.title,
          reason: 'Image already appropriate or no specific rule',
          updated: false
        })
      }
    }
    
    const successCount = updates.filter(u => u.updated).length
    
    return NextResponse.json({
      success: true,
      message: `Fixed ${successCount} article images to be content-appropriate`,
      summary: {
        total: articles.length,
        fixed: successCount,
        alreadyAppropriate: updates.filter(u => !u.updated && !u.error).length,
        errors: updates.filter(u => u.error).length
      },
      updates: updates.filter(u => u.updated || u.error)
    })
    
  } catch (error) {
    console.error('Content image fix failed:', error)
    
    return NextResponse.json({
      success: false,
      message: 'Failed to fix content images',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}