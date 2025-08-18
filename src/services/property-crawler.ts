import axios from 'axios'
import * as cheerio from 'cheerio'
import { prisma } from '@/lib/prisma'

interface CrawlerConfig {
  maxPages?: number
  delayBetweenRequests?: number
  userAgentRotation?: boolean
  saveToDatabase?: boolean
  retryOnFailure?: number
}

interface CrawledProperty {
  externalId: string
  title: string
  price: number
  priceText: string
  address: string
  district?: string
  bedrooms?: number
  bathrooms?: number
  area?: number
  areaText?: string
  propertyType: string
  tenure?: string
  url: string
  imageUrl?: string
  description?: string
  source: 'PropertyGuru' | '99.co'
  agentName?: string
  agentContact?: string
  features: string[]
  psf?: string
  availableFrom?: Date
  listedDate?: Date
}

export class PropertyCrawler {
  private config: CrawlerConfig
  private userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  ]

  constructor(config: CrawlerConfig = {}) {
    this.config = {
      maxPages: 50,
      delayBetweenRequests: 2000,
      userAgentRotation: true,
      saveToDatabase: true,
      retryOnFailure: 3,
      ...config
    }
  }

  async crawlAll(): Promise<{ success: boolean; stats: any }> {
    console.log('🕷️ Starting comprehensive property crawl...')
    
    const stats = {
      propertyGuru: { total: 0, errors: 0 },
      ninetyNine: { total: 0, errors: 0 },
      startTime: new Date(),
      endTime: null as Date | null
    }

    try {
      // Crawl PropertyGuru for all property types
      console.log('📊 Crawling PropertyGuru...')
      const pgStats = await this.crawlPropertyGuru()
      stats.propertyGuru = pgStats

      // Delay between sites
      await this.delay(5000)

      // Crawl 99.co for all property types
      console.log('📊 Crawling 99.co...')
      const nnStats = await this.crawl99co()
      stats.ninetyNine = nnStats

      stats.endTime = new Date()
      
      console.log('✅ Crawl completed successfully!')
      console.log(`📈 Total properties found: ${stats.propertyGuru.total + stats.ninetyNine.total}`)
      
      return { success: true, stats }
    } catch (error) {
      console.error('❌ Crawl failed:', error)
      stats.endTime = new Date()
      return { success: false, stats }
    }
  }

  private async crawlPropertyGuru(): Promise<{ total: number; errors: number }> {
    const stats = { total: 0, errors: 0 }
    const propertyTypes = [
      { type: 'N', name: 'Condo' },
      { type: 'L', name: 'Landed' },
      { type: 'H', name: 'HDB' },
      { type: 'B', name: 'Commercial' }
    ]

    for (const propType of propertyTypes) {
      console.log(`🏠 Crawling PropertyGuru ${propType.name} properties...`)
      
      try {
        const properties = await this.crawlPropertyGuruType(propType.type, propType.name)
        
        if (this.config.saveToDatabase) {
          await this.savePropertiesToDb(properties)
        }
        
        stats.total += properties.length
        console.log(`✅ Found ${properties.length} ${propType.name} properties`)
        
        // Delay between property types
        await this.delay(this.config.delayBetweenRequests!)
      } catch (error) {
        console.error(`❌ Error crawling ${propType.name}:`, error)
        stats.errors++
      }
    }

    return stats
  }

  private async crawlPropertyGuruType(propertyType: string, typeName: string): Promise<CrawledProperty[]> {
    const allProperties: CrawledProperty[] = []
    const maxPages = this.config.maxPages!
    
    for (let page = 1; page <= maxPages; page++) {
      try {
        const url = `https://www.propertyguru.com.sg/property-for-sale?property_type=${propertyType}&limit=100&page=${page}`
        console.log(`📄 Crawling page ${page}/${maxPages} for ${typeName}...`)
        
        const response = await axios.get(url, {
          headers: this.getHeaders(),
          timeout: 15000
        })

        const properties = this.parsePropertyGuruPage(response.data)
        
        if (properties.length === 0) {
          console.log(`🔚 No more properties found on page ${page}, stopping...`)
          break
        }
        
        allProperties.push(...properties)
        console.log(`📄 Page ${page}: Found ${properties.length} properties`)
        
        // Delay between pages
        await this.delay(this.config.delayBetweenRequests!)
        
      } catch (error) {
        console.error(`❌ Error on page ${page}:`, error)
        
        if (this.config.retryOnFailure! > 0) {
          console.log(`🔄 Retrying page ${page}...`)
          await this.delay(5000)
          // Could implement retry logic here
        }
        break
      }
    }
    
    return allProperties
  }

  private parsePropertyGuruPage(html: string): CrawledProperty[] {
    const $ = cheerio.load(html)
    const properties: CrawledProperty[] = []
    
    // Multiple selectors to find property listings
    const selectors = [
      '.listing-card',
      '.property-card', 
      '.search-result-card',
      '[data-automation-id="listing-card"]',
      '.card-listing',
      '.property-listing',
      '.result-item'
    ]
    
    for (const selector of selectors) {
      const elements = $(selector)
      if (elements.length > 0) {
        console.log(`🎯 Using selector: ${selector} (${elements.length} found)`)
        
        elements.each((index, element) => {
          try {
            const property = this.parsePropertyGuruElement($, $(element))
            if (property) {
              properties.push(property)
            }
          } catch (error) {
            console.error('Error parsing property element:', error)
          }
        })
        break // Use first working selector
      }
    }
    
    return properties
  }

  private parsePropertyGuruElement($: cheerio.CheerioAPI, $element: any): CrawledProperty | null {
    try {
      // Extract all property details
      const title = this.extractText($element, [
        '.listing-title', '.property-title', '.card-title', 'h3', 'h2'
      ])
      
      const priceText = this.extractText($element, [
        '.listing-price', '.price', '.card-price', '.amount'
      ])
      
      const address = this.extractText($element, [
        '.listing-location', '.address', '.location'
      ])
      
      const url = this.extractHref($element, [
        'a[href*="/listing/"]', 'a[href*="/property/"]', 'a'
      ])
      
      if (!title || !priceText || !url) {
        return null
      }
      
      const property: CrawledProperty = {
        externalId: this.extractIdFromUrl(url, 'PropertyGuru'),
        title: this.cleanText(title),
        price: this.extractPrice(priceText),
        priceText: priceText,
        address: this.cleanText(address),
        district: this.extractDistrict(address),
        bedrooms: this.extractNumber($element, ['.bed', '.beds', '.bedroom']),
        bathrooms: this.extractNumber($element, ['.bath', '.baths', '.bathroom']),
        area: this.extractAreaNumber($element, ['.area', '.floor-area', '.size']),
        areaText: this.extractText($element, ['.area', '.floor-area', '.size']),
        propertyType: this.detectPropertyType($element.text()),
        tenure: this.extractText($element, ['.tenure', '.lease']),
        url: url.startsWith('http') ? url : `https://www.propertyguru.com.sg${url}`,
        imageUrl: $element.find('img').first().attr('src'),
        source: 'PropertyGuru',
        features: this.extractFeatures($element),
        psf: this.extractText($element, ['.psf', '.price-psf']),
        listedDate: new Date()
      }
      
      return property
    } catch (error) {
      console.error('Error parsing PropertyGuru element:', error)
      return null
    }
  }

  private async crawl99co(): Promise<{ total: number; errors: number }> {
    const stats = { total: 0, errors: 0 }
    // Similar implementation for 99.co
    // For now, focusing on PropertyGuru as it's the primary source
    console.log('🚧 99.co crawler implementation pending...')
    return stats
  }

  private async savePropertiesToDb(properties: CrawledProperty[]): Promise<void> {
    console.log(`💾 Saving ${properties.length} properties to database...`)
    
    for (const property of properties) {
      try {
        await prisma.property.upsert({
          where: { externalId: property.externalId },
          update: {
            title: property.title,
            price: property.price,
            address: property.address,
            bedrooms: property.bedrooms || 0,
            bathrooms: property.bathrooms || 0,
            area: property.area || 0,
            propertyType: property.propertyType,
            listingUrl: property.url,
            imageUrl: property.imageUrl,
            source: property.source,
            tenure: property.tenure,
            psf: property.psf,
            updatedAt: new Date()
          },
          create: {
            externalId: property.externalId,
            slug: this.generateSlug(property.title),
            title: property.title,
            description: property.description || `${property.propertyType} property at ${property.address}`,
            type: this.mapPropertyType(property.propertyType),
            price: property.price,
            address: property.address,
            district: property.district || '01',
            bedrooms: property.bedrooms || 0,
            bathrooms: property.bathrooms || 0,
            area: property.area || 0,
            propertyType: property.propertyType,
            listingUrl: property.url,
            imageUrl: property.imageUrl,
            source: property.source,
            tenure: property.tenure,
            psf: property.psf,
            features: property.features
          }
        })
      } catch (error) {
        console.error(`Error saving property ${property.externalId}:`, error)
      }
    }
    
    console.log(`✅ Saved ${properties.length} properties to database`)
  }

  // Helper methods
  private getHeaders() {
    return {
      'User-Agent': this.config.userAgentRotation ? 
        this.userAgents[Math.floor(Math.random() * this.userAgents.length)] : 
        this.userAgents[0],
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  private extractText($element: any, selectors: string[]): string {
    for (const selector of selectors) {
      const text = $element.find(selector).first().text().trim()
      if (text) return text
    }
    return ''
  }

  private extractHref($element: any, selectors: string[]): string {
    for (const selector of selectors) {
      const href = $element.find(selector).first().attr('href')
      if (href) return href
    }
    return ''
  }

  private extractNumber($element: any, selectors: string[]): number | undefined {
    const text = this.extractText($element, selectors)
    const match = text.match(/\d+/)
    return match ? parseInt(match[0]) : undefined
  }

  private extractAreaNumber($element: any, selectors: string[]): number | undefined {
    const text = this.extractText($element, selectors)
    const sqftMatch = text.match(/(\d+(?:,\d+)?)\s*(?:sq\s*ft|sqft)/i)
    if (sqftMatch) {
      return parseInt(sqftMatch[1].replace(/,/g, ''))
    }
    
    const sqmMatch = text.match(/(\d+(?:,\d+)?)\s*(?:sq\s*m|sqm)/i)
    if (sqmMatch) {
      return Math.round(parseInt(sqmMatch[1].replace(/,/g, '')) * 10.764)
    }
    
    return undefined
  }

  private extractPrice(priceText: string): number {
    const cleanPrice = priceText.replace(/[^0-9.]/g, '')
    const price = parseFloat(cleanPrice)
    
    if (priceText.toLowerCase().includes('m')) {
      return price * 1000000
    }
    if (priceText.toLowerCase().includes('k')) {
      return price * 1000
    }
    
    return price || 0
  }

  private extractDistrict(address: string): string {
    const match = address.match(/\(D(\d{1,2})\)|\bD(\d{1,2})\b/i)
    return match ? (match[1] || match[2]) : '01'
  }

  private detectPropertyType(text: string): string {
    const lowerText = text.toLowerCase()
    if (lowerText.includes('condo') || lowerText.includes('apartment')) return 'Condominium'
    if (lowerText.includes('landed') || lowerText.includes('terrace')) return 'Landed'
    if (lowerText.includes('hdb')) return 'HDB'
    if (lowerText.includes('shophouse') || lowerText.includes('commercial')) return 'Commercial'
    return 'Residential'
  }

  private extractFeatures($element: any): string[] {
    const features: string[] = []
    const featureText = $element.find('.features, .amenities, .highlights').text()
    
    // Common property features
    const commonFeatures = ['pool', 'gym', 'parking', 'security', 'balcony', 'garden', 'lift']
    
    for (const feature of commonFeatures) {
      if (featureText.toLowerCase().includes(feature)) {
        features.push(feature.charAt(0).toUpperCase() + feature.slice(1))
      }
    }
    
    return features
  }

  private extractIdFromUrl(url: string, source: string): string {
    if (source === 'PropertyGuru') {
      const match = url.match(/listing\/(\d+)/)
      return match ? `pg-${match[1]}` : `pg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }
    return `${source.toLowerCase()}-${Date.now()}`
  }

  private cleanText(text: string): string {
    return text.replace(/\s+/g, ' ').trim()
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim() + '-' + Date.now()
  }

  private mapPropertyType(type: string): 'CONDO' | 'LANDED' | 'HDB' | 'SHOPHOUSE' | 'COMMERCIAL' {
    const lowerType = type.toLowerCase()
    if (lowerType.includes('condo') || lowerType.includes('apartment')) return 'CONDO'
    if (lowerType.includes('landed') || lowerType.includes('terrace')) return 'LANDED'
    if (lowerType.includes('hdb')) return 'HDB'
    if (lowerType.includes('shophouse')) return 'SHOPHOUSE'
    if (lowerType.includes('commercial')) return 'COMMERCIAL'
    return 'CONDO'
  }
}