/**
 * Developer Domain Manager - Automatically manages Next.js image domain whitelisting for developer websites
 * This service extracts domains from condo data and ensures they're whitelisted in Next.js config
 */

import fs from 'fs'
import path from 'path'

interface CondoImageData {
  slug: string
  name: string
  images: string[]
  developerWebsite?: string
}

interface DomainExtractionResult {
  domains: string[]
  sources: {
    domain: string
    properties: string[]
    imageCount: number
  }[]
}

export class DeveloperDomainManager {
  private nextConfigPath: string
  private existingDomains: Set<string>

  constructor() {
    this.nextConfigPath = path.join(process.cwd(), 'next.config.js')
    this.existingDomains = new Set()
    this.loadExistingDomains()
  }

  /**
   * Extract all domains from condo image URLs across the application
   */
  async extractDomainsFromCondoData(): Promise<DomainExtractionResult> {
    const allDomains = new Set<string>()
    const sources: { domain: string; properties: string[]; imageCount: number }[] = []

    // Extract from current condo pages data
    const condoData = await this.getCondoDataFromFiles()
    
    for (const condo of condoData) {
      const condoDomains = new Set<string>()
      
      for (const imageUrl of condo.images) {
        try {
          const url = new URL(imageUrl)
          const domain = url.hostname
          
          // Skip common image CDNs and focus on developer websites
          if (!this.isCommonImageCDN(domain)) {
            allDomains.add(domain)
            condoDomains.add(domain)
          }
        } catch (error) {
          console.warn(`Invalid URL in ${condo.name}: ${imageUrl}`)
        }
      }

      // Track which properties use which domains
      for (const domain of Array.from(condoDomains)) {
        let existing = sources.find(s => s.domain === domain)
        if (!existing) {
          existing = { domain, properties: [], imageCount: 0 }
          sources.push(existing)
        }
        existing.properties.push(condo.name)
        existing.imageCount += condo.images.filter(img => {
          try {
            return new URL(img).hostname === domain
          } catch {
            return false
          }
        }).length
      }
    }

    return {
      domains: Array.from(allDomains),
      sources
    }
  }

  /**
   * Get condo data from all application files
   */
  private async getCondoDataFromFiles(): Promise<CondoImageData[]> {
    const condoData: CondoImageData[] = []

    // Extract from main condo pages
    const files = [
      path.join(process.cwd(), 'src/app/condos/page.tsx'),
      path.join(process.cwd(), 'src/app/new-launches/page.tsx'),
      path.join(process.cwd(), 'src/app/condos/[slug]/review-2025/page.tsx')
    ]

    for (const filePath of files) {
      try {
        if (fs.existsSync(filePath)) {
          const fileContent = fs.readFileSync(filePath, 'utf-8')
          const extractedCondos = this.extractCondoDataFromFile(fileContent, filePath)
          condoData.push(...extractedCondos)
        }
      } catch (error) {
        console.warn(`Error reading ${filePath}:`, error)
      }
    }

    // Deduplicate based on slug
    const uniqueCondos = new Map<string, CondoImageData>()
    for (const condo of condoData) {
      if (!uniqueCondos.has(condo.slug) || uniqueCondos.get(condo.slug)!.images.length < condo.images.length) {
        uniqueCondos.set(condo.slug, condo)
      }
    }

    return Array.from(uniqueCondos.values())
  }

  /**
   * Extract condo data from a specific file content
   */
  private extractCondoDataFromFile(content: string, filePath: string): CondoImageData[] {
    const condos: CondoImageData[] = []

    // Extract image URLs using regex patterns
    const patterns = [
      // Pattern for: image: 'https://...'
      /image:\s*['"`]([^'"`]+)['"`]/g,
      // Pattern for: images: [...] arrays
      /images:\s*\[\s*((?:['"`][^'"`]+['"`]\s*,?\s*)+)\]/g,
      // Pattern for individual image URLs in arrays
      /['"`](https?:\/\/[^'"`]+)['"`]/g
    ]

    let imageUrls: string[] = []

    // Extract all image URLs
    for (const pattern of patterns) {
      let match
      while ((match = pattern.exec(content)) !== null) {
        if (match[1]) {
          // Handle arrays
          if (match[1].includes('http')) {
            const arrayMatches = match[1].match(/['"`](https?:\/\/[^'"`]+)['"`]/g)
            if (arrayMatches) {
              imageUrls.push(...arrayMatches.map(url => url.replace(/['"`]/g, '')))
            }
          } else {
            imageUrls.push(match[1])
          }
        }
      }
    }

    // Extract condo names and slugs
    const namePattern = /(?:name|id):\s*['"`]([^'"`]+)['"`]/g
    const slugPattern = /(?:slug|id):\s*['"`]([^'"`]+)['"`]/g

    let names: string[] = []
    let slugs: string[] = []

    let nameMatch
    while ((nameMatch = namePattern.exec(content)) !== null) {
      names.push(nameMatch[1])
    }

    let slugMatch  
    while ((slugMatch = slugPattern.exec(content)) !== null) {
      slugs.push(slugMatch[1])
    }

    // Create condo objects
    const uniqueImageUrls = Array.from(new Set(imageUrls))
    if (uniqueImageUrls.length > 0) {
      // Group by likely condo projects
      const knownCondos = [
        'the-continuum', 'grand-dunman', 'lentor-mansion', 
        'orchard-sophia', 'avenue-south-residence', 'normanton-park'
      ]

      for (const slug of knownCondos) {
        const relevantImages = uniqueImageUrls.filter(url => 
          this.isImageRelevantToProperty(url, slug)
        )

        if (relevantImages.length > 0) {
          condos.push({
            slug,
            name: this.slugToName(slug),
            images: relevantImages
          })
        }
      }

      // If no specific matches, create a general entry
      if (condos.length === 0 && uniqueImageUrls.length > 0) {
        condos.push({
          slug: 'general-' + Date.now(),
          name: 'General Property Images',
          images: uniqueImageUrls
        })
      }
    }

    return condos
  }

  /**
   * Check if an image URL is relevant to a specific property
   */
  private isImageRelevantToProperty(imageUrl: string, slug: string): boolean {
    const url = imageUrl.toLowerCase()
    const slugParts = slug.replace(/-/g, ' ').toLowerCase()

    // Check for developer domains that match the property
    const domainMappings = {
      'the-continuum': ['continuum-condo.sg', 'continuum'],
      'grand-dunman': ['singhaiyi.com', 'dunman'],
      'lentor-mansion': ['the-lentormansion.com.sg', 'lentor'],
      'orchard-sophia': ['orchard-sophia.com.sg', 'sophia'],
      'avenue-south-residence': ['uolhomes.com.sg', 'avenue-south'],
      'normanton-park': ['kingsford.com.sg', 'normanton']
    }

    const mappings = domainMappings[slug as keyof typeof domainMappings] || []
    return mappings.some(mapping => url.includes(mapping))
  }

  /**
   * Convert slug to human-readable name
   */
  private slugToName(slug: string): string {
    return slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  /**
   * Check if domain is a common image CDN that doesn't need whitelisting
   */
  private isCommonImageCDN(domain: string): boolean {
    const commonCDNs = [
      'images.unsplash.com',
      'unsplash.com',
      'images.propertyguru.com.sg',
      'images.99.co',
      'singaporepropertyhub.sg',
      'vercel.app'
    ]
    return commonCDNs.some(cdn => domain.includes(cdn))
  }

  /**
   * Load existing domains from next.config.js
   */
  private loadExistingDomains(): void {
    try {
      if (fs.existsSync(this.nextConfigPath)) {
        const configContent = fs.readFileSync(this.nextConfigPath, 'utf-8')
        const domainsMatch = configContent.match(/domains:\s*\[([\s\S]*?)\]/)
        
        if (domainsMatch) {
          const domainsString = domainsMatch[1]
          const domains = domainsString.match(/'([^']+)'/g)
          
          if (domains) {
            domains.forEach(domain => {
              this.existingDomains.add(domain.replace(/'/g, ''))
            })
          }
        }
      }
    } catch (error) {
      console.warn('Error loading existing domains:', error)
    }
  }

  /**
   * Update next.config.js with new domains
   */
  async updateNextConfig(newDomains: string[]): Promise<{ added: string[]; skipped: string[] }> {
    const added: string[] = []
    const skipped: string[] = []

    // Filter out domains that already exist
    for (const domain of newDomains) {
      if (this.existingDomains.has(domain)) {
        skipped.push(domain)
      } else {
        added.push(domain)
        this.existingDomains.add(domain)
      }
    }

    if (added.length === 0) {
      console.log('No new domains to add to Next.js config')
      return { added, skipped }
    }

    try {
      const configContent = fs.readFileSync(this.nextConfigPath, 'utf-8')
      
      // Find the domains array and update it
      const domainsMatch = configContent.match(/domains:\s*\[([\s\S]*?)\]/)
      
      if (domainsMatch) {
        const existingDomainsString = domainsMatch[1]
        const allDomains = Array.from(this.existingDomains)
        
        // Create new domains array string
        const newDomainsString = allDomains
          .map(domain => `'${domain}'`)
          .join(', ')
        
        // Replace the domains array
        const updatedConfig = configContent.replace(
          /domains:\s*\[([\s\S]*?)\]/,
          `domains: [${newDomainsString}]`
        )
        
        // Write back to file
        fs.writeFileSync(this.nextConfigPath, updatedConfig, 'utf-8')
        
        console.log(`✅ Added ${added.length} new domains to Next.js config:`, added)
        
      } else {
        console.warn('Could not find domains array in next.config.js')
      }
      
    } catch (error) {
      console.error('Error updating next.config.js:', error)
      throw error
    }

    return { added, skipped }
  }

  /**
   * Full automated process - extract domains and update config
   */
  async autoUpdateDomains(): Promise<{
    extraction: DomainExtractionResult
    update: { added: string[]; skipped: string[] }
  }> {
    console.log('🔍 Extracting domains from condo data...')
    const extraction = await this.extractDomainsFromCondoData()
    
    console.log(`Found ${extraction.domains.length} unique developer domains:`)
    extraction.sources.forEach(source => {
      console.log(`  ${source.domain}: ${source.properties.join(', ')} (${source.imageCount} images)`)
    })
    
    console.log('📝 Updating Next.js configuration...')
    const update = await this.updateNextConfig(extraction.domains)
    
    return { extraction, update }
  }

  /**
   * Validate that all domains in condo data are whitelisted
   */
  async validateDomainWhitelist(): Promise<{
    whitelisted: string[]
    missing: string[]
    report: string
  }> {
    const extraction = await this.extractDomainsFromCondoData()
    const whitelisted: string[] = []
    const missing: string[] = []

    for (const domain of extraction.domains) {
      if (this.existingDomains.has(domain)) {
        whitelisted.push(domain)
      } else {
        missing.push(domain)
      }
    }

    const report = `
Domain Whitelist Validation Report
=================================
✅ Whitelisted: ${whitelisted.length} domains
❌ Missing: ${missing.length} domains

Whitelisted domains:
${whitelisted.map(d => `  ✅ ${d}`).join('\n')}

Missing domains:
${missing.map(d => `  ❌ ${d}`).join('\n')}

${missing.length > 0 ? '\n⚠️ Run autoUpdateDomains() to fix missing domains' : '\n🎉 All domains are properly whitelisted!'}
`

    return { whitelisted, missing, report }
  }
}

// Export singleton instance
export const developerDomainManager = new DeveloperDomainManager()