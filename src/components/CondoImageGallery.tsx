'use client'

import { useState } from 'react'
import Image from 'next/image'

interface CondoImageGalleryProps {
  images: string[]
  condoName: string
}

export default function CondoImageGallery({ images, condoName }: CondoImageGalleryProps) {
  const [mainImage, setMainImage] = useState(0)
  // Ensure we have valid images array with fallbacks
  const validImages = images?.length > 0 ? images : [
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&h=630&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&h=630&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1571055107559-3e67626fa8be?w=1200&h=630&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&h=630&q=80&auto=format&fit=crop'
  ]
  
  return (
    <div>
      {/* Main Image */}
      <div className="relative aspect-[16/9] mb-4 bg-gray-100 rounded-lg overflow-hidden">
        <Image
          src={validImages[mainImage]}
          alt={`${condoName} - Image ${mainImage + 1}`}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
        />
      </div>
      
      {/* Thumbnail Strip */}
      <div className="grid grid-cols-4 gap-2">
        {validImages.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setMainImage(idx)}
            className={`relative aspect-[16/9] rounded-md overflow-hidden border-2 transition-all duration-200 hover:opacity-90 ${
              mainImage === idx ? 'border-blue-500 shadow-lg' : 'border-transparent'
            }`}
          >
            <Image
              src={validImages[idx]}
              alt={`Thumbnail ${idx + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 25vw, 200px"
            />
          </button>
        ))}
      </div>
    </div>
  )
}