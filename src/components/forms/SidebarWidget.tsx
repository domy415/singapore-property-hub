'use client'

import { useState, useEffect } from 'react'
import LeadCaptureForm from './LeadCaptureForm'

interface SidebarWidgetProps {
  delayMs?: number
  className?: string
}

export default function SidebarWidget({ 
  delayMs = 10000,
  className = ""
}: SidebarWidgetProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)

  useEffect(() => {
    // Check if widget was previously collapsed in this session
    const wasCollapsed = sessionStorage.getItem('sidebar-widget-collapsed') === 'true'
    if (wasCollapsed) {
      return
    }

    // Show widget after delay
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, delayMs)

    return () => clearTimeout(timer)
  }, [delayMs])

  const handleCollapse = () => {
    setIsCollapsed(true)
    setIsVisible(false)
    // Remember collapse state for this session
    sessionStorage.setItem('sidebar-widget-collapsed', 'true')
  }

  const handleExpand = () => {
    setIsCollapsed(false)
    setIsVisible(true)
  }

  // Don't render on mobile
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024) // lg breakpoint
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  if (isMobile) {
    return null
  }

  return (
    <>
      {/* Main Widget */}
      {isVisible && !isCollapsed && (
        <div className={`fixed right-6 top-1/2 -translate-y-1/2 z-50 w-80 ${className}`}>
          <div className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden animate-slide-in-right">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 flex items-center justify-between">
              <h4 className="text-white font-bold text-lg">Get Free Report</h4>
              <button
                onClick={handleCollapse}
                className="text-white hover:text-gray-200 transition-colors p-1"
                aria-label="Close widget"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Form Content */}
            <div className="p-4">
              <p className="text-sm text-secondary mb-4 leading-relaxed">
                Get personalized condo insights and market analysis delivered to your inbox within 24 hours.
              </p>
              
              <LeadCaptureForm 
                compact={true}
                title=""
                subtitle=""
                className="border-0 shadow-none p-0 rounded-none"
              />
            </div>

            {/* Trust Indicator */}
            <div className="px-4 pb-4">
              <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-800 font-medium">
                    247 reports sent this week
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Collapsed Tab */}
      {isCollapsed && (
        <div className="fixed right-0 top-1/2 -translate-y-1/2 z-50">
          <button
            onClick={handleExpand}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-6 rounded-l-lg shadow-xl transition-colors group"
            aria-label="Open lead capture form"
          >
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 transform -rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-4-4m4 4l4-4m-6 0a9 9 0 110-18 9 9 0 010 18z" />
              </svg>
              <div className="text-sm font-semibold whitespace-nowrap transform -rotate-90">
                Free Report
              </div>
            </div>
          </button>
        </div>
      )}

      {/* Styles for animation */}
      <style jsx>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%) translateY(-50%);
            opacity: 0;
          }
          to {
            transform: translateX(0) translateY(-50%);
            opacity: 1;
          }
        }
        
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out forwards;
        }
      `}</style>
    </>
  )
}