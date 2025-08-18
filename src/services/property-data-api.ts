import axios from 'axios'

interface PropertyTransaction {
  project: string
  area: string
  floorRange?: string
  noOfUnits?: number
  contractDate: string
  typeOfSale: string
  price: number
  propertyType?: string
  district?: string
  typeOfArea?: string
  tenure?: string
}

interface HDBTransaction {
  town: string
  flatType: string
  flatModel: string
  floorAreaSqm: number
  streetName: string
  resalePrice: number
  month: string
  remainingLease: string
  leaseCommenceDate: string
  storey: string
  block: string
}

interface PropertyApiConfig {
  uraApiKey?: string
  uraAccessKey?: string
  oneMapEmail?: string
  oneMapPassword?: string
}

export class PropertyDataAPI {
  private uraBaseUrl = 'https://www.ura.gov.sg/uraDataService'
  private oneMapBaseUrl = 'https://developers.onemap.sg'
  private config: PropertyApiConfig
  private oneMapToken?: string
  private oneMapTokenExpiry?: Date

  constructor(config: PropertyApiConfig) {
    this.config = config
  }

  // URA API Methods
  async getURAToken(): Promise<string> {
    if (!this.config.uraAccessKey) {
      throw new Error('URA Access Key is required')
    }

    try {
      const response = await axios.get(`${this.uraBaseUrl}/insertNewToken.action`, {
        headers: {
          'AccessKey': this.config.uraAccessKey,
          'User-Agent': 'Singapore Property Hub'
        }
      })
      
      return response.data.Result
    } catch (error) {
      console.error('Error getting URA token:', error)
      throw error
    }
  }

  async getPrivateResidentialTransactions(params?: {
    project?: string
    street?: string
    district?: string
  }): Promise<PropertyTransaction[]> {
    try {
      const token = await this.getURAToken()
      
      const response = await axios.get(
        `${this.uraBaseUrl}/invokeUraDS`, 
        {
          params: {
            service: 'PMI_Resi_Transaction',
            ...params
          },
          headers: {
            'AccessKey': this.config.uraAccessKey,
            'Token': token
          }
        }
      )
      
      return this.parseURAResponse(response.data)
    } catch (error) {
      console.error('Error fetching URA transactions:', error)
      return []
    }
  }

  async getPrivateRentalData(params?: {
    project?: string
    street?: string
  }): Promise<any[]> {
    try {
      const token = await this.getURAToken()
      
      const response = await axios.get(
        `${this.uraBaseUrl}/invokeUraDS`,
        {
          params: {
            service: 'PMI_Resi_Rental',
            ...params
          },
          headers: {
            'AccessKey': this.config.uraAccessKey,
            'Token': token
          }
        }
      )
      
      return response.data.Result || []
    } catch (error) {
      console.error('Error fetching URA rental data:', error)
      return []
    }
  }

  // OneMap API Methods
  async getOneMapToken(): Promise<string> {
    // Check if we have a valid token
    if (this.oneMapToken && this.oneMapTokenExpiry && new Date() < this.oneMapTokenExpiry) {
      return this.oneMapToken
    }

    if (!this.config.oneMapEmail || !this.config.oneMapPassword) {
      throw new Error('OneMap credentials are required')
    }

    try {
      const response = await axios.post(
        `${this.oneMapBaseUrl}/privateapi/auth/post/getToken`,
        {
          email: this.config.oneMapEmail,
          password: this.config.oneMapPassword
        }
      )
      
      this.oneMapToken = response.data.access_token
      // Token expires in 3 days, but we'll refresh it after 2 days
      this.oneMapTokenExpiry = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
      
      return this.oneMapToken
    } catch (error) {
      console.error('Error getting OneMap token:', error)
      throw error
    }
  }

  async searchAddress(searchText: string): Promise<any[]> {
    try {
      const response = await axios.get(
        `${this.oneMapBaseUrl}/commonapi/search`,
        {
          params: {
            searchVal: searchText,
            returnGeom: 'Y',
            getAddrDetails: 'Y'
          }
        }
      )
      
      return response.data.results || []
    } catch (error) {
      console.error('Error searching OneMap:', error)
      return []
    }
  }

  async getHDBResaleTransactions(params: {
    town?: string
    flatType?: string
    fromDate?: string
    toDate?: string
  }): Promise<HDBTransaction[]> {
    try {
      // Note: This would typically use the HDB resale API
      // For now, returning empty array as actual endpoint requires specific setup
      console.log('HDB API integration pending setup', params)
      return []
    } catch (error) {
      console.error('Error fetching HDB data:', error)
      return []
    }
  }

  // Helper methods
  private parseURAResponse(data: any): PropertyTransaction[] {
    if (!data.Result || !Array.isArray(data.Result)) {
      return []
    }

    return data.Result.flatMap((batch: any) => {
      if (!batch.transaction || !Array.isArray(batch.transaction)) {
        return []
      }

      return batch.transaction.map((t: any) => ({
        project: batch.project,
        area: t.area,
        floorRange: t.floorRange,
        noOfUnits: t.noOfUnits,
        contractDate: t.contractDate,
        typeOfSale: t.typeOfSale,
        price: parseFloat(t.price),
        propertyType: t.propertyType,
        district: batch.district,
        typeOfArea: t.typeOfArea,
        tenure: t.tenure
      }))
    })
  }

  // Aggregate data from multiple sources
  async getAggregatedPropertyData(searchCriteria: {
    location?: string
    propertyType?: 'condo' | 'landed' | 'hdb'
    minPrice?: number
    maxPrice?: number
  }): Promise<any> {
    const results = {
      uraTransactions: [] as PropertyTransaction[],
      hdbTransactions: [] as HDBTransaction[],
      addressInfo: [] as any[]
    }

    // Search for address info if location provided
    if (searchCriteria.location) {
      results.addressInfo = await this.searchAddress(searchCriteria.location)
    }

    // Get URA data for private properties
    if (searchCriteria.propertyType !== 'hdb') {
      results.uraTransactions = await this.getPrivateResidentialTransactions({
        street: searchCriteria.location
      })
      
      // Filter by price if specified
      if (searchCriteria.minPrice || searchCriteria.maxPrice) {
        results.uraTransactions = results.uraTransactions.filter(t => {
          if (searchCriteria.minPrice && t.price < searchCriteria.minPrice) return false
          if (searchCriteria.maxPrice && t.price > searchCriteria.maxPrice) return false
          return true
        })
      }
    }

    // Get HDB data if needed
    if (searchCriteria.propertyType === 'hdb' || !searchCriteria.propertyType) {
      results.hdbTransactions = await this.getHDBResaleTransactions({
        town: searchCriteria.location
      })
    }

    return results
  }
}