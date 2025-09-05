import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    console.log('🔧 Starting critical formatting fix for merged headings...')

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
      }
    })

    console.log(`📄 Found ${articles.length} articles to check for formatting issues`)

    let fixedCount = 0
    const fixResults = []

    for (const article of articles) {
      const originalContent = article.content
      let fixedContent = originalContent

      // CRITICAL FIX 1: Remove all markdown bold syntax that shouldn't be there
      fixedContent = fixedContent.replace(/\*\*/g, '')

      // CRITICAL FIX 2: Fix specific merged heading-text patterns
      const headingFixes = [
        {
          name: 'Main Title + Introduction',
          pattern: /Singapore's Property Market Poised for Continued Growth Amid Evolving Regulatory LandscapeAs we approach/g,
          replacement: 'Singapore\'s Property Market Poised for Continued Growth Amid Evolving Regulatory Landscape\n\nAs we approach'
        },
        {
          name: 'Current Market Dynamics',
          pattern: /Current Market Dynamics: Resilience Amid Shifting TidesThe Singapore property market/g,
          replacement: 'Current Market Dynamics: Resilience Amid Shifting Tides\n\nThe Singapore property market'
        },
        {
          name: 'Policy Impacts', 
          pattern: /Policy Impacts and Regulatory LandscapeThe Singapore government's/g,
          replacement: 'Policy Impacts and Regulatory Landscape\n\nThe Singapore government\'s'
        },
        {
          name: 'Segment Analysis',
          pattern: /Segment-Specific Analysis: Resilience Across the BoardThe resilience/g,
          replacement: 'Segment-Specific Analysis: Resilience Across the Board\n\nThe resilience'
        },
        {
          name: 'Investment Considerations',
          pattern: /Investment Considerations and Market PositioningAs investors/g,
          replacement: 'Investment Considerations and Market Positioning\n\nAs investors'
        },
        {
          name: 'Market Outlook',
          pattern: /Expert Market Outlook and Strategic RecommendationsLooking ahead/g,
          replacement: 'Expert Market Outlook and Strategic Recommendations\n\nLooking ahead'
        }
      ]

      // Apply specific heading fixes
      let appliedFixes: string[] = []
      headingFixes.forEach(fix => {
        if (fix.pattern.test(fixedContent)) {
          fixedContent = fixedContent.replace(fix.pattern, fix.replacement)
          appliedFixes.push(fix.name)
        }
      })

      // CRITICAL FIX 3: Fix general merged sentences (period + capital letter without space)
      const beforeGeneralFix = fixedContent.length
      fixedContent = fixedContent.replace(/([.!?])([A-Z][a-z])/g, '$1\n\n$2')
      const afterGeneralFix = fixedContent.length

      // CRITICAL FIX 4: Fix merged heading patterns (any heading followed immediately by capital letter)
      fixedContent = fixedContent.replace(/^(#{1,6}\s+[^\\n]+)([A-Z][a-z])/gm, '$1\n\n$2')

      // CRITICAL FIX 5: Ensure proper spacing after colons in headings
      fixedContent = fixedContent.replace(/^(#{1,6}\s+[^:]+:)([A-Z])/gm, '$1\n\n$2')

      // CRITICAL FIX 6: Clean up excessive newlines but preserve intentional spacing
      fixedContent = fixedContent.replace(/\n{4,}/g, '\n\n\n')

      // Check if content was actually changed
      if (fixedContent !== originalContent) {
        // Update the article in database
        await prisma.article.update({
          where: { id: article.id },
          data: { content: fixedContent }
        })

        fixedCount++
        
        // Check for remaining issues
        const remainingIssues = []
        if (fixedContent.includes('**')) remainingIssues.push('Bold markdown syntax')
        if (/[a-z][A-Z]/.test(fixedContent)) remainingIssues.push('Potential merged text')
        if (/^#{1,6}[^\\s]/.test(fixedContent)) remainingIssues.push('Heading format issues')

        const result = {
          id: article.id,
          title: article.title,
          slug: article.slug,
          appliedFixes: appliedFixes,
          originalLength: originalContent.length,
          fixedLength: fixedContent.length,
          characterChange: fixedContent.length - originalContent.length,
          generalFixApplied: afterGeneralFix > beforeGeneralFix,
          hasRemainingIssues: remainingIssues.length > 0,
          remainingIssues: remainingIssues
        }

        fixResults.push(result)

        console.log(`✅ Fixed article "${article.title}":`)
        console.log(`   - Applied fixes: ${appliedFixes.join(', ') || 'General formatting'}`)
        console.log(`   - Character change: ${result.characterChange}`)
        console.log(`   - Remaining issues: ${remainingIssues.length > 0 ? remainingIssues.join(', ') : 'None'}`)
      }
    }

    console.log(`🎉 Formatting fix complete: ${fixedCount}/${articles.length} articles updated`)

    return NextResponse.json({
      success: true,
      message: `Successfully fixed critical formatting issues in ${fixedCount} articles`,
      totalArticles: articles.length,
      fixedArticles: fixedCount,
      results: fixResults,
      summary: {
        removedBoldSyntax: fixResults.every(r => !r.remainingIssues?.includes('Bold markdown syntax')),
        fixedHeadingMergers: fixResults.filter(r => r.appliedFixes.length > 0).length,
        appliedGeneralFixes: fixResults.filter(r => r.generalFixApplied).length
      }
    })

  } catch (error) {
    console.error('❌ Critical formatting fix failed:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fix formatting issues',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Preview what would be fixed without making changes
    const articles = await prisma.article.findMany({
      where: {
        status: 'PUBLISHED'
      },
      select: {
        id: true,
        title: true,
        content: true,
        slug: true
      }
    })

    const issues = []
    
    for (const article of articles) {
      const content = article.content
      const articleIssues = []

      // Check for bold syntax
      const boldMatches = content.match(/\*\*/g)
      if (boldMatches) {
        articleIssues.push(`${boldMatches.length} bold markdown instances`)
      }

      // Check for specific merged patterns
      const mergedPatterns = [
        'LandscapeThe Singapore government',
        'TidesThe Singapore property',
        'BoardThe resilience', 
        'PositioningAs investors',
        'RecommendationsLooking ahead'
      ]

      mergedPatterns.forEach(pattern => {
        if (content.includes(pattern)) {
          articleIssues.push(`Contains merged text: "${pattern}"`)
        }
      })

      // Check for general merged sentences
      const mergedSentences = content.match(/[.!?][A-Z][a-z]/g)
      if (mergedSentences && mergedSentences.length > 0) {
        articleIssues.push(`${mergedSentences.length} merged sentences`)
      }

      if (articleIssues.length > 0) {
        issues.push({
          id: article.id,
          title: article.title,
          slug: article.slug,
          issues: articleIssues
        })
      }
    }

    return NextResponse.json({
      success: true,
      message: `Found formatting issues in ${issues.length} articles`,
      totalArticles: articles.length,
      articlesWithIssues: issues.length,
      issues: issues
    })

  } catch (error) {
    console.error('❌ Preview formatting check failed:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to check formatting issues',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}