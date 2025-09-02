import { NextRequest, NextResponse } from 'next/server'
import { ImageValidationService } from '@/services/image-validation'
import { ImageSelector } from '@/services/image-selector'
import { ArticleCategory } from '@prisma/client'

interface ImageIssue {
  articleId: string
  articleTitle: string
  slug: string
  currentImage: string
  issue: string
  suggestedFix: string
  confidence: number
}

export async function POST(request: NextRequest) {
  try {
    const { dryRun = true } = await request.json()

    console.log('🔍 Starting comprehensive image audit...')
    
    // Dynamic import to avoid build-time initialization
    const { prisma } = await import('@/lib/prisma')
    
    // Get all published articles
    const articles = await prisma.article.findMany({
      where: { status: 'PUBLISHED' },
      select: {
        id: true,
        title: true,
        slug: true,
        featuredImage: true,
        category: true
      },
      orderBy: { createdAt: 'desc' }
    })

    console.log(`Found ${articles.length} published articles to audit`)

    const issues: ImageIssue[] = []
    const validImages: string[] = []
    const fixedImages: Array<{ articleId: string, oldUrl: string, newUrl: string }> = []

    // Audit each article's image
    for (const article of articles) {
      if (!article.featuredImage) {
        issues.push({
          articleId: article.id,
          articleTitle: article.title,
          slug: article.slug,
          currentImage: 'None',
          issue: 'Missing featured image',
          suggestedFix: 'Generate image based on article category and title',
          confidence: 0.9
        })
        continue
      }

      // Validate current image
      const validation = await ImageValidationService.validateImageUrl(article.featuredImage)
      
      if (!validation.isValid || validation.confidence < 0.7) {
        const smartReplacement = await ImageValidationService.getSmartReplacement(
          article.featuredImage,
          article.title,
          article.category as ArticleCategory
        )

        issues.push({
          articleId: article.id,
          articleTitle: article.title,
          slug: article.slug,
          currentImage: article.featuredImage,
          issue: validation.reason || 'Image validation failed',
          suggestedFix: smartReplacement,
          confidence: validation.confidence
        })
      } else {
        validImages.push(article.featuredImage)
        
        // Check if image needs performance optimization
        const perfAnalysis = ImageValidationService.analyzeImagePerformance(article.featuredImage)
        if (perfAnalysis.needsOptimization && perfAnalysis.optimizedUrl) {
          issues.push({
            articleId: article.id,
            articleTitle: article.title,
            slug: article.slug,
            currentImage: article.featuredImage,
            issue: `Performance optimization needed: ${perfAnalysis.suggestions.join(', ')}`,
            suggestedFix: perfAnalysis.optimizedUrl,
            confidence: 0.8
          })
        }
      }
    }

    console.log(`\n📊 Audit Results:`)
    console.log(`   Valid images: ${validImages.length}`)
    console.log(`   Issues found: ${issues.length}`)

    if (!dryRun && issues.length > 0) {
      console.log('🔧 Applying fixes...')
      
      for (const issue of issues) {
        try {
          let newImageUrl: string

          if (issue.currentImage === 'None') {
            // Generate new image for articles without featured images
            newImageUrl = await ImageSelector.getTopicBasedImage(
              issue.articleTitle,
              articles.find(a => a.id === issue.articleId)?.category as ArticleCategory || ArticleCategory.MARKET_INSIGHTS
            )
          } else {
            newImageUrl = issue.suggestedFix
          }

          // Update the article in database
          await prisma.article.update({
            where: { id: issue.articleId },
            data: { featuredImage: newImageUrl }
          })

          fixedImages.push({
            articleId: issue.articleId,
            oldUrl: issue.currentImage,
            newUrl: newImageUrl
          })

          console.log(`   ✅ Fixed: ${issue.articleTitle}`)
        } catch (error) {
          console.error(`   ❌ Failed to fix ${issue.articleTitle}:`, error)
        }
      }
    }

    // Generate detailed report
    const report = {
      summary: {
        totalArticles: articles.length,
        validImages: validImages.length,
        issuesFound: issues.length,
        fixesApplied: dryRun ? 0 : fixedImages.length
      },
      issues: issues.map(issue => ({
        article: `${issue.articleTitle} (${issue.slug})`,
        currentImage: issue.currentImage,
        issue: issue.issue,
        suggestedFix: issue.suggestedFix,
        confidence: `${Math.round(issue.confidence * 100)}%`
      })),
      validImages: validImages.slice(0, 10), // First 10 valid images as sample
      fixedImages: dryRun ? [] : fixedImages
    }

    return NextResponse.json({
      success: true,
      dryRun,
      report,
      message: dryRun 
        ? `Audit complete. Found ${issues.length} issues. Use dryRun: false to apply fixes.`
        : `Audit and fix complete. Applied ${fixedImages.length} fixes.`
    })

  } catch (error) {
    console.error('Comprehensive image fix failed:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to audit/fix images',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// GET endpoint for quick audit summary
export async function GET() {
  try {
    // Dynamic import to avoid build-time initialization
    const { prisma } = await import('@/lib/prisma')
    
    const articles = await prisma.article.findMany({
      where: { status: 'PUBLISHED' },
      select: {
        id: true,
        title: true,
        featuredImage: true
      }
    })

    const stats = {
      totalArticles: articles.length,
      withImages: articles.filter(a => a.featuredImage).length,
      withoutImages: articles.filter(a => !a.featuredImage).length,
      unsplashImages: articles.filter(a => 
        a.featuredImage?.includes('images.unsplash.com')
      ).length
    }

    return NextResponse.json({
      success: true,
      stats,
      message: 'Quick audit complete'
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to get audit summary'
    }, { status: 500 })
  }
}