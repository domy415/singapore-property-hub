'use client'

import { useState } from 'react'

interface Testimonial {
  id: string
  name: string
  role: string
  content: string
  avatar: string
}

interface Stats {
  reviewsPublished: string
  monthlyReaders: string
  projectsCovered: string
  yearsExperience: string
}

interface TrustIndicatorsProps {
  data: {
    testimonials: Testimonial[]
    stats: Stats
  }
}

export default function TrustIndicators({ data }: TrustIndicatorsProps) {
  const [activeTestimonial, setActiveTestimonial] = useState(0)

  return (
    <section className="py-16 bg-gray-900 text-white">
      <div className="container">
        {/* Stats Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Trusted by Singapore's Property Community
          </h2>
          <p className="text-gray-300 text-lg mb-12">
            Join thousands who rely on our expert insights for their property decisions
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-blue-400 mb-2">
                {data.stats.reviewsPublished}
              </div>
              <div className="text-sm text-gray-300">
                Project Reviews Published
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-blue-400 mb-2">
                {data.stats.monthlyReaders}
              </div>
              <div className="text-sm text-gray-300">
                Monthly Readers
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-blue-400 mb-2">
                {data.stats.projectsCovered}
              </div>
              <div className="text-sm text-gray-300">
                Properties Covered
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-blue-400 mb-2">
                {data.stats.yearsExperience}
              </div>
              <div className="text-sm text-gray-300">
                Years of Experience
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-800 rounded-xl p-8 md:p-12">
            <div className="flex items-center justify-center mb-8">
              <div className="flex space-x-2">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-6 h-6 text-yellow-400 fill-current"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
            
            <div className="text-center mb-8">
              <p className="text-xl md:text-2xl text-gray-100 leading-relaxed mb-6">
                &ldquo;{data.testimonials[activeTestimonial].content}&rdquo;
              </p>
              <div className="flex items-center justify-center">
                <div className="w-12 h-12 bg-gray-600 rounded-full mr-4"></div>
                <div className="text-left">
                  <div className="font-semibold text-white">
                    {data.testimonials[activeTestimonial].name}
                  </div>
                  <div className="text-gray-400 text-sm">
                    {data.testimonials[activeTestimonial].role}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Testimonial Navigation */}
            <div className="flex justify-center space-x-2">
              {data.testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === activeTestimonial ? 'bg-blue-400' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-16">
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="flex items-center gap-2 text-sm">
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              SSL Secured
            </div>
            <div className="flex items-center gap-2 text-sm">
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Privacy Protected
            </div>
            <div className="flex items-center gap-2 text-sm">
              <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Instant Access
            </div>
            <div className="flex items-center gap-2 text-sm">
              <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              No Spam Policy
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <a 
            href="#newsletter" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold inline-flex items-center gap-2 transition-colors"
          >
            Join Our Community Today
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}