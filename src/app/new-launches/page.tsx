'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Project {
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
  image: string
  features: string[]
}

const projects: Project[] = [
  {
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
    image: 'https://static.straitstimes.com.sg/s3fs-public/articles/2023/04/15/yq-continuum-150423.jpg',
    features: ['Prime District 15', 'Freehold Tenure', 'Sea Views', 'Near ECP']
  },
  {
    id: 'grand-dunman',
    name: 'Grand Dunman',
    developer: 'SingHaiyi Group',
    location: 'Dunman Road',
    district: 15,
    region: 'RCR',
    status: 'TOP',
    rating: 4.3,
    priceFrom: '$1.4M',
    pricePsf: '$1,650 psf',
    units: 1054,
    tenure: 'Freehold',
    top: '2025',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop',
    features: ['Largest Freehold', 'EW Line MRT', 'City Views', 'Marina Bay Access']
  },
  {
    id: 'lentor-mansion',
    name: 'Lentor Mansion',
    developer: 'GuocolLand',
    location: 'Lentor Central',
    district: 26,
    region: 'OCR',
    status: 'Upcoming',
    rating: 4.6,
    priceFrom: '$1.1M',
    pricePsf: '$1,400 psf',
    units: 605,
    tenure: 'Freehold',
    top: '2027',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop',
    features: ['Thomson-East Coast Line', 'Nature Living', 'Freehold', 'Central Location']
  },
  {
    id: 'orchard-sophia',
    name: 'Orchard Sophia',
    developer: 'Far East Organization',
    location: 'Sophia Road',
    district: 9,
    region: 'CCR',
    status: 'Recent',
    rating: 4.8,
    priceFrom: '$2.8M',
    pricePsf: '$2,200 psf',
    units: 131,
    tenure: 'Freehold',
    top: '2026',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop',
    features: ['Prime Orchard', 'Boutique Development', 'Freehold', 'Luxury Living']
  },
  {
    id: 'avenue-south-residence',
    name: 'Avenue South Residence',
    developer: 'UOL Group',
    location: 'Silat Avenue',
    district: 4,
    region: 'CCR',
    status: 'TOP',
    rating: 4.4,
    priceFrom: '$1.9M',
    pricePsf: '$1,900 psf',
    units: 1074,
    tenure: '99-year',
    top: '2024',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop',
    features: ['Tallest Residential', 'CBD Access', 'Sky Garden', 'Marina View']
  },
  {
    id: 'normanton-park',
    name: 'Normanton Park',
    developer: 'Kingsford Development',
    location: 'Normanton Park',
    district: 5,
    region: 'RCR',
    status: 'TOP',
    rating: 4.2,
    priceFrom: '$1.5M',
    pricePsf: '$1,750 psf',
    units: 1862,
    tenure: '99-year',
    top: '2025',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop',
    features: ['Largest Development', 'Waterfront Living', 'Multiple Towers', 'Near VivoCity']
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
      <span className="text-sm text-gray-600 ml-1">{rating.toFixed(1)}</span>
    </div>
  )
}

export default function NewLaunchesPage() {
  const [filteredProjects, setFilteredProjects] = useState<Project[]>(projects)
  const [activeFilters, setActiveFilters] = useState({
    region: 'All',
    status: 'All',
    tenure: 'All',
    priceRange: 'All'
  })
  const [sortBy, setSortBy] = useState('name')

  const applyFilters = (filters: typeof activeFilters) => {
    let filtered = projects.filter(project => {
      if (filters.region !== 'All' && project.region !== filters.region) return false
      if (filters.status !== 'All' && project.status !== filters.status) return false
      if (filters.tenure !== 'All' && project.tenure !== filters.tenure) return false
      if (filters.priceRange !== 'All') {
        const price = parseFloat(project.priceFrom.replace('$', '').replace('M', ''))
        switch (filters.priceRange) {
          case 'under-1m':
            if (price >= 1) return false
            break
          case '1m-2m':
            if (price < 1 || price > 2) return false
            break
          case '2m-plus':
            if (price < 2) return false
            break
        }
      }
      return true
    })

    // Apply sorting
    filtered = filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return parseFloat(a.priceFrom.replace('$', '').replace('M', '')) - parseFloat(b.priceFrom.replace('$', '').replace('M', ''))
        case 'price-desc':
          return parseFloat(b.priceFrom.replace('$', '').replace('M', '')) - parseFloat(a.priceFrom.replace('$', '').replace('M', ''))
        case 'rating':
          return b.rating - a.rating
        case 'district':
          return a.district - b.district
        default:
          return a.name.localeCompare(b.name)
      }
    })

    setFilteredProjects(filtered)
  }

  const handleFilterChange = (filterType: keyof typeof activeFilters, value: string) => {
    const newFilters = { ...activeFilters, [filterType]: value }
    setActiveFilters(newFilters)
    applyFilters(newFilters)
  }

  const handleSortChange = (value: string) => {
    setSortBy(value)
    applyFilters(activeFilters)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              New Launch Properties in Singapore
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Discover the latest residential developments across Singapore with expert reviews, 
              ratings, and detailed analysis to help you make informed property decisions.
            </p>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white shadow-sm border-b sticky top-20 z-40">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {/* Region Filter */}
            <select 
              className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={activeFilters.region}
              onChange={(e) => handleFilterChange('region', e.target.value)}
            >
              <option value="All">All Regions</option>
              <option value="CCR">Central Core Region</option>
              <option value="RCR">Rest of Central</option>
              <option value="OCR">Outside Central</option>
            </select>

            {/* Status Filter */}
            <select 
              className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={activeFilters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Recent">Recently Launched</option>
              <option value="Upcoming">Coming Soon</option>
              <option value="TOP">TOP Coming</option>
            </select>

            {/* Tenure Filter */}
            <select 
              className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={activeFilters.tenure}
              onChange={(e) => handleFilterChange('tenure', e.target.value)}
            >
              <option value="All">All Tenure</option>
              <option value="Freehold">Freehold</option>
              <option value="99-year">99-year Leasehold</option>
              <option value="999-year">999-year Leasehold</option>
            </select>

            {/* Price Range Filter */}
            <select 
              className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={activeFilters.priceRange}
              onChange={(e) => handleFilterChange('priceRange', e.target.value)}
            >
              <option value="All">All Prices</option>
              <option value="under-1m">Under $1M</option>
              <option value="1m-2m">$1M - $2M</option>
              <option value="2m-plus">$2M+</option>
            </select>

            {/* Sort Filter */}
            <select 
              className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
            >
              <option value="name">Sort by Name</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="district">District</option>
            </select>

            {/* Results Count */}
            <div className="flex items-center justify-center px-3 py-2 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">
                {filteredProjects.length} Properties
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <Link key={project.id} href={`/projects/${project.id}`}>
              <article className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 group overflow-hidden">
                {/* Project Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${
                      project.status === 'Recent' ? 'bg-green-500' :
                      project.status === 'Upcoming' ? 'bg-blue-500' :
                      'bg-orange-500'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                      <StarRating rating={project.rating} />
                    </div>
                  </div>
                </div>

                {/* Project Details */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {project.name}
                      </h3>
                      <p className="text-sm text-gray-600">{project.developer}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-blue-600">{project.priceFrom}</div>
                      <div className="text-xs text-gray-500">{project.pricePsf}</div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {project.location} • District {project.district} • {project.region}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>{project.units} units</span>
                      <span>•</span>
                      <span>{project.tenure}</span>
                      <span>•</span>
                      <span>TOP {project.top}</span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.features.slice(0, 3).map((feature, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                      >
                        {feature}
                      </span>
                    ))}
                    {project.features.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +{project.features.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* CTA Button */}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <span className="text-blue-600 font-medium text-sm group-hover:text-blue-700">
                      View Details & Floor Plans
                    </span>
                    <svg className="w-5 h-5 text-blue-600 group-hover:text-blue-700 transform group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* No Results */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
            <p className="text-gray-600">Try adjusting your filters to see more results.</p>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">
            Can't Find What You're Looking For?
          </h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Get personalized property recommendations and exclusive access to off-market opportunities. 
            Our property experts will help you find your perfect home.
          </p>
          <Link 
            href="/contact"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors inline-block"
          >
            Get Personal Recommendations
          </Link>
        </div>
      </div>
    </div>
  )
}