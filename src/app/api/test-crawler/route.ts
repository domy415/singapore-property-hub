import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'
import * as cheerio from 'cheerio'
import { prisma } from '@/lib/prisma'

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Crawler test endpoint is working',
    timestamp: new Date().toISOString()
  })
}

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Starting basic crawler test...')
    
    // Simple test crawl of PropertyGuru first page
    const url = 'https://www.propertyguru.com.sg/property-for-sale?property_type=N&limit=10'
    
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9'
      },
      timeout: 10000
    })
    
    const $ = cheerio.load(response.data)
    
    // Try to find property listings with multiple selectors
    const selectors = [
      '.listing-card',
      '.property-card',
      '.search-result-card',
      '.card',
      'article',
      '.result-item',
      '[data-testid="listing-card"]'
    ]
    
    let foundProperties = []
    let workingSelector = null
    
    for (const selector of selectors) {
      const elements = $(selector)
      if (elements.length > 0) {
        workingSelector = selector
        console.log(`✅ Found ${elements.length} elements with selector: ${selector}`)
        
        elements.each((index, element) => {
          if (index < 5) { // Limit to first 5 for testing
            const $el = $(element)
            const title = $el.find('h1, h2, h3, h4, .title, .listing-title').text().trim()
            const price = $el.find('.price, .listing-price, .amount').text().trim()
            const address = $el.find('.address, .location, .listing-location').text().trim()
            const link = $el.find('a').first().attr('href')
            
            if (title || price || address) {
              foundProperties.push({
                title: title || 'No title found',
                price: price || 'No price found', 
                address: address || 'No address found',
                link: link || 'No link found',
                selector: selector
              })
            }
          }
        })
        break // Stop after finding working selector
      }
    }
    
    // Basic page analysis
    const pageAnalysis = {
      title: $('title').text(),
      totalElements: $('*').length,
      divCount: $('div').length,
      linkCount: $('a').length,
      imageCount: $('img').length,
      workingSelector,
      foundProperties: foundProperties.length
    }
    
    return NextResponse.json({
      success: true,
      message: `Found ${foundProperties.length} potential properties`,
      pageAnalysis,
      properties: foundProperties,
      responseLength: response.data.length,
      timestamp: new Date().toISOString()
    })
    
  } catch (error: any) {
    console.error('❌ Crawler test failed:', error)
    
    return NextResponse.json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}