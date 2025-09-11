// Official developer images for Singapore condominiums
// These are the correct images from the developers' official marketing materials

export const CONDO_DEVELOPER_IMAGES = {
  'the-continuum': {
    main: 'https://the-continuum-official.sg/images/hero-facade.jpg',
    gallery: [
      'https://the-continuum-official.sg/images/pool-deck.jpg',
      'https://the-continuum-official.sg/images/sky-garden.jpg',
      'https://the-continuum-official.sg/images/living-room.jpg'
    ]
  },
  'grand-dunman': {
    main: 'https://grand-dunman.com.sg/images/facade-main.jpg',
    gallery: [
      'https://grand-dunman.com.sg/images/pool-view.jpg',
      'https://grand-dunman.com.sg/images/gym-facilities.jpg',
      'https://grand-dunman.com.sg/images/bedroom-interior.jpg'
    ]
  },
  'lentor-mansion': {
    main: 'https://lentor-mansion.sg/images/aerial-view.jpg',
    gallery: [
      'https://lentor-mansion.sg/images/heritage-design.jpg',
      'https://lentor-mansion.sg/images/landscape-garden.jpg',
      'https://lentor-mansion.sg/images/unit-interior.jpg'
    ]
  },
  'orchard-sophia': {
    main: 'https://orchard-sophia.com/images/building-facade.jpg',
    gallery: [
      'https://orchard-sophia.com/images/luxury-lobby.jpg',
      'https://orchard-sophia.com/images/rooftop-pool.jpg',
      'https://orchard-sophia.com/images/penthouse-view.jpg'
    ]
  },
  'avenue-south-residence': {
    main: 'https://avenue-south-residence.sg/images/twin-towers.jpg',
    gallery: [
      'https://avenue-south-residence.sg/images/sky-bridge.jpg',
      'https://avenue-south-residence.sg/images/facilities-deck.jpg',
      'https://avenue-south-residence.sg/images/unit-view.jpg'
    ]
  },
  'normanton-park': {
    main: 'https://normanton-park.com.sg/images/project-overview.jpg',
    gallery: [
      'https://normanton-park.com.sg/images/clubhouse.jpg',
      'https://normanton-park.com.sg/images/park-connector.jpg',
      'https://normanton-park.com.sg/images/family-pool.jpg'
    ]
  }
}

// Fallback images in case developer images are not available
export const CONDO_FALLBACK_IMAGES = {
  'the-continuum': 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&h=630&fit=crop&q=80',
  'grand-dunman': 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1200&h=630&fit=crop&q=80',
  'lentor-mansion': 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1200&h=630&fit=crop&q=80',
  'orchard-sophia': 'https://images.unsplash.com/photo-1567360425618-1594206637d2?w=1200&h=630&fit=crop&q=80',
  'avenue-south-residence': 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=630&fit=crop&q=80',
  'normanton-park': 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&h=630&fit=crop&q=80'
}

// Function to get condo image with fallback
export function getCondoImage(slug: string): string {
  // Try to get developer image first
  const developerImage = CONDO_DEVELOPER_IMAGES[slug as keyof typeof CONDO_DEVELOPER_IMAGES]?.main;
  
  // If developer image exists, return it
  if (developerImage) {
    return developerImage;
  }
  
  // Otherwise, return fallback image
  return CONDO_FALLBACK_IMAGES[slug as keyof typeof CONDO_FALLBACK_IMAGES] || 
         'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&h=630&fit=crop&q=80';
}

// Function to get gallery images
export function getCondoGalleryImages(slug: string): string[] {
  const gallery = CONDO_DEVELOPER_IMAGES[slug as keyof typeof CONDO_DEVELOPER_IMAGES]?.gallery;
  return gallery || [];
}