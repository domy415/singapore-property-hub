'use client'

import { useState } from 'react'
import { useBreakpoint } from '@/lib/breakpoints'

export default function MobileTestPage() {
  const breakpoint = useBreakpoint()
  const [showDetails, setShowDetails] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-center mb-4">
          Mobile Experience Test Page
        </h1>
        
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <h2 className="text-lg font-semibold mb-2">
            Current Breakpoint Information:
          </h2>
          <div className="text-sm space-y-1">
            <div>Current: {breakpoint.current}</div>
            <div>Mobile: {breakpoint.mobile ? 'Yes' : 'No'}</div>
            <div>Tablet: {breakpoint.tablet ? 'Yes' : 'No'}</div>
            <div>Desktop: {breakpoint.desktop ? 'Yes' : 'No'}</div>
            <div>Touch Device: {breakpoint.touch ? 'Yes' : 'No'}</div>
            <div>Screen Width: {typeof window !== 'undefined' ? window.innerWidth : 'N/A'}px</div>
          </div>
        </div>
      </div>

      {/* Responsive Grid Test */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          Responsive Grid System
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(num => (
            <div key={num} className="bg-blue-100 p-6 rounded-lg">
              <div className="font-semibold">Grid Item {num}</div>
              <div className="text-sm text-gray-600">
                1 column on mobile, 2 on tablet, 3 on desktop
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Touch Target Test */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          Touch Target Test (Minimum 44x44px)
        </h2>
        
        <div className="flex flex-wrap gap-4">
          <button className="touch-target bg-blue-600 text-white rounded-lg font-medium">
            Standard Button
          </button>
          <button className="touch-target-comfortable bg-green-600 text-white rounded-lg font-medium">
            Comfortable Button
          </button>
          <button className="min-h-[56px] min-w-[56px] bg-purple-600 text-white rounded-full flex items-center justify-center">
            ❤️
          </button>
        </div>
      </div>

      {/* Typography Test */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          Responsive Typography
        </h2>
        
        <div className="space-y-4">
          <h1 className="text-5xl sm:text-6xl font-bold">
            5XL Heading (Scales down on mobile)
          </h1>
          <h2 className="text-3xl sm:text-4xl font-semibold">
            3XL Subheading (Responsive scaling)
          </h2>
          <p className="text-base sm:text-lg">
            Base paragraph text that remains readable across all devices. 
            This text should be comfortable to read on phones, tablets, and desktops.
          </p>
          <p className="text-sm text-gray-600">
            Small text for captions and secondary information.
          </p>
        </div>
      </div>

      {/* Breakpoint Visibility Test */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          Breakpoint Visibility Classes
        </h2>
        
        <div className="space-y-4">
          <div className="mobile-only bg-red-100 p-4 rounded-lg">
            <div className="font-semibold text-red-800">
              📱 Mobile Only (visible on screens &lt; 768px)
            </div>
          </div>
          
          <div className="tablet-up bg-yellow-100 p-4 rounded-lg">
            <div className="font-semibold text-yellow-800">
              📟 Tablet Up (visible on screens ≥ 768px)
            </div>
          </div>
          
          <div className="desktop-only bg-green-100 p-4 rounded-lg">
            <div className="font-semibold text-green-800">
              💻 Desktop Only (visible on screens ≥ 1024px)
            </div>
          </div>
        </div>
      </div>

      {/* Test Details Toggle */}
      <div className="mb-8">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          {showDetails ? 'Hide' : 'Show'} Test Details
        </button>

        {showDetails && (
          <div className="mt-4 bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-semibold mb-2">Mobile Optimization Features:</h3>
            <ul className="space-y-2 text-sm">
              <li>✅ Responsive hamburger menu for mobile navigation</li>
              <li>✅ Swipeable card components for mobile</li>
              <li>✅ Sticky mobile CTA bar with auto-hide</li>
              <li>✅ Touch targets optimized to 44x44px minimum</li>
              <li>✅ Mobile-optimized form components with iOS zoom prevention</li>
              <li>✅ Breakpoint testing from 320px to 1920px</li>
              <li>✅ Safe area support for devices with notches</li>
              <li>✅ Touch gesture support and swipe detection</li>
              <li>✅ Mobile-first responsive design approach</li>
            </ul>
          </div>
        )}
      </div>

      {/* Safe Area Test */}
      <div className="bg-blue-600 text-white safe-top safe-bottom safe-left safe-right p-4 rounded-lg">
        <div className="text-white">
          This content respects device safe areas (notches, home indicators, etc.)
        </div>
      </div>
    </div>
  )
}