import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import LeadCaptureForm from '@/components/forms/LeadCaptureForm'

// Mock data - in real app, this would come from database
const mockProperty = {
  id: '1',
  title: 'Marina Bay Residences',
  type: 'Condo',
  price: 2800000,
  bedrooms: 3,
  bathrooms: 2,
  area: 1200,
  address: 'Marina Boulevard',
  district: 'District 1',
  description: 'Luxurious waterfront condominium offering spectacular views of Marina Bay and the city skyline. This premium residence features high-end finishes, world-class amenities, and direct access to Singapore\'s central business district.',
  features: [
    '24/7 Concierge Service',
    'Infinity Pool with City Views',
    'Fully Equipped Gymnasium',
    'BBQ Pavilion',
    'Children\'s Playground',
    'Function Room',
    'Covered Car Park',
    'Security System'
  ],
  images: [
    'https://images.unsplash.com/photo-1567684014761-b65e2e59b9eb?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&h=800&fit=crop'
  ],
  agent: {
    name: 'Sarah Chen',
    phone: '+65 9123 4567',
    email: 'sarah.chen@singaporepropertyhub.sg',
    license: 'RES 12345G'
  },
  nearby: [
    { name: 'Marina Bay MRT', distance: '2 min walk', type: 'Transport' },
    { name: 'The Shoppes at Marina Bay Sands', distance: '5 min walk', type: 'Shopping' },
    { name: 'Gardens by the Bay', distance: '8 min walk', type: 'Recreation' },
    { name: 'Raffles Place', distance: '10 min walk', type: 'Business' }
  ]
}

interface Props {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // In real app, fetch property data
  const property = mockProperty
  
  return {
    title: `${property.title} | ${property.district} Property for Sale`,
    description: `${property.bedrooms} bedroom ${property.type.toLowerCase()} in ${property.district}. ${property.area} sqft at $${property.price.toLocaleString()}. ${property.description.substring(0, 150)}...`,
    alternates: {
      canonical: `https://singaporepropertyhub.sg/properties/${params.id}`,
    },
  }
}

export default function PropertyPage({ params }: Props) {
  // In real app, fetch property from database using params.id
  const property = mockProperty
  
  if (!property) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Image Gallery */}
      <section className="relative">
        <div className="grid grid-cols-4 gap-1 h-96">
          <div className="col-span-2 row-span-2">
            <img
              src={property.images[0]}
              alt={property.title}
              className="w-full h-full object-cover"
            />
          </div>
          {property.images.slice(1, 4).map((image, index) => (
            <div key={index} className="relative">
              <img
                src={image}
                alt={`${property.title} - Image ${index + 2}`}
                className="w-full h-full object-cover"
              />
              {index === 2 && property.images.length > 4 && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <span className="text-white font-semibold">
                    +{property.images.length - 4} more photos
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded">
          {property.type}
        </div>
      </section>

      {/* Property Details */}
      <section className="py-8">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
                <p className="text-gray-600 text-lg">{property.address}, {property.district}</p>
              </div>

              <div className="flex items-center justify-between mb-8 p-6 bg-gray-50 rounded-lg">
                <div>
                  <span className="text-3xl font-bold text-blue-600">
                    ${property.price.toLocaleString()}
                  </span>
                  <span className="text-gray-500 ml-4">
                    ${Math.round(property.price / property.area).toLocaleString()} psf
                  </span>
                </div>
                <div className="flex gap-6 text-gray-600">
                  {property.bedrooms > 0 && (
                    <span className="flex items-center gap-1">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      {property.bedrooms} Beds
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {property.bathrooms} Baths
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                    {property.area.toLocaleString()} sqft
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">About This Property</h2>
                <p className="text-gray-600 leading-relaxed">{property.description}</p>
              </div>

              {/* Features */}
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Features & Amenities</h2>
                <div className="grid md:grid-cols-2 gap-3">
                  {property.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Nearby */}
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">What's Nearby</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {property.nearby.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <div>
                        <span className="font-medium">{item.name}</span>
                        <span className="text-sm text-gray-500 block">{item.type}</span>
                      </div>
                      <span className="text-blue-600 font-medium">{item.distance}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                {/* Agent Info */}
                <div className="bg-gray-50 p-6 rounded-lg mb-6">
                  <h3 className="text-lg font-semibold mb-4">Contact Agent</h3>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
                    <div>
                      <h4 className="font-semibold">{property.agent.name}</h4>
                      <p className="text-sm text-gray-600">License: {property.agent.license}</p>
                    </div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <a
                      href={`tel:${property.agent.phone}`}
                      className="flex items-center gap-2 text-blue-600 hover:underline"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {property.agent.phone}
                    </a>
                    <a
                      href={`mailto:${property.agent.email}`}
                      className="flex items-center gap-2 text-blue-600 hover:underline"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {property.agent.email}
                    </a>
                  </div>
                </div>

                {/* Inquiry Form */}
                <div className="bg-white border rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Interested in This Property?</h3>
                  <LeadCaptureForm />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Back to Listings */}
      <section className="py-8 bg-gray-50">
        <div className="container">
          <Link
            href="/properties"
            className="inline-flex items-center gap-2 text-blue-600 hover:underline"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to All Properties
          </Link>
        </div>
      </section>
    </div>
  )
}