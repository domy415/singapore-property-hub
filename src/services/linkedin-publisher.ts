import axios from 'axios'
import { PrismaClient, ArticleStatus } from '@prisma/client'

const prisma = new PrismaClient()

interface LinkedInPost {
  author: string
  lifecycleState: string
  specificContent: {
    "com.linkedin.ugc.ShareContent": {
      shareCommentary: {
        text: string
      }
      shareMediaCategory: string
      media?: Array<{
        status: string
        description: {
          text: string
        }
        media: string
        title: {
          text: string
        }
      }>
    }
  }
  visibility: {
    "com.linkedin.ugc.MemberNetworkVisibility": string
  }
}

export class LinkedInPublisher {
  private accessToken: string
  private authorId: string
  
  constructor() {
    this.accessToken = process.env.LINKEDIN_ACCESS_TOKEN || ''
    this.authorId = process.env.LINKEDIN_AUTHOR_ID || ''
  }
  
  async publishArticle(articleId: string): Promise<void> {
    try {
      const article = await prisma.article.findUnique({
        where: { 
          id: articleId,
          status: ArticleStatus.PUBLISHED
        }
      })
      
      if (!article) {
        throw new Error('Published article not found')
      }
      
      const postContent = this.createPostContent(article)
      const linkedInResponse = await this.postToLinkedIn(postContent)
      
      await prisma.article.update({
        where: { id: articleId },
        data: {
          linkedinPostId: linkedInResponse.id,
          linkedinUrl: `https://www.linkedin.com/feed/update/${linkedInResponse.id}`
        }
      })
      
    } catch (error) {
      console.error('Error publishing to LinkedIn:', error)
      throw error
    }
  }
  
  private createPostContent(article: any): LinkedInPost {
    const articleUrl = `https://singaporepropertyhub.sg/article/${article.slug}`
    
    const commentary = `${article.title}

${article.excerpt}

${this.generateHashtags(article.tags)}

Read the full article: ${articleUrl}`
    
    return {
      author: `urn:li:person:${this.authorId}`,
      lifecycleState: "PUBLISHED",
      specificContent: {
        "com.linkedin.ugc.ShareContent": {
          shareCommentary: {
            text: commentary
          },
          shareMediaCategory: "ARTICLE",
          media: [{
            status: "READY",
            description: {
              text: article.excerpt
            },
            media: articleUrl,
            title: {
              text: article.title
            }
          }]
        }
      },
      visibility: {
        "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"
      }
    }
  }
  
  private generateHashtags(tags: string[]): string {
    const hashtagMap: { [key: string]: string } = {
      'property': '#SingaporeProperty',
      'investment': '#PropertyInvestment',
      'condo': '#SingaporeCondo',
      'hdb': '#HDBSingapore',
      'real estate': '#SingaporeRealEstate',
      'market': '#PropertyMarket',
      'buying guide': '#PropertyBuying',
      'commercial': '#CommercialProperty'
    }
    
    const hashtags = tags
      .map(tag => hashtagMap[tag.toLowerCase()] || `#${tag.replace(/\s+/g, '')}`)
      .slice(0, 5)
    
    return hashtags.join(' ')
  }
  
  private async postToLinkedIn(content: LinkedInPost): Promise<any> {
    try {
      const response = await axios.post(
        'https://api.linkedin.com/v2/ugcPosts',
        content,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
            'X-Restli-Protocol-Version': '2.0.0'
          }
        }
      )
      
      return response.data
    } catch (error) {
      console.error('LinkedIn API error:', error)
      throw error
    }
  }
  
  async publishAllPendingArticles() {
    const publishedArticles = await prisma.article.findMany({
      where: {
        status: ArticleStatus.PUBLISHED,
        linkedinPostId: null
      }
    })
    
    for (const article of publishedArticles) {
      try {
        await this.publishArticle(article.id)
        await new Promise(resolve => setTimeout(resolve, 5000)) // Rate limiting
      } catch (error) {
        console.error(`Failed to publish article ${article.id} to LinkedIn:`, error)
      }
    }
  }
}