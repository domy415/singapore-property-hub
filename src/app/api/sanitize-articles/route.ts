import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { markdownToHtml } from '@/utils/unified-markdown'

/**
 * Comprehensive Article Sanitizer - Part C of the Formatting Fix
 * 
 * This endpoint repairs existing articles with:
 * - Merged heading-text patterns
 * - Bold syntax issues
 * - Improper spacing and paragraph breaks
 * - General formatting problems
 */

interface SanitizationResult {
  id: string
  title: string
  slug: string
  changes: string[]
  beforeLength: number
  afterLength: number
  hasRemainingIssues: boolean
  remainingIssues: string[]
}

function sanitizeMarkdownContent(content: string): { 
  sanitized: string, 
  changes: string[] 
} {
  if (!content || typeof content !== 'string') {
    return { sanitized: '', changes: [] }
  }

  const changes: string[] = []
  let sanitized = content

  // Step 1: Remove bold markdown syntax that shouldn't be there
  const boldMatches = sanitized.match(/\*\*/g)
  if (boldMatches && boldMatches.length > 0) {
    sanitized = sanitized.replace(/\*\*/g, '')
    changes.push(`Removed ${boldMatches.length} bold markdown instances`)
  }

  // Step 2: Fix specific known merged patterns from Singapore Property Hub
  const specificFixes = [
    {
      name: 'Property Market Title Merger',
      pattern: /Singapore's Property Market Poised for Continued Growth Amid Evolving Regulatory LandscapeAs we approach/g,
      replacement: "Singapore's Property Market Poised for Continued Growth Amid Evolving Regulatory Landscape\n\nAs we approach"
    },
    {
      name: 'Market Dynamics Heading',
      pattern: /Current Market Dynamics: Resilience Amid Shifting TidesThe Singapore property market/g,
      replacement: "Current Market Dynamics: Resilience Amid Shifting Tides\n\nThe Singapore property market"
    },
    {
      name: 'Policy Impacts Section',
      pattern: /Policy Impacts and Regulatory LandscapeThe Singapore government's/g,
      replacement: "Policy Impacts and Regulatory Landscape\n\nThe Singapore government's"
    },
    {
      name: 'Segment Analysis Section',
      pattern: /Segment-Specific Analysis: Resilience Across the BoardThe resilience/g,
      replacement: "Segment-Specific Analysis: Resilience Across the Board\n\nThe resilience"
    },
    {
      name: 'Investment Considerations',
      pattern: /Investment Considerations and Market PositioningAs investors/g,
      replacement: "Investment Considerations and Market Positioning\n\nAs investors"
    },
    {
      name: 'Market Outlook Section',
      pattern: /Expert Market Outlook and Strategic RecommendationsLooking ahead/g,
      replacement: "Expert Market Outlook and Strategic Recommendations\n\nLooking ahead"
    },
    {
      name: 'District Guide Patterns',
      pattern: /District \d+[:\-\s]*([A-Z][^.\n]*[.!?])([A-Z][a-z])/g,
      replacement: 'District $1\n\n$2'
    },
    {
      name: 'Property Type Patterns',
      pattern: /(HDB|Condo|Landed|Commercial)([A-Z][a-z][^.\n]*[.!?])([A-Z][a-z])/g,
      replacement: '$1 $2\n\n$3'
    }
  ]

  specificFixes.forEach(fix => {
    const matches = sanitized.match(fix.pattern)
    if (matches && matches.length > 0) {
      sanitized = sanitized.replace(fix.pattern, fix.replacement)
      changes.push(`Fixed ${fix.name} (${matches.length} instances)`)
    }
  })

  // Step 3: Fix general merged sentence patterns (sentence ending + capital letter)
  const beforeGeneralFix = sanitized.length
  sanitized = sanitized.replace(/([.!?])([A-Z][a-z])/g, '$1\n\n$2')
  if (sanitized.length > beforeGeneralFix) {
    const generalFixes = (sanitized.length - beforeGeneralFix) / 2 // Approximate
    changes.push(`Fixed ${Math.round(generalFixes)} merged sentences`)
  }

  // Step 4: Fix merged headings with text (heading + capital letter without space)
  const headingMatches = sanitized.match(/^(#{1,6}\s+[^\n]+)([A-Z][a-z])/gm)
  if (headingMatches && headingMatches.length > 0) {
    sanitized = sanitized.replace(/^(#{1,6}\s+[^\n]+)([A-Z][a-z])/gm, '$1\n\n$2')
    changes.push(`Fixed ${headingMatches.length} merged headings`)
  }

  // Step 5: Fix colon-ended headings merged with text
  const colonHeadings = sanitized.match(/^(#{1,6}\s+[^:\n]+:)([A-Z])/gm)
  if (colonHeadings && colonHeadings.length > 0) {
    sanitized = sanitized.replace(/^(#{1,6}\s+[^:\n]+:)([A-Z])/gm, '$1\n\n$2')
    changes.push(`Fixed ${colonHeadings.length} colon-ended headings`)
  }

  // Step 6: Ensure proper spacing after ALL headings
  sanitized = sanitized.replace(/^(#{1,6}\s+.+)$/gm, '$1\n')

  // Step 7: Fix merged sections (content + heading patterns)
  sanitized = sanitized.replace(/([.!?])\s*(#{1,6}\s)/gm, '$1\n\n$2')

  // Step 8: Clean up excessive newlines but preserve intentional spacing
  sanitized = sanitized.replace(/\n{4,}/g, '\n\n\n')
  sanitized = sanitized.replace(/\n{3,}/g, '\n\n')

  // Step 9: Fix common transition word mergers
  const transitionWords = ['However', 'Additionally', 'Furthermore', 'Moreover', 'Meanwhile', 'Similarly', 'Consequently']
  transitionWords.forEach(word => {
    const pattern = new RegExp(`([.!?])${word}`, 'g')
    const matches = sanitized.match(pattern)
    if (matches && matches.length > 0) {
      sanitized = sanitized.replace(pattern, `$1\n\n${word}`)
      changes.push(`Fixed ${matches.length} merged "${word}" transitions`)
    }
  })

  // Step 10: Trim whitespace and normalize line endings
  sanitized = sanitized.trim().replace(/\r\n/g, '\n')

  return { sanitized, changes }
}

function detectRemainingIssues(content: string): string[] {
  const issues: string[] = []

  // Check for remaining bold syntax
  if (content.includes('**')) {
    const boldCount = (content.match(/\*\*/g) || []).length
    issues.push(`${boldCount} bold markdown instances remain`)
  }

  // Check for potential merged text (lowercase followed immediately by uppercase)
  const mergedTextMatches = content.match(/[a-z][A-Z]/g)
  if (mergedTextMatches && mergedTextMatches.length > 5) { // Allow some natural occurrences
    issues.push(`${mergedTextMatches.length} potential merged text instances`)
  }

  // Check for headings without spaces
  const badHeadingMatches = content.match(/^#{1,6}[^\s]/gm)
  if (badHeadingMatches && badHeadingMatches.length > 0) {
    issues.push(`${badHeadingMatches.length} improperly formatted headings`)
  }

  // Check for very long paragraphs (potential merged content)
  const paragraphs = content.split('\n\n')
  const longParagraphs = paragraphs.filter(p => p.length > 1000 && !p.startsWith('#'))
  if (longParagraphs.length > 0) {
    issues.push(`${longParagraphs.length} potentially merged paragraphs (>1000 chars)`)
  }

  // Check for missing spaces after periods
  const missingSpaceMatches = content.match(/\.[A-Z]/g)
  if (missingSpaceMatches && missingSpaceMatches.length > 0) {
    issues.push(`${missingSpaceMatches.length} missing spaces after periods`)
  }

  return issues
}

export async function POST(request: NextRequest) {
  try {
    console.log('🧹 Starting comprehensive article sanitization...')

    // Get all published articles
    const articles = await prisma.article.findMany({
      where: {
        status: 'PUBLISHED'
      },
      select: {
        id: true,
        title: true,
        content: true,
        slug: true
      },
      orderBy: {
        publishedAt: 'desc'
      }
    })

    console.log(`📄 Found ${articles.length} articles to sanitize`)

    const results: SanitizationResult[] = []
    let sanitizedCount = 0

    for (const article of articles) {
      const originalContent = article.content
      
      // Sanitize the content
      const { sanitized: sanitizedContent, changes } = sanitizeMarkdownContent(originalContent)
      
      // Check for remaining issues
      const remainingIssues = detectRemainingIssues(sanitizedContent)

      // Only update if content actually changed
      if (sanitizedContent !== originalContent) {
        await prisma.article.update({
          where: { id: article.id },
          data: { 
            content: sanitizedContent,
            // Update modified timestamp to track sanitization
            updatedAt: new Date()
          }
        })

        sanitizedCount++
        
        const result: SanitizationResult = {
          id: article.id,
          title: article.title,
          slug: article.slug,
          changes: changes,
          beforeLength: originalContent.length,
          afterLength: sanitizedContent.length,
          hasRemainingIssues: remainingIssues.length > 0,
          remainingIssues: remainingIssues
        }

        results.push(result)

        console.log(`✅ Sanitized "${article.title}"`)
        console.log(`   Changes: ${changes.join(', ')}`)
        if (remainingIssues.length > 0) {
          console.log(`   ⚠️ Remaining issues: ${remainingIssues.join(', ')}`)
        }
      } else {
        console.log(`✨ "${article.title}" - No changes needed`)
      }
    }

    console.log(`🎉 Sanitization complete: ${sanitizedCount}/${articles.length} articles updated`)

    const summary = {
      totalArticles: articles.length,
      sanitizedArticles: sanitizedCount,
      unchangedArticles: articles.length - sanitizedCount,
      totalChanges: results.reduce((sum, r) => sum + r.changes.length, 0),
      articlesWithRemainingIssues: results.filter(r => r.hasRemainingIssues).length
    }

    return NextResponse.json({
      success: true,
      message: `Successfully sanitized ${sanitizedCount} articles with comprehensive formatting fixes`,
      summary: summary,
      results: results,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ Article sanitization failed:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to sanitize articles',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Preview mode - show what would be sanitized without making changes
    const articles = await prisma.article.findMany({
      where: {
        status: 'PUBLISHED'
      },
      select: {
        id: true,
        title: true,
        content: true,
        slug: true
      },
      take: 10 // Limit for preview
    })

    const previews = articles.map(article => {
      const { sanitized, changes } = sanitizeMarkdownContent(article.content)
      const remainingIssues = detectRemainingIssues(sanitized)
      
      return {
        id: article.id,
        title: article.title,
        slug: article.slug,
        needsSanitization: sanitized !== article.content,
        potentialChanges: changes,
        beforeLength: article.content.length,
        afterLength: sanitized.length,
        potentialIssuesAfter: remainingIssues,
        contentPreview: {
          before: article.content.substring(0, 200) + '...',
          after: sanitized.substring(0, 200) + '...'
        }
      }
    })

    const needsSanitization = previews.filter(p => p.needsSanitization)

    return NextResponse.json({
      success: true,
      message: `Preview: ${needsSanitization.length}/${articles.length} articles need sanitization`,
      totalArticles: articles.length,
      articlesNeedingSanitization: needsSanitization.length,
      previews: previews
    })

  } catch (error) {
    console.error('❌ Sanitization preview failed:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to preview sanitization',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}