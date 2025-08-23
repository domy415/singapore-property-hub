'use client'

import { useState, useEffect } from 'react'
import LeadCaptureForm from './LeadCaptureForm'

interface InArticleFormProps {
  scrollThreshold?: number
  title?: string
  subtitle?: string
  className?: string
}

export default function InArticleForm({ 
  scrollThreshold = 0.3,
  title = "Want Personalized Property Insights?",
  subtitle = "Get expert analysis tailored to your needs and budget. Join thousands of smart property investors.",
  className = ""
}: InArticleFormProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [hasShown, setHasShown] = useState(false)

  useEffect(() => {
    if (hasShown) return

    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = scrollTop / scrollHeight

      if (scrollPercent >= scrollThreshold && !hasShown) {
        setIsVisible(true)
        setHasShown(true)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [scrollThreshold, hasShown])

  if (!isVisible) {
    return null
  }

  return (
    <div className={`my-16 ${className}`}>
      {/* Visual Separator */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex-1 border-t border-gray-300"></div>
        <div className="px-4">
          <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
            EXPERT INSIGHT
          </div>
        </div>
        <div className="flex-1 border-t border-gray-300"></div>
      </div>

      {/* Form Container */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100 animate-fade-in-up">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Limited Time Offer
            </div>
            <h3 className="text-3xl md:text-4xl font-bold text-primary mb-4">{title}</h3>
            <p className="text-lg text-secondary max-w-2xl mx-auto leading-relaxed">{subtitle}</p>
          </div>

          {/* Two Column Layout */}
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Benefits Column */}
            <div className="space-y-6">
              <h4 className="text-xl font-bold text-primary mb-4">What You'll Get:</h4>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h5 className="font-semibold text-primary">Market Analysis Report</h5>
                    <p className="text-sm text-secondary">Comprehensive analysis of current market trends and pricing in your preferred areas.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h5 className="font-semibold text-primary">Investment Opportunities</h5>
                    <p className="text-sm text-secondary">Curated list of properties matching your budget and investment criteria.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h5 className="font-semibold text-primary">Expert Consultation</h5>
                    <p className="text-sm text-secondary">15-minute phone consultation to discuss your property strategy.</p>
                  </div>
                </div>
              </div>

              {/* Social Proof */}
              <div className="bg-white rounded-xl p-4 border border-gray-200 mt-6">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full"></div>
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-teal-600 rounded-full"></div>
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-full"></div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-primary">2,847+ investors trust us</p>
                    <p className="text-xs text-secondary">Average response time: 4 hours</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Column */}
            <div>
              <LeadCaptureForm 
                title="Get Your Free Analysis"
                subtitle="Fill out this form and receive your personalized report within 24 hours."
                className="border-2 border-white shadow-xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Separator */}
      <div className="flex items-center justify-center mt-8">
        <div className="flex-1 border-t border-gray-300"></div>
        <div className="px-4">
          <div className="text-xs text-secondary uppercase tracking-wider">
            Continue Reading
          </div>
        </div>
        <div className="flex-1 border-t border-gray-300"></div>
      </div>

      {/* Styles for animation */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  )
}