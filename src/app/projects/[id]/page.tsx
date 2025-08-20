'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

interface ProjectDetails {
  id: string
  name: string
  developer: string
  location: string
  district: number
  region: 'CCR' | 'RCR' | 'OCR'
  status: 'Recent' | 'Upcoming' | 'TOP'
  rating: number
  priceFrom: string
  pricePsf: string
  units: number
  tenure: 'Freehold' | '999-year' | '99-year'
  top: string
  images: string[]
  description: string
  keyFeatures: string[]
  nearbyAmenities: {
    mrts: string[]
    schools: string[]
    shopping: string[]
    healthcare: string[]
  }
  unitMix: {
    type: string
    size: string
    price: string
    available: number
  }[]
  pros: string[]
  cons: string[]
  investmentHighlights: string[]
  targetBuyer: string
  rentalYield: string
  expertCommentary: string
}

// This would normally come from a database or API
const projectDetails: Record<string, ProjectDetails> = {
  'the-continuum': {
    id: 'the-continuum',
    name: 'The Continuum',
    developer: 'Far East Organization & Sino Group',
    location: 'Thiam Siew Avenue',
    district: 15,
    region: 'RCR',
    status: 'Recent',
    rating: 4.5,
    priceFrom: '$1.6M',
    pricePsf: '$1,800 psf',
    units: 816,
    tenure: 'Freehold',
    top: '2026',
    images: [
      'https://static.straitstimes.com.sg/s3fs-public/articles/2023/04/15/yq-continuum-150423.jpg',
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=800&fit=crop'
    ],
    description: 'The Continuum represents a new standard of luxury living in District 15, featuring innovative design and premium amenities. This freehold development offers residents unparalleled convenience with easy access to both the CBD and East Coast recreational areas.',
    keyFeatures: [
      'Freehold tenure in prime District 15',
      'Direct ECP access for easy connectivity',
      'Sea-facing units with Marina Bay views',
      '50m Olympic-length swimming pool',
      'Sky gardens on multiple levels',
      'Premium clubhouse facilities'
    ],
    nearbyAmenities: {
      mrts: ['Katong Park MRT (TEL) - 8 mins walk', 'Tanjong Katong MRT (TEL) - 12 mins walk'],
      schools: ['Tao Nan School', 'CHIJ Katong Primary', 'Dunman High School', 'Victoria School'],
      shopping: ['Parkway Parade', 'I12 Katong', 'Katong Shopping Centre', 'Orchard Road (15 mins drive)'],
      healthcare: ['Parkway East Hospital', 'Mount Elizabeth Hospital (East)', 'Singapore General Hospital']
    },
    unitMix: [
      { type: '1 Bedroom', size: '506-592 sqft', price: 'From $1.6M', available: 45 },
      { type: '2 Bedroom', size: '753-904 sqft', price: 'From $2.2M', available: 120 },
      { type: '3 Bedroom', size: '1,023-1,249 sqft', price: 'From $2.8M', available: 85 },
      { type: '4 Bedroom', size: '1,399-1,582 sqft', price: 'From $3.5M', available: 32 }
    ],
    pros: [
      'Prime freehold location in established District 15',
      'Direct ECP access for excellent connectivity',
      'Sea views and Marina Bay skyline from higher floors',
      'Strong rental demand from expat community',
      'Proven developer track record'
    ],
    cons: [
      'High quantum may limit buyer pool',
      'Construction noise during development phase',
      'Limited landed housing character in area',
      'High maintenance fees expected',
      'Competition from other new launches nearby'
    ],
    investmentHighlights: [
      'Freehold tenure ensures long-term value appreciation',
      'Prime District 15 location with historical price appreciation',
      'Strong rental market from nearby business districts',
      'Limited new freehold supply in the area'
    ],
    targetBuyer: 'High-net-worth individuals, expatriate families, property investors seeking freehold tenure',
    rentalYield: '3.2% - 3.8%',
    expertCommentary: 'The Continuum represents one of the few remaining freehold opportunities in District 15. While the entry price is substantial, the combination of prime location, sea views, and freehold tenure makes this an attractive long-term investment. The development\'s proximity to both CBD and East Coast recreational areas appeals to a wide range of buyers.'
  }
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-5 h-5 ${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="text-lg font-semibold text-gray-700 ml-2">{rating.toFixed(1)}/5</span>
    </div>
  )
}

export default function ProjectPage() {
  const params = useParams()
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [showEnquiryForm, setShowEnquiryForm] = useState(false)
  
  const project = projectDetails[params.id as string]
  
  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Project Not Found</h1>
          <Link href="/new-launches" className="text-blue-600 hover:text-blue-700">
            Back to New Launches
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumbs */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/new-launches" className="hover:text-blue-600">New Launches</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{project.name}</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="aspect-[4/3] overflow-hidden rounded-xl">
                <img
                  src={project.images[selectedImageIndex]}
                  alt={project.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                {project.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-video overflow-hidden rounded-lg border-2 transition-all ${
                      index === selectedImageIndex ? 'border-blue-500' : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <img src={image} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Project Summary */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium text-white ${
                    project.status === 'Recent' ? 'bg-green-500' :
                    project.status === 'Upcoming' ? 'bg-blue-500' :
                    'bg-orange-500'
                  }`}>
                    {project.status}
                  </span>
                  <span className="text-sm text-gray-600">{project.region} • District {project.district}</span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.name}</h1>
                <p className="text-lg text-gray-600">{project.developer}</p>
                <p className="text-gray-600">{project.location}</p>
              </div>

              {/* Rating */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Our Rating</div>
                  <StarRating rating={project.rating} />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">{project.priceFrom}</div>
                  <div className="text-sm text-gray-600">{project.pricePsf}</div>
                </div>
              </div>

              {/* Quick Facts */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600">Units</div>
                  <div className="font-semibold">{project.units.toLocaleString()}</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600">Tenure</div>
                  <div className="font-semibold">{project.tenure}</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600">TOP</div>
                  <div className="font-semibold">{project.top}</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600">Rental Yield</div>
                  <div className="font-semibold">{project.rentalYield}</div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-3">
                <button 
                  onClick={() => setShowEnquiryForm(true)}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Get Floor Plans & Price List
                </button>
                <Link 
                  href="/contact"
                  className="w-full border border-blue-600 text-blue-600 py-3 px-6 rounded-lg font-semibold hover:bg-blue-50 transition-colors text-center block"
                >
                  Schedule Viewing
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <section className="bg-white rounded-xl p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Project Overview</h2>
              <p className="text-gray-700 leading-relaxed">{project.description}</p>
            </section>

            {/* Key Features */}
            <section className="bg-white rounded-xl p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Key Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.keyFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Unit Mix */}
            <section className="bg-white rounded-xl p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Unit Mix & Pricing</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 text-gray-600">Unit Type</th>
                      <th className="text-left py-3 text-gray-600">Size</th>
                      <th className="text-left py-3 text-gray-600">Price From</th>
                      <th className="text-left py-3 text-gray-600">Available</th>
                    </tr>
                  </thead>
                  <tbody>
                    {project.unitMix.map((unit, index) => (
                      <tr key={index} className="border-b last:border-b-0">
                        <td className="py-3 font-semibold">{unit.type}</td>
                        <td className="py-3 text-gray-700">{unit.size}</td>
                        <td className="py-3 font-semibold text-blue-600">{unit.price}</td>
                        <td className="py-3 text-gray-700">{unit.available} units</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Pros & Cons */}
            <section className="bg-white rounded-xl p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Analysis</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-green-600 mb-4">✅ Strengths</h3>
                  <ul className="space-y-2">
                    {project.pros.map((pro, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <svg className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-700 text-sm">{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-red-600 mb-4">⚠️ Considerations</h3>
                  <ul className="space-y-2">
                    {project.cons.map((con, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <svg className="w-4 h-4 text-red-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <span className="text-gray-700 text-sm">{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* Expert Commentary */}
            <section className="bg-blue-50 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Expert Commentary</h2>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">SPH</span>
                </div>
                <div>
                  <p className="text-gray-700 leading-relaxed italic">"{project.expertCommentary}"</p>
                  <p className="text-sm text-gray-600 mt-2">— Singapore Property Hub Analysis Team</p>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Investment Summary */}
            <div className="bg-white rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Investment Highlights</h3>
              <ul className="space-y-3">
                {project.investmentHighlights.map((highlight, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-blue-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    <span className="text-sm text-gray-700">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Target Buyer */}
            <div className="bg-white rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Target Buyer Profile</h3>
              <p className="text-sm text-gray-700">{project.targetBuyer}</p>
            </div>

            {/* Nearby Amenities */}
            <div className="bg-white rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Nearby Amenities</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">🚇 MRT Stations</h4>
                  <ul className="space-y-1">
                    {project.nearbyAmenities.mrts.map((mrt, index) => (
                      <li key={index} className="text-sm text-gray-700">{mrt}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">🏫 Schools</h4>
                  <ul className="space-y-1">
                    {project.nearbyAmenities.schools.slice(0, 3).map((school, index) => (
                      <li key={index} className="text-sm text-gray-700">{school}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">🛍️ Shopping</h4>
                  <ul className="space-y-1">
                    {project.nearbyAmenities.shopping.slice(0, 3).map((mall, index) => (
                      <li key={index} className="text-sm text-gray-700">{mall}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Contact CTA */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-6 text-white">
              <h3 className="text-lg font-bold mb-2">Interested in {project.name}?</h3>
              <p className="text-blue-100 text-sm mb-4">
                Get exclusive floor plans, pricing, and viewing appointments.
              </p>
              <button 
                onClick={() => setShowEnquiryForm(true)}
                className="w-full bg-white text-blue-600 py-2 px-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Request Information
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Projects */}
      <div className="bg-white py-12 border-t">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Similar Projects You Might Like</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/projects/grand-dunman" className="group">
              <div className="bg-gray-50 rounded-xl overflow-hidden hover:shadow-lg transition-all">
                <div className="aspect-[4/3] overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop"
                    alt="Grand Dunman"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 group-hover:text-blue-600">Grand Dunman</h3>
                  <p className="text-sm text-gray-600">District 15 • From $1.4M</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Enquiry Modal - Simple placeholder */}
      {showEnquiryForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Request Information</h3>
            <p className="text-gray-600 mb-4">We'll send you the latest floor plans and pricing for {project.name}.</p>
            <div className="space-y-4">
              <input type="text" placeholder="Your Name" className="w-full px-4 py-2 border rounded-lg" />
              <input type="email" placeholder="Your Email" className="w-full px-4 py-2 border rounded-lg" />
              <input type="tel" placeholder="Your Phone" className="w-full px-4 py-2 border rounded-lg" />
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowEnquiryForm(false)}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => setShowEnquiryForm(false)}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                >
                  Send Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}