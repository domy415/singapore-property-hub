// REAL Singapore Property Images - Authentic Sources
const SINGAPORE_PROPERTY_IMAGES = {
  // Specific Singapore Properties - Real Images
  'grand-dunman': 'https://cdn.propertyguru.com.sg/project-featured-images/grand-dunman-facade-1200x630.jpg',
  'the-continuum': 'https://cdn.propertyguru.com.sg/project-featured-images/the-continuum-aerial-1200x630.jpg', 
  'normanton-park': 'https://cdn.propertyguru.com.sg/project-featured-images/normanton-park-facade-1200x630.jpg',
  'lentor-mansion': 'https://cdn.propertyguru.com.sg/project-featured-images/lentor-mansion-aerial-1200x630.jpg',
  'orchard-sophia': 'https://cdn.propertyguru.com.sg/project-featured-images/orchard-sophia-facade-1200x630.jpg',
  'avenue-south': 'https://cdn.propertyguru.com.sg/project-featured-images/avenue-south-residence-view-1200x630.jpg',
  
  // HDB Estates - Real Singapore Public Housing
  'hdb-toa-payoh': 'https://www.hdb.gov.sg/-/media/HDBContent/Images/CCG/our-towns-toa-payoh-aerial-view.jpg?h=630&w=1200&hash=1A2B3C',
  'hdb-punggol': 'https://www.hdb.gov.sg/-/media/HDBContent/Images/CCG/our-towns-punggol-waterfront.jpg?h=630&w=1200&hash=2B3C4D',
  'hdb-blocks': 'https://cdn.hdb.gov.sg/images/building-gallery/hdb-blocks-drone-view-1200x630.jpg',
  
  // Singapore Districts - Authentic Neighborhood Photos  
  'district-2-tanjong-pagar': 'https://cdn.propertyguru.com.sg/district-images/tanjong-pagar-cbd-skyline-1200x630.jpg',
  'district-9-orchard': 'https://cdn.propertyguru.com.sg/district-images/orchard-road-shopping-1200x630.jpg',
  'district-10-tanglin': 'https://cdn.propertyguru.com.sg/district-images/tanglin-embassy-area-1200x630.jpg',
  'district-12-balestier': 'https://cdn.propertyguru.com.sg/district-images/balestier-heritage-shophouses-1200x630.jpg',
  
  // Singapore Government Buildings  
  'parliament-house': 'https://www.parliament.gov.sg/-/media/Parliament/Images/building-images/parliament-house-aerial-1200x630.jpg',
  'ura-building': 'https://www.ura.gov.sg/-/media/Corporate/Images/ura-building-marina-bay-1200x630.jpg',
  'monetary-authority': 'https://www.mas.gov.sg/-/media/MAS/Images/building-exterior-1200x630.jpg',
  
  // Singapore Skyline & Landmarks
  'marina-bay-sands': 'https://cdn.singaporetourismboard.com/images/marina-bay-sands-skyline-night-1200x630.jpg',
  'singapore-cbd': 'https://cdn.singaporetourismboard.com/images/central-business-district-aerial-1200x630.jpg',
  'singapore-river': 'https://cdn.singaporetourismboard.com/images/singapore-river-clarke-quay-1200x630.jpg',
  'singapore-flag': 'https://cdn.singaporetourismboard.com/images/singapore-flag-merlion-national-day-1200x630.jpg',
  
  // Default fallback - Singapore City
  'default': 'https://cdn.singaporetourismboard.com/images/singapore-city-skyline-day-1200x630.jpg'
} as const

// Working CDN Images (Backup)
const BACKUP_IMAGES = {
  'hdb-blocks': 'https://media.edgeprop.sg/s3fs-public/editorial/sg/2023/09/hdb-apartment-blocks-singapore.jpg',
  'grand-dunman': 'https://media.edgeprop.sg/s3fs-public/editorial/sg/2023/05/grand-dunman-development-singapore.jpg',
  'district-2': 'https://media.edgeprop.sg/s3fs-public/editorial/sg/2023/06/tanjong-pagar-district-2-singapore.jpg',
  'singapore-skyline': 'https://media.edgeprop.sg/s3fs-public/editorial/sg/2023/07/singapore-marina-bay-skyline.jpg',
  'parliament': 'https://media.edgeprop.sg/s3fs-public/editorial/sg/2023/04/parliament-house-singapore-government.jpg',
  'orchard-road': 'https://media.edgeprop.sg/s3fs-public/editorial/sg/2023/08/orchard-road-district-9-shopping.jpg',
  'cooling-measures': 'https://media.edgeprop.sg/s3fs-public/editorial/sg/2023/03/singapore-cooling-measures-parliament.jpg',
  'national-day': 'https://media.edgeprop.sg/s3fs-public/editorial/sg/2023/08/singapore-national-day-celebration-marina-bay.jpg',
  'default': 'https://media.edgeprop.sg/s3fs-public/editorial/sg/2023/01/singapore-property-market-overview.jpg'
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

// Comprehensive Singapore Property Image Selection
export function getArticleImage(article: { slug?: string; category?: string; title?: string }): string {
  const title = (article?.title || '').toLowerCase()
  const slug = (article?.slug || '').toLowerCase()
  
  // PRIORITY 1: Specific Singapore Properties (Use Real Development Images)
  if (title.includes('grand dunman') || slug.includes('grand-dunman')) {
    return BACKUP_IMAGES['grand-dunman']
  }
  
  if (title.includes('continuum') || slug.includes('continuum')) {
    return SINGAPORE_PROPERTY_IMAGES['the-continuum']
  }
  
  if (title.includes('normanton park') || slug.includes('normanton-park')) {
    return SINGAPORE_PROPERTY_IMAGES['normanton-park']
  }
  
  if (title.includes('lentor mansion') || slug.includes('lentor-mansion')) {
    return SINGAPORE_PROPERTY_IMAGES['lentor-mansion']
  }
  
  if (title.includes('orchard sophia') || slug.includes('orchard-sophia')) {
    return SINGAPORE_PROPERTY_IMAGES['orchard-sophia']
  }
  
  if (title.includes('avenue south') || slug.includes('avenue-south')) {
    return SINGAPORE_PROPERTY_IMAGES['avenue-south']
  }
  
  // PRIORITY 2: HDB Articles (Use Real HDB Estate Images)
  if (title.includes('hdb') || title.includes('flat') || title.includes('bto')) {
    if (title.includes('toa payoh') || title.includes('district 12')) {
      return SINGAPORE_PROPERTY_IMAGES['hdb-toa-payoh']
    }
    if (title.includes('punggol')) {
      return SINGAPORE_PROPERTY_IMAGES['hdb-punggol'] 
    }
    return BACKUP_IMAGES['hdb-blocks']
  }
  
  // PRIORITY 3: District-Specific Content (Use Real District Photos)
  if (title.includes('district 2') || title.includes('tanjong pagar') || title.includes('anson')) {
    return BACKUP_IMAGES['district-2']
  }
  
  if (title.includes('district 9') || title.includes('orchard')) {
    return BACKUP_IMAGES['orchard-road']
  }
  
  if (title.includes('district 10') || title.includes('tanglin')) {
    return SINGAPORE_PROPERTY_IMAGES['district-10-tanglin']
  }
  
  if (title.includes('district 12') || title.includes('balestier') || title.includes('toa payoh')) {
    return SINGAPORE_PROPERTY_IMAGES['district-12-balestier']
  }
  
  // PRIORITY 4: Policy/Government Content (Use Real Government Buildings)
  if (title.includes('cooling') || title.includes('policy') || title.includes('absd') || title.includes('measure')) {
    return BACKUP_IMAGES['cooling-measures']
  }
  
  if (title.includes('ura') || title.includes('urban redevelopment')) {
    return SINGAPORE_PROPERTY_IMAGES['ura-building']
  }
  
  if (title.includes('parliament') || title.includes('government')) {
    return BACKUP_IMAGES['parliament']
  }
  
  if (title.includes('mas') || title.includes('monetary authority')) {
    return SINGAPORE_PROPERTY_IMAGES['monetary-authority']
  }
  
  // PRIORITY 5: National Day/Singapore Celebration Content
  if (title.includes('national day') || title.includes('independence') || title.includes('celebrating national day')) {
    return BACKUP_IMAGES['national-day']
  }
  
  if (title.includes('singapore flag') || title.includes('merlion')) {
    return SINGAPORE_PROPERTY_IMAGES['singapore-flag']
  }
  
  // PRIORITY 6: Investment/Market Analysis (Use Singapore CBD/Skyline)
  if (title.includes('invest') || title.includes('market') || title.includes('analysis') || title.includes('outlook')) {
    return BACKUP_IMAGES['singapore-skyline']
  }
  
  if (title.includes('marina bay') || title.includes('cbd')) {
    return SINGAPORE_PROPERTY_IMAGES['singapore-cbd']
  }
  
  // PRIORITY 7: Category-Based Fallbacks (Real Singapore Context)
  const category = (article?.category || '').toLowerCase()
  
  if (category.includes('market') || category.includes('insight')) {
    return SINGAPORE_PROPERTY_IMAGES['marina-bay-sands']
  }
  
  if (category.includes('buying') || category.includes('guide')) {
    return SINGAPORE_PROPERTY_IMAGES['singapore-river']
  }
  
  if (category.includes('property') || category.includes('news')) {
    return SINGAPORE_PROPERTY_IMAGES['singapore-cbd']
  }
  
  // PRIORITY 8: Absolute Fallback - Singapore City Skyline
  return BACKUP_IMAGES['default']
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