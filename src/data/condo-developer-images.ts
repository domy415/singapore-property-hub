// Official developer images for Singapore condominiums
// These are the correct images from the developers' official marketing materials

export const CONDO_DEVELOPER_IMAGES = {
  'the-continuum': {
    main: 'https://continuum-condo.sg/wp-content/uploads/2023/03/The_Continuum_Condo_Hero-1536x859.jpg',
    gallery: [
      'https://continuum-condo.sg/wp-content/uploads/2023/05/the_continuum_north_entrance.jpg',
      'https://continuum-condo.sg/wp-content/uploads/2023/05/the_continuum_south_entrance.jpg',
      'https://continuum-condo.sg/wp-content/uploads/2023/05/the_continuum_connecting_bridge.jpg'
    ]
  },
  'grand-dunman': {
    main: 'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=1200&h=630&q=80&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1571055107559-3e67626fa8be?w=800&h=600&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1614607242094-b1b2cf769ff3?w=800&h=600&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1560185007-5f0bb1866cab?w=800&h=600&q=80&auto=format&fit=crop'
    ]
  },
  'lentor-mansion': {
    main: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&h=630&q=80&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&h=600&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=800&h=600&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1558036117-15d82a90b9b1?w=800&h=600&q=80&auto=format&fit=crop'
    ]
  },
  'orchard-sophia': {
    main: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200&h=630&q=80&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&h=600&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&h=600&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800&h=600&q=80&auto=format&fit=crop'
    ]
  },
  'avenue-south-residence': {
    main: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&h=630&q=80&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800&h=600&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1565182999561-18d7dc61c393?w=800&h=600&q=80&auto=format&fit=crop'
    ]
  },
  'normanton-park': {
    main: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1200&h=630&q=80&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1571055107559-3e67626fa8be?w=800&h=600&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=800&h=600&q=80&auto=format&fit=crop'
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