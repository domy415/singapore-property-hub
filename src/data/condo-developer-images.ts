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
    main: 'https://thegranddunman.sg/wp-content/uploads/2023/07/Grand_Dunamn_Gallery_Img_-1-scaled.jpg',
    gallery: [
      'https://thegranddunman.sg/wp-content/uploads/2023/07/Grand_Dunamn_Gallery_Img_-2-scaled.jpg',
      'https://thegranddunman.sg/wp-content/uploads/2023/07/Grand_Dunamn_Gallery_Img_-3-scaled.jpg',
      'https://thegranddunman.sg/wp-content/uploads/2023/07/Grand_Dunamn_Gallery_Img_-4-scaled.jpg'
    ]
  },
  'lentor-mansion': {
    main: 'https://lentor-mansion.com.sg/wp-content/uploads/2024/03/LentorMansion-Slider-1.jpg',
    gallery: [
      'https://lentor-mansion.com.sg/wp-content/uploads/2024/03/LentorMansion-Slider-2.jpg',
      'https://lentor-mansion.com.sg/wp-content/uploads/2024/03/LentorMansion-Slider-3.jpg',
      'https://lentor-mansion.com.sg/wp-content/uploads/2024/03/LentorMansion-Banner-2a.jpg'
    ]
  },
  'orchard-sophia': {
    main: 'https://orchard-sophia.sg/wp-content/uploads/2023/07/Orchard-Sophia-Facade-View-from-Entrance.jpg',
    gallery: [
      'https://orchard-sophia.sg/wp-content/uploads/2023/07/Orchard-Sophia-Facade-View-from-Entrance.jpg',
      'https://orchardsophia-official.sg/wp-content/uploads/2023/06/OrchardSophia-Logo.jpg',
      'https://orchard-sophia.sg/wp-content/uploads/2023/07/Orchard-Sophia-Facade-View-from-Entrance.jpg'
    ]
  },
  'avenue-south-residence': {
    main: 'https://avenue-south.sg/wp-content/uploads/2023/07/Avenue-South-Residence-Perspective.jpg',
    gallery: [
      'https://avenue-south.sg/wp-content/uploads/2023/07/Avenue-South-Residence-Perspective.jpg',
      'https://avenue-south.sg/wp-content/uploads/2019/10/Avenue-South-Logo.png',
      'https://avenue-south.sg/wp-content/uploads/2023/07/Avenue-South-Residence-Perspective.jpg'
    ]
  },
  'normanton-park': {
    main: 'https://normanton-park.sg/wp-content/uploads/2023/07/Normanton-Park-Aerial-View.jpg',
    gallery: [
      'https://normanton-park.sg/wp-content/uploads/2023/07/Normanton-Park-Aerial-View.jpg',
      'https://normanton-park.sg/wp-content/uploads/2023/07/Normanton-Park-Aerial-View.jpg',
      'https://normanton-park.sg/wp-content/uploads/2023/07/Normanton-Park-Aerial-View.jpg'
    ]
  }
}

// Fallback images - use developer images as fallback (never stock photos)
export const CONDO_FALLBACK_IMAGES = {
  'the-continuum': 'https://continuum-condo.sg/wp-content/uploads/2023/03/The_Continuum_Condo_Hero-1536x859.jpg',
  'grand-dunman': 'https://thegranddunman.sg/wp-content/uploads/2023/07/Grand_Dunamn_Gallery_Img_-1-scaled.jpg',
  'lentor-mansion': 'https://lentor-mansion.com.sg/wp-content/uploads/2024/03/LentorMansion-Slider-1.jpg',
  'orchard-sophia': 'https://orchard-sophia.sg/wp-content/uploads/2023/07/Orchard-Sophia-Facade-View-from-Entrance.jpg',
  'avenue-south-residence': 'https://avenue-south.sg/wp-content/uploads/2023/07/Avenue-South-Residence-Perspective.jpg',
  'normanton-park': 'https://normanton-park.sg/wp-content/uploads/2023/07/Normanton-Park-Aerial-View.jpg'
}

// Function to get condo image with fallback
export function getCondoImage(slug: string): string {
  // Try to get developer image first
  const developerImage = CONDO_DEVELOPER_IMAGES[slug as keyof typeof CONDO_DEVELOPER_IMAGES]?.main;
  
  // If developer image exists, return it
  if (developerImage) {
    return developerImage;
  }
  
  // Otherwise, return fallback image (never stock photos)
  return CONDO_FALLBACK_IMAGES[slug as keyof typeof CONDO_FALLBACK_IMAGES] || 
         '/images/condos/default-condo.jpg';
}

// Function to get gallery images
export function getCondoGalleryImages(slug: string): string[] {
  const gallery = CONDO_DEVELOPER_IMAGES[slug as keyof typeof CONDO_DEVELOPER_IMAGES]?.gallery;
  return gallery || [];
}