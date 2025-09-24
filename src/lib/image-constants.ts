// SINGLE SOURCE OF TRUTH for all images
// Real Singapore property images from Unsplash API

export const ARTICLE_IMAGES = {
  // Real Singapore property/cityscape images from Unsplash - DIVERSE SET
  'default': 'https://images.unsplash.com/photo-1565967511849-76a60a516170?w=1200&h=630&fit=crop&q=80', // Singapore Parliament
  'singapore-cbd': 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1200&h=630&fit=crop&q=80', // Marina Bay CBD
  'marina-bay': 'https://images.unsplash.com/photo-1555217851-6141535bd771?w=1200&h=630&fit=crop&q=80', // Marina Bay Sands
  'hdb-flats': 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=1200&h=630&fit=crop&q=80', // HDB blocks
  'parliament': 'https://images.unsplash.com/photo-1565967511849-76a60a516170?w=1200&h=630&fit=crop&q=80', // Parliament House
  'financial-district': 'https://images.unsplash.com/photo-1595437193398-f24279553395?w=1200&h=630&fit=crop&q=80', // Raffles Place
  
  // District-specific images (authentic Singapore neighborhoods)
  'district-toa-payoh': 'https://images.unsplash.com/photo-1557804506-e969d7b32a4b?w=1200&h=630&fit=crop&q=80', // Toa Payoh HDB town
  'district-12': 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&h=630&fit=crop&q=80', // Balestier area
  'district-2': 'https://images.unsplash.com/photo-1536431311719-398b6704d4cc?w=1200&h=630&fit=crop&q=80', // Tanjong Pagar
  'district-downtown': 'https://images.unsplash.com/photo-1508970057347-0524a45ebdff?w=1200&h=630&fit=crop&q=80', // Downtown Core
  'district-9': 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1200&h=630&fit=crop&q=80', // Orchard area
  'district-10': 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&h=630&fit=crop&q=80', // Tanglin area
  
  // More variety for different article types to prevent repetition
  'analysis-1': 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=1200&h=630&fit=crop&q=80', // Singapore skyline night
  'analysis-2': 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&h=630&fit=crop&q=80', // Singapore buildings
  'analysis-3': 'https://images.unsplash.com/photo-1558036117-15d82a90b9b1?w=1200&h=630&fit=crop&q=80', // Singapore residential
  'guide-1': 'https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=1200&h=630&fit=crop&q=80', // Property guidance
  'guide-2': 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1200&h=630&fit=crop&q=80', // HDB guidance
  'news-1': 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&h=630&fit=crop&q=80', // Property news
  'investment-1': 'https://images.unsplash.com/photo-1567360425618-1594206637d2?w=1200&h=630&fit=crop&q=80', // Investment planning
  'investment-2': 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&h=630&fit=crop&q=80', // Commercial property
  'neighborhood-1': 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1200&h=630&fit=crop&q=80', // Singapore neighborhoods
  'neighborhood-2': 'https://images.unsplash.com/photo-1540332547168-8b63109225b7?w=1200&h=630&fit=crop&q=80', // Residential areas
  
  // Category defaults with variety
  'category-market-insights': 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=630&fit=crop&q=80', // Business analysis
  'category-property-news': 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=1200&h=630&fit=crop&q=80', // Singapore buildings
  'category-buying-guide': 'https://images.unsplash.com/photo-1513415564515-763d91423bdd?w=1200&h=630&fit=crop&q=80', // Singapore residential
  'category-new-launch-review': 'https://images.unsplash.com/photo-1555217851-6141535bd771?w=1200&h=630&fit=crop&q=80', // New developments
  'category-investment': 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=630&fit=crop&q=80', // Business buildings
  'category-neighborhood': 'https://images.unsplash.com/photo-1540332547168-8b63109225b7?w=1200&h=630&fit=crop&q=80', // Singapore neighborhood
} as const

// Map articles to specific images - COMPREHENSIVE CONTENT MATCHING
export const ARTICLE_IMAGE_MAP: Record<string, string> = {
  // HDB-focused articles should show HDB buildings
  'hdb-vs-private-property-complete-comparison-guide-2025': 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=1200&h=630&fit=crop&q=80',
  'hdb-vs-private-property-in-2025-a-complete-compari': 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=1200&h=630&fit=crop&q=80',
  'hdb-vs-private-property-in-2025-a-complete-compari-1755690686034': 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=1200&h=630&fit=crop&q=80',
  'hdb-resale-trends-analysis': 'https://images.unsplash.com/photo-1562679634-6fdc5056e5de?w=1200&h=630&fit=crop&q=80',
  
  // Cooling measures should show government/parliament
  'understanding-singapore-s-cooling-measures-in-2025': 'https://images.unsplash.com/photo-1565967511849-76a60a516170?w=1200&h=630&fit=crop&q=80',
  'navigating-singapore-s-cooling-measures-in-2025-a-': 'https://images.unsplash.com/photo-1565967511849-76a60a516170?w=1200&h=630&fit=crop&q=80',
  'cooling-measures-impact-2024': 'https://images.unsplash.com/photo-1565967511849-76a60a516170?w=1200&h=630&fit=crop&q=80',
  
  // District guides should show THAT specific district
  'ultimate-guide-to-living-in-district-12-balestier-toa-payoh-serangoon': 'https://images.unsplash.com/photo-1557804506-e969d7b32a4b?w=1200&h=630&fit=crop&q=80',
  'ultimate-guide-to-living-in-district-2-anson-tanjong-pagar-singapore': 'https://images.unsplash.com/photo-1536431311719-398b6704d4cc?w=1200&h=630&fit=crop&q=80',
  'district-guide-downtown-core': 'https://images.unsplash.com/photo-1508970057347-0524a45ebdff?w=1200&h=630&fit=crop&q=80',
  'district-9-vs-district-10-premium-location': 'https://images.unsplash.com/photo-1515263487990-61b07816b324?w=1200&h=630&fit=crop&q=80',
  
  // Investment articles should show financial/business imagery
  'property-investment-strategies': 'https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=1200&h=630&fit=crop&q=80',
  'singapore-property-investment-guide': 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=630&fit=crop&q=80',
  'property-investment-strategies-rising-rates': 'https://images.unsplash.com/photo-1460317442991-0ec209397118?w=1200&h=630&fit=crop&q=80',
  
  // New launch/condo articles should show modern condos
  'new-launch-guide-2024': 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&h=630&fit=crop&q=80',
  'bloomsbury-residences-2025-review': 'https://images.unsplash.com/photo-1515263487990-61b07816b324?w=1200&h=630&fit=crop&q=80',
  
  // Market analysis should show Singapore skyline/CBD
  'singapore-property-market-outlook-2025': 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1200&h=630&fit=crop&q=80',
  'singapore-s-property-market-poised-for-continued-growth-amid-evolving-regulatory-landscape': 'https://images.unsplash.com/photo-1508964942454-1a56651d54ac?w=1200&h=630&fit=crop&q=80',
  'singapore-property-market-resilience-navigating-evolving-trends': 'https://images.unsplash.com/photo-1595437193398-f24279553395?w=1200&h=630&fit=crop&q=80',
  'singapore-property-q3-2025-market-analysis': 'https://images.unsplash.com/photo-1555217851-6141535bd771?w=1200&h=630&fit=crop&q=80',
  'navigating-singapore-s-property-landscape-in-q3-2025-insights-from-a-seasoned-expert': 'https://images.unsplash.com/photo-1567360425618-1594206637d2?w=1200&h=630&fit=crop&q=80',
  'singapore-property-market-trends-q3-2024-analysis': 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1200&h=630&fit=crop&q=80',
  
  // National Day/Singapore themed
  'celebrating-national-day-insights-into-singapore-s-property-market-in-2025': 'https://images.unsplash.com/photo-1533628635777-112b2239b1c7?w=1200&h=630&fit=crop&q=80',
  'navigating-the-singapore-property-market-a-national-day-2025-special': 'https://images.unsplash.com/photo-1533628635777-112b2239b1c7?w=1200&h=630&fit=crop&q=80',
  'navigating-singapore-s-property-market-a-guide-to-independence-planning': 'https://images.unsplash.com/photo-1533628635777-112b2239b1c7?w=1200&h=630&fit=crop&q=80',
  
  // Weekend/general market articles
  'weekend-property-picks-in-singapore-a-2025-market-': 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&h=630&fit=crop&q=80',
  'unlocking-the-potential-of-singapore-s-property-ma': 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&h=630&fit=crop&q=80',
  'navigating-the-waves-of-singapore-s-property-market-an-expert-analysis': 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1200&h=630&fit=crop&q=80',
  
  // Sentosa/luxury
  'sentosa-cove-ultimate-luxury-living': 'https://images.unsplash.com/photo-1567360425618-1594206637d2?w=1200&h=630&fit=crop&q=80',
  
  // Policy/ABSD
  'understanding-absd-2024': 'https://images.unsplash.com/photo-1565967511849-76a60a516170?w=1200&h=630&fit=crop&q=80'
}

// Smart image selection with content-based matching - BULLETPROOF VERSION
export function getArticleImage(article: { slug?: string; category?: string; title?: string }): string {
  // Handle null/undefined inputs gracefully
  if (!article) {
    return 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1200&h=630&fit=crop&q=80'
  }
  
  const slug = (article.slug || '').toLowerCase()
  const title = (article.title || '').toLowerCase()
  const category = (article.category || '').toLowerCase()
  
  // 1. Check exact slug match first (case-insensitive)
  if (slug && ARTICLE_IMAGE_MAP[slug]) {
    return ARTICLE_IMAGE_MAP[slug]
  }
  
  // Also check original case slug
  if (article.slug && ARTICLE_IMAGE_MAP[article.slug]) {
    return ARTICLE_IMAGE_MAP[article.slug]
  }
  
  // 2. Content-based matching by keywords in title (prioritized by specificity)
  if (title.includes('hdb') || title.includes('flat') || title.includes('bto')) {
    return 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=1200&h=630&fit=crop&q=80' // HDB blocks
  }
  
  if (title.includes('cooling') || title.includes('measure') || title.includes('policy') || title.includes('absd')) {
    return 'https://images.unsplash.com/photo-1565967511849-76a60a516170?w=1200&h=630&fit=crop&q=80' // Parliament
  }
  
  if (title.includes('district 12') || title.includes('balestier') || title.includes('toa payoh')) {
    return 'https://images.unsplash.com/photo-1557804506-e969d7b32a4b?w=1200&h=630&fit=crop&q=80' // Toa Payoh
  }
  
  if (title.includes('district 2') || title.includes('tanjong pagar') || title.includes('anson')) {
    return 'https://images.unsplash.com/photo-1536431311719-398b6704d4cc?w=1200&h=630&fit=crop&q=80' // Tanjong Pagar
  }
  
  if (title.includes('district 9') || title.includes('district 10') || title.includes('orchard')) {
    return 'https://images.unsplash.com/photo-1515263487990-61b07816b324?w=1200&h=630&fit=crop&q=80' // Orchard/Premium
  }
  
  if (title.includes('invest') || title.includes('roi') || title.includes('yield') || title.includes('rental')) {
    return 'https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=1200&h=630&fit=crop&q=80' // Investment
  }
  
  if (title.includes('condo') || title.includes('new launch') || title.includes('luxury') || title.includes('residence')) {
    return 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&h=630&fit=crop&q=80' // Modern condo
  }
  
  if (title.includes('sentosa') || title.includes('waterfront')) {
    return 'https://images.unsplash.com/photo-1567360425618-1594206637d2?w=1200&h=630&fit=crop&q=80' // Waterfront
  }
  
  if (title.includes('national day') || title.includes('independence')) {
    return 'https://images.unsplash.com/photo-1533628635777-112b2239b1c7?w=1200&h=630&fit=crop&q=80' // National Day
  }
  
  // 3. Category-based fallback (handle all possible variations)
  const categoryImages: Record<string, string> = {
    'market_insights': 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1200&h=630&fit=crop&q=80',
    'market insights': 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1200&h=630&fit=crop&q=80',
    'marketinsights': 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1200&h=630&fit=crop&q=80',
    'buying_guide': 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&h=630&fit=crop&q=80',
    'buying guide': 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&h=630&fit=crop&q=80',
    'investment': 'https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=1200&h=630&fit=crop&q=80',
    'neighborhood': 'https://images.unsplash.com/photo-1540332547168-8b63109225b7?w=1200&h=630&fit=crop&q=80',
    'property_news': 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=1200&h=630&fit=crop&q=80',
    'property news': 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=1200&h=630&fit=crop&q=80',
    'new_launch_review': 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&h=630&fit=crop&q=80',
    'new launch review': 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&h=630&fit=crop&q=80'
  }
  
  // Try category matching (normalized)
  if (category && categoryImages[category]) {
    return categoryImages[category]
  }
  
  // Try original category if normalization didn't work
  if (article.category && categoryImages[article.category.toLowerCase()]) {
    return categoryImages[article.category.toLowerCase()]
  }
  
  // 4. Absolute fallback - Singapore skyline (always works)
  return 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1200&h=630&fit=crop&q=80'
}

// Export a modified version that ensures valid URLs
const originalGetArticleImage = getArticleImage;
export function getArticleImageSafe(article: { slug?: string; category?: string; title?: string }): string {
  const result = originalGetArticleImage(article);
  
  // Ensure we always return a valid URL
  if (!result || !result.startsWith('http')) {
    return 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1200&h=630&fit=crop&q=80';
  }
  
  return result;
}