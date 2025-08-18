# Web Crawler Guide for Property Listings

## 🕷️ **Why Web Crawler Instead of Real-time Scraping?**

### ✅ **Advantages of Web Crawler**
- **Pre-built Database** - Crawl once, search many times
- **Fast User Experience** - Instant search results from database
- **Less Blocking** - Periodic crawls are less suspicious than real-time scraping
- **Comprehensive Data** - Can crawl entire property database systematically
- **Better Reliability** - Database always available even if sites are down
- **Rich Search Features** - Complex filtering, sorting, aggregation

### ❌ **Problems with Real-time Scraping**
- **Slow User Experience** - Users wait 10-30 seconds for each search
- **High Blocking Risk** - Frequent requests trigger anti-bot measures
- **Unreliable** - Search fails if site structure changes or blocks request
- **Limited Coverage** - Only shows search results, not all available properties

## 🏗️ **Architecture Overview**

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   PropertyGuru  │    │   Web Crawler    │    │   Your Database │
│      99.co      │───▶│  (Scheduled)     │───▶│   (PostgreSQL)  │
│   Other Sites   │    │                  │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │                        │
                                ▼                        │
                       ┌──────────────────┐              │
                       │  Cron Jobs       │              │
                       │  (Daily/Hourly)  │              │
                       └──────────────────┘              │
                                                          │
┌─────────────────┐    ┌──────────────────┐              │
│   User Search   │◀───│  Search API      │◀─────────────┘
│   Interface     │    │  (Instant)       │
└─────────────────┘    └──────────────────┘
```

## 🚀 **Implementation Components**

### 1. **Property Crawler** (`property-crawler.ts`)
- **Systematic Crawling** - Pages through PropertyGuru property listings
- **Multi-type Support** - Condos, landed, HDB, commercial properties
- **Rate Limiting** - Respectful delays between requests
- **Data Extraction** - Comprehensive property details
- **Database Storage** - Automatic upsert to prevent duplicates

### 2. **Search API** (`/api/properties/search`)
- **Advanced Filtering** - Price, location, property type, bedrooms, etc.
- **Fast Queries** - Direct database search with indexing
- **Pagination** - Handle large result sets efficiently
- **Statistics** - Search result counts and breakdowns

### 3. **Scheduled Crawling** (`/api/cron/crawler`)
- **Automated Updates** - Daily/hourly crawling schedule
- **Background Processing** - No user waiting time
- **Error Handling** - Retry logic and failure notifications
- **Monitoring** - Crawl statistics and success tracking

## 📊 **Data Flow**

### **Crawling Process**
1. **Start Crawler** - Manually or via schedule
2. **Page Through Listings** - Systematically crawl all property types
3. **Extract Property Data** - Parse HTML for property details
4. **Save to Database** - Upsert properties (update existing, create new)
5. **Update Statistics** - Track crawl success and property counts

### **Search Process**
1. **User Search Request** - Criteria from website search form
2. **Database Query** - Fast SQL query with filters
3. **Return Results** - Instant response with paginated results
4. **Display Properties** - Show matching properties to user

## 🛠️ **Usage Instructions**

### **Manual Crawling**
```bash
# Start a manual crawl (3 pages for testing)
curl -X POST https://your-site.vercel.app/api/crawler/start \
  -H "Content-Type: application/json" \
  -d '{"maxPages": 3, "saveToDatabase": true}'
```

### **Searching Crawled Data**
```bash
# Search for condos in Orchard
curl -X POST https://your-site.vercel.app/api/properties/search \
  -H "Content-Type: application/json" \
  -d '{
    "propertyType": "condo",
    "keyword": "Orchard",
    "minPrice": 1000000,
    "maxPrice": 3000000,
    "limit": 20
  }'
```

### **Scheduled Crawling**
```bash
# Set up Vercel Cron Job (vercel.json)
{
  "crons": [{
    "path": "/api/cron/crawler",
    "schedule": "0 2 * * *"  // Daily at 2 AM
  }]
}
```

## 🎯 **Test the System**

Visit your admin test page: `/admin/property-api-test`

### **Step 1: Start Crawler**
- Click "Start Crawler (3 pages)"
- Wait for crawling to complete (1-3 minutes)
- Check crawler statistics

### **Step 2: Search Crawled Data**
- Set search criteria (location, price, type)
- Click "Search Crawled Data"
- See instant results from database

### **Step 3: Compare Performance**
- Try real-time scraper vs crawler search
- Notice speed difference and reliability

## 📈 **Performance Benefits**

### **Search Speed Comparison**
- **Real-time Scraping**: 10-30 seconds per search
- **Crawler Database**: 0.1-0.5 seconds per search

### **Data Coverage**
- **Real-time Scraping**: Limited to search results only
- **Crawler Database**: All available properties in systematic order

### **Reliability**
- **Real-time Scraping**: Fails if blocked or site changes
- **Crawler Database**: Always available, resilient to site issues

## 🔄 **Maintenance & Monitoring**

### **Daily Tasks**
- Monitor crawl success rates
- Check for new property types or site changes
- Update selectors if needed

### **Weekly Tasks**
- Analyze data quality and completeness
- Optimize crawler performance
- Clean up old/sold properties

### **Monthly Tasks**
- Review and update crawler strategies
- Expand to additional property sites
- Performance optimization

## 🚀 **Next Steps**

1. **Test the crawler** with small page counts
2. **Verify data quality** in your database
3. **Set up scheduled crawling** for regular updates
4. **Integrate search** into your main property pages
5. **Add monitoring** for crawler health
6. **Expand to 99.co** and other sites

This crawler approach gives you a professional, scalable property listing system that's fast, reliable, and comprehensive!