'use client'

import Link from 'next/link'

// Condo projects data
const condoProjects = [
  {
    id: 'the-continuum',
    name: 'The Continuum',
    slug: 'the-continuum',
    developer: 'Hoi Hup Realty & Sunway Development',
    district: 15,
    region: 'RCR',
    status: 'Recent',
    rating: 4.5,
    priceFrom: '$1.6M',
    pricePsf: '$1,800 psf',
    tenure: 'Freehold',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop'
  },
  {
    id: 'grand-dunman',
    name: 'Grand Dunman',
    slug: 'grand-dunman',
    developer: 'SingHaiyi Group',
    district: 15,
    region: 'RCR',
    status: 'TOP',
    rating: 4.3,
    priceFrom: '$1.4M',
    pricePsf: '$1,650 psf',
    tenure: 'Freehold',
    image: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&h=600&fit=crop'
  },
  {
    id: 'lentor-mansion',
    name: 'Lentor Mansion',
    slug: 'lentor-mansion',
    developer: 'GuocolLand & Hong Leong',
    district: 26,
    region: 'OCR',
    status: 'Upcoming',
    rating: 4.6,
    priceFrom: '$1.1M',
    pricePsf: '$1,400 psf',
    tenure: 'Freehold',
    image: 'https://images.unsplash.com/photo-1565967511849-76a60a516170?w=800&h=600&fit=crop'
  },
  {
    id: 'orchard-sophia',
    name: 'Orchard Sophia',
    slug: 'orchard-sophia',
    developer: 'Far East Organization',
    district: 9,
    region: 'CCR',
    status: 'Recent',
    rating: 4.8,
    priceFrom: '$2.8M',
    pricePsf: '$2,200 psf',
    tenure: 'Freehold',
    image: 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&h=600&fit=crop'
  },
  {
    id: 'avenue-south-residence',
    name: 'Avenue South Residence',
    slug: 'avenue-south-residence',
    developer: 'UOL Group',
    district: 4,
    region: 'CCR',
    status: 'TOP',
    rating: 4.4,
    priceFrom: '$1.9M',
    pricePsf: '$1,900 psf',
    tenure: '99-year',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop'
  },
  {
    id: 'normanton-park',
    name: 'Normanton Park',
    slug: 'normanton-park',
    developer: 'Kingsford Development',
    district: 5,
    region: 'RCR',
    status: 'TOP',
    rating: 4.2,
    priceFrom: '$1.5M',
    pricePsf: '$1,750 psf',
    tenure: '99-year',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop'
  }
]

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-4 h-4 ${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="text-sm font-medium text-gray-700 ml-1">{rating}</span>
    </div>
  )
}

export default function CondosPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Singapore Condo Reviews</h1>
            <p className="text-xl text-blue-100 leading-relaxed">
              Comprehensive reviews of Singapore's top condominium developments. Get expert insights, detailed analysis, and honest assessments to make informed property decisions.
            </p>
          </div>
        </div>
      </div>

      {/* Condos Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Featured Condo Reviews</h2>
          <p className="text-gray-600">In-depth reviews of Singapore's most sought-after condominium developments</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {condoProjects.map((project) => (
            <Link 
              key={project.id}
              href={`/condos/${project.slug}/review-2025`}
              className="group"
            >
              <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium text-white ${
                      project.status === 'Recent' ? 'bg-green-500' :
                      project.status === 'Upcoming' ? 'bg-blue-500' :
                      'bg-orange-500'
                    }`}>
                      {project.status}
                    </span>
                    <StarRating rating={project.rating} />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                    {project.name}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-3">{project.developer}</p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>{project.region} • District {project.district}</span>
                    <span>{project.tenure}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg font-bold text-blue-600">{project.priceFrom}</div>
                      <div className="text-sm text-gray-500">{project.pricePsf}</div>
                    </div>
                    <div className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium group-hover:bg-blue-700 transition-colors">
                      Read Review
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white py-16 border-t">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Looking for More Condo Reviews?</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Can't find the condo you're interested in? Get in touch with our property experts for personalized advice and detailed insights on any Singapore development.
          </p>
          <Link 
            href="/contact"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Request Custom Review
          </Link>
        </div>
      </div>
    </div>
  )
}