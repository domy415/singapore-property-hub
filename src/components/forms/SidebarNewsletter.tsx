'use client'

import { useState } from 'react'
import { trackNewsletterSignup } from '@/utils/analytics'

export default function SidebarNewsletter() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Newsletter Subscriber',
          email,
          phone: '',
          message: 'Newsletter signup from article sidebar',
          propertyType: 'newsletter'
        }),
      })

      if (response.ok) {
        setSubmitted(true)
        setEmail('')
        trackNewsletterSignup()
      }
    } catch (error) {
      console.error('Error submitting newsletter:', error)
    }

    setIsSubmitting(false)
  }

  if (submitted) {
    return (
      <div className="bg-green-50 p-6 rounded-lg text-center">
        <div className="text-green-600 mb-2">
          <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-semibold text-green-800">Success!</h3>
        <p className="text-sm text-green-700 mt-2">
          Check your email for confirmation.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-blue-50 p-6 rounded-lg">
      <h3 className="font-semibold mb-4">Stay Updated</h3>
      <p className="text-sm text-gray-600 mb-4">
        Get the latest property insights delivered to your inbox.
      </p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button 
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? 'Subscribing...' : 'Subscribe'}
        </button>
      </form>
    </div>
  )
}