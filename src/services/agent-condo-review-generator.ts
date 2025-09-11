/**
 * Enhanced Condo Review Generator with Automated Domain Whitelisting
 * Automatically ensures all developer website domains are whitelisted when generating condo reviews
 */

import { AgentPropertyArticleWriter } from './agent-property-article-writer'
import { AgentPropertyScorer } from './agent-property-scorer'
import { AgentPropertyImageFinder } from './agent-property-image-finder'
import { developerDomainManager } from './developer-domain-manager'
import { ArticleCategory } from '@prisma/client'

interface CondoReviewData {
  projectName: string
  developerName: string
  location: string
  district: number
  images: string[]
  developerWebsite?: string
  marketingImages?: string[]
}

interface CondoReviewResult {
  article: {
    title: string
    content: string
    excerpt: string
    category: ArticleCategory
    tags: string[]
    featuredImage: string
    images: string[]
  }
  propertyScore: any
  domainManagement: {
    domainsExtracted: string[]
    domainsAdded: string[]
    domainsSkipped: string[]
  }
  success: boolean
  error?: string
}

export class AgentCondoReviewGenerator {
  private articleWriter: AgentPropertyArticleWriter
  private propertyScorer: AgentPropertyScorer
  private imageFinder: AgentPropertyImageFinder

  constructor() {
    this.articleWriter = new AgentPropertyArticleWriter()
    this.propertyScorer = new AgentPropertyScorer()
    this.imageFinder = new AgentPropertyImageFinder()
  }

  /**
   * Generate a comprehensive condo review with automatic domain whitelisting
   */
  async generateCondoReview(condoData: CondoReviewData): Promise<CondoReviewResult> {
    try {
      console.log(`🏢 Generating condo review for: ${condoData.projectName}`)

      // Step 1: Extract and whitelist domains from condo images
      const domainManagement = await this.manageDeveloperDomains(condoData)

      // Step 2: Get property scoring
      console.log('📊 Generating property score...')
      const propertyScore = await this.propertyScorer.scoreProperty(
        condoData.projectName,
        `${condoData.projectName} condominium review Singapore`,
        ArticleCategory.NEW_LAUNCH_REVIEW
      )

      // Step 3: Find optimal featured image
      console.log('🖼️ Finding featured image...')
      const featuredImageResult = await this.imageFinder.findPropertyImage(
        `${condoData.projectName} Review 2025`,
        `Comprehensive review of ${condoData.projectName} condominium`,
        'NEW_LAUNCH_REVIEW',
        {
          propertyName: condoData.projectName,
          district: condoData.district.toString()
        }
      )

      // Step 4: Generate article content
      console.log('✍️ Generating article content...')
      const article = await this.articleWriter.generateArticle(
        `${condoData.projectName} Review 2025`,
        `Comprehensive review analysis of ${condoData.projectName} condominium development`,
        ArticleCategory.NEW_LAUNCH_REVIEW,
        {
          propertyName: condoData.projectName,
          location: condoData.location,
          district: condoData.district,
          developer: condoData.developerName,
          propertyScore: propertyScore
        }
      )

      if (!article.success) {
        throw new Error(`Article generation failed: ${article.error}`)
      }

      return {
        article: {
          title: article.title,
          content: article.content,
          excerpt: article.excerpt || this.generateExcerpt(article.content),
          category: ArticleCategory.NEW_LAUNCH_REVIEW,
          tags: this.generateTags(condoData),
          featuredImage: featuredImageResult.imageUrl,
          images: this.combineImages(condoData.images, featuredImageResult.imageUrl)
        },
        propertyScore,
        domainManagement,
        success: true
      }

    } catch (error) {
      console.error('Condo review generation failed:', error)
      
      return {
        article: {
          title: '',
          content: '',
          excerpt: '',
          category: ArticleCategory.NEW_LAUNCH_REVIEW,
          tags: [],
          featuredImage: '',
          images: []
        },
        propertyScore: null,
        domainManagement: {
          domainsExtracted: [],
          domainsAdded: [],
          domainsSkipped: []
        },
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Manage developer domains - extract and whitelist automatically
   */
  private async manageDeveloperDomains(condoData: CondoReviewData): Promise<{
    domainsExtracted: string[]
    domainsAdded: string[]
    domainsSkipped: string[]
  }> {
    try {
      console.log('🔍 Managing developer domains...')

      // Extract domains from condo image URLs
      const domains = this.extractDomainsFromImages(condoData.images)
      
      // Add developer website domain if provided
      if (condoData.developerWebsite) {
        try {
          const developerDomain = new URL(condoData.developerWebsite).hostname
          domains.push(developerDomain)
        } catch (error) {
          console.warn('Invalid developer website URL:', condoData.developerWebsite)
        }
      }

      // Remove duplicates
      const uniqueDomains = [...new Set(domains)]

      // Update Next.js config with new domains
      const updateResult = await developerDomainManager.updateNextConfig(uniqueDomains)

      console.log(`✅ Domain management complete:`)
      console.log(`  Extracted: ${uniqueDomains.length} domains`)
      console.log(`  Added: ${updateResult.added.length} new domains`)
      console.log(`  Skipped: ${updateResult.skipped.length} existing domains`)

      return {
        domainsExtracted: uniqueDomains,
        domainsAdded: updateResult.added,
        domainsSkipped: updateResult.skipped
      }

    } catch (error) {
      console.error('Domain management failed:', error)
      return {
        domainsExtracted: [],
        domainsAdded: [],
        domainsSkipped: []
      }
    }
  }

  /**
   * Extract domains from image URLs
   */
  private extractDomainsFromImages(imageUrls: string[]): string[] {
    const domains: string[] = []

    for (const imageUrl of imageUrls) {
      try {
        const url = new URL(imageUrl)
        const domain = url.hostname

        // Skip common CDNs and focus on developer domains
        if (!this.isCommonCDN(domain)) {
          domains.push(domain)
        }
      } catch (error) {
        console.warn(`Invalid image URL: ${imageUrl}`)
      }
    }

    return domains
  }

  /**
   * Check if domain is a common CDN
   */
  private isCommonCDN(domain: string): boolean {
    const commonCDNs = [
      'images.unsplash.com',
      'unsplash.com',
      'images.propertyguru.com.sg',
      'images.99.co',
      'cdn.jsdelivr.net',
      'cdnjs.cloudflare.com'
    ]
    return commonCDNs.some(cdn => domain.includes(cdn))
  }

  /**
   * Generate article excerpt from content
   */
  private generateExcerpt(content: string): string {
    // Remove markdown and get first 2 sentences
    const plainText = content
      .replace(/#{1,6}\s+/g, '') // Remove headers
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
      .replace(/\*(.*?)\*/g, '$1') // Remove italic
      .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links
      .replace(/\n+/g, ' ') // Replace newlines with spaces
      .trim()

    const sentences = plainText.split('. ')
    return sentences.slice(0, 2).join('. ') + (sentences.length > 2 ? '.' : '')
  }

  /**
   * Generate relevant tags for the condo review
   */
  private generateTags(condoData: CondoReviewData): string[] {
    const tags = [
      condoData.projectName.toLowerCase().replace(/\s+/g, '-'),
      'condo-review',
      'singapore-property',
      `district-${condoData.district}`,
      condoData.location.toLowerCase().replace(/\s+/g, '-'),
      condoData.developerName.toLowerCase().replace(/\s+/g, '-'),
      'property-investment',
      'new-launch'
    ]

    return tags.filter(tag => tag.length > 0)
  }

  /**
   * Combine developer images with featured image
   */
  private combineImages(developerImages: string[], featuredImage: string): string[] {
    const allImages = [featuredImage, ...developerImages]
    return [...new Set(allImages)].filter(img => img && img.length > 0)
  }

  /**
   * Bulk generate multiple condo reviews
   */
  async generateMultipleReviews(condoDataList: CondoReviewData[]): Promise<CondoReviewResult[]> {
    const results: CondoReviewResult[] = []

    for (const condoData of condoDataList) {
      console.log(`\n🏢 Processing ${condoData.projectName}...`)
      const result = await this.generateCondoReview(condoData)
      results.push(result)

      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000))
    }

    // Final domain validation
    console.log('\n🔍 Running final domain validation...')
    const validation = await developerDomainManager.validateDomainWhitelist()
    console.log(validation.report)

    return results
  }

  /**
   * Get current domain whitelist status
   */
  async getDomainStatus(): Promise<{
    whitelisted: string[]
    missing: string[]
    report: string
  }> {
    return await developerDomainManager.validateDomainWhitelist()
  }
}

// Export singleton instance
export const condoReviewGenerator = new AgentCondoReviewGenerator()