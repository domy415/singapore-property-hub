# Enhanced Property Web Scraper Guide

## Overview

The enhanced property scraper extracts real-time property listings from PropertyGuru and 99.co to provide current market availability. This complements the official APIs which provide historical transaction data.

## Key Features

### ✅ Advanced Parsing
- **Multiple Selector Support**: Uses fallback selectors for robust data extraction
- **Smart Property Detection**: Automatically identifies property types, districts, and features
- **Price Normalization**: Handles different price formats (millions, thousands, PSF)
- **Duplicate Removal**: Eliminates duplicate listings across sources

### ✅ Rate Limiting & Safety
- **Random User Agents**: Rotates between different browser signatures
- **Request Delays**: Built-in delays to avoid being blocked
- **Error Handling**: Graceful failure handling with detailed logs
- **Timeout Protection**: 10-second timeout per request

### ✅ Data Quality
- **Text Cleaning**: Removes extra whitespace and formatting
- **Area Conversion**: Converts sqm to sqft automatically
- **District Extraction**: Parses Singapore district codes from addresses
- **Image URL Extraction**: Captures property images when available

## API Endpoints

### POST `/api/scraper/listings`

Scrapes current property listings based on search criteria.

**Request Body:**
```json
{
  "propertyType": "condo",          // condo, landed, hdb, commercial
  "listingType": "sale",            // sale, rent
  "location": "Orchard",            // Area or district name
  "minPrice": 1000000,              // Minimum price
  "maxPrice": 3000000,              // Maximum price
  "bedrooms": 2,                    // Number of bedrooms
  "maxResults": 20,                 // Max listings to return
  "saveToDb": true                  // Save to database
}
```

**Response:**
```json
{
  "success": true,
  "count": 15,
  "message": "Found 15 current property listings",
  "sources": {
    "propertyGuru": 8,
    "ninetyNine": 7
  },
  "listings": [
    {
      "id": "pg-12345678",
      "title": "THE ORCHARD RESIDENCES",
      "price": "S$2.8M",
      "priceValue": 2800000,
      "address": "Orchard Boulevard (D09)",
      "district": "09",
      "bedrooms": "2",
      "bathrooms": "2",
      "area": "1,076 sqft",
      "sqft": 1076,
      "propertyType": "Condominium",
      "tenure": "99-year Leasehold",
      "url": "https://www.propertyguru.com.sg/listing/12345678",
      "image": "https://cdn.propertyguru.com.sg/images/...",
      "source": "PropertyGuru",
      "psf": "$2,602"
    }
  ]
}
```

### GET `/api/scraper/listings`

Retrieves recently scraped listings from the database.

## PropertyGuru Integration

### URL Structure
```
https://www.propertyguru.com.sg/property-for-sale
?property_type=N           // N=Condo, L=Landed, H=HDB, B=Commercial
&minprice=1000000         // Minimum price
&maxprice=3000000         // Maximum price
&beds=2                   // Number of bedrooms
&district_code[]=09       // District filter
&freetext=Orchard         // Location search
```

### Data Extracted
- Property title and project name
- Price and PSF (price per square foot)
- Address and district
- Bedrooms, bathrooms, floor area
- Property type and tenure
- Listing URL and images
- Agent information (when available)

## 99.co Integration

### URL Structure
```
https://www.99.co/singapore/sale/condominiums
?price_min=1000000        // Minimum price
&price_max=3000000        // Maximum price
&num_beds=2               // Number of bedrooms
&query_coords=Orchard     // Location search
&sort_by=date_desc        // Sort by newest
```

### Data Extracted
- Property title and development name
- Price and rental rates
- Address and location details
- Room configuration
- Floor area in sqft/sqm
- Property category and type
- Direct listing links

## Usage Examples

### 1. Search Orchard Condos
```javascript
const response = await fetch('/api/scraper/listings', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    propertyType: 'condo',
    location: 'Orchard',
    minPrice: 2000000,
    maxPrice: 5000000,
    bedrooms: 2,
    maxResults: 10
  })
})
```

### 2. Search Landed Properties
```javascript
const response = await fetch('/api/scraper/listings', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    propertyType: 'landed',
    location: 'Bukit Timah',
    minPrice: 3000000,
    listingType: 'sale'
  })
})
```

### 3. HDB Rental Search
```javascript
const response = await fetch('/api/scraper/listings', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    propertyType: 'hdb',
    listingType: 'rent',
    location: 'Tampines',
    maxPrice: 3000
  })
})
```

## Best Practices

### 🔄 Rate Limiting
- **Delay Between Requests**: 1-2 seconds between site requests
- **Batch Processing**: Process multiple criteria in batches
- **Time-based Scheduling**: Run bulk scraping during off-peak hours

### 💾 Caching Strategy
- **Database Storage**: Cache results for 1-2 hours
- **Incremental Updates**: Only scrape new listings when possible
- **Error Recovery**: Retry failed requests with exponential backoff

### 🛡️ Anti-Detection
- **User Agent Rotation**: Randomly switch between browser signatures
- **Header Variation**: Include realistic browser headers
- **Request Timing**: Vary request intervals naturally

## Error Handling

### Common Issues
1. **Rate Limiting**: Site blocks requests → Use delays and retry logic
2. **Selector Changes**: HTML structure changes → Update selectors regularly
3. **Captcha**: Site requires human verification → Use proxy rotation
4. **Timeout**: Slow response times → Increase timeout or retry

### Monitoring
- **Success Rate Tracking**: Monitor scraping success percentage
- **Error Logging**: Log failed requests with details
- **Data Quality Checks**: Validate extracted data completeness

## Legal Considerations

### ✅ Allowed Practices
- **Public Data**: Scraping publicly available listings
- **Reasonable Frequency**: Respectful request timing
- **Attribution**: Crediting data sources appropriately

### ⚠️ Best Practices
- **Terms of Service**: Review site terms regularly
- **Rate Limiting**: Don't overload servers
- **Data Usage**: Use scraped data responsibly
- **Attribution**: Credit PropertyGuru and 99.co as sources

## Performance Optimization

### Parallel Processing
```javascript
// Run both scrapers concurrently
const [propertyGuruResults, ninetyNineResults] = await Promise.allSettled([
  this.scrapePropertyGuru(options),
  this.scrape99co(options)
])
```

### Selective Scraping
- **Targeted Searches**: Use specific criteria to reduce data volume
- **Priority Sources**: Focus on most reliable data sources first
- **Progressive Loading**: Load basic data first, details on demand

## Database Integration

### Schema Fields
```sql
externalId      String   -- Unique listing ID
source          String   -- PropertyGuru or 99.co
listingUrl      String   -- Direct link to listing
imageUrl        String   -- Primary property image
area            Int      -- Floor area in sqft
propertyType    String   -- Property category
tenure          String   -- Lease type (freehold/leasehold)
psf             String   -- Price per square foot
```

### Upsert Strategy
```javascript
// Update existing or create new
await prisma.property.upsert({
  where: { externalId: listing.id },
  update: { /* updated fields */ },
  create: { /* new listing data */ }
})
```

This enhanced scraper provides reliable, real-time property data to complement the official APIs, giving your platform comprehensive market coverage.