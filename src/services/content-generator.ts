import OpenAI from 'openai'
import { PrismaClient } from '@prisma/client'
import { ArticleCategory, ArticleStatus } from '@prisma/client'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const prisma = new PrismaClient()

interface ArticleTopic {
  title: string
  category: ArticleCategory
  keywords: string[]
}

export class ContentGenerator {
  private authorId: string = 'singapore-property-expert'
  
  private topics: ArticleTopic[] = [
    {
      title: "Current HDB Resale Market Trends in Singapore",
      category: ArticleCategory.MARKET_INSIGHTS,
      keywords: ["HDB resale", "Singapore property market", "HDB prices"]
    },
    {
      title: "Top Districts for Property Investment in Singapore",
      category: ArticleCategory.INVESTMENT,
      keywords: ["Singapore districts", "property investment", "ROI"]
    },
    {
      title: "Guide to Buying Your First Condo in Singapore",
      category: ArticleCategory.BUYING_GUIDE,
      keywords: ["first time buyer", "Singapore condo", "property guide"]
    },
    {
      title: "Commercial Shophouse Investment Opportunities",
      category: ArticleCategory.INVESTMENT,
      keywords: ["shophouse", "commercial property", "Singapore investment"]
    },
    {
      title: "Landed Property Market Analysis",
      category: ArticleCategory.MARKET_INSIGHTS,
      keywords: ["landed property", "Singapore real estate", "market analysis"]
    }
  ]
  
  async generateDailyArticle(): Promise<void> {
    try {
      const topic = this.getRandomTopic()
      const article = await this.generateArticle(topic)
      await this.saveArticle(article)
    } catch (error) {
      console.error('Error generating daily article:', error)
      throw error
    }
  }
  
  private getRandomTopic(): ArticleTopic {
    const today = new Date().getDay()
    return this.topics[today % this.topics.length]
  }
  
  private async generateArticle(topic: ArticleTopic) {
    const currentDate = new Date().toLocaleDateString('en-SG', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
    
    const prompt = `You are Singapore's most renowned property expert and advisor. Write a comprehensive, SEO-optimized article about "${topic.title}" for the Singapore property market.

Current date: ${currentDate}

Requirements:
1. Length: 1500-2000 words
2. Include current market data and trends
3. Provide actionable insights for readers
4. Use Singapore-specific examples and locations
5. Include relevant statistics and facts
6. Write in a professional yet engaging tone
7. Optimize for SEO with natural keyword usage: ${topic.keywords.join(', ')}

Structure:
- Engaging introduction with hook
- 4-5 main sections with subheadings
- Practical tips and advice
- Market insights and analysis
- Conclusion with call-to-action

Format the response as JSON with:
{
  "title": "SEO-optimized title",
  "excerpt": "150-character excerpt",
  "content": "Full article content in markdown",
  "seoTitle": "SEO meta title (60 chars max)",
  "seoDescription": "SEO meta description (160 chars max)",
  "tags": ["tag1", "tag2", "tag3"]
}`

    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are Singapore's top property expert with 20+ years of experience in real estate."
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
      slug: this.generateSlug(articleData.title),
    }
  }
  
  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }
  
  private async saveArticle(articleData: any) {
    const author = await prisma.author.upsert({
      where: { email: 'expert@singaporepropertyhub.sg' },
      update: {},
      create: {
        id: this.authorId,
        name: 'Singapore Property Expert',
        email: 'expert@singaporepropertyhub.sg',
        bio: 'Singapore\'s leading property advisor with over 20 years of experience in residential and commercial real estate.',
      }
    })
    
    await prisma.article.create({
      data: {
        title: articleData.title,
        slug: articleData.slug,
        excerpt: articleData.excerpt,
        content: articleData.content,
        category: articleData.category,
        tags: articleData.tags,
        seoTitle: articleData.seoTitle,
        seoDescription: articleData.seoDescription,
        seoKeywords: articleData.keywords,
        status: ArticleStatus.REVIEW,
        authorId: author.id,
      }
    })
  }
}