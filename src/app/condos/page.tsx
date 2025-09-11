'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useMemo } from 'react'

// Condo projects data with enhanced properties
const condoProjects = [
  {
    id: 'the-continuum',
    name: 'The Continuum',
    slug: 'the-continuum',
    developer: 'Hoi Hup Realty & Sunway Development',
    district: 15,
    districtName: 'Marine Parade',
    region: 'RCR',
    status: 'NEW LAUNCH',
    rating: 4.5,
    reviewCount: 23,
    priceFrom: 1600000,
    priceFromDisplay: '$1.6M',
    pricePsf: '$1,800 psf',
    bedrooms: '2-4 bedrooms',
    tenure: 'Freehold',
    completionYear: 2024,
    propertyType: 'New Launch',
    highlights: [
      'Waterfront living with panoramic views',
      'Designer units by renowned architects',
      'Integrated lifestyle amenities'
    ],
    excerpt: 'A stunning waterfront development offering luxury living with panoramic sea views and world-class amenities in the heart of Marina Bay.',
    image: 'https://continuum-condo.sg/wp-content/uploads/2023/03/the-continuum-condo-artist-impression-img-15.png'
  },
  {
    id: 'grand-dunman',
    name: 'Grand Dunman',
    slug: 'grand-dunman',
    developer: 'SingHaiyi Group',
    district: 15,
    districtName: 'Marine Parade',
    region: 'RCR',
    status: 'TOP 2025',
    rating: 4.3,
    reviewCount: 18,
    priceFrom: 1400000,
    priceFromDisplay: '$1.4M',
    pricePsf: '$1,650 psf',
    bedrooms: '1-5 bedrooms',
    tenure: 'Freehold',
    completionYear: 2025,
    propertyType: 'New Launch',
    highlights: [
      'Freehold status in District 15',
      'Family-friendly environment',
      'Excellent connectivity to CBD'
    ],
    excerpt: 'A well-designed family-oriented development in the established Marine Parade area, offering excellent value and strong rental potential.',
    image: 'https://www.singhaiyi.com/images/property/V15_Lux_Building_Overall_05_extended_big_new.jpg'
  },
  {
    id: 'lentor-mansion',
    name: 'Lentor Mansion',
    slug: 'lentor-mansion',
    developer: 'GuocolLand & Hong Leong',
    district: 26,
    districtName: 'Upper Thomson',
    region: 'OCR',
    status: 'UPCOMING',
    rating: 4.6,
    reviewCount: 31,
    priceFrom: 1100000,
    priceFromDisplay: '$1.1M',
    pricePsf: '$1,400 psf',
    bedrooms: '2-5 bedrooms',
    tenure: 'Freehold',
    completionYear: 2026,
    propertyType: 'New Launch',
    highlights: [
      'Low-density luxury development',
      'Heritage black & white design',
      'Lentor MRT connectivity'
    ],
    excerpt: 'An exclusive low-density development inspired by Singapore\'s colonial heritage, offering spacious layouts in a tranquil setting.',
    image: 'https://www.the-lentormansion.com.sg/wp-content/uploads/2024/02/lentor-mansion-Clubhouse-overlooking-50m-pool-1-1024x512.jpg'
  },
  {
    id: 'orchard-sophia',
    name: 'Orchard Sophia',
    slug: 'orchard-sophia',
    developer: 'DB2Land',
    district: 9,
    districtName: 'Orchard',
    region: 'CCR',
    status: 'TOP 2024',
    rating: 4.8,
    reviewCount: 42,
    priceFrom: 2800000,
    priceFromDisplay: '$2.8M',
    pricePsf: '$2,200 psf',
    bedrooms: '1-3 bedrooms',
    tenure: 'Freehold',
    completionYear: 2024,
    propertyType: 'New Launch',
    highlights: [
      'Prime Orchard Road location',
      'Boutique luxury development',
      'Walking distance to shopping'
    ],
    excerpt: 'Ultra-luxury boutique development in the heart of Orchard Road, offering unparalleled convenience and prestige.',
    image: 'https://orchard-sophia.com.sg/files/folder_web_5490/images/Orchard_Sophia%27s_facade-dBk100.jpg'
  },
  {
    id: 'avenue-south-residence',
    name: 'Avenue South Residence',
    slug: 'avenue-south-residence',
    developer: 'UOL Group',
    district: 4,
    districtName: 'Sentosa/Harbourfront',
    region: 'CCR',
    status: 'TOP 2024',
    rating: 4.4,
    reviewCount: 56,
    priceFrom: 1900000,
    priceFromDisplay: '$1.9M',
    pricePsf: '$1,900 psf',
    bedrooms: '2-4 bedrooms',
    tenure: '99-year',
    completionYear: 2024,
    propertyType: 'Under Construction',
    highlights: [
      'Tallest residential towers in Singapore',
      'Integrated retail and dining',
      'MRT connectivity to Tanjong Pagar'
    ],
    excerpt: 'Singapore\'s tallest residential development featuring integrated lifestyle amenities and excellent transport links.',
    image: 'https://uolhomes.com.sg/wp-content/uploads/2020/08/AVENUE-SOUTH-RESIDENCE_G_01.jpg'
  },
  {
    id: 'normanton-park',
    name: 'Normanton Park',
    slug: 'normanton-park',
    developer: 'Kingsford Development',
    district: 5,
    districtName: 'Buona Vista/West Coast',
    region: 'RCR',
    status: 'TOP 2025',
    rating: 4.2,
    reviewCount: 29,
    priceFrom: 1500000,
    priceFromDisplay: '$1.5M',
    pricePsf: '$1,750 psf',
    bedrooms: '2-5 bedrooms',
    tenure: '99-year',
    completionYear: 2025,
    propertyType: 'New Launch',
    highlights: [
      'Spacious layouts and gardens',
      'Family-oriented facilities',
      'Established residential area'
    ],
    excerpt: 'A family-friendly development offering generous living spaces and comprehensive amenities in an established neighborhood.',
    image: 'https://kingsford.com.sg/wp-content/gallery/normanton-park-singapore-project/255-NormantonPark-v3.jpg'
  }
]

const allDistricts = [
  { value: 1, label: 'Raffles Place', region: 'CCR' },
  { value: 2, label: 'Anson/Tanjong Pagar', region: 'CCR' },
  { value: 3, label: 'Queenstown/Tiong Bahru', region: 'RCR' },
  { value: 4, label: 'Sentosa/Harbourfront', region: 'CCR' },
  { value: 5, label: 'Buona Vista/West Coast', region: 'RCR' },
  { value: 7, label: 'Beach Road/Bugis', region: 'RCR' },
  { value: 8, label: 'Little India/Farrer Park', region: 'RCR' },
  { value: 9, label: 'Orchard', region: 'CCR' },
  { value: 10, label: 'Tanglin/Holland', region: 'CCR' },
  { value: 11, label: 'Newton/Novena', region: 'CCR' },
  { value: 12, label: 'Balestier/Toa Payoh', region: 'RCR' },
  { value: 13, label: 'Macpherson/Potong Pasir', region: 'RCR' },
  { value: 14, label: 'Geylang/Paya Lebar', region: 'RCR' },
  { value: 15, label: 'Marine Parade', region: 'RCR' },
  { value: 16, label: 'Bedok/Upper East Coast', region: 'OCR' },
  { value: 17, label: 'Loyang/Changi', region: 'OCR' },
  { value: 18, label: 'Pasir Ris/Tampines', region: 'OCR' },
  { value: 19, label: 'Serangoon/Punggol', region: 'OCR' },
  { value: 20, label: 'Bishan/Ang Mo Kio', region: 'OCR' },
  { value: 21, label: 'Upper Bukit Timah', region: 'OCR' },
  { value: 22, label: 'Jurong', region: 'OCR' },
  { value: 23, label: 'Dairy Farm/Bukit Panjang', region: 'OCR' },
  { value: 25, label: 'Admiralty/Woodlands', region: 'OCR' },
  { value: 26, label: 'Upper Thomson', region: 'OCR' },
  { value: 27, label: 'Yishun/Sembawang', region: 'OCR' },
  { value: 28, label: 'Seletar/Yio Chu Kang', region: 'OCR' }
]

const bedroomOptions = ['1 BR', '2 BR', '3 BR', '4 BR', '5+ BR']
const statusOptions = ['All', 'New Launch', 'Under Construction', 'TOP/Ready']
const sortOptions = [
  { value: 'latest', label: 'Latest' },
  { value: 'highest-rated', label: 'Highest Rated' },
  { value: 'price-low-high', label: 'Price (Low-High)' },
  { value: 'price-high-low', label: 'Price (High-Low)' }
]

interface Filters {
  districts: number[]
  priceRange: [number, number]
  status: string
  bedrooms: string[]
  search: string
}

export default function CondosPage() {
  const [filters, setFilters] = useState<Filters>({
    districts: [],
    priceRange: [500000, 10000000],
    status: 'All',
    bedrooms: [],
    search: ''
  })

  const [sortBy, setSortBy] = useState('latest')
  const [showAllDistricts, setShowAllDistricts] = useState(false)
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  const getDistrictColor = (region: string) => {
    switch (region) {
      case 'CCR': return 'bg-blue-600'
      case 'RCR': return 'bg-green-600'
      case 'OCR': return 'bg-orange-600'
      default: return 'bg-gray-600'
    }
  }

  const filteredAndSortedProjects = useMemo(() => {
    let filtered = condoProjects.filter(project => {
      // District filter
      if (filters.districts.length > 0 && !filters.districts.includes(project.district)) {
        return false
      }
      
      // Price range filter
      if (project.priceFrom < filters.priceRange[0] || project.priceFrom > filters.priceRange[1]) {
        return false
      }
      
      // Status filter
      if (filters.status !== 'All') {
        const statusMap: { [key: string]: string[] } = {
          'New Launch': ['NEW LAUNCH', 'UPCOMING'],
          'Under Construction': ['UNDER CONSTRUCTION'],
          'TOP/Ready': ['TOP 2024', 'TOP 2025']
        }
        
        if (!statusMap[filters.status]?.includes(project.status)) {
          return false
        }
      }
      
      // Bedroom filter
      if (filters.bedrooms.length > 0) {
        const projectBedrooms = project.bedrooms.toLowerCase()
        const hasMatchingBedroom = filters.bedrooms.some(bedroom => {
          const bedroomNumber = bedroom.split(' ')[0]
          if (bedroomNumber === '5+') {
            return projectBedrooms.includes('5')
          }
          return projectBedrooms.includes(bedroomNumber)
        })
        if (!hasMatchingBedroom) return false
      }
      
      // Search filter
      if (filters.search && !project.name.toLowerCase().includes(filters.search.toLowerCase()) &&
          !project.districtName.toLowerCase().includes(filters.search.toLowerCase())) {
        return false
      }
      
      return true
    })

    // Sort
    switch (sortBy) {
      case 'highest-rated':
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case 'price-low-high':
        filtered.sort((a, b) => a.priceFrom - b.priceFrom)
        break
      case 'price-high-low':
        filtered.sort((a, b) => b.priceFrom - a.priceFrom)
        break
      default:
        // Latest (default order)
        break
    }

    return filtered
  }, [filters, sortBy])

  const clearAllFilters = () => {
    setFilters({
      districts: [],
      priceRange: [500000, 10000000],
      status: 'All',
      bedrooms: [],
      search: ''
    })
  }

  const handleDistrictToggle = (districtValue: number) => {
    setFilters(prev => ({
      ...prev,
      districts: prev.districts.includes(districtValue)
        ? prev.districts.filter(d => d !== districtValue)
        : [...prev.districts, districtValue]
    }))
  }

  const handleBedroomToggle = (bedroom: string) => {
    setFilters(prev => ({
      ...prev,
      bedrooms: prev.bedrooms.includes(bedroom)
        ? prev.bedrooms.filter(b => b !== bedroom)
        : [...prev.bedrooms, bedroom]
    }))
  }

  const displayedDistricts = showAllDistricts ? allDistricts : allDistricts.slice(0, 8)

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-4">
              Comprehensive Condo Reviews
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              Professional analysis of Singapore&rsquo;s condominium developments with our 5-star rating system
            </p>
            
            {/* Search Bar */}
            <div className="max-w-lg mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by condo name or district..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A66C2] focus:border-[#0A66C2] text-gray-900"
                />
                <svg className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex gap-8">
          {/* Filter Sidebar - Desktop */}
          <div className="hidden lg:block w-[280px] flex-shrink-0">
            <div className="sticky top-[100px] bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold mb-6 text-gray-900">Filters</h3>
              
              {/* District Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  District ({filters.districts.length > 0 ? filters.districts.length : 'All'})
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {displayedDistricts.map((district) => (
                    <label key={district.value} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.districts.includes(district.value)}
                        onChange={() => handleDistrictToggle(district.value)}
                        className="rounded border-gray-300 text-[#0A66C2] focus:ring-[#0A66C2] mr-3"
                      />
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${getDistrictColor(district.region)}`}></span>
                        <span className="text-sm text-gray-600">D{district.value} {district.label}</span>
                      </div>
                    </label>
                  ))}
                </div>
                <button
                  onClick={() => setShowAllDistricts(!showAllDistricts)}
                  className="text-[#0A66C2] text-sm hover:underline mt-2"
                >
                  {showAllDistricts ? 'Show less' : 'Show all 28 districts'}
                </button>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Price Range</label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="number"
                    placeholder="Min $"
                    value={filters.priceRange[0]}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      priceRange: [Number(e.target.value), prev.priceRange[1]]
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-[#0A66C2]"
                  />
                  <input
                    type="number"
                    placeholder="Max $"
                    value={filters.priceRange[1]}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      priceRange: [prev.priceRange[0], Number(e.target.value)]
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-[#0A66C2]"
                  />
                </div>
                <input
                  type="range"
                  min="500000"
                  max="10000000"
                  step="100000"
                  value={filters.priceRange[1]}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    priceRange: [prev.priceRange[0], Number(e.target.value)]
                  }))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>$500K</span>
                  <span>$10M+</span>
                </div>
              </div>

              {/* Property Status */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Property Status</label>
                <div className="space-y-2">
                  {statusOptions.map((status) => (
                    <label key={status} className="flex items-center">
                      <input
                        type="radio"
                        name="status"
                        value={status}
                        checked={filters.status === status}
                        onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                        className="border-gray-300 text-[#0A66C2] focus:ring-[#0A66C2] mr-3"
                      />
                      <span className="text-sm text-gray-600">{status}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Bedrooms */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Bedrooms</label>
                <div className="grid grid-cols-2 gap-2">
                  {bedroomOptions.map((bedroom) => (
                    <label key={bedroom} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.bedrooms.includes(bedroom)}
                        onChange={() => handleBedroomToggle(bedroom)}
                        className="rounded border-gray-300 text-[#0A66C2] focus:ring-[#0A66C2] mr-2"
                      />
                      <span className="text-sm text-gray-600">{bedroom}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Filter Buttons */}
              <div className="space-y-2">
                <button
                  onClick={clearAllFilters}
                  className="w-full py-2 px-4 border-2 border-[#0A66C2] text-[#0A66C2] rounded-lg font-medium hover:bg-[#0A66C2] hover:text-white transition-colors"
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Sort Header */}
            <div className="flex justify-between items-center mb-8">
              <p className="text-gray-600 text-lg">
                <span className="font-semibold">{filteredAndSortedProjects.length}</span> condos found
              </p>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A66C2] focus:border-[#0A66C2] text-gray-900 min-w-[180px]"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    Sort by: {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Condo Grid */}
            {filteredAndSortedProjects.length > 0 ? (
              <div className="grid lg:grid-cols-2 gap-8">
                {filteredAndSortedProjects.map((project) => (
                  <CondoReviewCard key={project.id} project={project} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <h3 className="text-xl font-semibold mb-2">No condos found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your filters to see more results</p>
                <button
                  onClick={clearAllFilters}
                  className="text-[#0A66C2] hover:underline font-medium"
                >
                  Clear all filters
                </button>
              </div>
            )}

            {/* Load More Button */}
            {filteredAndSortedProjects.length >= 6 && (
              <button className="w-full py-4 mt-12 border-2 border-[#0A66C2] text-[#0A66C2] rounded-lg hover:bg-[#0A66C2] hover:text-white transition-colors font-semibold text-lg">
                Load More Reviews (Showing 6 of {condoProjects.length})
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Button */}
      <button
        onClick={() => setShowMobileFilters(true)}
        className="lg:hidden fixed bottom-5 right-5 w-14 h-14 bg-[#0A66C2] text-white rounded-full shadow-lg flex items-center justify-center z-50"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
        </svg>
      </button>
    </div>
  )
}

function CondoReviewCard({ project }: { project: typeof condoProjects[0] }) {
  const getRegionColor = (region: string) => {
    switch (region) {
      case 'CCR': return 'bg-blue-600'
      case 'RCR': return 'bg-green-600' 
      case 'OCR': return 'bg-orange-600'
      default: return 'bg-gray-600'
    }
  }

  const getStatusColor = (status: string) => {
    if (status.includes('NEW LAUNCH')) return 'bg-green-500'
    if (status.includes('TOP')) return 'bg-blue-500'
    if (status.includes('UPCOMING')) return 'bg-purple-500'
    return 'bg-orange-500'
  }

  return (
    <Link
      href={`/condos/${project.slug}/review-2025`}
      className="group bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border hover:transform hover:-translate-y-1"
      style={{ height: '450px' }}
    >
      {/* Image */}
      <div className="relative h-[240px] overflow-hidden">
        <Image
          src={project.image}
          alt={project.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Status Badge */}
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${getStatusColor(project.status)}`}>
            {project.status}
          </span>
        </div>
        
        {/* Bookmark Icon */}
        <div className="absolute top-4 right-4">
          <button className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 h-[210px] flex flex-col">
        {/* Header */}
        <div className="mb-4">
          <h3 className="text-[26px] font-semibold text-[#111111] group-hover:text-[#0A66C2] transition-colors mb-2 line-clamp-1">
            {project.name}
          </h3>
          <p className="text-sm text-gray-600 mb-2">{project.developer} • {project.completionYear}</p>
          
          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            <StarRating rating={project.rating} />
            <span className="text-sm text-gray-600 ml-1">Based on {project.reviewCount} reviews</span>
          </div>

          {/* District Badge */}
          <div className="flex items-center gap-2 mb-3">
            <span className={`px-2 py-1 rounded-full text-white text-xs font-medium ${getRegionColor(project.region)}`}>
              D{project.district} {project.districtName}
            </span>
          </div>
        </div>

        {/* Price Info */}
        <div className="mb-4">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-[20px] font-medium text-[#0A66C2]">{project.priceFromDisplay}</span>
            <span className="text-gray-600">•</span>
            <span className="text-[16px] text-gray-600">{project.pricePsf}</span>
            <span className="text-gray-600">•</span>
            <span className="text-[16px] text-gray-600">{project.bedrooms}</span>
          </div>
        </div>

        {/* Key Features */}
        <div className="mb-4 flex-1">
          <ul className="text-sm text-gray-600 space-y-1">
            {project.highlights.slice(0, 2).map((highlight, index) => (
              <li key={index} className="flex items-start">
                <span className="text-[#0A66C2] mr-2 font-bold">•</span>
                {highlight}
              </li>
            ))}
          </ul>
        </div>

        {/* Description */}
        <p className="text-[16px] text-gray-600 mb-4 line-clamp-3 leading-relaxed flex-1">
          {project.excerpt}
        </p>

        {/* CTA Button */}
        <div className="mt-auto pt-4 border-t border-gray-100">
          <button className="w-full bg-[#0A66C2] text-white px-4 py-3 rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors flex items-center justify-center gap-2">
            Read Full Review
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </Link>
  )
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-4 h-4 ${star <= Math.floor(rating) ? 'text-yellow-400 fill-current' : 
            star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="text-sm font-medium text-gray-600 ml-1">{rating}</span>
    </div>
  )
}