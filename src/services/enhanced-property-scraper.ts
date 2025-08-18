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
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:121.0) Gecko/20100101 Firefox/121.0'
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
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
          'Accept-Language': 'en-US,en;q=0.9',
          'Accept-Encoding': 'gzip, deflate, br',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Sec-Ch-Ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
          'Sec-Ch-Ua-Mobile': '?0',
          'Sec-Ch-Ua-Platform': '"Windows"',
          'Sec-Fetch-Dest': 'document',
          'Sec-Fetch-Mode': 'navigate',
          'Sec-Fetch-Site': 'none',
          'Sec-Fetch-User': '?1',
          'Upgrade-Insecure-Requests': '1'
        },
        timeout: 15000,
        maxRedirects: 5
      })

      const $ = cheerio.load(response.data)
      
      // Multiple selector patterns to handle different PropertyGuru layouts
      const selectors = [
        '.listing-card',
        '.property-card',
        '.search-result-card',
        '[data-testid="listing-card"]',
        '.listing-item',
        '.card',
        'article',
        '.result-item'
      ]
      
      let foundElements = false
      for (const selector of selectors) {
        const elements = $(selector)
        if (elements.length > 0) {
          console.log(`Found ${elements.length} elements with selector: ${selector}`)
          foundElements = true
          
          elements.each((index, element) => {
            if (listings.length >= maxResults) return false
            
            const $item = $(element)
            
            try {
              // Extract listing details with comprehensive selector fallbacks
              const title = this.extractText($item, [
                '.listing-title', '.property-title', '.card-title', 'h3', 'h2', 
                '[data-automation-id="listing-title"]', '.title', '.name',
                'a[title]'
              ]) || $item.find('a[title]').attr('title')?.trim() || ''
              
              const priceText = this.extractText($item, [
                '.listing-price', '.price', '.card-price', '.property-price',
                '[data-automation-id="listing-price"]', '.list-price', '.amount'
              ])
              
              const address = this.extractText($item, [
                '.listing-location', '.address', '.location', '.card-address',
                '[data-automation-id="listing-address"]', '.listing-address', '.property-address'
              ])
              
              const link = this.extractHref($item, [
                'a[href*="/listing/"]', 'a[href*="/property/"]', '.listing-title a', 
                '.property-title a', '.card-title a', 'a'
              ])
              
              if (title && priceText && link) {
                const listing: PropertyListing = {
                  id: this.extractIdFromUrl(link, 'PropertyGuru'),
                  title: this.cleanText(title),
                  price: priceText,
                  priceValue: this.extractPrice(priceText),
                  address: this.cleanText(address),
                  district: this.extractDistrict(address),
                  bedrooms: this.extractText($item, ['.bed', '.beds', '.bedrooms', '[data-automation-id="beds"]']),
                  bathrooms: this.extractText($item, ['.bath', '.baths', '.bathrooms', '[data-automation-id="baths"]']),
                  area: this.extractText($item, ['.area', '.floor-area', '.size', '[data-automation-id="area"]']),
                  sqft: this.extractArea($item.find('.listing-floorarea, .floor-area, .area, .size').text()),
                  propertyType: this.detectPropertyType($item.text()),
                  tenure: this.extractText($item, ['.tenure', '.lease', '.freehold', '.leasehold']),
                  url: link.startsWith('http') ? link : `https://www.propertyguru.com.sg${link}`,
                  image: $item.find('img').first().attr('src') || $item.find('img').first().attr('data-src'),
                  source: 'PropertyGuru',
                  psf: this.extractText($item, ['.psf', '.price-psf', '.per-sqft'])
                }
                
                listings.push(listing)
                console.log(`Found listing: ${title} - ${priceText}`)
              }
            } catch (err) {
              console.error('Error parsing PropertyGuru listing:', err)
            }
          })
          
          break // Stop after finding elements with the first working selector
        }
      }
      
      if (!foundElements) {
        console.log('No listing elements found with any selector')
        // Log the page content for debugging
        console.log('Page title:', $('title').text())
        console.log('Page content length:', response.data.length)
        console.log('Found divs:', $('div').length)
      }

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

  // Helper methods for robust text extraction
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
}