'use client'

import { useState } from 'react'
import { trackNewsletterSignup } from '@/utils/analytics'
import { ABTestCTAButton } from '@/components/ui/ABTestButton'

export default function NewsletterSignup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    propertyJourney: '',
    budgetRange: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Submit to leads API
      const leadsResponse = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          message: `Newsletter signup - Journey: ${formData.propertyJourney}, Budget: ${formData.budgetRange}`,
          source: 'NEWSLETTER'
        }),
      })

      // Send welcome email
      const emailResponse = await fetch('/api/emails/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name,
          type: 'welcome'
        }),
      })

      if (leadsResponse.ok) {
        setSubmitted(true)
        setFormData({ name: '', email: '', phone: '', propertyJourney: '', budgetRange: '' })
        
        // Track newsletter signup
        trackNewsletterSignup()
        
        if (!emailResponse.ok) {
          console.warn('Newsletter signup successful but welcome email failed')
        }
      } else {
        throw new Error('Failed to submit newsletter signup')
      }
    } catch (error) {
      console.error('Error submitting newsletter:', error)
    }

    setIsSubmitting(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  if (submitted) {
    return (
      <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-xl p-8 text-white text-center">
        <h2 className="text-2xl font-bold mb-2">Thank You!</h2>
        <p className="text-green-100">
          You've successfully subscribed to our property insights. Check your email for confirmation!
        </p>
      </div>
    )
  }
  return (
    <div>
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-8 text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Get Free Property Intel</h2>
          <p className="text-blue-100 mb-6">
            Join property enthusiasts getting our daily insights, new launch alerts, and exclusive floor plans.
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Name"
              required
              className="px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your Email"
              required
              className="px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
          
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone Number (Optional)"
            className="w-full px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <select 
              name="propertyJourney"
              value={formData.propertyJourney}
              onChange={handleChange}
              className="px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <option value="">Select your current stage</option>
              <option value="actively-viewing">Actively viewing properties</option>
              <option value="researching-3-months">Researching (next 3 months)</option>
              <option value="planning-6-12-months">Planning (6-12 months)</option>
              <option value="exploring-options">Just exploring options</option>
              <option value="market-research">Market research only</option>
            </select>
            <select 
              name="budgetRange"
              value={formData.budgetRange}
              onChange={handleChange}
              className="px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <option value="">Budget Range</option>
              <option value="under-800k">Under $800K</option>
              <option value="800k-1m">$800K - $1M</option>
              <option value="1m-1.5m">$1M - $1.5M</option>
              <option value="1.5m-2m">$1.5M - $2M</option>
              <option value="2m-3m">$2M - $3M</option>
              <option value="above-3m">Above $3M</option>
            </select>
          </div>
          
          <ABTestCTAButton
            type="submit"
            disabled={isSubmitting}
            className="!bg-white !text-blue-600 hover:!bg-gray-50 border-2 border-transparent hover:!border-blue-200"
            trackingEvent="newsletter_signup"
            trackingValue={2}
          >
            {isSubmitting ? 'Subscribing...' : 'Get Free Property Guide + Daily Updates'}
          </ABTestCTAButton>
        </form>
        
        <div className="mt-6 flex items-center justify-center gap-4 text-xs text-blue-200">
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            No spam
          </div>
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Unsubscribe anytime
          </div>
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Instant delivery
          </div>
        </div>
      </div>
      
      {/* Lead Magnet Preview */}
      <div className="mt-6 bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-2">🎁 Free with Signup:</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li className="flex items-center gap-2">
            <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            2025 Property Investment Guide (32 pages)
          </li>
          <li className="flex items-center gap-2">
            <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Daily property insights and analysis
          </li>
          <li className="flex items-center gap-2">
            <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Frequent market intelligence reports
          </li>
        </ul>
      </div>
    </div>
  )
}