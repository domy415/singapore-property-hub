// LOCAL Singapore Property Images - Downloaded from Free Sources
const LOCAL_SINGAPORE_IMAGES = {
  // HDB Estates - Real Singapore Public Housing
  'hdb-toa-payoh': '/property-images/hdb/toa-payoh-hdb-town.jpg',
  'hdb-blocks': '/property-images/hdb/singapore-hdb-blocks.jpg',
  'hdb-mature-estate': '/property-images/hdb/mature-hdb-estate.jpg',
  
  // Singapore Districts & Neighborhoods  
  'district-9-orchard': '/property-images/districts/orchard-road-shopping.jpg',
  'district-2-tanjong-pagar': '/property-images/districts/tanjong-pagar-cbd.jpg',
  
  // Modern Condominiums
  'modern-condo': '/property-images/condos/modern-singapore-condo.jpg',
  'luxury-condo': '/property-images/condos/luxury-condo-singapore.jpg',
  'high-rise-residential': '/property-images/condos/high-rise-residential.jpg',
  'waterfront-condo': '/property-images/condos/waterfront-condo.jpg',
  
  // Singapore Government Buildings & Landmarks
  'parliament': '/property-images/government/singapore-parliament.jpg',
  'city-hall': '/property-images/government/singapore-city-hall.jpg',
  'merlion': '/property-images/government/singapore-merlion.jpg',
  
  // Singapore Skyline & Business District
  'marina-bay-skyline': '/property-images/misc/singapore-marina-bay-skyline.jpg',
  'marina-bay-night': '/property-images/misc/marina-bay-sands-night.jpg',
  'cbd-buildings': '/property-images/misc/singapore-cbd-buildings.jpg',
  'skyline-day': '/property-images/misc/singapore-skyline-day.jpg',
  'river-view': '/property-images/misc/singapore-river-view.jpg',
  'business-district': '/property-images/misc/singapore-business-district.jpg',
  
  // National Day & Singapore Culture
  'flag-celebration': '/property-images/misc/singapore-flag-celebration.jpg',
  'national-day': '/property-images/misc/singapore-national-day.jpg',
  
  // Default fallback
  'default': '/property-images/misc/singapore-marina-bay-skyline.jpg'
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

// Comprehensive Singapore Property Image Selection - Using Local Images
export function getArticleImage(article: { slug?: string; category?: string; title?: string }): string {
  const title = (article?.title || '').toLowerCase()
  const slug = (article?.slug || '').toLowerCase()
  
  // PRIORITY 1: Specific Singapore Properties (Use Local Condo Images)
  if (title.includes('grand dunman') || slug.includes('grand-dunman')) {
    return LOCAL_SINGAPORE_IMAGES['luxury-condo']
  }
  
  if (title.includes('continuum') || slug.includes('continuum')) {
    return LOCAL_SINGAPORE_IMAGES['waterfront-condo']
  }
  
  if (title.includes('normanton park') || slug.includes('normanton-park')) {
    return LOCAL_SINGAPORE_IMAGES['high-rise-residential']
  }
  
  if (title.includes('lentor mansion') || slug.includes('lentor-mansion')) {
    return LOCAL_SINGAPORE_IMAGES['modern-condo']
  }
  
  if (title.includes('orchard sophia') || slug.includes('orchard-sophia')) {
    return LOCAL_SINGAPORE_IMAGES['luxury-condo']
  }
  
  if (title.includes('avenue south') || slug.includes('avenue-south')) {
    return LOCAL_SINGAPORE_IMAGES['waterfront-condo']
  }
  
  // PRIORITY 2: HDB Articles (Use Local HDB Estate Images)
  if (title.includes('hdb') || title.includes('flat') || title.includes('bto')) {
    if (title.includes('toa payoh') || title.includes('district 12')) {
      return LOCAL_SINGAPORE_IMAGES['hdb-toa-payoh']
    }
    if (title.includes('mature') || title.includes('established')) {
      return LOCAL_SINGAPORE_IMAGES['hdb-mature-estate']
    }
    return LOCAL_SINGAPORE_IMAGES['hdb-blocks']
  }
  
  // PRIORITY 3: District-Specific Content (Use Local District Photos)
  if (title.includes('district 2') || title.includes('tanjong pagar') || title.includes('anson')) {
    return LOCAL_SINGAPORE_IMAGES['district-2-tanjong-pagar']
  }
  
  if (title.includes('district 9') || title.includes('orchard')) {
    return LOCAL_SINGAPORE_IMAGES['district-9-orchard']
  }
  
  if (title.includes('district 10') || title.includes('tanglin')) {
    return LOCAL_SINGAPORE_IMAGES['business-district']
  }
  
  if (title.includes('district 12') || title.includes('balestier') || title.includes('toa payoh')) {
    return LOCAL_SINGAPORE_IMAGES['hdb-toa-payoh']
  }
  
  // PRIORITY 4: Policy/Government Content (Use Local Government Buildings)
  if (title.includes('cooling') || title.includes('policy') || title.includes('absd') || title.includes('measure')) {
    return LOCAL_SINGAPORE_IMAGES['parliament']
  }
  
  if (title.includes('ura') || title.includes('urban redevelopment')) {
    return LOCAL_SINGAPORE_IMAGES['city-hall']
  }
  
  if (title.includes('parliament') || title.includes('government')) {
    return LOCAL_SINGAPORE_IMAGES['parliament']
  }
  
  if (title.includes('mas') || title.includes('monetary authority')) {
    return LOCAL_SINGAPORE_IMAGES['city-hall']
  }
  
  // PRIORITY 5: National Day/Singapore Celebration Content
  if (title.includes('national day') || title.includes('independence') || title.includes('celebrating national day')) {
    return LOCAL_SINGAPORE_IMAGES['national-day']
  }
  
  if (title.includes('singapore flag') || title.includes('merlion')) {
    return LOCAL_SINGAPORE_IMAGES['flag-celebration']
  }
  
  if (title.includes('merlion') || title.includes('landmark')) {
    return LOCAL_SINGAPORE_IMAGES['merlion']
  }
  
  // PRIORITY 6: Investment/Market Analysis (Use Local Singapore CBD/Skyline)
  if (title.includes('invest') || title.includes('market') || title.includes('analysis') || title.includes('outlook')) {
    return LOCAL_SINGAPORE_IMAGES['business-district']
  }
  
  if (title.includes('marina bay') || title.includes('cbd')) {
    return LOCAL_SINGAPORE_IMAGES['marina-bay-skyline']
  }
  
  if (title.includes('skyline') || title.includes('cityscape')) {
    return LOCAL_SINGAPORE_IMAGES['marina-bay-night']
  }
  
  // PRIORITY 7: Category-Based Fallbacks (Local Singapore Context)
  const category = (article?.category || '').toLowerCase()
  
  if (category.includes('market') || category.includes('insight')) {
    return LOCAL_SINGAPORE_IMAGES['marina-bay-skyline']
  }
  
  if (category.includes('buying') || category.includes('guide')) {
    return LOCAL_SINGAPORE_IMAGES['river-view']
  }
  
  if (category.includes('property') || category.includes('news')) {
    return LOCAL_SINGAPORE_IMAGES['cbd-buildings']
  }
  
  if (category.includes('condo') || category.includes('new launch')) {
    return LOCAL_SINGAPORE_IMAGES['modern-condo']
  }
  
  // PRIORITY 8: Absolute Fallback - Singapore Marina Bay Skyline
  return LOCAL_SINGAPORE_IMAGES['default']
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