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

// REMOVED: Static image mapping replaced with dynamic matching using LOCAL_SINGAPORE_IMAGES
// All images now use the getArticleImage() function for proper content-based selection

// Comprehensive Singapore Property Image Selection - Using Local Images
export function getArticleImage(article: { slug?: string; category?: string; title?: string }): string {
  const title = (article?.title || '').toLowerCase()
  const slug = (article?.slug || '').toLowerCase()
  const category = (article?.category || '').toLowerCase()
  
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
  if (title.includes('hdb') || title.includes('flat') || title.includes('bto') || title.includes('public housing') || title.includes('resale')) {
    if (title.includes('toa payoh') || title.includes('district 12') || title.includes('balestier')) {
      return LOCAL_SINGAPORE_IMAGES['hdb-toa-payoh']
    }
    if (title.includes('mature') || title.includes('established') || title.includes('old estate')) {
      return LOCAL_SINGAPORE_IMAGES['hdb-mature-estate']
    }
    return LOCAL_SINGAPORE_IMAGES['hdb-blocks']
  }
  
  // PRIORITY 3: District-Specific Content (Use Local District Photos)
  if (title.includes('district 2') || title.includes('tanjong pagar') || title.includes('anson') || title.includes('downtown core')) {
    return LOCAL_SINGAPORE_IMAGES['district-2-tanjong-pagar']
  }
  
  if (title.includes('district 9') || title.includes('orchard') || title.includes('shopping') || title.includes('retail')) {
    return LOCAL_SINGAPORE_IMAGES['district-9-orchard']
  }
  
  if (title.includes('district 10') || title.includes('tanglin') || title.includes('embassy')) {
    return LOCAL_SINGAPORE_IMAGES['business-district']
  }
  
  if (title.includes('district 12') || title.includes('balestier') || title.includes('toa payoh') || title.includes('serangoon')) {
    return LOCAL_SINGAPORE_IMAGES['hdb-toa-payoh']
  }
  
  // PRIORITY 4: Policy/Government Content (Use Local Government Buildings)
  if (title.includes('cooling') || title.includes('policy') || title.includes('absd') || title.includes('measures') || title.includes('regulation') || title.includes('tax')) {
    return LOCAL_SINGAPORE_IMAGES['parliament']
  }
  
  if (title.includes('ura') || title.includes('urban redevelopment') || title.includes('planning')) {
    return LOCAL_SINGAPORE_IMAGES['city-hall']
  }
  
  if (title.includes('parliament') || title.includes('government') || title.includes('minister')) {
    return LOCAL_SINGAPORE_IMAGES['parliament']
  }
  
  if (title.includes('mas') || title.includes('monetary authority') || title.includes('central bank')) {
    return LOCAL_SINGAPORE_IMAGES['city-hall']
  }
  
  // PRIORITY 5: National Day/Singapore Celebration Content
  if (title.includes('national day') || title.includes('independence') || title.includes('celebrating national day') || title.includes('singapore day')) {
    return LOCAL_SINGAPORE_IMAGES['national-day']
  }
  
  if (title.includes('singapore flag') || title.includes('celebration') || title.includes('patriotic')) {
    return LOCAL_SINGAPORE_IMAGES['flag-celebration']
  }
  
  if (title.includes('merlion') || title.includes('landmark') || title.includes('tourist')) {
    return LOCAL_SINGAPORE_IMAGES['merlion']
  }
  
  // PRIORITY 6: Private Condominiums/New Launches
  if (title.includes('condo') || title.includes('condominium') || title.includes('new launch') || title.includes('private') || title.includes('development')) {
    if (title.includes('luxury') || title.includes('premium') || title.includes('high-end')) {
      return LOCAL_SINGAPORE_IMAGES['luxury-condo']
    }
    if (title.includes('waterfront') || title.includes('sea view') || title.includes('marina')) {
      return LOCAL_SINGAPORE_IMAGES['waterfront-condo']
    }
    if (title.includes('high-rise') || title.includes('tower') || title.includes('tall')) {
      return LOCAL_SINGAPORE_IMAGES['high-rise-residential']
    }
    return LOCAL_SINGAPORE_IMAGES['modern-condo']
  }
  
  // PRIORITY 7: Investment/Market Analysis (Use Local Singapore CBD/Skyline)
  if (title.includes('invest') || title.includes('market') || title.includes('analysis') || title.includes('outlook') || title.includes('trends') || title.includes('forecast')) {
    if (title.includes('night') || title.includes('evening') || title.includes('after dark')) {
      return LOCAL_SINGAPORE_IMAGES['marina-bay-night']
    }
    return LOCAL_SINGAPORE_IMAGES['business-district']
  }
  
  if (title.includes('marina bay') || title.includes('cbd') || title.includes('financial district')) {
    return LOCAL_SINGAPORE_IMAGES['marina-bay-skyline']
  }
  
  if (title.includes('skyline') || title.includes('cityscape') || title.includes('panorama')) {
    if (title.includes('night') || title.includes('evening')) {
      return LOCAL_SINGAPORE_IMAGES['marina-bay-night']
    }
    return LOCAL_SINGAPORE_IMAGES['skyline-day']
  }
  
  if (title.includes('river') || title.includes('waterfront') || title.includes('quay')) {
    return LOCAL_SINGAPORE_IMAGES['river-view']
  }
  
  // PRIORITY 8: Category-Based Fallbacks (Local Singapore Context)
  if (category.includes('market') || category.includes('insight') || category.includes('analysis')) {
    return LOCAL_SINGAPORE_IMAGES['marina-bay-skyline']
  }
  
  if (category.includes('buying') || category.includes('guide') || category.includes('tips')) {
    return LOCAL_SINGAPORE_IMAGES['river-view']
  }
  
  if (category.includes('property') || category.includes('news') || category.includes('update')) {
    return LOCAL_SINGAPORE_IMAGES['cbd-buildings']
  }
  
  if (category.includes('condo') || category.includes('new launch') || category.includes('development')) {
    return LOCAL_SINGAPORE_IMAGES['modern-condo']
  }
  
  if (category.includes('hdb') || category.includes('public') || category.includes('flat')) {
    return LOCAL_SINGAPORE_IMAGES['hdb-blocks']
  }
  
  if (category.includes('district') || category.includes('location') || category.includes('area')) {
    return LOCAL_SINGAPORE_IMAGES['business-district']
  }
  
  // PRIORITY 9: Absolute Fallback - Singapore Marina Bay Skyline
  return LOCAL_SINGAPORE_IMAGES['default']
}

// Export a modified version that ensures valid local image paths
const originalGetArticleImage = getArticleImage;
export function getArticleImageSafe(article: { slug?: string; category?: string; title?: string }): string {
  const result = originalGetArticleImage(article);
  
  // Ensure we always return a valid local path - all our images are local now
  if (!result || result.startsWith('http')) {
    return LOCAL_SINGAPORE_IMAGES['default'];
  }
  
  return result;
}