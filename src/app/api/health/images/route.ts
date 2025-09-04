import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { validateSingaporeImage, suggestCorrectImage, getImageComplianceReport } from '@/lib/image-validator'

export async function GET() {
  try {
    const articles = await prisma.article.findMany({
      where: { status: 'PUBLISHED' },
      select: { 
        id: true, 
        title: true, 
        featuredImage: true,
        slug: true
      },
      orderBy: { publishedAt: 'desc' }
    })
    
    const complianceReport = getImageComplianceReport(articles)
    
    const detailedAnalysis = articles.map(article => {
      const validation = validateSingaporeImage(article.featuredImage || '', article.title)
      
      return {
        id: article.id,
        slug: article.slug,
        title: article.title,
        currentImage: article.featuredImage,
        isCompliant: validation.isValid && validation.issues.length === 0,
        imageType: validation.imageType,
        confidence: validation.confidence,
        issues: validation.issues,
        suggestedImage: validation.isValid && validation.issues.length === 0 
          ? null 
          : suggestCorrectImage(article.title)
      }
    })
    
    const stats = {
      total: articles.length,
      compliant: complianceReport.compliant,
      nonCompliant: complianceReport.nonCompliant,
      complianceRate: Math.round((complianceReport.compliant / articles.length) * 100),
      lastChecked: new Date().toISOString()
    }
    
    return NextResponse.json({ 
      success: true,
      stats, 
      articles: detailedAnalysis,
      summary: {
        needsAttention: complianceReport.issues.length,
        recommendations: complianceReport.issues.slice(0, 5).map(issue => ({
          title: issue.title,
          primaryIssue: issue.issues[0],
          suggestedFix: issue.suggestedImage
        }))
      }
    })
    
  } catch (error) {
    console.error('Image compliance check failed:', error)
    
    return NextResponse.json({ 
      success: false,
      error: 'Failed to check image compliance',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// Endpoint to fix a specific article's image
export async function POST(request: Request) {
  try {
    const { articleId, imageUrl } = await request.json()
    
    if (!articleId || !imageUrl) {
      return NextResponse.json({
        success: false,
        error: 'Missing articleId or imageUrl'
      }, { status: 400 })
    }
    
    // Update the article image
    const updatedArticle = await prisma.article.update({
      where: { id: articleId },
      data: { featuredImage: imageUrl }
    })
    
    // Validate the new image
    const validation = validateSingaporeImage(imageUrl, updatedArticle.title)
    
    return NextResponse.json({
      success: true,
      message: 'Article image updated successfully',
      article: {
        id: updatedArticle.id,
        title: updatedArticle.title,
        newImage: imageUrl,
        validation: validation
      }
    })
    
  } catch (error) {
    console.error('Failed to update article image:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to update article image',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}