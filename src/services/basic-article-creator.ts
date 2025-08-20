import { prisma } from '@/lib/prisma'
import { ArticleCategory, ArticleStatus } from '@prisma/client'
import OpenAI from 'openai'

const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null

interface ArticleTopic {
  title: string
  category: ArticleCategory
  keywords: string[]
}

export class BasicArticleCreator {
  private topics: ArticleTopic[] = [
    {
      title: "Singapore Property Market Outlook 2025: Expert Analysis and Predictions",
      category: ArticleCategory.MARKET_INSIGHTS,
      keywords: ["Singapore property market", "2025 trends", "real estate analysis"]
    },
    {
      title: "First-Time Home Buyer's Guide to Singapore Property",
      category: ArticleCategory.BUYING_GUIDE,
      keywords: ["first time buyer", "Singapore property", "home buying guide"]
    },
    {
      title: "Investment Strategies for Singapore Real Estate",
      category: ArticleCategory.INVESTMENT,
      keywords: ["property investment", "Singapore real estate", "investment strategies"]
    },
    {
      title: "Understanding Singapore's Cooling Measures and Their Impact",
      category: ArticleCategory.MARKET_INSIGHTS,
      keywords: ["cooling measures", "Singapore property policy", "market impact"]
    },
    {
      title: "HDB vs Private Property: Complete Comparison Guide",
      category: ArticleCategory.BUYING_GUIDE,
      keywords: ["HDB vs private", "property comparison", "Singapore housing"]
    }
  ]
  
  async createArticle(): Promise<string | null> {
    if (!openai) {
      console.log('OpenAI not configured')
      return null
    }

    try {
      const topic = this.getRandomTopic()
      console.log('Generating article for topic:', topic.title)
      
      const articleData = await this.generateContent(topic)
      console.log('Article content generated successfully')
      
      const savedArticle = await this.saveToDatabase(articleData)
      console.log('Article saved to database:', savedArticle.id)
      
      return savedArticle.id
    } catch (error) {
      console.error('Error creating article:', error)
      throw error
    }
  }
  
  private getRandomTopic(): ArticleTopic {
    const index = Math.floor(Math.random() * this.topics.length)
    return this.topics[index]
  }
  
  private async generateContent(topic: ArticleTopic) {
    if (!openai) {
      throw new Error('OpenAI not configured')
    }
    
    const currentDate = "August 18, 2025" // Current date for accurate content generation
    
    const prompt = `You are Singapore's leading property expert with 20+ years of experience. Write a comprehensive, SEO-optimized article about "${topic.title}".

IMPORTANT: Today's date is ${currentDate}. We are currently in 2025. All content must reflect 2025 market conditions and data.

Requirements:
1. Length: 1500-2000 words
2. Include current 2025 Singapore market insights and data
3. Provide actionable advice for 2025 property buyers/investors
4. Use Singapore-specific examples and current 2025 developments
5. Professional yet engaging tone
6. Include these keywords naturally: ${topic.keywords.join(', ')}
7. Reference current 2025 government policies and market conditions
8. Include realistic 2025 price data and trends

Structure:
- Compelling introduction with current 2025 market hook
- 4-5 main sections with clear subheadings covering:
  * Current 2025 market landscape
  * Latest trends shaping the market in 2025
  * 2025 price analysis and predictions
  * Investment opportunities for 2025
  * Expert recommendations for 2025
- Practical tips and actionable insights for 2025
- Strong conclusion with call-to-action

Format as JSON:
{
  "title": "SEO-optimized title with 2025",
  "excerpt": "Compelling 150-character summary mentioning 2025",
  "content": "Full article in markdown format with current 2025 context",
  "seoTitle": "SEO title mentioning 2025 (60 chars max)",
  "seoDescription": "Meta description highlighting 2025 insights (160 chars max)",
  "tags": ["tag1", "tag2", "tag3"]
}`

    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are Singapore's top property expert with 20+ years of experience. Write authoritative, helpful content."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 3000,
      response_format: { type: "json_object" }
    })
    
    const articleData = JSON.parse(response.choices[0].message.content || '{}')
    
    return {
      ...articleData,
      category: topic.category,
      keywords: topic.keywords,
      slug: this.createSlug(articleData.title),
    }
  }
  
  private createSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 50) // Limit length
  }
  
  private async saveToDatabase(articleData: any) {
    // Ensure author exists
    const author = await prisma.author.upsert({
      where: { email: 'expert@singaporepropertyhub.sg' },
      update: {},
      create: {
        id: 'singapore-property-expert',
        name: 'Singapore Property Expert',
        email: 'expert@singaporepropertyhub.sg',
        bio: 'Singapore\'s leading property advisor with over 20 years of experience.',
      }
    })
    
    // Make slug unique if needed
    const existingSlug = await prisma.article.findUnique({
      where: { slug: articleData.slug }
    })
    
    if (existingSlug) {
      articleData.slug = `${articleData.slug}-${Date.now()}`
    }
    
    // Create article without LinkedIn fields
    const article = await prisma.article.create({
      data: {
        title: articleData.title,
        slug: articleData.slug,
        excerpt: articleData.excerpt,
        content: articleData.content,
        category: articleData.category,
        tags: articleData.tags || [],
        seoTitle: articleData.seoTitle,
        seoDescription: articleData.seoDescription,
        seoKeywords: articleData.keywords || [],
        status: ArticleStatus.PUBLISHED,
        publishedAt: new Date(),
        authorId: author.id,
      }
    })
    
    return article
  }
}