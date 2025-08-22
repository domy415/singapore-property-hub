'use client'

import { useState } from 'react'
import { trackLeadSubmission } from '@/utils/analytics'

interface LeadCaptureFormProps {
  compact?: boolean
}

export default function LeadCaptureForm({ compact = false }: LeadCaptureFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    propertyType: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSubmitted(true)
        setFormData({ name: '', email: '', phone: '', message: '', propertyType: '' })
        
        // Track successful lead submission
        trackLeadSubmission(compact ? 'sidebar_form' : 'main_contact_form')
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to submit form. Please try again.')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      setError('Network error. Please check your connection and try again.')
    }

    setIsSubmitting(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
        <div className="text-green-600 text-2xl mb-2">✅</div>
        <h3 className="text-lg font-semibold text-green-800 mb-2">Thank You!</h3>
        <p className="text-green-700 text-sm">
          We'll contact you within 24 hours.
        </p>
      </div>
    )
  }

  const formClass = compact 
    ? "space-y-3"
    : "bg-white p-6 rounded-lg shadow-lg border max-w-lg mx-auto"

  const inputClass = compact
    ? "w-full p-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    : "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"

  const buttonClass = compact
    ? "w-full bg-blue-600 text-white py-2 px-4 rounded font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
    : "w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"

  return (
    <form onSubmit={handleSubmit} className={formClass}>
      {!compact && (
        <h3 className="text-xl font-semibold mb-4 text-center">Get Expert Property Advice</h3>
      )}
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded p-3 mb-3">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}
      
      <div className={compact ? "space-y-3" : "grid grid-cols-1 md:grid-cols-2 gap-4 mb-4"}>
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className={inputClass}
            placeholder="Your name"
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className={inputClass}
            placeholder="your@email.com"
          />
        </div>
      </div>
      
      <div className={compact ? "space-y-3" : "grid grid-cols-1 md:grid-cols-2 gap-4 mb-4"}>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={inputClass}
            placeholder="+65 9123 4567"
          />
        </div>
        
        <div>
          <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700 mb-1">
            Interest
          </label>
          <select
            id="propertyType"
            name="propertyType"
            value={formData.propertyType}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="">Select type</option>
            <option value="condo">Condo</option>
            <option value="landed">Landed</option>
            <option value="hdb">HDB</option>
            <option value="commercial">Commercial</option>
          </select>
        </div>
      </div>
      
      <div className={compact ? "" : "mb-6"}>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
          {compact ? "Your needs" : "Tell us about your property needs"}
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={compact ? 3 : 4}
          className={inputClass}
          placeholder={compact ? "Budget, location, timeline..." : "Budget, preferred location, timeline, or any specific requirements..."}
        />
      </div>
      
      <button
        type="submit"
        disabled={isSubmitting}
        className={buttonClass}
      >
        {isSubmitting ? 'Submitting...' : (compact ? 'Get Advice' : 'Get Free Consultation')}
      </button>
      
      {!compact && (
        <p className="text-xs text-gray-500 text-center mt-3">
          * We respect your privacy and will never share your information.
        </p>
      )}
    </form>
  )
}