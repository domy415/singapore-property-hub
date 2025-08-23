'use client'

import { useState } from 'react'
import AnimatedInput, { AnimatedSelect } from '@/components/ui/AnimatedInput'
import AnimatedButton from '@/components/ui/AnimatedButton'
import SuccessAnimation, { ConfettiSuccess } from '@/components/ui/SuccessAnimation'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { cn } from '@/lib/utils'

interface FormData {
  name: string
  email: string
  phone: string
  propertyJourney: string
  budget: string
}

export default function AnimatedLeadForm() {
  const [ref, isVisible] = useScrollAnimation<HTMLDivElement>()
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    propertyJourney: '',
    budget: ''
  })
  const [errors, setErrors] = useState<Partial<FormData>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const validateForm = () => {
    const newErrors: Partial<FormData> = {}
    
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email'
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required'
    if (!formData.propertyJourney) newErrors.propertyJourney = 'Please select an option'
    if (!formData.budget) newErrors.budget = 'Please select a budget'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsSubmitting(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setShowSuccess(true)
      // Reset form after success animation
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          phone: '',
          propertyJourney: '',
          budget: ''
        })
        setShowSuccess(false)
      }, 3000)
    } catch (error) {
      console.error('Form submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <>
      <div
        ref={ref}
        className={cn(
          'bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-auto',
          'transition-all duration-700 ease-out',
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        )}
      >
        {!showSuccess ? (
          <>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Get Personalized Recommendations
            </h3>
            <p className="text-gray-600 mb-6">
              Tell us what you're looking for and we'll find the perfect match
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <AnimatedInput
                label="Full Name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                error={errors.name}
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                }
              />

              <AnimatedInput
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                error={errors.email}
                success={!!(formData.email && !errors.email && /\S+@\S+\.\S+/.test(formData.email))}
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                }
              />

              <AnimatedInput
                label="Phone Number"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                error={errors.phone}
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                }
              />

              <AnimatedSelect
                label="Property Journey"
                value={formData.propertyJourney}
                onChange={(e) => handleChange('propertyJourney', e.target.value)}
                error={errors.propertyJourney}
                options={[
                  { value: 'viewing', label: 'Actively viewing properties' },
                  { value: 'planning', label: 'Planning to buy in 3 months' },
                  { value: 'researching', label: 'Researching options' },
                  { value: 'browsing', label: 'Just browsing' }
                ]}
              />

              <AnimatedSelect
                label="Budget Range"
                value={formData.budget}
                onChange={(e) => handleChange('budget', e.target.value)}
                error={errors.budget}
                options={[
                  { value: 'above-2m', label: 'Above $2M' },
                  { value: '1m-2m', label: '$1M - $2M' },
                  { value: '500k-1m', label: '$500K - $1M' },
                  { value: 'below-500k', label: 'Below $500K' },
                  { value: 'not-sure', label: 'Not sure yet' }
                ]}
              />

              <AnimatedButton
                type="submit"
                variant="primary"
                size="lg"
                loading={isSubmitting}
                className="w-full"
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                }
              >
                Get Recommendations
              </AnimatedButton>
            </form>

            <p className="text-xs text-gray-500 text-center mt-6">
              By submitting, you agree to our privacy policy. No spam, unsubscribe anytime.
            </p>
          </>
        ) : (
          <SuccessAnimation
            show={showSuccess}
            message="Thank you! We'll send your personalized recommendations shortly."
            variant="inline"
          />
        )}
      </div>

      {/* Confetti animation on success */}
      <ConfettiSuccess show={showSuccess} />
    </>
  )
}