import { NextResponse } from 'next/server'
import { getArticleImage } from '@/lib/image-constants'

export async function GET() {
  // Test articles to see what images they get
  const testArticles = [
    { slug: 'hdb-vs-private-property-complete-comparison-guide-2025', title: 'HDB vs Private Property Complete Comparison Guide 2025', category: 'BUYING_GUIDE' },
    { slug: 'ultimate-guide-to-living-in-district-12-balestier-toa-payoh-serangoon', title: 'Ultimate Guide to Living in District 12: Balestier, Toa Payoh, Serangoon', category: 'NEIGHBORHOOD' },
    { slug: 'understanding-singapore-s-cooling-measures-in-2025', title: 'Understanding Singapore\'s Cooling Measures in 2025', category: 'MARKET_INSIGHTS' },
    { slug: 'singapore-s-property-market-poised-for-continued-growth-amid-evolving-regulatory-landscape', title: 'Singapore\'s Property Market Poised for Continued Growth', category: 'MARKET_INSIGHTS' },
    { slug: 'property-investment-strategies-rising-rates', title: 'Property Investment Strategies in a Rising Interest Rate Environment', category: 'INVESTMENT' },
    { slug: 'district-9-vs-district-10-premium-location', title: 'District 9 vs District 10: Which Premium Location Should You Choose?', category: 'INVESTMENT' },
    { slug: 'sentosa-cove-ultimate-luxury-living', title: 'Sentosa Cove: The Ultimate Luxury Living Experience', category: 'NEIGHBORHOOD' },
    { slug: 'understanding-absd-2024', title: 'Understanding the Additional Buyer\'s Stamp Duty (ABSD) in 2024', category: 'PROPERTY_NEWS' }
  ]
  
  const results = testArticles.map(article => ({
    article,
    image: getArticleImage(article),
    expectedImageType: getExpectedImageType(article)
  }))
  
  return NextResponse.json({ 
    message: 'Image mapping test results',
    results,
    timestamp: new Date().toISOString()
  })
}

function getExpectedImageType(article: { title: string }) {
  const title = article.title.toLowerCase()
  
  if (title.includes('hdb')) return 'HDB Buildings'
  if (title.includes('district 12') || title.includes('toa payoh')) return 'Toa Payoh District'
  if (title.includes('district 2') || title.includes('tanjong pagar')) return 'Tanjong Pagar District'
  if (title.includes('cooling') || title.includes('absd')) return 'Parliament/Government'
  if (title.includes('invest') || title.includes('rising rates')) return 'Financial/Investment'
  if (title.includes('district 9') || title.includes('district 10')) return 'Premium Districts'
  if (title.includes('sentosa')) return 'Waterfront/Luxury'
  
  return 'Market Analysis/Singapore Skyline'
}