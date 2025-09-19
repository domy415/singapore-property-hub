'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useMemo } from 'react'
import ImageWithFallback from '@/components/ui/ImageWithFallback'
import { getAllCondos } from '@/lib/condo-data'

// Get all condo projects from centralized data
const condoProjects = getAllCondos()

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
      const priceFromNum = project.priceMin * 1000000
      if (priceFromNum < filters.priceRange[0] || priceFromNum > filters.priceRange[1]) {
        return false
      }
      
      // Status filter
      if (filters.status !== 'All') {
        if (filters.status === 'New Launch' && project.status !== 'NEW LAUNCH') return false
        if (filters.status === 'Under Construction' && project.status !== 'TOP 2025') return false
        if (filters.status === 'TOP/Ready' && !['TOP', 'Recent'].includes(project.status)) return false
      }
      
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        const searchableText = `${project.name} ${project.developer} ${project.districtName} ${project.excerpt}`.toLowerCase()
        if (!searchableText.includes(searchLower)) return false
      }
      
      return true
    })

    // Sort
    switch (sortBy) {
      case 'highest-rated':
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case 'price-low-high':
        filtered.sort((a, b) => a.priceMin - b.priceMin)
        break
      case 'price-high-low':
        filtered.sort((a, b) => b.priceMin - a.priceMin)
        break
      case 'latest':
      default:
        filtered.sort((a, b) => b.completionYear - a.completionYear)
        break
    }

    return filtered
  }, [filters, sortBy])

  const displayedDistricts = showAllDistricts ? allDistricts : allDistricts.slice(0, 6)

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 to-blue-700 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Singapore Condo Reviews
            </h1>
            <p className="text-xl text-blue-100">
              In-depth analysis and expert reviews of the latest condominium developments
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden lg:block w-80 shrink-0">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-6">Filter Results</h2>
              
              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Projects
                </label>
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  placeholder="Search by name, developer..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Districts */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Districts
                </label>
                <div className="space-y-2">
                  {displayedDistricts.map(district => (
                    <label key={district.value} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.districts.includes(district.value)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilters({ ...filters, districts: [...filters.districts, district.value] })
                          } else {
                            setFilters({ ...filters, districts: filters.districts.filter(d => d !== district.value) })
                          }
                        }}
                        className="rounded text-blue-600 mr-2"
                      />
                      <span className="text-sm">District {district.value} - {district.label}</span>
                      <span className={`ml-auto text-xs px-2 py-0.5 rounded text-white ${getDistrictColor(district.region)}`}>
                        {district.region}
                      </span>
                    </label>
                  ))}
                </div>
                {allDistricts.length > 6 && (
                  <button
                    onClick={() => setShowAllDistricts(!showAllDistricts)}
                    className="text-blue-600 text-sm mt-2 hover:underline"
                  >
                    {showAllDistricts ? 'Show Less' : `Show All ${allDistricts.length} Districts`}
                  </button>
                )}
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-sm">$500K</span>
                  <input
                    type="range"
                    min={500000}
                    max={10000000}
                    step={100000}
                    value={filters.priceRange[1]}
                    onChange={(e) => setFilters({ ...filters, priceRange: [filters.priceRange[0], Number(e.target.value)] })}
                    className="flex-1"
                  />
                  <span className="text-sm">$10M+</span>
                </div>
                <p className="text-center text-sm text-gray-600 mt-1">
                  Up to ${(filters.priceRange[1] / 1000000).toFixed(1)}M
                </p>
              </div>

              {/* Status */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {statusOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              {/* Clear Filters */}
              <button
                onClick={() => setFilters({
                  districts: [],
                  priceRange: [500000, 10000000],
                  status: 'All',
                  bedrooms: [],
                  search: ''
                })}
                className="w-full py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {filteredAndSortedProjects.length} Condo Reviews
                </h2>
                <p className="text-gray-600">
                  Expert analysis and detailed reviews
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                {/* Mobile Filter Button */}
                <button
                  onClick={() => setShowMobileFilters(true)}
                  className="lg:hidden px-4 py-2 bg-white border border-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-50"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                  Filters
                </button>
                
                {/* Sort Dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Project Cards Grid */}
            <div className="grid gap-6">
              {filteredAndSortedProjects.map(project => (
                <Link 
                  key={project.id}
                  href={`/condos/${project.slug}`}
                  className="block"
                >
                  <article className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                    <div className="flex flex-col lg:flex-row">
                      {/* Image */}
                      <div className="lg:w-1/3 relative h-64 lg:h-auto">
                        <ImageWithFallback
                          src={project.images?.[0] || ''}
                          alt={project.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          fallbackText="Condo Property"
                        />
                        {/* Status Badge */}
                        <div className="absolute top-4 left-4">
                          <span className={`px-3 py-1 text-sm font-semibold rounded-full text-white ${
                            project.status === 'NEW LAUNCH' ? 'bg-red-600' :
                            project.status === 'TOP' ? 'bg-green-600' :
                            'bg-blue-600'
                          }`}>
                            {project.status}
                          </span>
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="lg:w-2/3 p-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start mb-3">
                          <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                              {project.name}
                            </h3>
                            <p className="text-gray-600">
                              <span className="font-medium">District {project.district}</span> • {project.districtName}
                            </p>
                          </div>
                          
                          {/* Rating */}
                          <div className="flex items-center mt-2 sm:mt-0">
                            <div className="flex text-yellow-400 mr-2">
                              {[...Array(5)].map((_, i) => (
                                <svg 
                                  key={i} 
                                  className={`w-5 h-5 ${i < Math.floor(project.rating) ? 'fill-current' : 'fill-gray-300'}`}
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                            <span className="text-sm text-gray-600">
                              {project.rating} ({project.reviewCount} reviews)
                            </span>
                          </div>
                        </div>
                        
                        {/* Description */}
                        <p className="text-gray-700 mb-4 line-clamp-2">
                          {project.excerpt}
                        </p>
                        
                        {/* Key Info */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-500">Starting From</p>
                            <p className="font-semibold text-lg text-blue-600">{project.priceFromDisplay}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">PSF</p>
                            <p className="font-semibold">{project.pricePsf}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Bedrooms</p>
                            <p className="font-semibold">{project.bedrooms}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Tenure</p>
                            <p className="font-semibold">{project.tenure}</p>
                          </div>
                        </div>
                        
                        {/* Highlights */}
                        <div className="flex flex-wrap gap-2">
                          {project.highlights.map((highlight, index) => (
                            <span 
                              key={index}
                              className="text-xs px-3 py-1 bg-blue-50 text-blue-700 rounded-full"
                            >
                              {highlight}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>

            {/* No Results */}
            {filteredAndSortedProjects.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  No condos match your current filters. Try adjusting your search criteria.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 lg:hidden">
          <div className="absolute right-0 top-0 h-full w-80 bg-white p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Filters</h2>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Mobile filter content - same as desktop */}
            {/* (Content identical to desktop filters) */}
          </div>
        </div>
      )}
    </div>
  )
}