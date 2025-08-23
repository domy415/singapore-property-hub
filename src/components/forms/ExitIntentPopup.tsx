'use client'

import { useState, useEffect } from 'react'
import LeadCaptureForm from './LeadCaptureForm'

interface ExitIntentPopupProps {
  className?: string
}

export default function ExitIntentPopup({ className = "" }: ExitIntentPopupProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [hasShown, setHasShown] = useState(false)

  useEffect(() => {
    // Check if popup was already shown in this session
    const wasShown = sessionStorage.getItem('exit-intent-shown') === 'true'
    if (wasShown) {
      setHasShown(true)
      return
    }

    let exitTimer: NodeJS.Timeout | null = null

    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger if mouse is leaving from the top of the viewport
      if (e.clientY <= 0 && !hasShown) {
        // Small delay to avoid accidental triggers
        exitTimer = setTimeout(() => {
          setIsVisible(true)
          setHasShown(true)
          sessionStorage.setItem('exit-intent-shown', 'true')
        }, 100)
      }
    }

    const handleMouseEnter = () => {
      // Cancel the timer if mouse re-enters quickly
      if (exitTimer) {
        clearTimeout(exitTimer)
        exitTimer = null
      }
    }

    // Add event listeners
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mouseenter', handleMouseEnter)

    // Cleanup
    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseenter', handleMouseEnter)
      if (exitTimer) {
        clearTimeout(exitTimer)
      }
    }
  }, [hasShown])

  const handleClose = () => {
    setIsVisible(false)
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose()
    }
  }

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isVisible) {
        handleClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isVisible])

  if (!isVisible) {
    return null
  }

  return (
    <div 
      className={`fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-center justify-center p-4 ${className}`}
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-zoom-in">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-red-600 to-orange-600 text-white p-6 rounded-t-2xl">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors p-2"
            aria-label="Close popup"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white bg-opacity-20 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              Wait! Don't Leave Yet
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-3">One Last Offer!</h2>
            <p className="text-xl opacity-90 leading-relaxed">
              Get our exclusive Singapore Property Investment Guide absolutely FREE
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Offer Details */}
            <div>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-lg mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-yellow-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-yellow-800">Limited Time: FREE Property Analysis</h3>
                </div>
                <p className="text-yellow-700">
                  This offer expires when you close this window. Get personalized insights worth $500 completely free.
                </p>
              </div>

              <h4 className="text-xl font-bold text-primary mb-4">What's Included (Worth $500):</h4>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="font-medium text-primary">Personalized Market Analysis ($150 value)</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="font-medium text-primary">Investment Opportunity List ($200 value)</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="font-medium text-primary">Expert Phone Consultation ($150 value)</span>
                </div>
              </div>

              {/* Urgency Indicators */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="font-semibold text-red-800">🔥 High Demand Alert</span>
                </div>
                <p className="text-sm text-red-700">
                  147 people requested this analysis in the last 48 hours. Spots are filling up quickly!
                </p>
              </div>

              {/* Testimonial */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">JW</span>
                  </div>
                  <div>
                    <p className="text-sm text-secondary italic mb-2">
                      "This free analysis helped me identify an undervalued condo that's now worth $200K more!"
                    </p>
                    <p className="text-xs text-secondary font-medium">- Jennifer Wong, Property Investor</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div>
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-1 rounded-xl">
                <LeadCaptureForm 
                  title="Claim Your FREE Analysis"
                  subtitle="No strings attached. Get your personalized report in 24 hours or less."
                  className="bg-white border-0"
                />
              </div>
              
              {/* Security Badge */}
              <div className="text-center mt-4">
                <div className="inline-flex items-center gap-2 text-xs text-secondary">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span>100% Secure & Confidential</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-8 py-4 rounded-b-2xl">
          <p className="text-xs text-secondary text-center">
            This is a one-time offer. Close this window and it won't be shown again.
          </p>
        </div>
      </div>

      {/* Styles for animation */}
      <style jsx>{`
        @keyframes zoom-in {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-zoom-in {
          animation: zoom-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  )
}