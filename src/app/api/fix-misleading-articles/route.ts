import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ArticleStatus } from '@prisma/client'
import { DistrictArticleCreator } from '@/services/district-article-creator'
import { ArticleFactChecker } from '@/services/article-fact-checker'

export async function POST(request: NextRequest) {
  return handleFixRequest()
}

export async function GET(request: NextRequest) {
  return handleFixRequest()
}

async function handleFixRequest() {
  try {
    console.log('Starting to fix misleading articles...')
    
    // Find articles with district/neighborhood titles that lack proper content
    const problematicArticles = await prisma.article.findMany({
      where: {
        status: ArticleStatus.PUBLISHED,
        OR: [
          { title: { contains: 'District Discovery', mode: 'insensitive' } },
          { title: { contains: 'Neighborhood Spotlight', mode: 'insensitive' } },
          { title: { contains: 'District', mode: 'insensitive' } }
        ]
      },
      select: {
        id: true,
        title: true,
        slug: true,
        content: true
      }
    })

    const districtArticleCreator = new DistrictArticleCreator()
    const factChecker = new ArticleFactChecker()
    const fixedArticles = []

    for (const article of problematicArticles) {
      try {
        // Check if article actually lacks district content
        const hasDistrictContent = /district \d+|district [a-z]+/i.test(article.content) ||
                                 /\b(orchard|marina|sentosa|jurong|woodlands|tampines|punggol|sengkang|bishan|toa payoh|ang mo kio|bedok|clementi|bukit timah|newton|novena|dhoby ghaut|city hall|raffles place|marina bay|clarke quay|boat quay|chinatown|little india|arab street|bugis|beach road|lavender|kallang|geylang|katong|east coast|west coast)\b/i.test(article.content)
        
        if (hasDistrictContent) {
          console.log(`Article ${article.id} already has proper district content, skipping`)
          continue
        }

        console.log(`Fixing article: ${article.title}`)

        // Generate new district-specific content
        const newArticleData = await districtArticleCreator.generateDistrictArticle()
        
        // Fact-check the new content
        const factCheckResult = await factChecker.reviewArticle(newArticleData.title, newArticleData.content, newArticleData.category)
        
        if (factCheckResult.qualityScore < 80) {
          console.log(`Generated article quality too low (${factCheckResult.qualityScore}), skipping`)
          continue
        }

        // Update the article with new content
        const updatedArticle = await prisma.article.update({
          where: { id: article.id },
          data: {
            title: newArticleData.title,
            content: newArticleData.content,
            excerpt: newArticleData.excerpt,
            slug: newArticleData.slug,
            seoTitle: newArticleData.seoTitle,
            seoDescription: newArticleData.seoDescription,
            seoKeywords: newArticleData.keywords || [],
            featuredImage: newArticleData.featuredImage,
            updatedAt: new Date()
          }
        })

        fixedArticles.push({
          id: article.id,
          oldTitle: article.title,
          newTitle: newArticleData.title,
          qualityScore: factCheckResult.qualityScore
        })

        console.log(`Successfully fixed article: ${article.title} -> ${newArticleData.title}`)

      } catch (error) {
        console.error(`Error fixing article ${article.id}:`, error)
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Misleading articles check completed',
      stats: {
        totalProblematicArticles: problematicArticles.length,
        articlesFixed: fixedArticles.length,
        articlesSkipped: problematicArticles.length - fixedArticles.length
      },
      fixedArticles: fixedArticles
    })

  } catch (error) {
    console.error('Error fixing misleading articles:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fix misleading articles'
    }, { status: 500 })
  }
}