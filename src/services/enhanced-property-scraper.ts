import axios from 'axios'
import * as cheerio from 'cheerio'

interface PropertyListing {
  id: string
  title: string
  price: string
  priceValue?: number
  address: string
  district?: string
  bedrooms?: string
  bathrooms?: string
  area?: string
  sqft?: number
  propertyType: string
  tenure?: string
  url: string
  image?: string
  description?: string
  agentName?: string
  agentContact?: string
  source: 'PropertyGuru' | '99.co'
  listingDate?: string
  availableFrom?: string
  psf?: string
}

interface ScraperOptions {
  propertyType?: 'condo' | 'landed' | 'hdb' | 'commercial'
  listingType?: 'sale' | 'rent'
  minPrice?: number
  maxPrice?: number
  bedrooms?: number
  district?: string
  area?: string
  keyword?: string
  maxResults?: number
}

export class EnhancedPropertyScraper {
  private readonly userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:122.0) Gecko/20100101 Firefox/122.0'
  ]

  private getRandomUserAgent(): string {
    return this.userAgents[Math.floor(Math.random() * this.userAgents.length)]
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  async searchProperties(options: ScraperOptions): Promise<PropertyListing[]> {
    const results: PropertyListing[] = []
    
    try {
      // Run scrapers in parallel with error handling
      const [propertyGuruResults, ninetyNineResults] = await Promise.allSettled([
        this.scrapePropertyGuru(options),
        this.scrape99co(options)
      ])

      if (propertyGuruResults.status === 'fulfilled') {
        results.push(...propertyGuruResults.value)
      } else {
        console.error('PropertyGuru scraping failed:', propertyGuruResults.reason)
      }

      if (ninetyNineResults.status === 'fulfilled') {
        results.push(...ninetyNineResults.value)
      } else {
        console.error('99.co scraping failed:', ninetyNineResults.reason)
      }

      // Remove duplicates based on title and price
      const uniqueResults = this.removeDuplicates(results)
      
      // Sort by price
      return uniqueResults.sort((a, b) => {
        const priceA = a.priceValue || 0
        const priceB = b.priceValue || 0
        return priceA - priceB
      })
    } catch (error) {
      console.error('Property search error:', error)
      return results
    }
  }

  private async scrapePropertyGuru(options: ScraperOptions): Promise<PropertyListing[]> {
    const listings: PropertyListing[] = []
    const maxResults = options.maxResults || 20
    
    try {
      const url = this.buildPropertyGuruUrl(options)
      console.log('Scraping PropertyGuru:', url)
      
      const response = await axios.get(url, {
        headers: {
          'User-Agent': this.getRandomUserAgent(),
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1'
        },
        timeout: 10000
      })

      const $ = cheerio.load(response.data)
      
      // Updated selectors based on PropertyGuru's current structure
      $('.listing-card, .listings-container .listing-item, [data-automation-id="listing-card"]').each((index, element) => {
        if (listings.length >= maxResults) return false
        
        const $item = $(element)
        
        try {
          // Extract listing details with multiple selector fallbacks
          const title = $item.find('.listing-title, h3.title, [data-automation-id="listing-title"]').text().trim() ||
                       $item.find('a[title]').attr('title')?.trim() || ''
          
          const priceText = $item.find('.listing-price, .price, [data-automation-id="listing-price"]').text().trim() ||
                           $item.find('.list-price').text().trim()
          
          const address = $item.find('.listing-location, .address, [data-automation-id="listing-address"]').text().trim() ||
                         $item.find('.listing-address').text().trim()
          
          const link = $item.find('a[href*="/listing/"]').attr('href') ||
                      $item.find('.listing-title a').attr('href') ||
                      $item.find('a').first().attr('href')
          
          if (title && priceText && link) {
            const listing: PropertyListing = {
              id: this.extractIdFromUrl(link, 'PropertyGuru'),
              title: this.cleanText(title),
              price: priceText,
              priceValue: this.extractPrice(priceText),
              address: this.cleanText(address),
              district: this.extractDistrict(address),
              bedrooms: $item.find('.listing-rooms .bed, .beds, [data-automation-id="beds-label"]').text().trim(),
              bathrooms: $item.find('.listing-rooms .bath, .baths, [data-automation-id="baths-label"]').text().trim(),
              area: $item.find('.listing-floorarea, .floor-area, [data-automation-id="listing-area"]').text().trim(),
              sqft: this.extractArea($item.find('.listing-floorarea, .floor-area').text()),
              propertyType: this.detectPropertyType($item.text()),
              tenure: $item.find('.listing-tenure, .tenure').text().trim(),
              url: link.startsWith('http') ? link : `https://www.propertyguru.com.sg${link}`,
              image: $item.find('img[src*="property"], img[data-src*="property"]').attr('src') ||
                     $item.find('img').attr('data-src'),
              source: 'PropertyGuru',
              psf: $item.find('.listing-psf, .psf').text().trim()
            }
            
            listings.push(listing)
          }
        } catch (err) {
          console.error('Error parsing PropertyGuru listing:', err)
        }
      })

      console.log(`Found ${listings.length} PropertyGuru listings`)
      return listings
    } catch (error: any) {
      console.error('PropertyGuru scraping error:', error.message)
      return []
    }
  }

  private async scrape99co(options: ScraperOptions): Promise<PropertyListing[]> {
    const listings: PropertyListing[] = []
    const maxResults = options.maxResults || 20
    
    try {
      const url = this.build99coUrl(options)
      console.log('Scraping 99.co:', url)
      
      // Add delay to avoid rate limiting
      await this.delay(1000)
      
      const response = await axios.get(url, {
        headers: {
          'User-Agent': this.getRandomUserAgent(),
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Referer': 'https://www.99.co',
          'Connection': 'keep-alive'
        },
        timeout: 10000
      })

      const $ = cheerio.load(response.data)
      
      // Updated selectors for 99.co
      $('[data-testid="listing-card"], .ListingCard, .property-card').each((index, element) => {
        if (listings.length >= maxResults) return false
        
        const $item = $(element)
        
        try {
          const title = $item.find('[data-testid="listing-card-title"], .ListingCard-title, h3').text().trim()
          const priceText = $item.find('[data-testid="listing-card-price"], .ListingCard-price, .price').text().trim()
          const address = $item.find('[data-testid="listing-card-address"], .ListingCard-address, .address').text().trim()
          const link = $item.find('a[href*="/singapore/sale/"], a[href*="/singapore/rent/"]').attr('href') ||
                      $item.find('a').first().attr('href')
          
          if (title && priceText && link) {
            const listing: PropertyListing = {
              id: this.extractIdFromUrl(link, '99.co'),
              title: this.cleanText(title),
              price: priceText,
              priceValue: this.extractPrice(priceText),
              address: this.cleanText(address),
              district: this.extractDistrict(address),
              bedrooms: $item.find('[data-testid="listing-card-bedrooms"], .bedrooms, .beds').text().trim(),
              bathrooms: $item.find('[data-testid="listing-card-bathrooms"], .bathrooms, .baths').text().trim(),
              area: $item.find('[data-testid="listing-card-area"], .floor-area, .size').text().trim(),
              sqft: this.extractArea($item.find('[data-testid="listing-card-area"], .floor-area').text()),
              propertyType: this.detectPropertyType($item.text()),
              tenure: $item.find('.tenure, .lease').text().trim(),
              url: link.startsWith('http') ? link : `https://www.99.co${link}`,
              image: $item.find('img[src*="property"], img[data-src]').attr('src') ||
                     $item.find('img').attr('data-src'),
              source: '99.co',
              psf: $item.find('.psf, .price-psf').text().trim()
            }
            
            listings.push(listing)
          }
        } catch (err) {
          console.error('Error parsing 99.co listing:', err)
        }
      })

      console.log(`Found ${listings.length} 99.co listings`)
      return listings
    } catch (error: any) {
      console.error('99.co scraping error:', error.message)
      return []
    }
  }

  private buildPropertyGuruUrl(options: ScraperOptions): string {
    const baseUrl = 'https://www.propertyguru.com.sg'
    const listingType = options.listingType || 'sale'
    let url = `${baseUrl}/property-for-${listingType}`
    
    const params: string[] = []
    
    // Property type mapping
    if (options.propertyType) {
      const typeMap: Record<string, string> = {
        'condo': 'N',
        'landed': 'L',
        'hdb': 'H',
        'commercial': 'B'
      }
      params.push(`property_type=${typeMap[options.propertyType]}`)
    }
    
    // Price range
    if (options.minPrice) params.push(`minprice=${options.minPrice}`)
    if (options.maxPrice) params.push(`maxprice=${options.maxPrice}`)
    
    // Bedrooms
    if (options.bedrooms) params.push(`beds=${options.bedrooms}`)
    
    // District
    if (options.district) params.push(`district_code[]=${options.district}`)
    
    // Location/Area search
    if (options.area) params.push(`freetext=${encodeURIComponent(options.area)}`)
    
    // Market listing (exclude new launches)
    params.push('listing_type=sale')
    
    if (params.length > 0) {
      url += '?' + params.join('&')
    }
    
    return url
  }

  private build99coUrl(options: ScraperOptions): string {
    const baseUrl = 'https://www.99.co/singapore'
    const listingType = options.listingType || 'sale'
    let url = `${baseUrl}/${listingType}`
    
    // Property type specific URLs
    if (options.propertyType) {
      const typeMap: Record<string, string> = {
        'condo': 'condominiums',
        'landed': 'landed-houses',
        'hdb': 'hdb',
        'commercial': 'commercial'
      }
      url += `/${typeMap[options.propertyType]}`
    }
    
    const params: string[] = []
    
    // Price range
    if (options.minPrice) params.push(`price_min=${options.minPrice}`)
    if (options.maxPrice) params.push(`price_max=${options.maxPrice}`)
    
    // Bedrooms
    if (options.bedrooms) params.push(`num_beds=${options.bedrooms}`)
    
    // Location
    if (options.area) params.push(`query_coords=${encodeURIComponent(options.area)}`)
    
    // Sort by date to get newest listings
    params.push('sort_by=date_desc')
    
    if (params.length > 0) {
      url += '?' + params.join('&')
    }
    
    return url
  }

  private extractPrice(priceText: string): number {
    const cleanPrice = priceText.replace(/[^0-9.]/g, '')
    const price = parseFloat(cleanPrice)
    
    // Handle millions
    if (priceText.toLowerCase().includes('m')) {
      return price * 1000000
    }
    
    // Handle thousands
    if (priceText.toLowerCase().includes('k')) {
      return price * 1000
    }
    
    return price || 0
  }

  private extractArea(areaText: string): number {
    const sqftMatch = areaText.match(/(\d+(?:,\d+)?)\s*(?:sq\s*ft|sqft)/i)
    if (sqftMatch) {
      return parseInt(sqftMatch[1].replace(/,/g, ''))
    }
    
    const sqmMatch = areaText.match(/(\d+(?:,\d+)?)\s*(?:sq\s*m|sqm)/i)
    if (sqmMatch) {
      // Convert sqm to sqft (1 sqm = 10.764 sqft)
      return Math.round(parseInt(sqmMatch[1].replace(/,/g, '')) * 10.764)
    }
    
    return 0
  }

  private extractDistrict(address: string): string {
    const districtMatch = address.match(/\(D(\d{1,2})\)|\bD(\d{1,2})\b|District\s+(\d{1,2})/i)
    if (districtMatch) {
      return districtMatch[1] || districtMatch[2] || districtMatch[3]
    }
    return ''
  }

  private detectPropertyType(text: string): string {
    const lowerText = text.toLowerCase()
    
    if (lowerText.includes('condo') || lowerText.includes('apartment')) return 'Condominium'
    if (lowerText.includes('landed') || lowerText.includes('terrace') || 
        lowerText.includes('semi-d') || lowerText.includes('bungalow')) return 'Landed'
    if (lowerText.includes('hdb') || lowerText.includes('flat')) return 'HDB'
    if (lowerText.includes('shophouse') || lowerText.includes('commercial') ||
        lowerText.includes('office') || lowerText.includes('retail')) return 'Commercial'
    
    return 'Residential'
  }

  private cleanText(text: string): string {
    return text
      .replace(/\s+/g, ' ')
      .replace(/\n/g, ' ')
      .trim()
  }

  private extractIdFromUrl(url: string, source: string): string {
    if (source === 'PropertyGuru') {
      const match = url.match(/listing\/(\d+)/)
      return match ? `pg-${match[1]}` : `pg-${Date.now()}`
    } else {
      const match = url.match(/(\d+)-/)
      return match ? `99co-${match[1]}` : `99co-${Date.now()}`
    }
  }

  private removeDuplicates(listings: PropertyListing[]): PropertyListing[] {
    const seen = new Set<string>()
    return listings.filter(listing => {
      const key = `${listing.title}-${listing.price}-${listing.address}`.toLowerCase()
      if (seen.has(key)) {
        return false
      }
      seen.add(key)
      return true
    })
  }
}