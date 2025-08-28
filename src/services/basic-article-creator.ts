import { prisma } from '@/lib/prisma'
import { ArticleCategory, ArticleStatus } from '@prisma/client'
import OpenAI from 'openai'
import { ImageSelector } from './image-selector'

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
      title: "Singapore Property Market Analysis: Current Trends and Opportunities",
      category: ArticleCategory.MARKET_INSIGHTS,
      keywords: ["Singapore property market", "market trends", "real estate analysis"]
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
      
      return savedArticle.slug
    } catch (error) {
      console.error('Error creating article:', error)
      throw error
    }
  }

  // New method for the verified content generator
  async generateArticle(category?: ArticleCategory, topicHint?: string) {
    if (!openai) {
      throw new Error('OpenAI not configured')
    }

    const topic = this.selectTopic(category, topicHint)
    const articleData = await this.generateContent(topic)
    
    return {
      title: articleData.title,
      slug: articleData.slug,
      content: articleData.content,
      excerpt: articleData.excerpt,
      category: articleData.category,
      tags: articleData.tags || [],
      seoTitle: articleData.seoTitle,
      seoDescription: articleData.seoDescription,
      seoKeywords: articleData.keywords ? articleData.keywords.join(', ') : '',
      featuredImage: await ImageSelector.getTopicBasedImage(articleData.title, articleData.category)
    }
  }

  private selectTopic(category?: ArticleCategory, topicHint?: string): ArticleTopic {
    if (topicHint) {
      // Create a custom topic based on the hint
      return {
        title: topicHint,
        category: category || ArticleCategory.MARKET_INSIGHTS,
        keywords: ["Singapore property", "real estate", "market analysis"]
      }
    }
    
    if (category) {
      // Find topics matching the category
      const matchingTopics = this.topics.filter(topic => topic.category === category)
      if (matchingTopics.length > 0) {
        return matchingTopics[Math.floor(Math.random() * matchingTopics.length)]
      }
    }
    
    return this.getRandomTopic()
  }
  
  private getRandomTopic(): ArticleTopic {
    const index = Math.floor(Math.random() * this.topics.length)
    return this.topics[index]
  }
  
  private async generateContent(topic: ArticleTopic) {
    if (!openai) {
      throw new Error('OpenAI not configured')
    }
    
    const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) // Current date for accurate content generation
    
    const prompt = `You are a seasoned Singapore property expert writing for Business Times readers. Write a comprehensive, authoritative article about "${topic.title}".

IMPORTANT: Today's date is ${currentDate}. Write as a LOCAL EXPERT with deep market knowledge. Avoid generic conclusions.

WRITING STYLE:
- Business Times editorial voice - professional, analytical, insider knowledge
- Write as someone who has been tracking Singapore property for decades
- Include specific market observations and insider insights
- Reference actual transactions, policies, and market movements
- Avoid AI-like phrases like "In conclusion", "To conclude", "In summary"
- End with forward-looking analysis or market outlook, NOT conclusions

Requirements:
1. Length: 1500-2000 words
2. Local expert perspective with Singapore market analysis
3. Reference specific developments, precincts, and market segments
4. Include these keywords naturally: ${topic.keywords.join(', ')}
5. Reference government policies (ABSD, LTV, cooling measures) with expert insight
6. Business Times reader expectations - sophisticated property analysis

Structure:
- Market context opening (avoid generic introductions)
- 4-5 analytical sections with specific insights:
  * Current market dynamics with specific examples
  * Policy impacts and regulatory landscape analysis
  * Segment-specific analysis (HDB, private, commercial)
  * Investment considerations and market positioning
  * Expert market outlook and strategic recommendations
- End with MARKET OUTLOOK or EXPERT INSIGHTS (never "in conclusion")

WRITING APPROACH:
- Use insider knowledge and specific market references
- Include transaction patterns and price movements
- Reference actual developments and precincts by name
- Provide balanced, expert analysis based on market fundamentals
- Write for sophisticated investors and property professionals

Format as JSON:
{
  "title": "SEO-optimized title",
  "excerpt": "Compelling 150-character summary",
  "content": "Full article in markdown format with verifiable information",
  "seoTitle": "SEO title (60 chars max)",
  "seoDescription": "Meta description with key insights (160 chars max)",
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
      .substring(0, 100) // Increased from 50 to 100 characters
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
        featuredImage: await ImageSelector.getTopicBasedImage(articleData.title, articleData.category),
      }
    })
    
    return article
  }
}