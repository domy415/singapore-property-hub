import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ArticleStatus } from '@prisma/client'
import OpenAI from 'openai'

const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null

export async function GET(request: NextRequest) {
  try {
    console.log('Fixing articles with conclusion endings...')
    
    if (!openai) {
      return NextResponse.json({
        success: false,
        error: 'OpenAI not configured'
      })
    }

    // Find articles with "In conclusion" or similar patterns
    const problematicArticles = await prisma.article.findMany({
      where: {
        status: ArticleStatus.PUBLISHED,
        OR: [
          { content: { contains: 'In conclusion', mode: 'insensitive' } },
          { content: { contains: 'To conclude', mode: 'insensitive' } },
          { content: { contains: 'In summary', mode: 'insensitive' } },
          { content: { contains: 'To summarize', mode: 'insensitive' } }
        ]
      },
      select: {
        id: true,
        title: true,
        slug: true,
        content: true,
        category: true
      }
    })

    console.log(`Found ${problematicArticles.length} articles with conclusion patterns`)

    const fixedArticles = []

    for (const article of problematicArticles) {
      try {
        console.log(`Fixing conclusion pattern in: ${article.title}`)

        // Generate new ending based on article content and category
        const prompt = `You are a Business Times property editor. The following article ends with generic AI-like conclusions. Rewrite ONLY the ending section to sound like a local Singapore property expert with insider knowledge.

ORIGINAL ARTICLE CONTENT:
${article.content}

INSTRUCTIONS:
- Keep all content exactly the same EXCEPT the conclusion/ending section
- Replace any "In conclusion", "To conclude", "In summary" endings
- Write a new ending as "Market Outlook" or "Expert Insights" section
- Use Business Times editorial voice - authoritative, analytical, insider knowledge
- End with forward-looking market analysis or expert commentary
- Reference specific Singapore market dynamics and trends

Return the COMPLETE rewritten article maintaining all original sections but with the improved ending.

Format as JSON:
{
  "content": "Complete article content with improved ending",
  "endingType": "Market Outlook" or "Expert Insights"
}`

        const response = await openai.chat.completions.create({
          model: "gpt-4-turbo-preview",
          messages: [
            {
              role: "system", 
              content: "You are a Singapore property expert writing for Business Times readers. Eliminate generic AI conclusions and write authentic market analysis."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 4000,
          response_format: { type: "json_object" }
        })

        const result = JSON.parse(response.choices[0].message.content || '{}')
        
        if (!result.content) {
          console.log(`Failed to generate content for article ${article.id}`)
          continue
        }

        // Update the article with new content
        await prisma.article.update({
          where: { id: article.id },
          data: {
            content: result.content,
            updatedAt: new Date()
          }
        })

        fixedArticles.push({
          id: article.id,
          title: article.title,
          slug: article.slug,
          endingType: result.endingType || 'Improved',
          url: `https://singapore-property-hub.vercel.app/articles/${article.slug}`
        })

        console.log(`✅ Fixed conclusion pattern: ${article.title}`)

      } catch (error) {
        console.error(`❌ Error fixing article ${article.id}:`, error)
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Conclusion pattern fixing completed',
      stats: {
        totalProblematicArticles: problematicArticles.length,
        articlesFixed: fixedArticles.length,
        articlesSkipped: problematicArticles.length - fixedArticles.length
      },
      fixedArticles: fixedArticles
    })

  } catch (error) {
    console.error('Error fixing conclusion articles:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}