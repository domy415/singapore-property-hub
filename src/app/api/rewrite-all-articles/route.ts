import { NextRequest, NextResponse } from 'next/server'
import { ArticleStatus } from '@prisma/client'
import { WebFactChecker } from '@/lib/agent-fact-checker-web'

interface ArticleRewriteResult {
  articleId: string
  originalTitle: string
  success: boolean
  newTitle?: string
  newContent?: string
  factCheckScore?: number
  error?: string
  warnings?: string[]
}

interface BulkRewriteResult {
  totalArticles: number
  processed: number
  succeeded: number
  failed: number
  results: ArticleRewriteResult[]
  summary: {
    averageFactCheckScore: number
    articlesNeedingReview: string[]
    categoriesProcessed: Record<string, number>
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Starting bulk article rewrite process...')
    
    // Dynamic import to avoid build-time initialization
    const { prisma } = await import('@/lib/prisma')
    
    const body = await request.json()
    const { 
      articleIds = [], 
      rewriteAll = false, 
      factCheckRequired = true,
      minFactCheckScore = 80 
    } = body

    // Get articles to process
    let articlesToProcess
    if (rewriteAll) {
      articlesToProcess = await prisma.article.findMany({
        where: { status: ArticleStatus.PUBLISHED },
        include: { author: true },
        orderBy: { publishedAt: 'desc' }
      })
    } else if (articleIds.length > 0) {
      articlesToProcess = await prisma.article.findMany({
        where: { 
          id: { in: articleIds },
          status: ArticleStatus.PUBLISHED 
        },
        include: { author: true }
      })
    } else {
      return NextResponse.json({
        success: false,
        error: 'Must specify either articleIds or rewriteAll=true'
      }, { status: 400 })
    }

    console.log(`📊 Processing ${articlesToProcess.length} articles`)

    const results: ArticleRewriteResult[] = []
    const categoryCounts: Record<string, number> = {}
    let totalFactCheckScore = 0
    let factCheckCount = 0

    // Process each article
    for (const article of articlesToProcess) {
      console.log(`\n🔄 Processing: ${article.title}`)
      
      try {
        // Track categories
        categoryCounts[article.category] = (categoryCounts[article.category] || 0) + 1

        // Step 1: Use property-article-writer agent to rewrite the article
        const rewrittenContent = await rewriteArticleWithAgent(
          article.title,
          article.content || '',
          article.category,
          article.excerpt || ''
        )

        // Step 2: Fact-check the rewritten content if required
        let factCheckScore = 100 // Default high score if fact-checking is disabled
        const warnings: string[] = []

        if (factCheckRequired) {
          console.log('🔍 Fact-checking rewritten content...')
          const factChecker = new WebFactChecker()
          const factCheckResult = await factChecker.checkArticle(
            rewrittenContent.content, 
            rewrittenContent.title
          )
          
          factCheckScore = factCheckResult.score
          totalFactCheckScore += factCheckScore
          factCheckCount++
          
          if (factCheckResult.issues.length > 0) {
            warnings.push(...factCheckResult.issues)
          }

          // Add Singapore-specific validation warnings
          const singaporeWarnings = await factChecker.validateSingaporeFacts(rewrittenContent.content)
          warnings.push(...singaporeWarnings)
        }

        // Step 3: Only update if fact-check score meets requirement
        if (factCheckScore >= minFactCheckScore) {
          console.log(`✅ Updating article (Fact-check score: ${factCheckScore})`)
          
          const updatedArticle = await prisma.article.update({
            where: { id: article.id },
            data: {
              title: rewrittenContent.title,
              content: rewrittenContent.content,
              excerpt: rewrittenContent.excerpt,
              seoTitle: rewrittenContent.seoTitle,
              seoDescription: rewrittenContent.seoDescription,
              seoKeywords: rewrittenContent.seoKeywords,
              tags: rewrittenContent.tags,
              featuredImage: rewrittenContent.featuredImage || article.featuredImage,
              updatedAt: new Date()
            }
          })

          results.push({
            articleId: article.id,
            originalTitle: article.title,
            success: true,
            newTitle: rewrittenContent.title,
            newContent: rewrittenContent.content.substring(0, 200) + '...',
            factCheckScore,
            warnings: warnings.length > 0 ? warnings : undefined
          })
          
          console.log(`✅ Successfully updated: ${rewrittenContent.title}`)
        } else {
          console.log(`❌ Fact-check score too low (${factCheckScore}), skipping update`)
          results.push({
            articleId: article.id,
            originalTitle: article.title,
            success: false,
            factCheckScore,
            error: `Fact-check score ${factCheckScore} below minimum ${minFactCheckScore}`,
            warnings
          })
        }

      } catch (error) {
        console.error(`❌ Error processing ${article.title}:`, error)
        results.push({
          articleId: article.id,
          originalTitle: article.title,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }

      // Add small delay to avoid overwhelming the system
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    // Compile summary
    const succeeded = results.filter(r => r.success).length
    const failed = results.filter(r => !r.success).length
    const averageFactCheckScore = factCheckCount > 0 ? Math.round(totalFactCheckScore / factCheckCount) : 0
    const articlesNeedingReview = results
      .filter(r => r.factCheckScore && r.factCheckScore < 90)
      .map(r => `${r.originalTitle} (Score: ${r.factCheckScore})`)

    const summary: BulkRewriteResult = {
      totalArticles: articlesToProcess.length,
      processed: results.length,
      succeeded,
      failed,
      results,
      summary: {
        averageFactCheckScore,
        articlesNeedingReview,
        categoriesProcessed: categoryCounts
      }
    }

    console.log(`\n🎉 Bulk rewrite completed!`)
    console.log(`   Total: ${summary.totalArticles}`)
    console.log(`   Succeeded: ${succeeded}`)
    console.log(`   Failed: ${failed}`)
    console.log(`   Average fact-check score: ${averageFactCheckScore}`)

    return NextResponse.json({
      success: true,
      message: `Successfully processed ${succeeded}/${summary.totalArticles} articles`,
      ...summary
    })

  } catch (error) {
    console.error('❌ Bulk article rewrite failed:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 })
  }
}

// Function to rewrite article using property-article-writer agent
async function rewriteArticleWithAgent(
  originalTitle: string,
  originalContent: string,
  category: string,
  originalExcerpt: string
) {
  // This is where we'll integrate with the property-article-writer agent
  // For now, using the agent's structure to format the prompt

  const agentPrompt = `
# Property Article Rewriting Request

## Original Article to Rewrite
**Title**: ${originalTitle}
**Category**: ${category}
**Original Content**: ${originalContent.substring(0, 3000)}...

## Editorial Requirements
As property-article-writer agent, rewrite this article to meet Business Times editorial standards:

### Content Quality Standards
1. **Professional Voice**: Business Times editorial style, not AI-generated content
2. **Structure**: Clear H2/H3 headings, logical flow, engaging introduction
3. **Length**: 2000-2500 words for comprehensive analysis
4. **Ending**: Forward-looking market outlook (NO "In conclusion" phrases)
5. **Singapore Context**: Accurate district numbers, current ABSD/LTV rates, real project names

### Editorial Guidelines
- Remove AI-like language patterns and generic conclusions
- Add specific Singapore property market insights and data
- Include forward-looking analysis and market predictions
- Maintain authoritative but accessible tone
- Ensure all facts are current for 2025

### Required Output Format
Return JSON with:
{
  "title": "Compelling, SEO-optimized headline",
  "content": "Full rewritten article in markdown format",
  "excerpt": "150-200 character summary",
  "seoTitle": "SEO-optimized title (50-60 chars)",
  "seoDescription": "Meta description (150-160 chars)",
  "seoKeywords": ["keyword1", "keyword2", "keyword3"],
  "tags": ["tag1", "tag2", "tag3"],
  "featuredImage": "Singapore property image description"
}

Rewrite this article to be publication-ready with Business Times quality standards.`

  try {
    // Use Claude API directly for article rewriting
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY not configured')
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4000,
        messages: [{
          role: 'user',
          content: agentPrompt
        }]
      })
    })

    if (!response.ok) {
      throw new Error(`Claude API error: ${response.status}`)
    }

    const data = await response.json()
    const content = data.content[0]?.text

    if (!content) {
      throw new Error('No content received from Claude API')
    }

    // Extract JSON from Claude's response
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('Could not extract JSON from Claude response')
    }

    const result = JSON.parse(jsonMatch[0])
    
    return {
      title: result.title || originalTitle,
      content: result.content || originalContent,
      excerpt: result.excerpt || originalExcerpt,
      seoTitle: result.seoTitle || result.title,
      seoDescription: result.seoDescription || result.excerpt,
      seoKeywords: result.seoKeywords || [],
      tags: result.tags || [],
      featuredImage: result.featuredImage
    }

  } catch (error) {
    console.error('Agent rewrite failed, using enhanced original:', error)
    
    // Fallback: return improved version of original content
    return {
      title: originalTitle,
      content: enhanceOriginalContent(originalContent),
      excerpt: originalExcerpt,
      seoTitle: originalTitle,
      seoDescription: originalExcerpt,
      seoKeywords: extractKeywords(originalTitle),
      tags: extractKeywords(originalTitle),
      featuredImage: 'modern-singapore-condo-development'
    }
  }
}

// Fallback function to enhance original content
function enhanceOriginalContent(content: string): string {
  // Basic content improvements
  let enhanced = content
    .replace(/In conclusion,?/gi, 'Looking ahead,')
    .replace(/To conclude,?/gi, 'Moving forward,')
    .replace(/In summary,?/gi, 'As the market evolves,')
  
  // Ensure proper markdown formatting
  if (!enhanced.startsWith('#')) {
    const lines = enhanced.split('\n')
    if (lines.length > 0) {
      enhanced = `# ${lines[0]}\n\n${lines.slice(1).join('\n')}`
    }
  }
  
  return enhanced
}

// Helper function to extract keywords from title
function extractKeywords(title: string): string[] {
  const words = title.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 3 && 
      !['singapore', 'property', 'market', 'analysis', 'guide', 'the', 'and', 'for', 'with'].includes(word)
    )
  
  return words.slice(0, 5)
}