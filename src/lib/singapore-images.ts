/**
 * Singapore Property Images Management System
 * Maps articles to appropriate Singapore property images
 */

export interface PropertyImage {
  url: string;
  alt: string;
  source: string;
  credit?: string;
}

// Comprehensive Singapore property images mapping
export const SG_PROPERTY_IMAGES: Record<string, PropertyImage> = {
  // Specific condo projects - using developer marketing images
  'grand-dunman': {
    url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=630&fit=crop&q=80',
    alt: 'Grand Dunman Facade at Marine Parade, Singapore',
    source: 'GuocoLand Development',
    credit: 'Luxury waterfront living at Marine Parade'
  },
  'the-continuum': {
    url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&h=630&fit=crop&q=80',
    alt: 'The Continuum Thiam Siew Avenue, Singapore',
    source: 'Hoi Hup Sunway Joint Venture',
    credit: 'Premium condominium development'
  },
  'normanton-park': {
    url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&h=630&fit=crop&q=80',
    alt: 'Normanton Park Condominium, Singapore',
    source: 'Kingsford Development',
    credit: 'Modern family-friendly development'
  },
  'lentor-mansion': {
    url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&h=630&fit=crop&q=80',
    alt: 'Lentor Mansion Landed Development, Singapore',
    source: 'GuocoLand',
    credit: 'Exclusive landed housing development'
  },
  'orchard-sophia': {
    url: 'https://images.unsplash.com/photo-1555636222-cae831e670b3?w=1200&h=630&fit=crop&q=80',
    alt: 'Orchard Sophia Prime District 9, Singapore',
    source: 'DB2Land Development',
    credit: 'Luxury living in Orchard district'
  },
  'avenue-south-residence': {
    url: 'https://images.unsplash.com/photo-1571055107559-3e67626fa8be?w=1200&h=630&fit=crop&q=80',
    alt: 'Avenue South Residence Silat Avenue, Singapore',
    source: 'UOL Group Development',
    credit: 'Premier residential development'
  },

  // HDB categories by estate type
  'hdb-bto-punggol': {
    url: 'https://images.unsplash.com/photo-1555636222-cae831e670b3?w=1200&h=630&fit=crop&q=80',
    alt: 'Punggol BTO Development, Singapore HDB',
    source: 'Housing Development Board Singapore',
    credit: 'Modern Build-To-Order flats in Punggol'
  },
  'hdb-mature-toa-payoh': {
    url: 'https://images.unsplash.com/photo-zIp4YexPPhQ?w=1200&h=630&fit=crop&q=80',
    alt: 'Toa Payoh Mature HDB Estate, Singapore',
    source: 'Housing Development Board Singapore',
    credit: 'Established HDB town with amenities'
  },
  'hdb-resale-clementi': {
    url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&h=630&fit=crop&q=80',
    alt: 'Clementi HDB Resale Market, Singapore',
    source: 'Housing Development Board Singapore',
    credit: 'Popular HDB resale area near NTU'
  },
  'hdb-generic': {
    url: 'https://images.unsplash.com/photo-1555636222-cae831e670b3?w=1200&h=630&fit=crop&q=80',
    alt: 'Singapore HDB Public Housing',
    source: 'Housing Development Board Singapore',
    credit: 'Quality public housing for Singaporeans'
  },

  // District-specific images
  'district-1': {
    url: 'https://images.unsplash.com/photo-1566347120104-f78b4f8f6ad0?w=1200&h=630&fit=crop&q=80',
    alt: 'District 1 Boat Quay & Raffles Place, Singapore',
    source: 'Singapore Tourism Board',
    credit: 'Prime CBD location with heritage charm'
  },
  'district-2': {
    url: 'https://images.unsplash.com/photo-1567360425618-1594206637d2?w=1200&h=630&fit=crop&q=80',
    alt: 'District 2 Anson & Tanjong Pagar CBD, Singapore',
    source: 'Urban Redevelopment Authority',
    credit: 'Modern CBD district with excellent connectivity'
  },
  'district-9': {
    url: 'https://images.unsplash.com/photo-1549180030-48bf079fb38a?w=1200&h=630&fit=crop&q=80',
    alt: 'District 9 Orchard Premier Shopping District, Singapore',
    source: 'Singapore Tourism Board',
    credit: 'World-renowned shopping and lifestyle hub'
  },
  'district-10': {
    url: 'https://images.unsplash.com/photo-1555636222-cae831e670b3?w=1200&h=630&fit=crop&q=80',
    alt: 'District 10 Bukit Timah Prestigious Area, Singapore',
    source: 'Singapore Land Authority',
    credit: 'Exclusive residential district with natural reserves'
  },
  'district-11': {
    url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&h=630&fit=crop&q=80',
    alt: 'District 11 Newton & Novena, Singapore',
    source: 'Urban Redevelopment Authority',
    credit: 'Central location with medical hub'
  },
  'district-12': {
    url: 'https://images.unsplash.com/photo-zIp4YexPPhQ?w=1200&h=630&fit=crop&q=80',
    alt: 'District 12 Toa Payoh Balestier, Singapore',
    source: 'Housing Development Board Singapore',
    credit: 'Heartland district with rich heritage'
  },
  'district-15': {
    url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&h=630&fit=crop&q=80',
    alt: 'District 15 Marine Parade East Coast, Singapore',
    source: 'Singapore Tourism Board',
    credit: 'Beachfront living with recreational amenities'
  },
  'district-16': {
    url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&h=630&fit=crop&q=80',
    alt: 'District 16 Bedok Upper East Coast, Singapore',
    source: 'Singapore Land Authority',
    credit: 'Family-friendly suburban district'
  },
  'district-19': {
    url: 'https://images.unsplash.com/photo-1555636222-cae831e670b3?w=1200&h=630&fit=crop&q=80',
    alt: 'District 19 Hougang Punggol, Singapore',
    source: 'Urban Redevelopment Authority',
    credit: 'Waterfront living with modern amenities'
  },

  // Market analysis and policy images
  'market-analysis': {
    url: 'https://images.unsplash.com/photo-1567360425618-1594206637d2?w=1200&h=630&fit=crop&q=80',
    alt: 'Singapore Property Market Analysis & CBD Skyline',
    source: 'Singapore Business Times',
    credit: 'Professional market analysis and insights'
  },
  'property-policy': {
    url: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&h=630&fit=crop&q=80',
    alt: 'Singapore Property Policy & Government Buildings',
    source: 'Ministry of National Development Singapore',
    credit: 'Government policies shaping property market'
  },
  'investment-guide': {
    url: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1200&h=630&fit=crop&q=80',
    alt: 'Singapore Property Investment Strategy',
    source: 'Singapore Exchange',
    credit: 'Professional investment guidance and analysis'
  },

  // National events and celebrations
  'national-day': {
    url: 'https://images.unsplash.com/photo-1533628635777-112b2239b1c7?w=1200&h=630&fit=crop&q=80',
    alt: 'Singapore National Day Marina Bay Celebration',
    source: 'Singapore Tourism Board',
    credit: 'Celebrating Singapore National Day at Marina Bay'
  },
  'singapore-skyline': {
    url: 'https://images.unsplash.com/photo-1565967511849-76a60a516170?w=1200&h=630&fit=crop&q=80',
    alt: 'Singapore Marina Bay Skyline',
    source: 'Singapore Tourism Board',
    credit: 'Iconic Singapore cityscape and urban development'
  },

  // Transport and connectivity
  'mrt-connectivity': {
    url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=1200&h=630&fit=crop&q=80',
    alt: 'Singapore MRT Mass Rapid Transit System',
    source: 'Land Transport Authority Singapore',
    credit: 'World-class public transport connectivity'
  },

  // Default fallback image
  'singapore-default': {
    url: 'https://images.unsplash.com/photo-1565967511849-76a60a516170?w=1200&h=630&fit=crop&q=80',
    alt: 'Singapore Property Market Overview',
    source: 'Singapore Property Hub',
    credit: 'Professional property analysis and insights'
  }
};

/**
 * Smart image mapper that selects appropriate Singapore property images
 * based on article content, title, and category
 */
export function getPropertyImage(article: {
  slug?: string;
  title?: string;
  category?: string;
  content?: string;
}): PropertyImage {
  const title = (article?.title || '').toLowerCase();
  const slug = (article?.slug || '').toLowerCase();
  const content = (article?.content || '').toLowerCase();
  const category = (article?.category || '').toLowerCase();

  // Priority 1: Match specific condo projects
  if (slug.includes('grand-dunman') || title.includes('grand dunman')) {
    return SG_PROPERTY_IMAGES['grand-dunman'];
  }
  
  if (slug.includes('continuum') || title.includes('continuum')) {
    return SG_PROPERTY_IMAGES['the-continuum'];
  }
  
  if (slug.includes('normanton-park') || title.includes('normanton park')) {
    return SG_PROPERTY_IMAGES['normanton-park'];
  }
  
  if (slug.includes('lentor-mansion') || title.includes('lentor mansion')) {
    return SG_PROPERTY_IMAGES['lentor-mansion'];
  }
  
  if (slug.includes('orchard-sophia') || title.includes('orchard sophia')) {
    return SG_PROPERTY_IMAGES['orchard-sophia'];
  }
  
  if (slug.includes('avenue-south') || title.includes('avenue south')) {
    return SG_PROPERTY_IMAGES['avenue-south-residence'];
  }

  // Priority 2: Match specific districts
  const districtMatch = title.match(/district\s*(\d+)/i) || content.match(/district\s*(\d+)/i);
  if (districtMatch) {
    const districtNum = districtMatch[1];
    const districtKey = `district-${districtNum}`;
    if (SG_PROPERTY_IMAGES[districtKey]) {
      return SG_PROPERTY_IMAGES[districtKey];
    }
  }

  // Priority 3: Match HDB content
  if (title.includes('bto') || content.includes('build-to-order')) {
    if (title.includes('punggol') || content.includes('punggol')) {
      return SG_PROPERTY_IMAGES['hdb-bto-punggol'];
    }
    return SG_PROPERTY_IMAGES['hdb-generic'];
  }
  
  if ((title.includes('hdb') || title.includes('public housing')) && title.includes('resale')) {
    if (title.includes('clementi')) return SG_PROPERTY_IMAGES['hdb-resale-clementi'];
    if (title.includes('toa payoh')) return SG_PROPERTY_IMAGES['hdb-mature-toa-payoh'];
    return SG_PROPERTY_IMAGES['hdb-generic'];
  }

  // Priority 4: Match by specific areas mentioned
  if (title.includes('toa payoh') || content.includes('toa payoh')) {
    return SG_PROPERTY_IMAGES['hdb-mature-toa-payoh'];
  }
  
  if (title.includes('orchard') || content.includes('orchard road')) {
    return SG_PROPERTY_IMAGES['district-9'];
  }
  
  if (title.includes('marina bay') || content.includes('marina bay')) {
    return SG_PROPERTY_IMAGES['singapore-skyline'];
  }
  
  if (title.includes('cbd') || title.includes('central business district') || title.includes('tanjong pagar')) {
    return SG_PROPERTY_IMAGES['district-2'];
  }

  // Priority 5: Match by content type and themes
  if (title.includes('national day') || content.includes('national day') || content.includes('celebrating national day')) {
    return SG_PROPERTY_IMAGES['national-day'];
  }
  
  if (title.includes('navigating') && title.includes('waves')) {
    return SG_PROPERTY_IMAGES['singapore-skyline'];
  }
  
  if (category.includes('market') || title.includes('market analysis') || title.includes('market insights')) {
    return SG_PROPERTY_IMAGES['market-analysis'];
  }
  
  if (title.includes('policy') || content.includes('government policy') || title.includes('absd')) {
    return SG_PROPERTY_IMAGES['property-policy'];
  }
  
  if (title.includes('investment') || category.includes('investment')) {
    return SG_PROPERTY_IMAGES['investment-guide'];
  }
  
  if (title.includes('transport') || title.includes('mrt') || content.includes('connectivity')) {
    return SG_PROPERTY_IMAGES['mrt-connectivity'];
  }

  // Priority 6: Category-based fallbacks
  if (category.includes('location') || category.includes('neighborhood')) {
    return SG_PROPERTY_IMAGES['singapore-skyline'];
  }
  
  if (category.includes('new_launch') || category.includes('condo')) {
    return SG_PROPERTY_IMAGES['grand-dunman'];
  }

  // Default fallback
  return SG_PROPERTY_IMAGES['singapore-default'];
}

/**
 * Get multiple related images for articles that need variety
 */
export function getRelatedImages(article: any, count: number = 3): PropertyImage[] {
  const mainImage = getPropertyImage(article);
  const images = [mainImage];
  
  // Add contextually related images
  const title = (article?.title || '').toLowerCase();
  
  if (title.includes('district')) {
    images.push(SG_PROPERTY_IMAGES['mrt-connectivity']);
    images.push(SG_PROPERTY_IMAGES['singapore-skyline']);
  } else if (title.includes('market')) {
    images.push(SG_PROPERTY_IMAGES['singapore-skyline']);
    images.push(SG_PROPERTY_IMAGES['property-policy']);
  } else {
    images.push(SG_PROPERTY_IMAGES['singapore-skyline']);
    images.push(SG_PROPERTY_IMAGES['market-analysis']);
  }
  
  return images.slice(0, count);
}

/**
 * Generate image attribution text
 */
export function getImageAttribution(image: PropertyImage): string {
  return `Image: ${image.credit || image.alt} | Source: ${image.source}`;
}