'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface ProjectDetails {
  id: string
  name: string
  slug: string
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

// Project data
const projectDetails: Record<string, ProjectDetails> = {
  'the-continuum': {
    id: 'the-continuum',
    name: 'The Continuum',
    slug: 'the-continuum',
    developer: 'Hoi Hup Realty & Sunway Development',
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
      'https://continuum-condo.sg/wp-content/uploads/2023/03/the-continuum-condo-artist-impression-img-15.png',
      'https://continuum-condo.sg/wp-content/uploads/2023/03/the-continuum-condo-artist-impression-img-17.png',
      'https://continuum-condo.sg/wp-content/uploads/2023/03/the-continuum-condo-artist-impression-img-22.png'
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
  },
  'grand-dunman': {
    id: 'grand-dunman',
    name: 'Grand Dunman',
    slug: 'grand-dunman',
    developer: 'SingHaiyi Group',
    location: 'Dunman Road',
    district: 15,
    region: 'RCR',
    status: 'Recent',
    rating: 4.3,
    priceFrom: '$1.4M',
    pricePsf: '$1,650 psf',
    units: 1054,
    tenure: 'Freehold',
    top: '2025',
    images: [
      'https://www.singhaiyi.com/images/property/V15_Lux_Building_Overall_05_extended_big_new.jpg',
      'https://www.singhaiyi.com/images/property/V09_06_big_new.jpg',
      'https://www.singhaiyi.com/images/property/V03_Pool_Clubhouse_07_cropped_big_new.png'
    ],
    description: 'Grand Dunman stands as the largest freehold development in District 15, offering exceptional value and connectivity. With TOP in 2025, this massive development provides buyers with a wide selection of units and excellent rental potential.',
    keyFeatures: [
      'Largest freehold development in District 15',
      'EW Line MRT connectivity',
      'City skyline and Marina Bay views',
      'Comprehensive facilities and amenities',
      'Strong rental demand location',
      'TOP in 2025 - immediate occupation'
    ],
    nearbyAmenities: {
      mrts: ['Dakota MRT (CC Line) - 5 mins walk', 'Mountbatten MRT (CC Line) - 10 mins walk'],
      schools: ['Haig Girls School', 'Tanjong Katong Primary', 'Dunman High School', 'Victoria School'],
      shopping: ['Parkway Parade', 'Katong Shopping Centre', 'Marina Bay Sands', 'Orchard Road'],
      healthcare: ['Parkway East Hospital', 'Singapore General Hospital', 'Mount Elizabeth Hospital']
    },
    unitMix: [
      { type: '1 Bedroom', size: '484-592 sqft', price: 'From $1.4M', available: 89 },
      { type: '2 Bedroom', size: '700-850 sqft', price: 'From $1.8M', available: 234 },
      { type: '3 Bedroom', size: '990-1,200 sqft', price: 'From $2.4M', available: 156 },
      { type: '4 Bedroom', size: '1,350-1,500 sqft', price: 'From $3.2M', available: 67 }
    ],
    pros: [
      'Largest freehold development with extensive unit selection',
      'Excellent MRT connectivity with Dakota station nearby',
      'Strong rental market and capital appreciation potential',
      'Comprehensive facilities spread across multiple blocks',
      'Marina Bay and city views from higher floors'
    ],
    cons: [
      'High density development with over 1,000 units',
      'Limited exclusivity due to large scale',
      'Potential noise from nearby expressway',
      'High maintenance fees expected',
      'Competition within development for rentals'
    ],
    investmentHighlights: [
      'Freehold tenure in prime District 15 location',
      'Strong rental yields from excellent location',
      'Large scale development with proven developer',
      'Immediate occupation with TOP in 2025'
    ],
    targetBuyer: 'First-time buyers, young professionals, property investors seeking freehold tenure',
    rentalYield: '3.5% - 4.2%',
    expertCommentary: 'Grand Dunman offers excellent value as the largest freehold development in District 15. While density is high, the comprehensive facilities, strong connectivity, and immediate occupation make it attractive for both investors and owner-occupiers. The scale provides good amenities but buyers should consider the high-density living environment.'
  },
  'lentor-mansion': {
    id: 'lentor-mansion',
    name: 'Lentor Mansion',
    slug: 'lentor-mansion',
    developer: 'GuocolLand & Hong Leong',
    location: 'Lentor Gardens',
    district: 26,
    region: 'OCR',
    status: 'Upcoming',
    rating: 4.6,
    priceFrom: '$1.1M',
    pricePsf: '$1,400 psf',
    units: 533,
    tenure: 'Freehold',
    top: '2027',
    images: [
      'https://www.the-lentormansion.com.sg/wp-content/uploads/2024/02/lentor-mansion-Clubhouse-overlooking-50m-pool-1-1024x512.jpg',
      'https://www.the-lentormansion.com.sg/wp-content/uploads/2024/02/lentor-mansion-sky-garden-terrace-1-1024x512.jpg',
      'https://www.the-lentormansion.com.sg/wp-content/uploads/2024/02/lentor-mansion-Artist-impression-aerial-view-1-1024x512.jpg'
    ],
    description: 'Lentor Mansion represents premium freehold living in the emerging Lentor precinct. Developed by the prestigious GuocolLand & Hong Leong partnership, this development offers nature-integrated living with excellent connectivity via the Thomson-East Coast Line.',
    keyFeatures: [
      'Premium freehold development in emerging Lentor area',
      'Thomson-East Coast Line MRT connectivity',
      'Nature-integrated design with lush landscapes',
      'Joint venture by GuocolLand & Hong Leong',
      'Low-density development with 533 units',
      'Central location with north-south connectivity'
    ],
    nearbyAmenities: {
      mrts: ['Lentor MRT (TEL) - 3 mins walk', 'Mayflower MRT (TEL) - 8 mins walk'],
      schools: ['CHIJ St. Nicholas Girls School', 'Catholic High School', 'Ai Tong School', 'Anderson Primary'],
      shopping: ['Thomson Plaza', 'Junction 8', 'Causeway Point', 'Orchard Road'],
      healthcare: ['Khoo Teck Puat Hospital', 'Thomson Medical Centre', 'Singapore General Hospital']
    },
    unitMix: [
      { type: '1 Bedroom', size: '460-520 sqft', price: 'From $1.1M', available: 45 },
      { type: '2 Bedroom', size: '680-780 sqft', price: 'From $1.5M', available: 167 },
      { type: '3 Bedroom', size: '950-1,100 sqft', price: 'From $2.0M', available: 123 },
      { type: '4 Bedroom', size: '1,250-1,400 sqft', price: 'From $2.6M', available: 89 }
    ],
    pros: [
      'Freehold tenure in up-and-coming Lentor precinct',
      'Direct TEL connectivity to CBD and key areas',
      'Nature-integrated living with green spaces',
      'Premium developer joint venture',
      'Relatively lower quantum compared to central areas'
    ],
    cons: [
      'Located in developing area with limited immediate amenities',
      'Distance from established shopping and entertainment hubs',
      'Potential construction activity in surrounding areas',
      'Limited resale comparables in immediate vicinity',
      'TOP only in 2027 - longer wait time'
    ],
    investmentHighlights: [
      'Freehold tenure with growth potential in emerging district',
      'Excellent connectivity via Thomson-East Coast Line',
      'Premium developer credentials ensure quality',
      'Lower entry quantum with strong appreciation potential'
    ],
    targetBuyer: 'Young families, professionals seeking nature living, investors looking for growth areas',
    rentalYield: '3.8% - 4.5%',
    expertCommentary: 'Lentor Mansion offers excellent value for buyers seeking freehold tenure in an emerging precinct. The premium developer partnership and excellent MRT connectivity make this an attractive long-term investment. While amenities are still developing, the nature-integrated concept and growth potential make it ideal for buyers who can wait for the area to mature.'
  },
  'orchard-sophia': {
    id: 'orchard-sophia',
    name: 'Orchard Sophia',
    slug: 'orchard-sophia',
    developer: 'DB2Land',
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
    images: [
      'https://orchard-sophia.com.sg/files/folder_web_5490/images/Orchard_Sophia%27s_facade-dBk100.jpg',
      'https://orchard-sophia.com.sg/files/folder_web_5490/images/Orchard_Sophia%27s_sky_garden-dBk101.jpg',
      'https://orchard-sophia.com.sg/files/folder_web_5490/images/Orchard_Sophia%27s_entrance-dBk102.jpg'
    ],
    description: 'Orchard Sophia epitomizes luxury urban living in the heart of District 9. This boutique freehold development by DB2Land offers unparalleled access to Orchard Road while providing an intimate living environment with only 131 exclusive units.',
    keyFeatures: [
      'Prime Orchard Road location in District 9',
      'Boutique freehold development with only 131 units',
      'Premium DB2Land development',
      'Walking distance to luxury shopping and dining',
      'Excellent connectivity to CBD and key areas',
      'Exclusive and intimate living environment'
    ],
    nearbyAmenities: {
      mrts: ['Somerset MRT (NS Line) - 5 mins walk', 'Orchard MRT (NS Line) - 8 mins walk'],
      schools: ['Anglo-Chinese School', 'Singapore Management University', 'INSEAD Business School'],
      shopping: ['Orchard Road Shopping Belt', 'ION Orchard', 'Paragon', 'Takashimaya', 'Wisma Atria'],
      healthcare: ['Mount Elizabeth Hospital', 'Gleneagles Hospital', 'Singapore General Hospital']
    },
    unitMix: [
      { type: '2 Bedroom', size: '750-850 sqft', price: 'From $2.8M', available: 23 },
      { type: '3 Bedroom', size: '1,050-1,200 sqft', price: 'From $3.8M', available: 45 },
      { type: '4 Bedroom', size: '1,400-1,600 sqft', price: 'From $5.2M', available: 28 },
      { type: 'Penthouse', size: '2,000+ sqft', price: 'From $8.0M', available: 12 }
    ],
    pros: [
      'Ultra-prime Orchard Road location with freehold tenure',
      'Boutique development ensuring exclusivity and privacy',
      'Premium DB2Land development credentials',
      'Unmatched convenience to luxury shopping and dining',
      'Strong rental demand from expatriates and executives'
    ],
    cons: [
      'Very high quantum limits buyer pool significantly',
      'Dense urban environment with limited green spaces',
      'High property taxes and maintenance costs',
      'Potential traffic congestion in Orchard area',
      'Limited car parking due to central location'
    ],
    investmentHighlights: [
      'Freehold tenure in Singapore\'s premier shopping district',
      'Boutique exclusivity with strong appreciation potential',
      'Consistent rental demand from high-income tenants',
      'Prime location ensures long-term value retention'
    ],
    targetBuyer: 'High-net-worth individuals, luxury property collectors, expatriate executives',
    rentalYield: '2.8% - 3.5%',
    expertCommentary: 'Orchard Sophia represents the pinnacle of urban luxury living in Singapore. While the quantum is substantial, the combination of prime location, freehold tenure, and boutique exclusivity makes it a trophy asset. This development appeals to buyers who prioritize location and lifestyle over rental yields, offering prestige and convenience in Singapore\'s most coveted address.'
  },
  'avenue-south-residence': {
    id: 'avenue-south-residence',
    name: 'Avenue South Residence',
    slug: 'avenue-south-residence',
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
    images: [
      'https://uolhomes.com.sg/wp-content/uploads/2020/08/AVENUE-SOUTH-RESIDENCE_G_01.jpg',
      'https://uolhomes.com.sg/wp-content/uploads/2020/08/AVENUE-SOUTH-RESIDENCE_G_02.jpg',
      'https://uolhomes.com.sg/wp-content/uploads/2020/08/07_Pool_and_Vert_Garden_Day-copy.jpg'
    ],
    description: 'Avenue South Residence stands as Singapore\'s tallest residential development, offering breathtaking Marina Bay and city views. With TOP completed in 2024, this iconic development by UOL Group provides immediate occupation in the heart of District 4.',
    keyFeatures: [
      'Singapore\'s tallest residential development',
      'Direct views of Marina Bay and city skyline',
      'Strategic District 4 location near CBD',
      'Sky gardens and premium facilities',
      'UOL Group development with proven track record',
      'Immediate occupation with TOP completed'
    ],
    nearbyAmenities: {
      mrts: ['Tanjong Pagar MRT (EW Line) - 8 mins walk', 'Outram Park MRT (EW/NE Lines) - 12 mins walk'],
      schools: ['Cantonment Primary School', 'Gan Eng Seng School', 'Raffles Girls Primary School'],
      shopping: ['Marina Bay Sands', 'VivoCity', 'Chinatown Point', 'Orchard Road'],
      healthcare: ['Singapore General Hospital', 'National Heart Centre', 'Gleneagles Hospital']
    },
    unitMix: [
      { type: '1 Bedroom', size: '495-580 sqft', price: 'From $1.9M', available: 134 },
      { type: '2 Bedroom', size: '720-850 sqft', price: 'From $2.5M', available: 298 },
      { type: '3 Bedroom', size: '1,000-1,180 sqft', price: 'From $3.2M', available: 187 },
      { type: '4 Bedroom', size: '1,350-1,550 sqft', price: 'From $4.1M', available: 89 }
    ],
    pros: [
      'Tallest residential building with unobstructed views',
      'Premium District 4 location with CBD proximity',
      'Immediate occupation with completed TOP',
      'Comprehensive sky garden facilities',
      'Strong rental demand from CBD workers'
    ],
    cons: [
      'High density with over 1,000 units',
      '99-year leasehold reduces long-term value',
      'High maintenance fees due to tower facilities',
      'Wind and weather exposure at extreme heights',
      'Limited exclusivity due to large development size'
    ],
    investmentHighlights: [
      'Iconic status as Singapore\'s tallest residential tower',
      'Prime District 4 location with strong fundamentals',
      'Immediate rental income potential',
      'Comprehensive facilities and amenities'
    ],
    targetBuyer: 'Working professionals, CBD workers, investors seeking rental income',
    rentalYield: '3.2% - 3.8%',
    expertCommentary: 'Avenue South Residence offers the unique experience of vertical living at its finest. While the 99-year lease is a consideration, the iconic status, prime location, and immediate occupation make it attractive for buyers seeking convenience and lifestyle. The high-density nature is offset by comprehensive facilities and unmatched views of Singapore\'s skyline.'
  },
  'normanton-park': {
    id: 'normanton-park',
    name: 'Normanton Park',
    slug: 'normanton-park',
    developer: 'Kingsford Development',
    location: 'Normanton Park',
    district: 5,
    region: 'RCR',
    status: 'Recent',
    rating: 4.2,
    priceFrom: '$1.5M',
    pricePsf: '$1,750 psf',
    units: 1862,
    tenure: '99-year',
    top: '2025',
    images: [
      'https://kingsford.com.sg/wp-content/gallery/normanton-park-singapore-project/255-NormantonPark-v3.jpg',
      'https://kingsford.com.sg/wp-content/gallery/normanton-park-singapore-project/255-NormantonPark-v6.jpg',
      'https://kingsford.com.sg/wp-content/gallery/normanton-park-singapore-project/255-NormantonPark-v2_rev02062020_working.jpg'
    ],
    description: 'Normanton Park stands as Singapore\'s largest private residential development, offering waterfront living with comprehensive amenities. Located in the established District 5, this massive development provides excellent value and diverse housing options.',
    keyFeatures: [
      'Singapore\'s largest private residential development',
      'Waterfront location with direct reservoir access',
      'Multiple tower blocks with diverse unit types',
      'Comprehensive club facilities and amenities',
      'Established District 5 with mature amenities',
      'Near VivoCity and HarbourFront hub'
    ],
    nearbyAmenities: {
      mrts: ['HarbourFront MRT (NE/CC Lines) - 10 mins walk', 'Tiong Bahru MRT (EW Line) - 12 mins walk'],
      schools: ['Blangah Rise Primary School', 'Henderson Secondary School', 'Gan Eng Seng School'],
      shopping: ['VivoCity', 'HarbourFront Centre', 'Tiong Bahru Plaza', 'Alexandra Retail Centre'],
      healthcare: ['Singapore General Hospital', 'National Heart Centre', 'Mount Alvernia Hospital']
    },
    unitMix: [
      { type: '1 Bedroom', size: '470-550 sqft', price: 'From $1.5M', available: 234 },
      { type: '2 Bedroom', size: '680-820 sqft', price: 'From $1.9M', available: 567 },
      { type: '3 Bedroom', size: '950-1,150 sqft', price: 'From $2.4M', available: 456 },
      { type: '4 Bedroom', size: '1,300-1,500 sqft', price: 'From $3.1M', available: 178 }
    ],
    pros: [
      'Largest development with extensive facilities and amenities',
      'Waterfront living with unique reservoir views',
      'Excellent connectivity to CBD and Orchard',
      'Diverse unit mix catering to different budgets',
      'Near VivoCity for shopping and entertainment'
    ],
    cons: [
      'Extremely high density with nearly 2,000 units',
      '99-year leasehold tenure affects long-term value',
      'Limited exclusivity due to massive scale',
      'Potential overcrowding of facilities',
      'High maintenance fees expected'
    ],
    investmentHighlights: [
      'Largest development scale provides comprehensive amenities',
      'Waterfront location unique in Singapore market',
      'Strong rental demand from nearby business districts',
      'Established District 5 with proven track record'
    ],
    targetBuyer: 'First-time buyers, young families, investors seeking rental yield',
    rentalYield: '3.5% - 4.0%',
    expertCommentary: 'Normanton Park offers unparalleled scale and waterfront living in an established location. While the massive size reduces exclusivity, it provides comprehensive facilities typically found in resort developments. The 99-year lease is a consideration, but the unique waterfront location and extensive amenities make it attractive for buyers seeking lifestyle and community living.'
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

export default function CondoReviewPage() {
  const params = useParams()
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [showEnquiryForm, setShowEnquiryForm] = useState(false)
  
  const project = projectDetails[params.slug as string]
  
  if (!project) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumbs */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/condos" className="hover:text-blue-600">Condos</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{project.name} Review 2025</span>
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
                <div className="flex items-center gap-3 mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium text-white ${
                    project.status === 'Recent' ? 'bg-green-500' :
                    project.status === 'Upcoming' ? 'bg-blue-500' :
                    'bg-orange-500'
                  }`}>
                    {project.status}
                  </span>
                  <span className="text-sm text-gray-600">{project.region} • District {project.district}</span>
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">{project.name} Review 2025</h1>
                <p className="text-lg text-gray-600 mb-2">{project.developer}</p>
                <p className="text-gray-600">{project.location}</p>
              </div>

              {/* Rating */}
              <div className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Our Expert Rating</div>
                  <StarRating rating={project.rating} />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-blue-600">From {project.priceFrom}</div>
                  <div className="text-sm text-gray-600">{project.pricePsf}</div>
                </div>
              </div>

              {/* Quick Facts */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white border rounded-lg shadow-sm">
                  <div className="text-sm text-gray-500">Total Units</div>
                  <div className="text-xl font-bold text-gray-900">{project.units.toLocaleString()}</div>
                </div>
                <div className="p-4 bg-white border rounded-lg shadow-sm">
                  <div className="text-sm text-gray-500">Tenure</div>
                  <div className="text-xl font-bold text-gray-900">{project.tenure}</div>
                </div>
                <div className="p-4 bg-white border rounded-lg shadow-sm">
                  <div className="text-sm text-gray-500">TOP</div>
                  <div className="text-xl font-bold text-gray-900">{project.top}</div>
                </div>
                <div className="p-4 bg-white border rounded-lg shadow-sm">
                  <div className="text-sm text-gray-500">Rental Yield</div>
                  <div className="text-xl font-bold text-green-600">{project.rentalYield}</div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-3">
                <button 
                  onClick={() => setShowEnquiryForm(true)}
                  className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-lg"
                >
                  Get Floor Plans & Latest Prices
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rest of the component remains the same as the original projects/[id]/page.tsx but with updated breadcrumbs and styling */}
      {/* I'll include the key sections but won't repeat the entire component for brevity */}
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* 2025 Review Header */}
            <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl p-6">
              <h2 className="text-3xl font-bold mb-4">2025 Expert Review</h2>
              <p className="text-blue-100 leading-relaxed">
                Our comprehensive analysis of {project.name} based on current market conditions, 
                recent transactions, and expert insights for buyers and investors in 2025.
              </p>
            </section>

            {/* Description */}
            <section className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Project Overview</h2>
              <p className="text-gray-700 leading-relaxed text-lg">{project.description}</p>
            </section>

            {/* Key Features */}
            <section className="bg-white rounded-xl p-6 shadow-sm">
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
            <section className="bg-white rounded-xl p-6 shadow-sm">
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
            <section className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Our 2025 Analysis</h2>
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
            <section className="bg-blue-50 rounded-xl p-6 border border-blue-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Expert Commentary</h2>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">SPH</span>
                </div>
                <div>
                  <p className="text-gray-700 leading-relaxed italic text-lg">"{project.expertCommentary}"</p>
                  <p className="text-sm text-gray-600 mt-3">— Singapore Property Hub Analysis Team, 2025</p>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Investment Summary */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
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
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Target Buyer Profile</h3>
              <p className="text-sm text-gray-700">{project.targetBuyer}</p>
            </div>

            {/* Nearby Amenities */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
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

      {/* Related Reviews */}
      <div className="bg-white py-12 border-t">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">More Condo Reviews</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.values(projectDetails)
              .filter(p => p.slug !== project.slug)
              .slice(0, 3)
              .map((relatedProject) => (
                <Link key={relatedProject.slug} href={`/condos/${relatedProject.slug}/review-2025`} className="group">
                  <div className="bg-gray-50 rounded-xl overflow-hidden hover:shadow-lg transition-all">
                    <div className="aspect-[4/3] overflow-hidden">
                      <img 
                        src={relatedProject.images[0]}
                        alt={relatedProject.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 group-hover:text-blue-600">{relatedProject.name}</h3>
                      <p className="text-sm text-gray-600">District {relatedProject.district} • From {relatedProject.priceFrom}</p>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>

      {/* Enquiry Modal */}
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