import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ArticleStatus } from '@prisma/client'
import { DistrictArticleCreator } from '@/services/district-article-creator'
import { ArticleFactChecker } from '@/services/article-fact-checker'

export async function GET(request: NextRequest) {
  try {
    console.log('Fixing specific problematic articles...')
    
    // Target the specific articles we know are problematic
    const problemArticleSlugs = [
      'district-discovery-thursday-navigating-singapore-s-property-market-in-2025',
      'neighborhood-spotlight-navigating-singapore-s-property-market-in-2025'
    ]
    
    const articlesToFix = await prisma.article.findMany({
      where: {
        slug: { in: problemArticleSlugs },
        status: ArticleStatus.PUBLISHED
      },
      select: {
        id: true,
        title: true,
        slug: true,
        content: true
      }
    })

    if (articlesToFix.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No problematic articles found with specified slugs'
      })
    }

    const districtArticleCreator = new DistrictArticleCreator()
    const factChecker = new ArticleFactChecker()
    const results = []

    for (const article of articlesToFix) {
      try {
        console.log(`Fixing article: ${article.title}`)

        // Generate new district-specific content
        const newArticleData = await districtArticleCreator.generateDistrictArticle()
        
        console.log(`Generated new article: ${newArticleData.title}`)
        
        // Fact-check the new content
        const factCheckResult = await factChecker.reviewArticle(newArticleData.title, newArticleData.content, 'NEIGHBORHOOD')
        
        console.log(`Fact check score: ${factCheckResult.qualityScore}`)

        if (factCheckResult.qualityScore < 70) {
          console.log(`Quality score too low, trying once more...`)
          // Try once more with a different district
          const retryArticleData = await districtArticleCreator.generateDistrictArticle()
          const retryFactCheck = await factChecker.reviewArticle(retryArticleData.title, retryArticleData.content, 'NEIGHBORHOOD')
          
          if (retryFactCheck.qualityScore >= 70) {
            Object.assign(newArticleData, retryArticleData)
            Object.assign(factCheckResult, retryFactCheck)
          }
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

        results.push({
          success: true,
          articleId: article.id,
          oldTitle: article.title,
          oldSlug: article.slug,
          newTitle: newArticleData.title,
          newSlug: newArticleData.slug,
          qualityScore: factCheckResult.qualityScore
        })

        console.log(`✅ Successfully updated: ${article.slug} -> ${newArticleData.slug}`)

      } catch (error) {
        console.error(`❌ Error fixing article ${article.id}:`, error)
        results.push({
          success: false,
          articleId: article.id,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Article fixing completed',
      totalArticles: articlesToFix.length,
      results: results
    })

  } catch (error) {
    console.error('❌ Error in fix-specific-articles:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}