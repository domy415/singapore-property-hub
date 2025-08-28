import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { DistrictArticleCreator } from '@/services/district-article-creator'

export async function GET(request: NextRequest) {
  return NextResponse.json({
    success: true,
    message: 'District article fixer is available',
    description: 'POST to this endpoint to fix district articles with misleading titles'
  })
}

export async function POST(request: NextRequest) {
  try {
    console.log('Starting to fix misleading district articles...')
    
    // Target specific problematic articles by slug
    const problematicSlugs = [
      'district-discovery-thursday-navigating-singapore-s-property-market-in-2025',
      'neighborhood-spotlight-navigating-singapore-s-property-market-in-2025'
    ]

    const articles = await prisma.article.findMany({
      where: {
        slug: {
          in: problematicSlugs
        },
        status: 'PUBLISHED'
      },
      select: {
        id: true,
        title: true,
        slug: true,
        content: true
      }
    })

    if (articles.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No problematic articles found with the specified slugs',
        slugsSearched: problematicSlugs
      })
    }

    const districtCreator = new DistrictArticleCreator()
    const results = []

    for (const article of articles) {
      try {
        console.log(`Processing article: ${article.title}`)
        
        // Generate proper district-specific content
        const newContent = await districtCreator.generateDistrictArticle()
        
        // Update the article with new district-specific content
        const updatedArticle = await prisma.article.update({
          where: { id: article.id },
          data: {
            title: newContent.title,
            content: newContent.content,
            excerpt: newContent.excerpt,
            slug: newContent.slug,
            seoTitle: newContent.seoTitle,
            seoDescription: newContent.seoDescription,
            seoKeywords: newContent.keywords || [],
            featuredImage: newContent.featuredImage,
            updatedAt: new Date()
          }
        })

        results.push({
          id: article.id,
          oldTitle: article.title,
          newTitle: newContent.title,
          oldSlug: article.slug,
          newSlug: newContent.slug,
          status: 'updated'
        })

        console.log(`Successfully updated: ${article.title} -> ${newContent.title}`)

      } catch (error) {
        console.error(`Error processing article ${article.id}:`, error)
        results.push({
          id: article.id,
          oldTitle: article.title,
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }

    return NextResponse.json({
      success: true,
      message: 'District article fixing process completed',
      articlesProcessed: articles.length,
      results: results,
      summary: {
        updated: results.filter(r => r.status === 'updated').length,
        errors: results.filter(r => r.status === 'error').length
      }
    })

  } catch (error) {
    console.error('Error in fix district articles:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fix district articles',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}