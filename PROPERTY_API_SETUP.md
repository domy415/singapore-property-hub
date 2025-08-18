# Property Data API Setup Guide

This guide will help you set up official property data APIs for Singapore Property Hub instead of web scraping.

## Why Use Official APIs?

✅ **Legal Compliance** - No terms of service violations  
✅ **Reliable Data** - Direct from government sources  
✅ **Better Performance** - No scraping delays or blocks  
✅ **Accurate Information** - Official, verified data  

## Available Data Sources

### 1. URA Data Service API
Provides private residential property transaction data and rental information.

**Data Available:**
- Private residential property transactions (past 5 years)
- Median rental data (past 3 years)
- Property details including price, area, district, tenure
- Updated quarterly

### 2. OneMap API
Singapore's official mapping and location service.

**Data Available:**
- Address search and geocoding
- HDB resale transaction prices (past 3 years)
- Property location details
- Updated daily for HDB data

### 3. Data.gov.sg
Additional property-related datasets.

**Data Available:**
- HDB property information
- Planning area boundaries
- Various housing statistics

## Setup Instructions

### Step 1: Register for URA API Access

1. Visit [URA Data Service](https://www.ura.gov.sg/maps/api/)
2. Click on "Register for an Account"
3. Fill in the registration form with:
   - Your name and email
   - Organization: Singapore Property Hub
   - Purpose: Property listing and market analysis
4. After approval, you'll receive an **Access Key** via email
5. Generate your API token using the Access Key

### Step 2: Register for OneMap API

1. Visit [OneMap API](https://www.onemap.gov.sg/apidocs/)
2. Click "Register" to create an account
3. Verify your email address
4. Your login credentials will be your API credentials

### Step 3: Configure Environment Variables

Add these to your `.env.local` file in Vercel:

```env
# URA API Configuration
URA_ACCESS_KEY=your_ura_access_key_here

# OneMap API Configuration  
ONEMAP_EMAIL=your_onemap_email@example.com
ONEMAP_PASSWORD=your_onemap_password

# Optional: Data.gov.sg (no auth required)
DATAGOV_API_ENDPOINT=https://data.gov.sg/api/action/datastore_search
```

### Step 4: Update Vercel Environment Variables

1. Go to your [Vercel Dashboard](https://vercel.com)
2. Select your `singapore-property-hub` project
3. Go to Settings → Environment Variables
4. Add the following variables:
   - `URA_ACCESS_KEY`
   - `ONEMAP_EMAIL`
   - `ONEMAP_PASSWORD`
5. Redeploy your application

## API Usage Examples

### Search for Property Transactions

```bash
curl -X POST https://singapore-property-hub.vercel.app/api/properties/official-data \
  -H "Content-Type: application/json" \
  -d '{
    "location": "Orchard",
    "propertyType": "condo",
    "minPrice": 1000000,
    "maxPrice": 3000000
  }'
```

### Response Format

```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "type": "sale",
        "source": "URA",
        "project": "THE ORCHARD RESIDENCES",
        "area": "1001-1200 sqft",
        "price": 2500000,
        "contractDate": "2024-12",
        "propertyType": "Condominium",
        "district": "09",
        "tenure": "99-year Leasehold"
      }
    ],
    "locations": [...],
    "summary": {
      "totalTransactions": 15,
      "averagePrice": 2300000,
      "priceRange": {
        "min": 1200000,
        "max": 3000000
      }
    }
  }
}
```

## Rate Limits and Best Practices

### URA API
- Rate limit: 250 requests per day
- Best practice: Cache responses for at least 1 hour
- Data updates: Quarterly (4th Friday of Jan, Apr, Jul, Oct)

### OneMap API
- Rate limit: 250 requests per minute
- Best practice: Batch location searches
- Token validity: 3 days (auto-refresh implemented)

## Implementation Status

✅ Created `property-data-api.ts` service  
✅ Created `/api/properties/official-data` endpoint  
✅ Implemented data aggregation from multiple sources  
✅ Added proper error handling and setup instructions  

## Next Steps

1. **Get API Credentials**: Register for URA and OneMap accounts
2. **Configure Environment**: Add credentials to Vercel
3. **Test the APIs**: Use the test endpoint to verify setup
4. **Update UI**: Modify property search to use official data
5. **Add Caching**: Implement Redis or similar for API response caching

## Troubleshooting

### "URA API credentials not configured" Error
- Ensure `URA_ACCESS_KEY` is set in environment variables
- Verify the access key is valid and not expired
- Check that you've completed URA registration

### "OneMap API credentials not configured" Error  
- Ensure `ONEMAP_EMAIL` and `ONEMAP_PASSWORD` are set
- Verify your OneMap account is active
- Try logging in to OneMap portal to confirm credentials

### No Data Returned
- Check if your search criteria are too restrictive
- Verify the location name matches official records
- Try broader search parameters first

## Additional Resources

- [URA API Documentation](https://www.ura.gov.sg/maps/api/)
- [OneMap API Documentation](https://www.onemap.gov.sg/apidocs/)
- [Data.gov.sg APIs](https://data.gov.sg/developer)
- [HDB Resale Statistics](https://data.gov.sg/dataset/resale-flat-prices)