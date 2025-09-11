import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Comprehensive Condo Reviews | Singapore Property Hub',
  description: 'Unbiased analysis of Singapore\'s condominium developments with our professional 5-star rating system. Expert reviews and detailed property assessments.',
  alternates: {
    canonical: 'https://singaporepropertyhub.sg/condos',
  },
}

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
    reviewCount: 23,
    priceFrom: '$1.6M',
    pricePsf: '$1,800 psf',
    tenure: 'Freehold',
    completionYear: '2024',
    propertyType: 'New Launch',
    highlights: [
      'Waterfront living with panoramic views',
      'Designer units by renowned architects',
      'Integrated lifestyle amenities'
    ],
    excerpt: 'A stunning waterfront development offering luxury living with panoramic sea views and world-class amenities in the heart of Marina Bay.',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&h=630&fit=crop&q=80'
  },
  {
    id: 'grand-dunman',
    name: 'Grand Dunman',
    slug: 'grand-dunman',
    developer: 'SingHaiyi Group',
    district: 15,
    region: 'RCR',
    status: 'Recent',
    rating: 4.3,
    reviewCount: 18,
    priceFrom: '$1.4M',
    pricePsf: '$1,650 psf',
    tenure: 'Freehold',
    completionYear: '2025',
    propertyType: 'New Launch',
    highlights: [
      'Freehold status in District 15',
      'Family-friendly environment',
      'Excellent connectivity to CBD'
    ],
    excerpt: 'A well-designed family-oriented development in the established Marine Parade area, offering excellent value and strong rental potential.',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=630&fit=crop&q=80'
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
    reviewCount: 31,
    priceFrom: '$1.1M',
    pricePsf: '$1,400 psf',
    tenure: 'Freehold',
    completionYear: '2026',
    propertyType: 'New Launch',
    highlights: [
      'Low-density luxury development',
      'Heritage black & white design',
      'Lentor MRT connectivity'
    ],
    excerpt: 'An exclusive low-density development inspired by Singapore\'s colonial heritage, offering spacious layouts in a tranquil setting.',
    image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200&h=630&fit=crop&q=80'
  },
  {
    id: 'orchard-sophia',
    name: 'Orchard Sophia',
    slug: 'orchard-sophia',
    developer: 'DB2Land',
    district: 9,
    region: 'CCR',
    status: 'Recent',
    rating: 4.8,
    reviewCount: 42,
    priceFrom: '$2.8M',
    pricePsf: '$2,200 psf',
    tenure: 'Freehold',
    completionYear: '2024',
    propertyType: 'New Launch',
    highlights: [
      'Prime Orchard Road location',
      'Boutique luxury development',
      'Walking distance to shopping'
    ],
    excerpt: 'Ultra-luxury boutique development in the heart of Orchard Road, offering unparalleled convenience and prestige.',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&h=630&fit=crop&q=80'
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
    reviewCount: 56,
    priceFrom: '$1.9M',
    pricePsf: '$1,900 psf',
    tenure: '99-year',
    completionYear: '2024',
    propertyType: 'Resale',
    highlights: [
      'Tallest residential towers in Singapore',
      'Integrated retail and dining',
      'MRT connectivity to Tanjong Pagar'
    ],
    excerpt: 'Singapore\'s tallest residential development featuring integrated lifestyle amenities and excellent transport links.',
    image: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=1200&h=630&fit=crop&q=80'
  },
  {
    id: 'normanton-park',
    name: 'Normanton Park',
    slug: 'normanton-park',
    developer: 'Kingsford Development',
    district: 5,
    region: 'RCR',
    status: 'Recent',
    rating: 4.2,
    reviewCount: 29,
    priceFrom: '$1.5M',
    pricePsf: '$1,750 psf',
    tenure: '99-year',
    completionYear: '2025',
    propertyType: 'New Launch',
    highlights: [
      'Spacious layouts and gardens',
      'Family-oriented facilities',
      'Established residential area'
    ],
    excerpt: 'A family-friendly development offering generous living spaces and comprehensive amenities in an established neighborhood.',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=630&fit=crop&q=80'
  }
]

const districts = [
  'All Districts',
  'District 1', 'District 2', 'District 3', 'District 4', 'District 5',
  'District 9', 'District 10', 'District 11', 'District 12', 'District 13',
  'District 14', 'District 15', 'District 16', 'District 17', 'District 18',
  'District 19', 'District 20', 'District 21', 'District 22', 'District 23',
  'District 25', 'District 26', 'District 27', 'District 28'
]

export default function CondosPage() {
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
              Unbiased analysis of Singapore&rsquo;s condominium developments
            </p>
            
            {/* Search Bar */}
            <div className="max-w-lg mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by condo name or district..."
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Filter Sidebar */}
          <div className="lg:col-span-1 mb-8 lg:mb-0">
            <div className="bg-white p-6 rounded-lg shadow-sm border sticky top-24">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Filters</h3>
              
              {/* District Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A66C2] focus:border-[#0A66C2] text-gray-900">
                  {districts.map((district) => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="500000"
                    max="10000000"
                    step="100000"
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>$500K</span>
                    <span>$10M+</span>
                  </div>
                </div>
              </div>

              {/* Completion Year */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Completion Year</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A66C2] focus:border-[#0A66C2] text-gray-900">
                  <option>Any Year</option>
                  <option>2024</option>
                  <option>2025</option>
                  <option>2026</option>
                  <option>2027+</option>
                </select>
              </div>

              {/* Property Type */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-[#0A66C2] focus:ring-[#0A66C2]" />
                    <span className="ml-2 text-sm text-gray-600">New Launch</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-[#0A66C2] focus:ring-[#0A66C2]" />
                    <span className="ml-2 text-sm text-gray-600">Resale</span>
                  </label>
                </div>
              </div>

              <button className="w-full bg-[#0A66C2] text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-800 transition-colors">
                Apply Filters
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Sort Dropdown */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">{condoProjects.length} condos found</p>
              <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A66C2] focus:border-[#0A66C2] text-gray-900">
                <option>Latest Reviews</option>
                <option>Highest Rated</option>
                <option>Most Viewed</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </select>
            </div>

            {/* Condo Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {condoProjects.map((project) => (
                <CondoReviewCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function CondoReviewCard({ project }: { project: typeof condoProjects[0] }) {
  return (
    <Link
      href={`/condos/${project.slug}/review-2025`}
      className="group bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border"
      style={{ height: '450px' }}
    >
      {/* Image */}
      <div className="relative h-[260px] overflow-hidden">
        <Image
          src={project.image}
          alt={project.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 left-4">
          <span className={`px-2 py-1 rounded text-xs font-semibold text-white ${
            project.status === 'Recent' ? 'bg-green-500' :
            project.status === 'Upcoming' ? 'bg-blue-500' :
            'bg-orange-500'
          }`}>
            {project.status}
          </span>
        </div>
        <div className="absolute top-4 right-4 bg-white/90 px-2 py-1 rounded flex items-center gap-1">
          <StarRating rating={project.rating} />
          <span className="text-xs text-gray-600">({project.reviewCount})</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 h-[190px] flex flex-col">
        <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#0A66C2] transition-colors mb-1">
          {project.name}
        </h3>
        <p className="text-sm text-gray-600 mb-2">{project.developer} • {project.completionYear}</p>
        
        {/* Key Highlights */}
        <div className="mb-3 flex-1">
          <ul className="text-xs text-gray-600 space-y-1">
            {project.highlights.slice(0, 3).map((highlight, index) => (
              <li key={index} className="flex items-start">
                <span className="text-[#0A66C2] mr-1">•</span>
                {highlight}
              </li>
            ))}
          </ul>
        </div>

        {/* Review Excerpt */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2 flex-1">
          {project.excerpt}
        </p>

        {/* Price and CTA */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
          <div>
            <div className="text-lg font-bold text-[#0A66C2]">{project.priceFrom}</div>
            <div className="text-xs text-gray-500">{project.pricePsf}</div>
          </div>
          <button className="bg-[#0A66C2] text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-800 transition-colors">
            Read Full Review
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
          className={`w-3 h-3 ${star <= Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="text-xs font-medium text-gray-600 ml-1">{rating}</span>
    </div>
  )
}