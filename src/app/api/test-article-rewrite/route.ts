import { NextRequest, NextResponse } from 'next/server'
import { WebFactChecker } from '@/lib/agent-fact-checker-web'

export async function POST(request: NextRequest) {
  try {
    const { prisma } = await import('@/lib/prisma')
    const body = await request.json()
    const { articleId } = body

    if (!articleId) {
      return NextResponse.json({
        success: false,
        error: 'articleId is required'
      }, { status: 400 })
    }

    // Get the article to test
    const article = await prisma.article.findUnique({
      where: { id: articleId },
      include: { author: true }
    })

    if (!article) {
      return NextResponse.json({
        success: false,
        error: 'Article not found'
      }, { status: 404 })
    }

    console.log(`🧪 Testing rewrite for: ${article.title}`)

    // Test the rewriting process
    const rewrittenContent = await rewriteArticleWithAgent(
      article.title,
      article.content || '',
      article.category,
      article.excerpt || ''
    )

    // Test fact-checking
    const factChecker = new WebFactChecker()
    const factCheckResult = await factChecker.checkArticle(
      rewrittenContent.content,
      rewrittenContent.title
    )

    return NextResponse.json({
      success: true,
      originalArticle: {
        id: article.id,
        title: article.title,
        contentLength: article.content?.length || 0,
        category: article.category
      },
      rewrittenContent: {
        title: rewrittenContent.title,
        contentLength: rewrittenContent.content.length,
        excerpt: rewrittenContent.excerpt,
        contentPreview: rewrittenContent.content.substring(0, 500) + '...'
      },
      factCheck: {
        score: factCheckResult.score,
        isAccurate: factCheckResult.isAccurate,
        issuesCount: factCheckResult.issues.length,
        issues: factCheckResult.issues.slice(0, 3), // First 3 issues
        sourcesCount: factCheckResult.sources.length
      }
    })

  } catch (error) {
    console.error('❌ Test article rewrite failed:', error)
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
  const agentPrompt = `
# Property Article Rewriting Request

## Original Article to Rewrite
**Title**: ${originalTitle}
**Category**: ${category}
**Original Content**: ${originalContent.substring(0, 2000)}...

## Editorial Requirements
As property-article-writer agent, rewrite this article to meet Business Times editorial standards:

### Content Quality Standards
1. **Professional Voice**: Business Times editorial style, authoritative but accessible
2. **Structure**: Clear H2/H3 headings, logical flow, engaging introduction
3. **Length**: 2000-2500 words for comprehensive analysis
4. **Ending**: Forward-looking market outlook (NO "In conclusion" phrases)
5. **Singapore Context**: Accurate district numbers, current 2025 ABSD/LTV rates, real project names

### Editorial Guidelines
- Remove AI-like language patterns and generic conclusions
- Add specific Singapore property market insights and data
- Include forward-looking analysis and market predictions
- Maintain authoritative but accessible tone
- Ensure all facts are current for 2025
- Use proper markdown formatting with H2 (##) and H3 (###) headings

### Required Output Format
Return JSON with:
{
  "title": "Compelling, SEO-optimized headline",
  "content": "Full rewritten article in markdown format (2000-2500 words)",
  "excerpt": "150-200 character summary",
  "seoTitle": "SEO-optimized title (50-60 chars)",
  "seoDescription": "Meta description (150-160 chars)",
  "seoKeywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "featuredImage": "Singapore property image description"
}

Write a comprehensive, publication-ready article that meets Business Times editorial standards for Singapore property analysis.`

  try {
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
      const errorText = await response.text()
      throw new Error(`Claude API error: ${response.status} - ${errorText}`)
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
      featuredImage: result.featuredImage || 'modern-singapore-property-development'
    }

  } catch (error) {
    console.error('Agent rewrite failed:', error)
    throw error
  }
}