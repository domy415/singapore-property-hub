// SINGLE SOURCE OF TRUTH for all images
// Real Singapore property images from Unsplash API

export const ARTICLE_IMAGES = {
  // Real Singapore property/cityscape images from Unsplash
  'default': 'https://images.unsplash.com/photo-1565967511849-76a60a516170?w=1200&h=630&fit=crop&q=80', // Singapore Parliament
  'singapore-cbd': 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1200&h=630&fit=crop&q=80', // Marina Bay CBD
  'marina-bay': 'https://images.unsplash.com/photo-1555217851-6141535bd771?w=1200&h=630&fit=crop&q=80', // Marina Bay Sands
  'hdb-flats': 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=1200&h=630&fit=crop&q=80', // HDB blocks
  'parliament': 'https://images.unsplash.com/photo-1565967511849-76a60a516170?w=1200&h=630&fit=crop&q=80', // Parliament House
  'financial-district': 'https://images.unsplash.com/photo-1595437193398-f24279553395?w=1200&h=630&fit=crop&q=80', // Raffles Place
  'district-12': 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=1200&h=630&fit=crop&q=80', // District 12 HDB/residential
  'district-2': 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1200&h=630&fit=crop&q=80', // District 2 CBD
  
  // Category-specific Singapore images
  'category-market-insights': 'https://images.unsplash.com/photo-1508964942454-1a56651d54ac?w=1200&h=630&fit=crop&q=80', // Singapore skyline
  'category-property-news': 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=1200&h=630&fit=crop&q=80', // Singapore buildings
  'category-buying-guide': 'https://images.unsplash.com/photo-1513415564515-763d91423bdd?w=1200&h=630&fit=crop&q=80', // Singapore residential
  'category-new-launch-review': 'https://images.unsplash.com/photo-1555217851-6141535bd771?w=1200&h=630&fit=crop&q=80', // New developments
  'category-investment': 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=630&fit=crop&q=80', // Business buildings
  'category-neighborhood': 'https://images.unsplash.com/photo-1540332547168-8b63109225b7?w=1200&h=630&fit=crop&q=80', // Singapore neighborhood
} as const

// Map articles to specific images
export const ARTICLE_IMAGE_MAP: Record<string, string> = {
  // Market analysis articles
  'singapore-s-property-market-poised-for-continued-growth-amid-evolving-regulatory-landscape': ARTICLE_IMAGES['singapore-cbd'],
  'singapore-property-market-resilience-navigating-evolving-trends': ARTICLE_IMAGES['financial-district'],
  'singapore-property-q3-2025-market-analysis': ARTICLE_IMAGES['marina-bay'],
  'navigating-singapore-s-property-landscape-in-q3-2025-insights-from-a-seasoned-expert': ARTICLE_IMAGES['financial-district'],
  'singapore-property-market-trends-q3-2024-analysis': ARTICLE_IMAGES['singapore-cbd'],
  
  // HDB vs Private articles
  'hdb-vs-private-property-complete-comparison-guide-2025': ARTICLE_IMAGES['hdb-flats'],
  'hdb-vs-private-property-in-2025-a-complete-compari': ARTICLE_IMAGES['hdb-flats'],
  'hdb-vs-private-property-in-2025-a-complete-compari-1755690686034': ARTICLE_IMAGES['hdb-flats'],
  
  // Policy articles
  'understanding-singapore-s-cooling-measures-in-2025': ARTICLE_IMAGES['parliament'],
  'navigating-singapore-s-cooling-measures-in-2025-a-': ARTICLE_IMAGES['parliament'],
  
  // District guides
  'ultimate-guide-to-living-in-district-12-balestier-toa-payoh-serangoon': ARTICLE_IMAGES['district-12'],
  'ultimate-guide-to-living-in-district-2-anson-tanjong-pagar-singapore': ARTICLE_IMAGES['district-2'],
  
  // New launch reviews
  'bloomsbury-residences-2025-review': ARTICLE_IMAGES['singapore-cbd'],
  
  // National Day themed
  'celebrating-national-day-insights-into-singapore-s-property-market-in-2025': ARTICLE_IMAGES['marina-bay'],
  'navigating-the-singapore-property-market-a-national-day-2025-special': ARTICLE_IMAGES['marina-bay'],
  'navigating-singapore-s-property-market-a-guide-to-independence-planning': ARTICLE_IMAGES['marina-bay'],
  
  // Weekend/general articles
  'weekend-property-picks-in-singapore-a-2025-market-': ARTICLE_IMAGES['singapore-cbd'],
  'unlocking-the-potential-of-singapore-s-property-ma': ARTICLE_IMAGES['financial-district'],
  'navigating-the-waves-of-singapore-s-property-market-an-expert-analysis': ARTICLE_IMAGES['marina-bay']
}

// SINGLE function to get image - use EVERYWHERE
export function getArticleImage(article: { slug?: string; category?: string }): string {
  // First check specific mapping
  if (article.slug && ARTICLE_IMAGE_MAP[article.slug]) {
    return ARTICLE_IMAGE_MAP[article.slug]
  }
  
  // Then check category
  if (article.category) {
    const categoryKey = `category-${article.category.toLowerCase().replace(/_/g, '-')}`
    if (ARTICLE_IMAGES[categoryKey as keyof typeof ARTICLE_IMAGES]) {
      return ARTICLE_IMAGES[categoryKey as keyof typeof ARTICLE_IMAGES]
    }
  }
  
  // Finally return default
  return ARTICLE_IMAGES['default']
}