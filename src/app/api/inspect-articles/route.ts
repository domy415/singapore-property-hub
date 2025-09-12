import { NextRequest, NextResponse } from 'next/server'
import { safeMarkdownToHtml } from '@/lib/markdown'

// Force Node.js runtime for Prisma compatibility
export const runtime = 'nodejs'

interface ArticleInspectionResult {
  id: number
  title: string
  slug: string
  status: 'healthy' | 'warnings' | 'error'
  issues: string[]
  contentLength: number
  markdownProcessed: boolean
  htmlLength: number
  warnings: string[]
  featuredImage?: string
}

interface InspectionSummary {
  totalArticles: number
  healthyArticles: number
  articlesWithWarnings: number
  articlesWithErrors: number
  commonIssues: { [key: string]: number }
  results: ArticleInspectionResult[]
}

export async function GET(request: NextRequest) {
  try {
    // Build-time guard: Skip database operations during build
    if (process.env.NODE_ENV !== 'production' && !process.env.DATABASE_URL) {
      return NextResponse.json({
        error: 'Database unavailable during build',
        totalArticles: 0,
        results: []
      })
    }

    // Dynamic import to avoid build-time initialization
    const { prisma } = await import('@/lib/prisma')
    const { ArticleStatus } = await import('@prisma/client')

    // Get query parameters
    const url = new URL(request.url)
    const limit = parseInt(url.searchParams.get('limit') || '20')
    const includeUnpublished = url.searchParams.get('includeUnpublished') === 'true'
    const onlyProblematic = url.searchParams.get('onlyProblematic') === 'true'

    // Fetch articles to inspect
    const articles = await prisma.article.findMany({
      where: includeUnpublished ? {} : { 
        status: ArticleStatus.PUBLISHED 
      },
      select: {
        id: true,
        title: true,
        slug: true,
        content: true,
        status: true,
        publishedAt: true,
        featuredImage: true
      },
      orderBy: { publishedAt: 'desc' },
      take: limit
    })

    const results: ArticleInspectionResult[] = []
    const issueCounter: { [key: string]: number } = {}

    // Inspect each article
    for (const article of articles) {
      const issues: string[] = []
      let status: 'healthy' | 'warnings' | 'error' = 'healthy'
      let markdownProcessed = false
      let htmlLength = 0
      let warnings: string[] = []

      // Basic content validation
      if (!article.content || article.content.trim().length === 0) {
        issues.push('Empty content')
        status = 'error'
      }

      if (article.content && article.content.length > 50000) {
        issues.push(`Very long content (${article.content.length} chars)`)
        status = 'warnings'
      }

      // Check for problematic patterns
      if (article.content) {
        // Null bytes or control characters
        if (/[\x00-\x08\x0B\x0C\x0E-\x1F]/.test(article.content)) {
          issues.push('Contains control characters')
          status = 'warnings'
        }

        // Malformed headers
        if (/^#{1,6}[^#\s\n]/m.test(article.content)) {
          issues.push('Malformed markdown headers')
          status = 'warnings'
        }

        // Very long lines that might cause issues
        const lines = article.content.split('\n')
        const longLines = lines.filter(line => line.length > 1000)
        if (longLines.length > 0) {
          issues.push(`${longLines.length} very long lines`)
          status = 'warnings'
        }

        // Check for merged headers (common issue)
        const mergedHeaderPattern = /^(#{1,6}\s*[^#\n]*?)([A-Z][a-z][^\n]{20,})/gm
        const mergedHeaders = article.content.match(mergedHeaderPattern)
        if (mergedHeaders && mergedHeaders.length > 0) {
          issues.push(`${mergedHeaders.length} potentially merged headers`)
          status = 'warnings'
        }

        // Try to process markdown to identify processing issues
        try {
          const markdownResult = await safeMarkdownToHtml(article.content, {
            enableLogging: false
          })
          
          markdownProcessed = markdownResult.success
          htmlLength = markdownResult.html.length
          warnings = markdownResult.warnings

          if (!markdownResult.success) {
            issues.push(`Markdown processing failed: ${markdownResult.error}`)
            status = 'error'
          } else if (markdownResult.warnings.length > 0) {
            issues.push(`${markdownResult.warnings.length} processing warnings`)
            if (status === 'healthy') status = 'warnings'
          }

          // Check for suspicious HTML output
          if (markdownResult.success && markdownResult.html.includes('Content temporarily unavailable')) {
            issues.push('Fallback content detected')
            status = 'error'
          }

        } catch (error) {
          issues.push(`Markdown test failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
          status = 'error'
        }
      }

      // Count issues for summary
      issues.forEach(issue => {
        const issueType = issue.split(':')[0] // Get the first part before colon
        issueCounter[issueType] = (issueCounter[issueType] || 0) + 1
      })

      const result: ArticleInspectionResult = {
        id: article.id,
        title: article.title,
        slug: article.slug,
        status,
        issues,
        contentLength: article.content?.length || 0,
        markdownProcessed,
        htmlLength,
        warnings,
        featuredImage: article.featuredImage || undefined
      }

      // Add to results (filter if only problematic requested)
      if (!onlyProblematic || status !== 'healthy') {
        results.push(result)
      }
    }

    // Create summary
    const summary: InspectionSummary = {
      totalArticles: articles.length,
      healthyArticles: results.filter(r => r.status === 'healthy').length,
      articlesWithWarnings: results.filter(r => r.status === 'warnings').length,
      articlesWithErrors: results.filter(r => r.status === 'error').length,
      commonIssues: issueCounter,
      results: results.sort((a, b) => {
        // Sort by severity: error > warnings > healthy
        const severityOrder = { error: 2, warnings: 1, healthy: 0 }
        return severityOrder[b.status] - severityOrder[a.status]
      })
    }

    return NextResponse.json(summary)

  } catch (error) {
    console.error('Article inspection failed:', error)
    return NextResponse.json(
      { 
        error: 'Inspection failed',
        message: error instanceof Error ? error.message : 'Unknown error',
        totalArticles: 0,
        results: []
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // This endpoint can be used to fix a specific article's content
    const body = await request.json()
    const { articleId, fixType } = body

    if (!articleId || !fixType) {
      return NextResponse.json(
        { error: 'articleId and fixType are required' },
        { status: 400 }
      )
    }

    // Build-time guard
    if (process.env.NODE_ENV !== 'production' && !process.env.DATABASE_URL) {
      return NextResponse.json({
        error: 'Database unavailable during build'
      })
    }

    // Dynamic import to avoid build-time initialization
    const { prisma } = await import('@/lib/prisma')

    // Get the article
    const article = await prisma.article.findUnique({
      where: { id: parseInt(articleId) },
      select: { id: true, title: true, slug: true, content: true }
    })

    if (!article) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      )
    }

    let fixedContent = article.content
    const appliedFixes: string[] = []

    // Apply fixes based on fixType
    switch (fixType) {
      case 'headers':
        // Fix malformed headers
        fixedContent = fixedContent
          ?.replace(/^(#{1,6})([^#\s\n])/gm, '$1 $2')
        appliedFixes.push('Fixed malformed headers')
        break

      case 'cleanup':
        // General cleanup
        fixedContent = fixedContent
          ?.replace(/\n{4,}/g, '\n\n\n') // Fix multiple newlines
          ?.replace(/  +/g, ' ') // Fix double spaces
          ?.split('\n').map(line => line.trimEnd()).join('\n') // Trim line endings
          ?.trim()
        appliedFixes.push('Applied general cleanup')
        break

      case 'full':
        // Apply all fixes using the safe markdown processor
        const result = await safeMarkdownToHtml(article.content || '', {
          enableLogging: false
        })
        
        if (result.success && result.warnings.length > 0) {
          appliedFixes.push(...result.warnings.map(w => `Fixed: ${w}`))
        }
        break

      default:
        return NextResponse.json(
          { error: 'Invalid fixType. Use: headers, cleanup, or full' },
          { status: 400 }
        )
    }

    // Update the article if content was changed
    if (fixedContent !== article.content) {
      await prisma.article.update({
        where: { id: article.id },
        data: { 
          content: fixedContent,
          updatedAt: new Date()
        }
      })

      return NextResponse.json({
        success: true,
        articleId: article.id,
        title: article.title,
        slug: article.slug,
        appliedFixes,
        contentChanged: true,
        newContentLength: fixedContent?.length || 0
      })
    } else {
      return NextResponse.json({
        success: true,
        articleId: article.id,
        title: article.title,
        slug: article.slug,
        appliedFixes: ['No changes needed'],
        contentChanged: false,
        newContentLength: fixedContent?.length || 0
      })
    }

  } catch (error) {
    console.error('Article fix failed:', error)
    return NextResponse.json(
      { 
        error: 'Fix failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}