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
  propertyName?: string
  isPropertySpecific?: boolean
}

// Singapore property images database
const PROPERTY_IMAGES: Record<string, string> = {
  // New Launches 2025
  'The Continuum': 'https://static.straitstimes.com.sg/s3fs-public/styles/xlarge/public/articles/2023/11/24/iStock-1370119373_3.jpg',
  'Grand Dunman': 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&h=630&fit=crop',
  'Tembusu Grand': 'https://images.unsplash.com/photo-1591825729269-caeb344f6df2?w=1200&h=630&fit=crop',
  'Lentor Mansion': 'https://www.straitstimes.com/sites/default/files/styles/large/public/articles/2023/09/08/lentor-mansion-080923.jpg',
  'The Reserve Residences': 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&h=630&fit=crop',
  'J\'den': 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=630&fit=crop',
  'Pinetree Hill': 'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=1200&h=630&fit=crop',
  'Hillhaven': 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200&h=630&fit=crop',
  'Watten House': 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200&h=630&fit=crop',
  
  // Iconic Properties
  'Marina Bay Sands': 'https://images.unsplash.com/photo-1555217851-6141535bd771?w=1200&h=630&fit=crop',
  'Reflections at Keppel Bay': 'https://images.unsplash.com/photo-1567958451986-2de427a4a0be?w=1200&h=630&fit=crop',
  'Sentosa Cove': 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&h=630&fit=crop',
  'The Interlace': 'https://images.unsplash.com/photo-1591825729269-caeb344f6df2?w=1200&h=630&fit=crop',
  'Sky Habitat': 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&h=630&fit=crop',
  
  // Districts
  'District 9': 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=1200&h=630&fit=crop',
  'District 10': 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200&h=630&fit=crop',
  'Orchard': 'https://images.unsplash.com/photo-1531971589569-0d9370cbe1e5?w=1200&h=630&fit=crop',
  'Marina Bay': 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1200&h=630&fit=crop',
  'Bukit Timah': 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200&h=630&fit=crop',
  
  // HDB Towns
  'Tampines': 'https://images.unsplash.com/photo-1565402170291-8491f14678db?w=1200&h=630&fit=crop',
  'Bishan': 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&h=630&fit=crop',
  'Toa Payoh': 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=1200&h=630&fit=crop',
  'Queenstown': 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&h=630&fit=crop',
}

export class EnhancedArticleCreator {
  private newLaunchTopics: ArticleTopic[] = [
    {
      title: "The Continuum Review: Thiam Siew Avenue's Newest Premium Development",
      category: ArticleCategory.PROPERTY_NEWS,
      keywords: ["The Continuum", "Thiam Siew Avenue", "new launch 2025"],
      propertyName: "The Continuum",
      isPropertySpecific: true
    },
    {
      title: "Grand Dunman: Comprehensive Analysis of Katong's Latest Mixed Development",
      category: ArticleCategory.PROPERTY_NEWS,
      keywords: ["Grand Dunman", "Katong", "mixed development"],
      propertyName: "Grand Dunman",
      isPropertySpecific: true
    },
    {
      title: "Lentor Mansion: Investment Potential in Singapore's Growing North",
      category: ArticleCategory.INVESTMENT,
      keywords: ["Lentor Mansion", "Lentor", "investment property"],
      propertyName: "Lentor Mansion",
      isPropertySpecific: true
    },
    {
      title: "Tembusu Grand Review: A Detailed Look at the Katong Park MRT Development",
      category: ArticleCategory.PROPERTY_NEWS,
      keywords: ["Tembusu Grand", "Katong Park MRT", "new launch"],
      propertyName: "Tembusu Grand",
      isPropertySpecific: true
    },
  ]
  
  private marketTopics: ArticleTopic[] = [
    {
      title: "District 9 vs District 10: Which Premium District Offers Better Value in 2025?",
      category: ArticleCategory.MARKET_INSIGHTS,
      keywords: ["District 9", "District 10", "premium property"],
      propertyName: "District 9",
      isPropertySpecific: false
    },
    {
      title: "Orchard Road Property Market Analysis: Investment Opportunities in 2025",
      category: ArticleCategory.INVESTMENT,
      keywords: ["Orchard Road", "property investment", "2025 market"],
      propertyName: "Orchard",
      isPropertySpecific: false
    },
    {
      title: "Marina Bay Real Estate: Understanding the Premium and Future Growth",
      category: ArticleCategory.NEIGHBORHOOD,
      keywords: ["Marina Bay", "luxury property", "waterfront living"],
      propertyName: "Marina Bay",
      isPropertySpecific: false
    },
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
      
      const savedArticle = await this.saveToDatabase(articleData, topic)
      console.log('Article saved to database:', savedArticle.id)
      
      return savedArticle.slug
    } catch (error) {
      console.error('Error creating article:', error)
      throw error
    }
  }
  
  private getRandomTopic(): ArticleTopic {
    const allTopics = [...this.newLaunchTopics, ...this.marketTopics]
    const index = Math.floor(Math.random() * allTopics.length)
    return allTopics[index]
  }
  
  private async generateContent(topic: ArticleTopic) {
    if (!openai) {
      throw new Error('OpenAI not configured')
    }
    
    const currentDate = new Date().toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    })
    
    const propertyPrompt = topic.isPropertySpecific 
      ? `This article is specifically about ${topic.propertyName}. Include specific details about this development.`
      : ''
    
    const prompt = `You are Singapore's leading property expert with 20+ years of experience. Write a comprehensive, SEO-optimized article about "${topic.title}".

IMPORTANT: Today's date is ${currentDate}. We are currently in 2025. All content must reflect 2025 market conditions and data.
${propertyPrompt}

Requirements:
1. Length: 1500-2000 words
2. Format: Use proper markdown formatting with clear headings (##), subheadings (###), paragraphs, and lists
3. Include current 2025 Singapore market insights and data
4. Provide actionable advice for 2025 property buyers/investors
5. Use Singapore-specific examples and current 2025 developments
6. Professional yet engaging tone
7. Include these keywords naturally: ${topic.keywords.join(', ')}
8. Reference current 2025 government policies and market conditions
9. Include realistic 2025 price data and trends

IMPORTANT FORMATTING REQUIREMENTS:
- Use ## for main headings
- Use ### for subheadings
- Separate paragraphs with blank lines
- Use bullet points or numbered lists where appropriate
- Include **bold** text for emphasis
- Create a well-structured, scannable article

Structure:
- Compelling introduction with current 2025 market hook
- 4-5 main sections with clear headings covering:
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
  "content": "Full article in PROPERLY FORMATTED markdown with headings, paragraphs, and lists",
  "seoTitle": "SEO title mentioning 2025 (60 chars max)",
  "seoDescription": "Meta description highlighting 2025 insights (160 chars max)",
  "tags": ["tag1", "tag2", "tag3"]
}`

    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are Singapore's top property expert. Write well-formatted, authoritative content with proper markdown structure."
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
      .substring(0, 50)
  }
  
  private getPropertySpecificImage(topic: ArticleTopic): string {
    // If we have a specific property name, try to get its image
    if (topic.propertyName && PROPERTY_IMAGES[topic.propertyName]) {
      return PROPERTY_IMAGES[topic.propertyName]
    }
    
    // Otherwise, return a relevant category image
    return this.getCategoryImage(topic.category)
  }
  
  private getCategoryImage(category: ArticleCategory): string {
    const categoryImages = {
      [ArticleCategory.MARKET_INSIGHTS]: [
        'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=1200&h=630&fit=crop',
        'https://images.unsplash.com/photo-1565967511849-76a60a516170?w=1200&h=630&fit=crop',
        'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1200&h=630&fit=crop'
      ],
      [ArticleCategory.BUYING_GUIDE]: [
        'https://images.unsplash.com/photo-1494526585095-c41746248156?w=1200&h=630&fit=crop',
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=630&fit=crop',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&h=630&fit=crop'
      ],
      [ArticleCategory.INVESTMENT]: [
        'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=1200&h=630&fit=crop',
        'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200&h=630&fit=crop',
        'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200&h=630&fit=crop'
      ],
      [ArticleCategory.NEIGHBORHOOD]: [
        'https://images.unsplash.com/photo-1601760562234-9814eea6663a?w=1200&h=630&fit=crop',
        'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=1200&h=630&fit=crop',
        'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1200&h=630&fit=crop'
      ],
      [ArticleCategory.PROPERTY_NEWS]: [
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&h=630&fit=crop',
        'https://images.unsplash.com/photo-1565402170291-8491f14678db?w=1200&h=630&fit=crop',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&h=630&fit=crop'
      ],
      [ArticleCategory.SELLING_GUIDE]: [
        'https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=1200&h=630&fit=crop',
        'https://images.unsplash.com/photo-1593696140826-c58b021acf8b?w=1200&h=630&fit=crop',
        'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&h=630&fit=crop'
      ]
    }
    
    const images = categoryImages[category] || categoryImages[ArticleCategory.MARKET_INSIGHTS]
    return images[Math.floor(Math.random() * images.length)]
  }
  
  private async saveToDatabase(articleData: any, topic: ArticleTopic) {
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
    
    // Create article with property-specific image
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
        featuredImage: this.getPropertySpecificImage(topic),
      }
    })
    
    return article
  }
}