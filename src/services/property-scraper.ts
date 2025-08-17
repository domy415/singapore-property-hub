import axios from 'axios'
import * as cheerio from 'cheerio'

interface PropertySearchCriteria {
  propertyType?: 'condo' | 'landed' | 'hdb' | 'commercial'
  minPrice?: number
  maxPrice?: number
  bedrooms?: number
  district?: string
  area?: string
  keyword?: string
}

interface ScrapedProperty {
  title: string
  price: string
  address: string
  bedrooms?: string
  bathrooms?: string
  area?: string
  propertyType: string
  url: string
  image?: string
  source: 'PropertyGuru' | '99.co'
}

export class PropertyScraper {
  private propertyGuruBaseUrl = 'https://www.propertyguru.com.sg'
  private ninetyNineBaseUrl = 'https://www.99.co'
  
  async searchProperties(criteria: PropertySearchCriteria): Promise<ScrapedProperty[]> {
    const [propertyGuruResults, ninetyNineResults] = await Promise.all([
      this.searchPropertyGuru(criteria),
      this.search99co(criteria)
    ])
    
    return [...propertyGuruResults, ...ninetyNineResults]
  }
  
  private async searchPropertyGuru(criteria: PropertySearchCriteria): Promise<ScrapedProperty[]> {
    try {
      const searchUrl = this.buildPropertyGuruUrl(criteria)
      const response = await axios.get(searchUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      })
      
      const $ = cheerio.load(response.data)
      const properties: ScrapedProperty[] = []
      
      $('.listing-card').each((index, element) => {
        const $element = $(element)
        
        const property: ScrapedProperty = {
          title: $element.find('.listing-card-title').text().trim(),
          price: $element.find('.listing-price').text().trim(),
          address: $element.find('.listing-location').text().trim(),
          bedrooms: $element.find('.listing-rooms .bed').text().trim(),
          bathrooms: $element.find('.listing-rooms .bath').text().trim(),
          area: $element.find('.listing-floorarea').text().trim(),
          propertyType: this.detectPropertyType($element),
          url: this.propertyGuruBaseUrl + $element.find('a').attr('href'),
          image: $element.find('img').attr('src'),
          source: 'PropertyGuru'
        }
        
        if (property.title && property.price) {
          properties.push(property)
        }
      })
      
      return properties.slice(0, 20) // Limit to 20 results
    } catch (error) {
      console.error('Error scraping PropertyGuru:', error)
      return []
    }
  }
  
  private async search99co(criteria: PropertySearchCriteria): Promise<ScrapedProperty[]> {
    try {
      const searchUrl = this.build99coUrl(criteria)
      const response = await axios.get(searchUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      })
      
      const $ = cheerio.load(response.data)
      const properties: ScrapedProperty[] = []
      
      $('[data-testid="listing-card"]').each((index, element) => {
        const $element = $(element)
        
        const property: ScrapedProperty = {
          title: $element.find('[data-testid="listing-card-title"]').text().trim(),
          price: $element.find('[data-testid="listing-card-price"]').text().trim(),
          address: $element.find('[data-testid="listing-card-address"]').text().trim(),
          bedrooms: $element.find('[data-testid="listing-card-bedrooms"]').text().trim(),
          bathrooms: $element.find('[data-testid="listing-card-bathrooms"]').text().trim(),
          area: $element.find('[data-testid="listing-card-area"]').text().trim(),
          propertyType: this.detectPropertyType($element),
          url: this.ninetyNineBaseUrl + $element.find('a').attr('href'),
          image: $element.find('img').attr('src'),
          source: '99.co'
        }
        
        if (property.title && property.price) {
          properties.push(property)
        }
      })
      
      return properties.slice(0, 20) // Limit to 20 results
    } catch (error) {
      console.error('Error scraping 99.co:', error)
      return []
    }
  }
  
  private buildPropertyGuruUrl(criteria: PropertySearchCriteria): string {
    let url = `${this.propertyGuruBaseUrl}/property-for-sale`
    const params: string[] = []
    
    if (criteria.propertyType) {
      const typeMap: { [key: string]: string } = {
        'condo': 'N',
        'landed': 'L',
        'hdb': 'H',
        'commercial': 'C'
      }
      params.push(`property_type=${typeMap[criteria.propertyType]}`)
    }
    
    if (criteria.minPrice) params.push(`minprice=${criteria.minPrice}`)
    if (criteria.maxPrice) params.push(`maxprice=${criteria.maxPrice}`)
    if (criteria.bedrooms) params.push(`beds=${criteria.bedrooms}`)
    if (criteria.district) params.push(`district_code=${criteria.district}`)
    if (criteria.keyword) params.push(`q=${encodeURIComponent(criteria.keyword)}`)
    
    if (params.length > 0) {
      url += '?' + params.join('&')
    }
    
    return url
  }
  
  private build99coUrl(criteria: PropertySearchCriteria): string {
    let url = `${this.ninetyNineBaseUrl}/singapore/sale`
    const params: string[] = []
    
    if (criteria.propertyType) {
      const typeMap: { [key: string]: string } = {
        'condo': 'condominiums',
        'landed': 'landed',
        'hdb': 'hdb',
        'commercial': 'commercial'
      }
      url = `${this.ninetyNineBaseUrl}/singapore/sale/${typeMap[criteria.propertyType]}`
    }
    
    if (criteria.minPrice) params.push(`price_min=${criteria.minPrice}`)
    if (criteria.maxPrice) params.push(`price_max=${criteria.maxPrice}`)
    if (criteria.bedrooms) params.push(`num_beds=${criteria.bedrooms}`)
    if (criteria.area) params.push(`query_location=${encodeURIComponent(criteria.area)}`)
    
    if (params.length > 0) {
      url += '?' + params.join('&')
    }
    
    return url
  }
  
  private detectPropertyType($element: cheerio.Cheerio<cheerio.Element>): string {
    const text = $element.text().toLowerCase()
    if (text.includes('condo') || text.includes('apartment')) return 'Condominium'
    if (text.includes('landed') || text.includes('terrace') || text.includes('bungalow')) return 'Landed'
    if (text.includes('hdb')) return 'HDB'
    if (text.includes('shophouse') || text.includes('commercial')) return 'Commercial'
    return 'Property'
  }
}