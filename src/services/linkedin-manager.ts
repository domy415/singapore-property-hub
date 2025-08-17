import { prisma } from '@/lib/prisma'
import OpenAI from 'openai'

const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null

interface LinkedInPost {
  text: string
  hashtags: string[]
  media?: {
    title: string
    description: string
    url: string
  }
}

interface LinkedInConfig {
  accessToken: string
  personId: string
}

export class LinkedInManager {
  private config: LinkedInConfig | null
  
  constructor() {
    this.config = this.getLinkedInConfig()
  }
  
  private getLinkedInConfig(): LinkedInConfig | null {
    const accessToken = process.env.LINKEDIN_ACCESS_TOKEN
    const personId = process.env.LINKEDIN_PERSON_ID
    
    if (!accessToken || !personId) {
      console.log('LinkedIn credentials not configured')
      return null
    }
    
    return {
      accessToken,
      personId
    }
  }
  
  async postArticleToLinkedIn(articleId: string): Promise<boolean> {
    if (!this.config) {
      console.log('LinkedIn not configured, skipping post')
      return false
    }
    
    try {
      // Get article from database
      const article = await prisma.article.findUnique({
        where: { id: articleId }
      })
      
      if (!article) {
        throw new Error('Article not found')
      }
      
      // Generate LinkedIn post content
      const linkedInPost = await this.generateLinkedInPost(article)
      
      // Post to LinkedIn
      const result = await this.createLinkedInPost(linkedInPost, article)
      
      if (result) {
        // Update article as posted to LinkedIn
        await prisma.article.update({
          where: { id: articleId },
          data: {
            linkedInPosted: true,
            linkedInPostDate: new Date()
          }
        })
        
        console.log(`Article ${articleId} posted to LinkedIn successfully`)
        return true
      }
      
      return false
    } catch (error) {
      console.error('Failed to post to LinkedIn:', error)
      return false
    }
  }
  
  private async generateLinkedInPost(article: any): Promise<LinkedInPost> {
    if (!openai) {
      // Fallback post without AI
      return {
        text: `🏠 New Article: ${article.title}\n\n${article.excerpt || article.summary}\n\nRead more on Singapore Property Hub 👆`,
        hashtags: ['#SingaporeProperty', '#RealEstate', '#PropertyInvestment', '#Singapore']
      }
    }
    
    try {
      const prompt = `Create an engaging LinkedIn post for this Singapore property article:

Title: ${article.title}
Summary: ${article.summary}
Category: ${article.category}

Create a LinkedIn post that:
1. Hooks the reader with an engaging opening
2. Highlights key insights from the article
3. Uses relevant emojis appropriately
4. Includes a call-to-action
5. Uses relevant hashtags for Singapore property market
6. Keeps it under 3000 characters

Format as JSON:
{
  "text": "Main post content with emojis",
  "hashtags": ["array", "of", "hashtags"]
}`

      const response = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content: "You are a Singapore property expert creating engaging LinkedIn content for professionals and investors."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" }
      })
      
      const generatedPost = JSON.parse(response.choices[0].message.content || '{}')
      
      return {
        text: generatedPost.text || `New insights on Singapore property market: ${article.title}`,
        hashtags: generatedPost.hashtags || ['#SingaporeProperty', '#RealEstate'],
        media: {
          title: article.title,
          description: article.summary,
          url: `https://singapore-property-hub.vercel.app/articles/${article.slug}`
        }
      }
    } catch (error) {
      console.error('Failed to generate LinkedIn post with AI:', error)
      // Fallback
      return {
        text: `🏠 ${article.title}\n\n${article.summary}\n\nRead the full article on Singapore Property Hub`,
        hashtags: ['#SingaporeProperty', '#RealEstate', '#PropertyInvestment'],
        media: {
          title: article.title,
          description: article.summary,
          url: `https://singapore-property-hub.vercel.app/articles/${article.slug}`
        }
      }
    }
  }
  
  private async createLinkedInPost(post: LinkedInPost, article: any): Promise<boolean> {
    if (!this.config) return false
    
    try {
      const postContent = `${post.text}\n\n${post.hashtags.join(' ')}`
      
      // LinkedIn API v2 post creation
      const postData = {
        author: `urn:li:person:${this.config.personId}`,
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: {
              text: postContent
            },
            shareMediaCategory: 'ARTICLE',
            media: [
              {
                status: 'READY',
                description: {
                  text: post.media?.description || article.summary
                },
                originalUrl: post.media?.url || `https://singapore-property-hub.vercel.app/articles/${article.slug}`,
                title: {
                  text: post.media?.title || article.title
                }
              }
            ]
          }
        },
        visibility: {
          'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
        }
      }
      
      const response = await fetch('https://api.linkedin.com/v2/ugcPosts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.accessToken}`,
          'Content-Type': 'application/json',
          'X-Restli-Protocol-Version': '2.0.0'
        },
        body: JSON.stringify(postData)
      })
      
      if (response.ok) {
        const result = await response.json()
        console.log('LinkedIn post created:', result.id)
        return true
      } else {
        const error = await response.text()
        console.error('LinkedIn API error:', error)
        return false
      }
    } catch (error) {
      console.error('LinkedIn post creation failed:', error)
      return false
    }
  }
  
  async getProfileInfo(): Promise<any> {
    if (!this.config) return null
    
    try {
      const response = await fetch('https://api.linkedin.com/v2/people/(id:{id})', {
        headers: {
          'Authorization': `Bearer ${this.config.accessToken}`
        }
      })
      
      if (response.ok) {
        return await response.json()
      }
      return null
    } catch (error) {
      console.error('Failed to get LinkedIn profile:', error)
      return null
    }
  }
  
  async scheduleArticlePost(articleId: string, scheduleDate?: Date): Promise<boolean> {
    // For now, post immediately. In production, this would integrate with a job scheduler
    if (scheduleDate && scheduleDate > new Date()) {
      console.log(`Article ${articleId} scheduled for LinkedIn posting at ${scheduleDate}`)
      // In production: create scheduled job
      return true
    }
    
    return await this.postArticleToLinkedIn(articleId)
  }
  
  async postAllUnpostedArticles(): Promise<number> {
    try {
      const unpostedArticles = await prisma.article.findMany({
        where: {
          status: 'PUBLISHED',
          linkedInPosted: { not: true }
        },
        orderBy: { publishedAt: 'desc' },
        take: 5 // Limit to avoid rate limiting
      })
      
      let successCount = 0
      
      for (const article of unpostedArticles) {
        const success = await this.postArticleToLinkedIn(article.id)
        if (success) {
          successCount++
          // Add delay between posts to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 2000))
        }
      }
      
      console.log(`Posted ${successCount} articles to LinkedIn`)
      return successCount
    } catch (error) {
      console.error('Failed to post unposted articles:', error)
      return 0
    }
  }
}