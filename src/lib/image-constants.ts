// SINGLE SOURCE OF TRUTH for all images
// DO NOT CREATE MULTIPLE IMAGE SYSTEMS

export const ARTICLE_IMAGES = {
  // Use CDN images that will always load
  'default': 'https://placehold.co/1200x630/1e40af/white?text=Singapore+Property+Hub',
  'singapore-cbd': 'https://placehold.co/1200x630/1e40af/white?text=CBD+Skyline',
  'marina-bay': 'https://placehold.co/1200x630/059669/white?text=Marina+Bay',
  'hdb-flats': 'https://placehold.co/1200x630/dc2626/white?text=HDB+Housing',
  'parliament': 'https://placehold.co/1200x630/7c3aed/white?text=Government+Policy',
  'financial-district': 'https://placehold.co/1200x630/ea580c/white?text=Financial+District',
  'district-12': 'https://placehold.co/1200x630/0891b2/white?text=District+12+Balestier',
  'district-2': 'https://placehold.co/1200x630/7c2d12/white?text=District+2+CBD',
  
  // Category defaults
  'category-market-insights': 'https://placehold.co/1200x630/1e40af/white?text=Market+Insights',
  'category-property-news': 'https://placehold.co/1200x630/dc2626/white?text=Property+News',
  'category-buying-guide': 'https://placehold.co/1200x630/059669/white?text=Buying+Guide',
  'category-new-launch-review': 'https://placehold.co/1200x630/7c3aed/white?text=New+Launch+Review',
  'category-investment': 'https://placehold.co/1200x630/ea580c/white?text=Investment+Guide',
  'category-neighborhood': 'https://placehold.co/1200x630/0891b2/white?text=Neighborhood+Guide',
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