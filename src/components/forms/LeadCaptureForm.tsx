'use client'

import { useState, useMemo } from 'react'

interface LeadFormData {
  name: string
  email: string
  phone: string
  propertyJourney: string
  budget: string
  financingStatus: string
  timeline: string
}

interface LeadCaptureFormProps {
  title?: string
  subtitle?: string
  className?: string
  compact?: boolean
}

interface LeadScore {
  propertyJourney: number
  budget: number
  financing: number
  timeline: number
  total: number
  category: 'HOT' | 'WARM' | 'COLD'
}

const propertyJourneyOptions = [
  { value: '', label: 'Select your current stage...', score: 0 },
  { value: 'actively-viewing', label: 'Actively viewing properties', score: 40 },
  { value: 'researching-3-months', label: 'Researching (next 3 months)', score: 30 },
  { value: 'planning-6-12-months', label: 'Planning (6-12 months)', score: 20 },
  { value: 'exploring-options', label: 'Just exploring options', score: 10 },
  { value: 'market-research', label: 'Market research only', score: 0 }
]

const budgetOptions = [
  { value: '', label: 'Select your budget range...', score: 0 },
  { value: 'under-800k', label: 'Under $800K', score: 5 },
  { value: '800k-1m', label: '$800K - $1M', score: 10 },
  { value: '1m-1.5m', label: '$1M - $1.5M', score: 15 },
  { value: '1.5m-2m', label: '$1.5M - $2M', score: 20 },
  { value: '2m-3m', label: '$2M - $3M', score: 25 },
  { value: 'above-3m', label: 'Above $3M', score: 30 }
]

const financingOptions = [
  { value: '', label: 'Select financing status...', score: 0 },
  { value: 'approved', label: 'Pre-approved for loan', score: 20 },
  { value: 'in-process', label: 'Application in process', score: 15 },
  { value: 'not-yet', label: 'Not started yet', score: 5 }
]

const timelineOptions = [
  { value: '', label: 'Select your timeline...', score: 0 },
  { value: 'within-1-month', label: 'Within 1 month', score: 10 },
  { value: '1-3-months', label: '1-3 months', score: 8 },
  { value: '3-6-months', label: '3-6 months', score: 6 },
  { value: '6-12-months', label: '6-12 months', score: 4 },
  { value: 'over-1-year', label: 'Over 1 year', score: 2 },
  { value: 'no-timeline', label: 'No specific timeline', score: 0 }
]

export default function LeadCaptureForm({ 
  title = "Get Your Free Condo Report",
  subtitle = "Expert insights delivered to your inbox within 24 hours",
  className = "",
  compact = false
}: LeadCaptureFormProps) {
  const [formData, setFormData] = useState<LeadFormData>({
    name: '',
    email: '',
    phone: '',
    propertyJourney: '',
    budget: '',
    financingStatus: '',
    timeline: ''
  })

  const [errors, setErrors] = useState<Partial<LeadFormData>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [submissionId, setSubmissionId] = useState<string>('')

  // Calculate lead score
  const leadScore: LeadScore = useMemo(() => {
    const propertyJourneyScore = propertyJourneyOptions.find(option => option.value === formData.propertyJourney)?.score || 0
    const budgetScore = budgetOptions.find(option => option.value === formData.budget)?.score || 0
    const financingScore = financingOptions.find(option => option.value === formData.financingStatus)?.score || 0
    const timelineScore = timelineOptions.find(option => option.value === formData.timeline)?.score || 0
    
    const total = propertyJourneyScore + budgetScore + financingScore + timelineScore
    
    let category: 'HOT' | 'WARM' | 'COLD'
    if (total >= 80) {
      category = 'HOT'
    } else if (total >= 50) {
      category = 'WARM'
    } else {
      category = 'COLD'
    }

    return {
      propertyJourney: propertyJourneyScore,
      budget: budgetScore,
      financing: financingScore,
      timeline: timelineScore,
      total,
      category
    }
  }, [formData.propertyJourney, formData.budget, formData.financingStatus, formData.timeline])

  const validateForm = (): boolean => {
    const newErrors: Partial<LeadFormData> = {}

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    // Phone validation
    const phoneRegex = /^[+]?[0-9\s-()]{8,15}$/
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number'
    }

    // Property journey validation
    if (!formData.propertyJourney) {
      newErrors.propertyJourney = 'Please select your property journey stage'
    }

    // Budget validation
    if (!formData.budget) {
      newErrors.budget = 'Please select your budget range'
    }

    // Financing validation
    if (!formData.financingStatus) {
      newErrors.financingStatus = 'Please select your financing status'
    }

    // Timeline validation
    if (!formData.timeline) {
      newErrors.timeline = 'Please select your timeline'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof LeadFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Generate unique submission ID
      const timestamp = Date.now()
      const id = `lead-${timestamp}`

      // Prepare submission data with scoring
      const submissionData = {
        id,
        ...formData,
        leadScore: leadScore,
        timestamp: new Date().toISOString(),
        source: 'lead-capture-form',
        status: 'new'
      }

      // Store in localStorage
      const existingLeads = JSON.parse(localStorage.getItem('property-leads') || '[]')
      existingLeads.push(submissionData)
      localStorage.setItem('property-leads', JSON.stringify(existingLeads))

      // Send to API endpoint
      try {
        const apiData = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: `Property Journey: ${formData.propertyJourney}, Budget: ${formData.budget}, Financing: ${formData.financingStatus}, Timeline: ${formData.timeline}. Lead Score: ${leadScore.total}/100 (${leadScore.category})`,
          source: 'CONTACT_FORM'
        }

        const response = await fetch('/api/leads', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(apiData),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to submit')
        }

        console.log('Form submitted successfully to API')
      } catch (apiError) {
        console.error('API submission failed:', apiError)
        // Continue with localStorage backup
      }

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1000))

      setSubmissionId(id)
      setIsSuccess(true)
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        propertyJourney: '',
        budget: '',
        financingStatus: '',
        timeline: ''
      })

    } catch (error) {
      console.error('Form submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleNewSubmission = () => {
    setIsSuccess(false)
    setSubmissionId('')
  }

  // Get category styling
  const getCategoryStyles = (category: string) => {
    switch (category) {
      case 'HOT':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'WARM':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'COLD':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  // Success state
  if (isSuccess) {
    return (
      <div className={`bg-white rounded-xl shadow-lg p-8 ${className}`}>
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-primary mb-4">Thank You!</h3>
          <p className="text-secondary mb-6 leading-relaxed">
            Your free condo report request has been received. Our property experts will analyze the latest market data and send you personalized insights within 24 hours.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              <strong>Submission ID:</strong> {submissionId}
            </p>
          </div>
          <button
            onClick={handleNewSubmission}
            className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
          >
            Submit Another Request
          </button>
        </div>
      </div>
    )
  }

  // Compact version for sidebars
  if (compact) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-4 ${className}`}>
        <h4 className="text-lg font-bold text-primary mb-3">Get Free Condo Report</h4>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className={`w-full px-3 py-2 text-sm border-2 rounded transition-colors ${
              errors.name ? 'border-red-300' : 'border-gray-200 focus:border-blue-500'
            } focus:outline-none`}
            placeholder="Your name"
          />
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={`w-full px-3 py-2 text-sm border-2 rounded transition-colors ${
              errors.email ? 'border-red-300' : 'border-gray-200 focus:border-blue-500'
            } focus:outline-none`}
            placeholder="Email address"
          />
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className={`w-full px-3 py-2 text-sm border-2 rounded transition-colors ${
              errors.phone ? 'border-red-300' : 'border-gray-200 focus:border-blue-500'
            } focus:outline-none`}
            placeholder="Phone number"
          />
          <select
            value={formData.propertyJourney}
            onChange={(e) => handleInputChange('propertyJourney', e.target.value)}
            className={`w-full px-3 py-2 text-sm border-2 rounded transition-colors ${
              errors.propertyJourney ? 'border-red-300' : 'border-gray-200 focus:border-blue-500'
            } focus:outline-none bg-white`}
          >
            {propertyJourneyOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#0A66C2] text-white py-2 rounded font-medium text-sm hover:bg-blue-800 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Get Report'}
          </button>
        </form>
      </div>
    )
  }

  // Full form version
  return (
    <div className={`bg-white rounded-xl shadow-lg p-8 ${className}`}>
      {/* Form Header */}
      <div className="text-center mb-8">
        <h3 className="text-2xl md:text-3xl font-bold text-primary mb-3">{title}</h3>
        <p className="text-secondary leading-relaxed">{subtitle}</p>
      </div>

      {/* Lead Score Display */}
      {(formData.propertyJourney || formData.budget || formData.financingStatus || formData.timeline) && (
        <div className="mb-8 p-6 bg-gray-50 rounded-xl border-2 border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-bold text-primary">Lead Assessment</h4>
            <div className={`px-4 py-2 rounded-full border font-bold text-sm ${getCategoryStyles(leadScore.category)}`}>
              {leadScore.category} LEAD
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{leadScore.propertyJourney}</div>
              <div className="text-xs text-secondary">Journey</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{leadScore.budget}</div>
              <div className="text-xs text-secondary">Budget</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{leadScore.financing}</div>
              <div className="text-xs text-secondary">Financing</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{leadScore.timeline}</div>
              <div className="text-xs text-secondary">Timeline</div>
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-1">{leadScore.total}/100</div>
            <div className="text-sm text-secondary">Total Lead Score</div>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information Section */}
        <div className="border-b border-gray-200 pb-6">
          <h4 className="text-lg font-semibold text-primary mb-4">Personal Information</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-primary mb-2">
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full px-4 py-3 border-2 rounded-lg transition-colors ${
                  errors.name 
                    ? 'border-red-300 focus:border-red-500' 
                    : 'border-gray-200 focus:border-blue-500'
                } focus:outline-none`}
                placeholder="Enter your full name"
              />
              {errors.name && (
                <p className="mt-2 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-primary mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full px-4 py-3 border-2 rounded-lg transition-colors ${
                  errors.email 
                    ? 'border-red-300 focus:border-red-500' 
                    : 'border-gray-200 focus:border-blue-500'
                } focus:outline-none`}
                placeholder="your.email@example.com"
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-600">{errors.email}</p>
              )}
            </div>
          </div>

          {/* Phone Field */}
          <div className="mt-6">
            <label htmlFor="phone" className="block text-sm font-semibold text-primary mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              id="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className={`w-full px-4 py-3 border-2 rounded-lg transition-colors ${
                errors.phone 
                  ? 'border-red-300 focus:border-red-500' 
                  : 'border-gray-200 focus:border-blue-500'
              } focus:outline-none`}
              placeholder="+65 9123 4567"
            />
            {errors.phone && (
              <p className="mt-2 text-sm text-red-600">{errors.phone}</p>
            )}
          </div>
        </div>

        {/* Property Requirements Section */}
        <div>
          <h4 className="text-lg font-semibold text-primary mb-4">Property Requirements</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Property Journey Dropdown */}
            <div>
              <label htmlFor="propertyJourney" className="block text-sm font-semibold text-primary mb-2">
                What describes your property journey? *
              </label>
              <select
                id="propertyJourney"
                value={formData.propertyJourney}
                onChange={(e) => handleInputChange('propertyJourney', e.target.value)}
                className={`w-full px-4 py-3 border-2 rounded-lg transition-colors ${
                  errors.propertyJourney 
                    ? 'border-red-300 focus:border-red-500' 
                    : 'border-gray-200 focus:border-blue-500'
                } focus:outline-none bg-white`}
              >
                {propertyJourneyOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.propertyJourney && (
                <p className="mt-2 text-sm text-red-600">{errors.propertyJourney}</p>
              )}
            </div>

            {/* Budget Dropdown */}
            <div>
              <label htmlFor="budget" className="block text-sm font-semibold text-primary mb-2">
                Budget Range *
              </label>
              <select
                id="budget"
                value={formData.budget}
                onChange={(e) => handleInputChange('budget', e.target.value)}
                className={`w-full px-4 py-3 border-2 rounded-lg transition-colors ${
                  errors.budget 
                    ? 'border-red-300 focus:border-red-500' 
                    : 'border-gray-200 focus:border-blue-500'
                } focus:outline-none bg-white`}
              >
                {budgetOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.budget && (
                <p className="mt-2 text-sm text-red-600">{errors.budget}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* Financing Status */}
            <div>
              <label htmlFor="financingStatus" className="block text-sm font-semibold text-primary mb-2">
                Financing Status *
              </label>
              <select
                id="financingStatus"
                value={formData.financingStatus}
                onChange={(e) => handleInputChange('financingStatus', e.target.value)}
                className={`w-full px-4 py-3 border-2 rounded-lg transition-colors ${
                  errors.financingStatus 
                    ? 'border-red-300 focus:border-red-500' 
                    : 'border-gray-200 focus:border-blue-500'
                } focus:outline-none bg-white`}
              >
                {financingOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.financingStatus && (
                <p className="mt-2 text-sm text-red-600">{errors.financingStatus}</p>
              )}
            </div>

            {/* Timeline */}
            <div>
              <label htmlFor="timeline" className="block text-sm font-semibold text-primary mb-2">
                Purchase Timeline *
              </label>
              <select
                id="timeline"
                value={formData.timeline}
                onChange={(e) => handleInputChange('timeline', e.target.value)}
                className={`w-full px-4 py-3 border-2 rounded-lg transition-colors ${
                  errors.timeline 
                    ? 'border-red-300 focus:border-red-500' 
                    : 'border-gray-200 focus:border-blue-500'
                } focus:outline-none bg-white`}
              >
                {timelineOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.timeline && (
                <p className="mt-2 text-sm text-red-600">{errors.timeline}</p>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#0A66C2] text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-800 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center gap-2">
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting...
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-4-4m4 4l4-4m-6 0a9 9 0 110-18 9 9 0 010 18z" />
              </svg>
              Get My Free Report
            </div>
          )}
        </button>

        {/* Privacy Notice */}
        <p className="text-xs text-secondary text-center leading-relaxed">
          By submitting this form, you agree to receive property insights and market updates. 
          We respect your privacy and will never share your information with third parties.
        </p>
      </form>
    </div>
  )
}