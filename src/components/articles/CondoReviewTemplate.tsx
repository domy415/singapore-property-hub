'use client'

import { useState } from 'react'
import Breadcrumbs from './Breadcrumbs'
import QuickFactsTable from './QuickFactsTable'
import TableOfContents from './TableOfContents'
import CollapsibleFAQ from './CollapsibleFAQ'
import RelatedArticles from './RelatedArticles'
import LeadCaptureForm from '../forms/LeadCaptureForm'
import InArticleForm from '../forms/InArticleForm'

interface CondoReviewData {
  name: string
  slug: string
  heroImage: string
  rating: number
  quickFacts: {
    yearBuilt: string
    totalUnits: string
    developer: string
    mrtDistance: string
  }
  overview: string
  pros: string[]
  cons: string[]
  facilities: string[]
  location: {
    description: string
    connectivity: string[]
    amenities: string[]
  }
  investment: {
    rentalYield: string
    capitalAppreciation: string
    targetBuyers: string[]
    marketOutlook: string
  }
  faqs: Array<{
    question: string
    answer: string
  }>
  relatedArticles: Array<{
    id: string
    title: string
    excerpt: string
    slug: string
    category: string
    readTime: string
    image: string
    publishedAt: Date
  }>
}

interface CondoReviewTemplateProps {
  data: CondoReviewData
  className?: string
}

export default function CondoReviewTemplate({ data, className = "" }: CondoReviewTemplateProps) {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Condos', href: '/condos' },
    { label: data.name }
  ]

  const quickFacts = [
    {
      label: 'Year Built',
      value: data.quickFacts.yearBuilt,
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
    },
    {
      label: 'Total Units',
      value: data.quickFacts.totalUnits,
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
    },
    {
      label: 'Developer',
      value: data.quickFacts.developer,
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
    },
    {
      label: 'MRT Distance',
      value: data.quickFacts.mrtDistance,
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
    }
  ]

  const tocItems = [
    { id: 'overview', title: 'Overview', level: 1 },
    { id: 'the-good', title: 'The Good', level: 1 },
    { id: 'the-not-so-good', title: 'The Not-So-Good', level: 1 },
    { id: 'facilities', title: 'Facilities & Amenities', level: 1 },
    { id: 'location', title: 'Location & Connectivity', level: 1 },
    { id: 'investment', title: 'Investment Analysis', level: 1 },
    { id: 'faqs', title: 'Frequently Asked Questions', level: 1 }
  ]

  const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-6 h-6 ${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="text-lg font-bold text-primary ml-2">{rating}/5</span>
    </div>
  )

  return (
    <div className={className}>
      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 py-4">
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      {/* Hero Section */}
      <div className="relative h-[500px] w-full overflow-hidden">
        <img 
          src={data.heroImage} 
          alt={data.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto">
            <div className="max-w-4xl">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
                {data.name} Review
              </h1>
              <div className="mb-4">
                <StarRating rating={data.rating} />
              </div>
              <p className="text-xl text-white/90 mb-6">
                Comprehensive analysis and expert review of {data.name}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <QuickFactsTable facts={quickFacts} />
              <div className="hidden lg:block">
                <TableOfContents items={tocItems} />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="prose prose-lg max-w-none">
              {/* Overview */}
              <section id="overview" className="mb-12">
                <h2 className="text-3xl font-bold text-primary mb-6 flex items-center gap-3">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Overview
                </h2>
                <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg mb-6">
                  <p className="text-primary leading-relaxed text-lg">{data.overview}</p>
                </div>
              </section>

              {/* The Good */}
              <section id="the-good" className="mb-12">
                <h2 className="text-3xl font-bold text-primary mb-6 flex items-center gap-3">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  The Good
                </h2>
                <div className="grid gap-4">
                  {data.pros.map((pro, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="text-primary font-medium">{pro}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* The Not-So-Good */}
              <section id="the-not-so-good" className="mb-12">
                <h2 className="text-3xl font-bold text-primary mb-6 flex items-center gap-3">
                  <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  The Not-So-Good
                </h2>
                <div className="grid gap-4">
                  {data.cons.map((con, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-orange-50 rounded-lg border border-orange-200">
                      <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </div>
                      <p className="text-primary font-medium">{con}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* In-Article Form */}
              <InArticleForm 
                title={`Get Detailed ${data.name} Analysis`}
                subtitle="Want personalized insights about this development? Get expert analysis tailored to your investment goals."
              />

              {/* Facilities & Amenities */}
              <section id="facilities" className="mb-12">
                <h2 className="text-3xl font-bold text-primary mb-6 flex items-center gap-3">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  Facilities & Amenities
                </h2>
                <div className="grid md:grid-cols-2 gap-3">
                  {data.facilities.map((facility, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                      <div className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-3 h-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-primary">{facility}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Location & Connectivity */}
              <section id="location" className="mb-12">
                <h2 className="text-3xl font-bold text-primary mb-6 flex items-center gap-3">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  Location & Connectivity
                </h2>
                
                <div className="bg-gray-50 p-6 rounded-lg mb-6">
                  <p className="text-primary leading-relaxed">{data.location.description}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-bold text-primary mb-4">Transport Connectivity</h3>
                    <div className="space-y-2">
                      {data.location.connectivity.map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-secondary">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-primary mb-4">Nearby Amenities</h3>
                    <div className="space-y-2">
                      {data.location.amenities.map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-secondary">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* Investment Analysis */}
              <section id="investment" className="mb-12">
                <h2 className="text-3xl font-bold text-primary mb-6 flex items-center gap-3">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  Investment Analysis
                </h2>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                    <h3 className="text-lg font-bold text-primary mb-2">Rental Yield</h3>
                    <div className="text-3xl font-bold text-green-600 mb-2">{data.investment.rentalYield}</div>
                    <p className="text-sm text-secondary">Expected annual return</p>
                  </div>

                  <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                    <h3 className="text-lg font-bold text-primary mb-2">Capital Appreciation</h3>
                    <div className="text-3xl font-bold text-blue-600 mb-2">{data.investment.capitalAppreciation}</div>
                    <p className="text-sm text-secondary">Projected growth potential</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg mb-6">
                  <h3 className="text-lg font-bold text-primary mb-4">Target Buyer Profile</h3>
                  <div className="flex flex-wrap gap-2">
                    {data.investment.targetBuyers.map((buyer, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        {buyer}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-lg">
                  <h3 className="text-lg font-bold text-primary mb-2">Market Outlook</h3>
                  <p className="text-primary">{data.investment.marketOutlook}</p>
                </div>
              </section>

              {/* FAQ Section */}
              <section id="faqs" className="mb-12">
                <h2 className="text-3xl font-bold text-primary mb-6 flex items-center gap-3">
                  <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Frequently Asked Questions
                </h2>
                <CollapsibleFAQ faqs={data.faqs} />
              </section>

              {/* CTA Section */}
              <section className="mb-12">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center text-white">
                  <h2 className="text-3xl font-bold mb-4">Get Your Detailed {data.name} Report</h2>
                  <p className="text-xl mb-8 opacity-90">
                    Ready to dive deeper? Get our comprehensive analysis including floor plans, pricing details, and personalized investment recommendations.
                  </p>
                  <div className="max-w-md mx-auto">
                    <LeadCaptureForm 
                      title=""
                      subtitle=""
                      className="bg-white text-primary border-0"
                      compact={true}
                    />
                  </div>
                </div>
              </section>

              {/* Related Articles */}
              <RelatedArticles articles={data.relatedArticles} className="mb-12" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}