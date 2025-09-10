import { prisma } from '@/lib/prisma'
import { ArticleCategory, ArticleStatus } from '@prisma/client'
import OpenAI from 'openai'
import { LinkedInManager } from './linkedin-manager'
import { NewLaunchGenerator } from './new-launch-generator'
import { generateSlug } from '@/utils/generateSlug'

const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null

interface ArticleTopic {
  title: string
  category: ArticleCategory
  keywords: string[]
}

export class ContentGenerator {
  private authorId: string = 'singapore-property-expert'
  private newLaunchGenerator: NewLaunchGenerator

  constructor() {
    this.newLaunchGenerator = new NewLaunchGenerator()
  }
  
  private topics: ArticleTopic[] = [
    // Market Insights
    {
      title: "Current HDB Resale Market Trends in Singapore 2025",
      category: ArticleCategory.MARKET_INSIGHTS,
      keywords: ["HDB resale", "Singapore property market 2025", "HDB prices", "BTO alternatives"]
    },
    {
      title: "Singapore Property Price Forecast: What to Expect in Q4 2025",
      category: ArticleCategory.MARKET_INSIGHTS,
      keywords: ["property price forecast", "Singapore real estate 2025", "market predictions", "property trends"]
    },
    {
      title: "Landed Property Market Analysis: Freehold vs Leasehold in 2025",
      category: ArticleCategory.MARKET_INSIGHTS,
      keywords: ["landed property", "freehold property Singapore", "leasehold comparison", "property investment"]
    },
    {
      title: "New Launch Condos vs Resale: Making the Right Choice in 2025",
      category: ArticleCategory.MARKET_INSIGHTS,
      keywords: ["new launch condo", "resale property", "Singapore condos 2025", "property comparison"]
    },
    
    // Investment Guides
    {
      title: "Top 5 Districts for Property Investment Returns in Singapore",
      category: ArticleCategory.INVESTMENT,
      keywords: ["Singapore districts", "property investment", "ROI", "rental yield"]
    },
    {
      title: "Commercial Shophouse Investment: Hidden Gems in 2025",
      category: ArticleCategory.INVESTMENT,
      keywords: ["shophouse investment", "commercial property", "Singapore shophouse", "heritage property"]
    },
    {
      title: "REITs vs Physical Property: Singapore Investment Strategy 2025",
      category: ArticleCategory.INVESTMENT,
      keywords: ["Singapore REITs", "property investment", "real estate investment trust", "investment strategy"]
    },
    
    // Buying Guides
    {
      title: "First-Time Buyer's Guide to Singapore Condos in 2025",
      category: ArticleCategory.BUYING_GUIDE,
      keywords: ["first time buyer", "Singapore condo", "property guide", "home loan Singapore"]
    },
    {
      title: "Executive Condo (EC) Buying Guide: Everything You Need to Know",
      category: ArticleCategory.BUYING_GUIDE,
      keywords: ["executive condo", "EC Singapore", "HDB upgraders", "property eligibility"]
    },
    {
      title: "Navigating ABSD and Stamp Duties: 2025 Property Tax Guide",
      category: ArticleCategory.BUYING_GUIDE,
      keywords: ["ABSD Singapore", "stamp duty", "property tax 2025", "buyer stamp duty"]
    },
    
    // Neighborhood Guides
    {
      title: "Jurong Lake District: The Next CBD Property Hotspot",
      category: ArticleCategory.NEIGHBORHOOD,
      keywords: ["Jurong Lake District", "Singapore CBD", "property hotspot", "future development"]
    },
    {
      title: "East Coast Living: Why Property Prices Keep Rising",
      category: ArticleCategory.NEIGHBORHOOD,
      keywords: ["East Coast property", "Singapore lifestyle", "beachfront living", "District 15 16"]
    },
    {
      title: "Woodlands Regional Centre: Investment Opportunities Near Johor",
      category: ArticleCategory.NEIGHBORHOOD,
      keywords: ["Woodlands property", "Johor proximity", "regional centre", "RTS Link"]
    },
    
    // Property News & Updates
    {
      title: "Smart Nation Initiatives: How They Affect Property Values",
      category: ArticleCategory.PROPERTY_NEWS,
      keywords: ["smart nation", "property technology", "Singapore innovation", "property values"]
    },
    {
      title: "Green Buildings and Sustainability: The Future of Singapore Property",
      category: ArticleCategory.PROPERTY_NEWS,
      keywords: ["green building", "sustainable property", "BCA Green Mark", "eco-friendly homes"]
    }
  ]
  
  async generateDailyArticle(): Promise<string | null> {
    if (!openai) {
      console.log('OpenAI not configured - skipping content generation')
      return null
    }

    try {
      // 40% chance of generating a new launch article, 60% regular topics
      const shouldGenerateNewLaunch = Math.random() < 0.4

      if (shouldGenerateNewLaunch) {
        console.log('Generating new launch article...')
        return await this.newLaunchGenerator.generateNewLaunchArticle()
      } else {
        console.log('Generating regular topic article...')
        const topic = await this.getRandomTopic()
        const article = await this.generateArticle(topic)
        const savedArticle = await this.saveArticle(article)
        return savedArticle.id
      }
    } catch (error) {
      console.error('Error generating daily article:', error)
      throw error
    }
  }
  
  private async getRandomTopic(): Promise<ArticleTopic> {
    // Get recently used topics to avoid repetition
    const recentArticles = await prisma.article.findMany({
      where: {
        publishedAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
        }
      },
      select: {
        title: true
      },
      orderBy: {
        publishedAt: 'desc'
      },
      take: 7
    })
    
    const recentTitles = recentArticles.map(a => a.title.toLowerCase())
    
    // Filter out recently used topics
    const availableTopics = this.topics.filter(topic => {
      const topicLower = topic.title.toLowerCase()
      return !recentTitles.some(recent => 
        recent.includes(topicLower.substring(0, 20)) || 
        topicLower.includes(recent.substring(0, 20))
      )
    })
    
    // If all topics were recently used, use all topics
    const topicsToChooseFrom = availableTopics.length > 0 ? availableTopics : this.topics
    
    // Select random topic from available ones
    const randomIndex = Math.floor(Math.random() * topicsToChooseFrom.length)
    return topicsToChooseFrom[randomIndex]
  }
  
  private async generateArticle(topic: ArticleTopic) {
    if (!openai) {
      throw new Error('OpenAI API key not configured')
    }
    
    const currentDate = new Date().toLocaleDateString('en-SG', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
    
    const prompt = `You are Singapore's most renowned property expert and advisor. Write a comprehensive, SEO-optimized article about "${topic.title}" for the Singapore property market.

Current date: ${currentDate}
Context: We are in August 2025, well into the year with significant market data available. Consider recent policy changes, infrastructure developments, and market trends specific to 2025.

Requirements:
1. Length: 1500-2000 words
2. Include current 2025 market data and trends
3. Reference specific Singapore locations, projects, and developments
4. Provide actionable insights and expert recommendations
5. Include relevant statistics, prices, and market indicators
6. Write in a professional yet conversational tone
7. Naturally incorporate these keywords: ${topic.keywords.join(', ')}
8. Make content evergreen but with 2025-specific insights

Structure:
- Compelling introduction with current market hook
- 4-5 detailed sections with descriptive subheadings
- Real-world examples and case studies
- Data-driven insights and analysis
- Expert tips and practical advice
- Strong conclusion with clear call-to-action

Remember: You're writing in August 2025, so you have access to H1 2025 data and can make informed predictions for the remainder of the year.

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
      slug: generateSlug(articleData.title),
    }
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
    
    // Check if article with this slug already exists
    const existingArticle = await prisma.article.findUnique({
      where: { slug: articleData.slug }
    })
    
    if (existingArticle) {
      // Modify slug to make it unique
      articleData.slug = `${articleData.slug}-${Date.now()}`
    }
    
    const article = await prisma.article.create({
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
        status: ArticleStatus.PUBLISHED,
        publishedAt: new Date(),
        authorId: author.id,
      }
    })
    
    // Auto-post to LinkedIn if configured (temporarily disabled to avoid schema issues)
    try {
      // const linkedinManager = new LinkedInManager()
      // await linkedinManager.scheduleArticlePost(article.id)
      console.log(`Article ${article.id} created - LinkedIn posting temporarily disabled`)
    } catch (error) {
      console.error('Failed to schedule LinkedIn post:', error)
      // Don't fail article creation if LinkedIn posting fails
    }
    
    return article
  }
}