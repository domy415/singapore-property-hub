# Singapore Property Hub

A comprehensive Singapore property portal featuring automated content generation, property scraping, and lead management.

<!-- Image refresh completed on 2025-08-29 - Force deployment to clear cache -->

## Features

✅ **SEO-Optimized Website** - Built with Next.js 14 for maximum search engine visibility
✅ **AI Content Generator** - Automatically creates daily property articles
✅ **Content Review System** - AI-powered quality control for articles
✅ **LinkedIn Integration** - Auto-posts articles to social media
✅ **Property Scraper** - Searches PropertyGuru and 99.co based on criteria
✅ **Lead Management** - Automated responses and notifications
✅ **Database** - Prisma ORM with PostgreSQL

## Quick Start

1. **Clone and Install**
   ```bash
   cd singapore-property-hub
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```

3. **Database Setup**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Build and Run**
   ```bash
   npm run build
   npm start
   ```

## API Endpoints

### Property Search
```
POST /api/scraper
Content-Type: application/json

{
  "propertyType": "condo",
  "minPrice": 500000,
  "maxPrice": 1000000,
  "bedrooms": 2,
  "district": "01"
}
```

### Lead Submission
```
POST /api/leads
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+65 9123 4567",
  "message": "Looking for 2-bedroom condo",
  "propertyId": "optional-property-id"
}
```

## Automated Tasks

- **Daily Content**: Runs at 9 AM Singapore time
- **Article Review**: Automatic quality control
- **LinkedIn Posting**: Auto-publishes approved articles
- **Lead Responses**: Instant automated replies

## Domain Configuration

Recommended domain: **singaporepropertyhub.sg**
- Exact match for "singapore property" keywords
- Local .sg extension for SEO advantage
- Professional, memorable brand

## Required Environment Variables

```env
DATABASE_URL="postgresql://..."
OPENAI_API_KEY="sk-..."
LINKEDIN_ACCESS_TOKEN="your_token"
SMTP_HOST="smtp.gmail.com"
SMTP_USER="your_email@gmail.com"
```

## Production Deployment

1. Set up PostgreSQL database
2. Configure environment variables
3. Set up domain (singaporepropertyhub.sg)
4. Configure SMTP for email notifications
5. Set up LinkedIn Developer App
6. Deploy to Vercel/AWS/DigitalOcean

## Maintenance

- Monitor lead conversion rates via `/api/leads` endpoint
- Review article quality in admin dashboard
- Update property search criteria as needed
- Maintain LinkedIn API access tokens