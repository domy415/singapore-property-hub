'use client'

import { useState } from 'react'
import { CONDO_DEVELOPER_IMAGES, CONDO_FALLBACK_IMAGES } from '@/data/condo-developer-images'

interface CondoImageGalleryProps {
  images: string[]
  condoName: string
  condoSlug?: string
}

export default function CondoImageGallery({ images, condoName, condoSlug }: CondoImageGalleryProps) {
  const [mainImage, setMainImage] = useState(0)
  
  // Use developer images if available, otherwise fallback to provided images
  const getDeveloperImages = () => {
    if (condoSlug && CONDO_DEVELOPER_IMAGES[condoSlug as keyof typeof CONDO_DEVELOPER_IMAGES]) {
      const developerData = CONDO_DEVELOPER_IMAGES[condoSlug as keyof typeof CONDO_DEVELOPER_IMAGES]
      return [developerData.main, ...developerData.gallery]
    }
    return null
  }
  
  // Priority: 1) Developer images, 2) Provided images, 3) Fallback from developer images data
  const validImages = getDeveloperImages() || 
    (images?.length > 0 ? images : 
      (condoSlug && CONDO_FALLBACK_IMAGES[condoSlug as keyof typeof CONDO_FALLBACK_IMAGES] 
        ? [CONDO_FALLBACK_IMAGES[condoSlug as keyof typeof CONDO_FALLBACK_IMAGES]]
        : ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&q=80&auto=format&fit=crop'])
    )
  
  return (
    <div>
      {/* Main Image */}
      <div className="relative aspect-[16/9] mb-4 bg-gray-100 rounded-lg overflow-hidden">
        <img
          src={validImages[mainImage]}
          alt={`${condoName} - Image ${mainImage + 1}`}
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Thumbnail Strip */}
      <div className="grid grid-cols-4 gap-2">
        {validImages.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setMainImage(idx)}
            className={`relative aspect-[16/9] rounded-md overflow-hidden border-2 transition-all duration-200 hover:opacity-90 ${
              mainImage === idx ? 'border-blue-500 shadow-lg' : 'border-transparent'
            }`}
          >
            <img
              src={img}
              alt={`Thumbnail ${idx + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  )
}