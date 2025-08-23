'use client'

import Breadcrumbs from '../articles/Breadcrumbs'
import TopCondosTable from './TopCondosTable'
import PriceTrendsChart from './PriceTrendsChart'
import LifestyleAmenities from './LifestyleAmenities'
import SchoolsNearby from './SchoolsNearby'
import TransportationInfo from './TransportationInfo'
import InvestmentOutlook from './InvestmentOutlook'
import LeadCaptureForm from '../forms/LeadCaptureForm'
import InArticleForm from '../forms/InArticleForm'

interface DistrictGuideData {
  districtNumber: number
  districtName: string
  region: 'CCR' | 'RCR' | 'OCR'
  overview: string
  keyHighlights: string[]
  mapImage: string
  topCondos: Array<{
    rank: number
    name: string
    slug: string
    rating: number
    priceFrom: string
    pricePsf: string
    completionYear: string
    developer: string
    units: number
  }>
  priceData: Array<{
    year: string
    averagePrice: string
    growth: string
  }>
  amenities: Array<{
    name: string
    icon: React.ReactNode
    count?: number
    description: string
  }>
  schools: Array<{
    name: string
    type: 'Primary' | 'Secondary' | 'JC' | 'International' | 'Special'
    distance: string
    rating?: number
    description: string
    website?: string
  }>
  transportation: {
    mrtStations: Array<{
      name: string
      line: string
      distance: string
      walkingTime: string
    }>
    busServices: Array<{
      number: string
      description: string
      frequency: string
    }>
    highways: string[]
  }
  investment: {
    pros: Array<{
      title: string
      description: string
    }>
    cons: Array<{
      title: string
      description: string
    }>
    overallRating: number
    rentalYieldRange: string
    capitalGrowthProjection: string
  }
}

interface DistrictGuideTemplateProps {
  data: DistrictGuideData
  className?: string
}

export default function DistrictGuideTemplate({ data, className = "" }: DistrictGuideTemplateProps) {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Districts', href: '/districts' },
    { label: `District ${data.districtNumber}` }
  ]

  const getRegionColor = (region: string) => {
    switch (region) {
      case 'CCR':
        return 'bg-red-100 text-red-800'
      case 'RCR':
        return 'bg-orange-100 text-orange-800'
      case 'OCR':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className={className}>
      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 py-4">
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-white/20 px-4 py-2 rounded-full text-sm font-semibold">
                  District {data.districtNumber}
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRegionColor(data.region)}`}>
                  {data.region}
                </span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                District {data.districtNumber}
              </h1>
              <h2 className="text-2xl md:text-3xl font-semibold mb-6 opacity-90">
                {data.districtName}
              </h2>
              
              <p className="text-xl leading-relaxed mb-8 opacity-90">
                {data.overview}
              </p>

              {/* Key Highlights */}
              <div className="space-y-3">
                {data.keyHighlights.map((highlight, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-yellow-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-white/90">{highlight}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="aspect-square bg-white/20 rounded-xl flex items-center justify-center border-2 border-dashed border-white/40">
                <div className="text-center">
                  <svg className="w-16 h-16 text-white/60 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p className="text-white/80 font-medium">Interactive District Map</p>
                  <p className="text-sm text-white/60">Map integration available</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="space-y-12">
          {/* Top 10 Condominiums */}
          <section id="top-condos">
            <TopCondosTable condos={data.topCondos} />
          </section>

          {/* Price Trends */}
          <section id="price-trends">
            <PriceTrendsChart data={data.priceData} />
          </section>

          {/* In-Article Form */}
          <InArticleForm 
            title={`Get District ${data.districtNumber} Investment Report`}
            subtitle="Want detailed insights about property investment opportunities in this district? Get our comprehensive analysis tailored to your investment goals."
          />

          {/* Lifestyle & Amenities */}
          <section id="lifestyle">
            <LifestyleAmenities amenities={data.amenities} />
          </section>

          {/* Schools Nearby */}
          <section id="schools">
            <SchoolsNearby schools={data.schools} />
          </section>

          {/* Transportation */}
          <section id="transportation">
            <TransportationInfo 
              mrtStations={data.transportation.mrtStations}
              busServices={data.transportation.busServices}
              highways={data.transportation.highways}
            />
          </section>

          {/* Investment Outlook */}
          <section id="investment">
            <InvestmentOutlook 
              pros={data.investment.pros}
              cons={data.investment.cons}
              overallRating={data.investment.overallRating}
              rentalYieldRange={data.investment.rentalYieldRange}
              capitalGrowthProjection={data.investment.capitalGrowthProjection}
            />
          </section>

          {/* Final CTA */}
          <section className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-center text-white">
            <div className="max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Limited Time Offer
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Get Your District {data.districtNumber} Investment Report
              </h2>
              <p className="text-xl mb-8 opacity-90 leading-relaxed">
                Comprehensive analysis including property recommendations, ROI projections, and market timing insights - delivered within 24 hours.
              </p>

              {/* Benefits */}
              <div className="grid md:grid-cols-3 gap-6 mb-8 text-left">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <span className="font-semibold">Market Analysis</span>
                  </div>
                  <p className="text-sm opacity-80">5-year price trends and growth projections</p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span className="font-semibold">Property Shortlist</span>
                  </div>
                  <p className="text-sm opacity-80">Curated recommendations matching your budget</p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span className="font-semibold">Expert Consultation</span>
                  </div>
                  <p className="text-sm opacity-80">15-minute strategy call with property expert</p>
                </div>
              </div>

              <div className="max-w-md mx-auto">
                <LeadCaptureForm 
                  title=""
                  subtitle=""
                  className="bg-white text-primary border-0 shadow-xl"
                  compact={true}
                />
              </div>

              <p className="text-xs opacity-70 mt-4">
                No spam, no sales calls. Just valuable insights delivered to your inbox.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}