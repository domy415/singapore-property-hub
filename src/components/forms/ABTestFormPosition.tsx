'use client'

import { useABVariant, useABTestContext } from '@/context/ABTestContext'
import LeadCaptureForm from './LeadCaptureForm'
import { useEffect } from 'react'

interface ABTestFormPositionProps {
  className?: string
}

export default function ABTestFormPosition({ className = '' }: ABTestFormPositionProps) {
  const { variant: formVariant, isLoading } = useABVariant('form-position')
  const { trackConversion } = useABTestContext()

  // Track form impressions
  useEffect(() => {
    if (!isLoading) {
      trackConversion('form-position', 'form_impression')
    }
  }, [formVariant, isLoading, trackConversion])

  if (isLoading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="bg-gray-200 rounded-xl h-96"></div>
      </div>
    )
  }

  return (
    <div className={className}>
      {formVariant === 'inline' ? (
        <InlineFormLayout />
      ) : (
        <SidebarFormLayout />
      )}
    </div>
  )
}

function SidebarFormLayout() {
  return (
    <aside className="w-full lg:w-80 flex-shrink-0">
      <div className="sticky top-24 space-y-6">
        <LeadCaptureForm 
          title="Get Your Free Property Report" 
          subtitle="Expert analysis delivered in 24 hours"
          compact={true}
        />
      </div>
    </aside>
  )
}

function InlineFormLayout() {
  const { trackConversion } = useABTestContext()

  const handleFormInteraction = () => {
    trackConversion('form-position', 'inline_form_interaction')
  }

  return (
    <div className="w-full">
      {/* Inline form integrated into content flow */}
      <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-2xl p-8 my-12 border border-blue-100">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Ready to Find Your Perfect Property?
            </h3>
            <p className="text-gray-600 text-lg">
              Join thousands of smart investors getting personalized property insights
            </p>
          </div>
          
          <div onClick={handleFormInteraction}>
            <LeadCaptureForm 
              title=""
              subtitle=""
              className="max-w-2xl mx-auto"
            />
          </div>
          
          {/* Trust badges inline */}
          <div className="flex flex-wrap justify-center items-center gap-6 mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              100% Free Analysis
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Privacy Protected
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <svg className="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              24hr Response
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Layout wrapper component that handles form positioning logic
export function ABTestPageLayout({ 
  children, 
  className = '' 
}: { 
  children: React.ReactNode
  className?: string 
}) {
  const { variant: formVariant, isLoading } = useABVariant('form-position')

  if (isLoading) {
    return <div className={`container mx-auto px-4 py-8 ${className}`}>{children}</div>
  }

  if (formVariant === 'sidebar') {
    return (
      <div className={`container mx-auto px-4 py-8 ${className}`}>
        <div className="flex flex-col lg:flex-row gap-8">
          <main className="flex-1 min-w-0">
            {children}
          </main>
          <ABTestFormPosition />
        </div>
      </div>
    )
  }

  // Inline layout
  return (
    <div className={`container mx-auto px-4 py-8 ${className}`}>
      <div className="max-w-4xl mx-auto">
        {children}
        <ABTestFormPosition />
      </div>
    </div>
  )
}