import { Metadata } from 'next'
import Link from 'next/link'
import PropertySearch from '@/components/home/PropertySearch'
import { prisma } from '@/lib/prisma'
import { PropertyStatus } from '@prisma/client'

export const metadata: Metadata = {
  title: 'Singapore Properties for Sale & Rent | Condos, Landed, Commercial',
  description: 'Browse thousands of properties in Singapore. Find condominiums, landed properties, HDB flats, and commercial spaces. Updated daily with new listings.',
  alternates: {
    canonical: 'https://singaporepropertyhub.sg/properties',
  },
}

async function getProperties() {
  try {
    const properties = await prisma.property.findMany({
      where: {
        status: PropertyStatus.AVAILABLE
      },
      include: {
        images: true,
        agent: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 20
    })
    
    return properties.map(property => ({
      id: property.id,
      title: property.title,
      type: property.type,
      price: property.price,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      area: property.floorArea,
      address: property.address,
      district: property.district,
      image: property.images[0]?.url || 'https://images.unsplash.com/photo-1567684014761-b65e2e59b9eb?w=800&h=600&fit=crop'
    }))
  } catch (error) {
    console.error('Error fetching properties:', error)
    return []
  }
}

// This will be removed once real properties are added
const sampleProperties = [
  {
    id: '1',
    title: 'Marina Bay Residences',
    type: 'Condo',
    price: 2800000,
    bedrooms: 3,
    bathrooms: 2,
    area: 1200,
    address: 'Marina Boulevard',
    district: 'District 1',
    image: 'https://images.unsplash.com/photo-1567684014761-b65e2e59b9eb?w=800&h=600&fit=crop'
  },
  {
    id: '2',
    title: 'Orchard Scotts Residences',
    type: 'Condo',
    price: 3500000,
    bedrooms: 4,
    bathrooms: 3,
    area: 1800,
    address: 'Scotts Road',
    district: 'District 9',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop'
  },
  {
    id: '3',
    title: 'Sentosa Cove Bungalow',
    type: 'Landed',
    price: 12000000,
    bedrooms: 6,
    bathrooms: 5,
    area: 8000,
    address: 'Ocean Drive',
    district: 'Sentosa',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop'
  },
  {
    id: '4',
    title: 'Tanjong Pagar Shophouse',
    type: 'Commercial',
    price: 8500000,
    bedrooms: 0,
    bathrooms: 2,
    area: 3000,
    address: 'Duxton Road',
    district: 'District 2',
    image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&h=600&fit=crop'
  },
  {
    id: '5',
    title: 'The Sail @ Marina Bay',
    type: 'Condo',
    price: 1950000,
    bedrooms: 2,
    bathrooms: 2,
    area: 950,
    address: 'Marina Boulevard',
    district: 'District 1',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop'
  },
  {
    id: '6',
    title: 'Holland Village Terrace',
    type: 'Landed',
    price: 5800000,
    bedrooms: 5,
    bathrooms: 4,
    area: 3500,
    address: 'Lorong Liput',
    district: 'District 10',
    image: 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&h=600&fit=crop'
  }
]

export default async function PropertiesPage() {
  const properties = await getProperties()
  const displayProperties = properties.length > 0 ? properties : sampleProperties
  const isUsingRealData = properties.length > 0
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-16">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Find Your Dream Property in Singapore
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Browse thousands of properties across the island
            </p>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-8 -mt-8">
        <div className="container">
          <PropertySearch />
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 border-b">
        <div className="container">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-4">
              <select className="px-4 py-2 border rounded-lg">
                <option>All Types</option>
                <option>Condo</option>
                <option>Landed</option>
                <option>HDB</option>
                <option>Commercial</option>
              </select>
              <select className="px-4 py-2 border rounded-lg">
                <option>Price Range</option>
                <option>Under $1M</option>
                <option>$1M - $2M</option>
                <option>$2M - $5M</option>
                <option>Above $5M</option>
              </select>
              <select className="px-4 py-2 border rounded-lg">
                <option>Bedrooms</option>
                <option>1 Bedroom</option>
                <option>2 Bedrooms</option>
                <option>3 Bedrooms</option>
                <option>4+ Bedrooms</option>
              </select>
              <select className="px-4 py-2 border rounded-lg">
                <option>All Districts</option>
                <option>District 1</option>
                <option>District 2</option>
                <option>District 9</option>
                <option>District 10</option>
              </select>
            </div>
            <p className="text-gray-600">
              {!isUsingRealData && (
                <span className="text-orange-600 font-medium">Demo: </span>
              )}
              Showing {displayProperties.length} properties
            </p>
          </div>
        </div>
      </section>

      {/* Property Grid */}
      <section className="py-16">
        <div className="container">
          {!isUsingRealData && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
              <p className="text-orange-800 text-sm">
                <strong>Demo Mode:</strong> These are sample properties for demonstration. Real listings will appear here once added.
              </p>
            </div>
          )}
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayProperties.map((property) => (
              <Link
                key={property.id}
                href={`/properties/${property.id}`}
                className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="relative h-64 bg-gray-200">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded">
                    {property.type}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition-colors">
                    {property.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{property.address}, {property.district}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-blue-600">
                      ${property.price.toLocaleString()}
                    </span>
                    <span className="text-gray-500">
                      {property.area ? `$${Math.round(property.price / property.area).toLocaleString()} psf` : 'Price on request'}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    {property.bedrooms > 0 && (
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        {property.bedrooms} Beds
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {property.bathrooms} Baths
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                      </svg>
                      {property.area ? property.area.toLocaleString() : 'N/A'} sqft
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Pagination */}
      <section className="py-8">
        <div className="container">
          <div className="flex justify-center gap-2">
            <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">Previous</button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">1</button>
            <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">2</button>
            <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">3</button>
            <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">Next</button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Can't Find What You're Looking For?</h2>
            <p className="text-xl text-gray-600 mb-8">
              Let our property experts help you find the perfect property that matches your requirements.
            </p>
            <Link
              href="/contact"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-block"
            >
              Get Personalized Recommendations
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}