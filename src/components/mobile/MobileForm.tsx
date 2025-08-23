'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface MobileInputProps {
  label: string
  type?: 'text' | 'email' | 'tel' | 'number' | 'password'
  value: string
  onChange: (value: string) => void
  error?: string
  placeholder?: string
  required?: boolean
  autoComplete?: string
  inputMode?: 'text' | 'tel' | 'email' | 'numeric' | 'decimal'
  icon?: React.ReactNode
}

export function MobileInput({
  label,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
  required = false,
  autoComplete,
  inputMode,
  icon
}: MobileInputProps) {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700 px-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || label}
          autoComplete={autoComplete}
          inputMode={inputMode}
          className={cn(
            // Base styles
            'w-full px-4 py-4 text-base rounded-xl border-2',
            'transition-all duration-200',
            'focus:outline-none focus:ring-0',
            'placeholder-gray-400',
            // Icon padding
            icon && 'pl-12',
            // Focus states
            isFocused && 'border-blue-500 shadow-sm',
            // Error states
            error ? 'border-red-500 focus:border-red-500' : 'border-gray-300',
            // Hover states
            !error && !isFocused && 'hover:border-gray-400',
            // Mobile optimizations
            'text-16px', // Prevents zoom on iOS
            'touch-manipulation' // Better touch handling
          )}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          // Prevent zoom on iOS
          style={{ fontSize: '16px' }}
        />
      </div>
      
      {error && (
        <p className="text-sm text-red-600 px-1 animate-slide-down">
          {error}
        </p>
      )}
    </div>
  )
}

interface MobileSelectProps {
  label: string
  value: string
  onChange: (value: string) => void
  options: Array<{ value: string; label: string }>
  error?: string
  required?: boolean
  placeholder?: string
}

export function MobileSelect({
  label,
  value,
  onChange,
  options,
  error,
  required = false,
  placeholder = 'Select an option'
}: MobileSelectProps) {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700 px-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            // Base styles
            'w-full px-4 py-4 text-base rounded-xl border-2 appearance-none',
            'transition-all duration-200 bg-white',
            'focus:outline-none focus:ring-0',
            // Focus states
            isFocused && 'border-blue-500 shadow-sm',
            // Error states
            error ? 'border-red-500 focus:border-red-500' : 'border-gray-300',
            // Hover states
            !error && !isFocused && 'hover:border-gray-400',
            // Mobile optimizations
            'text-16px touch-manipulation'
          )}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={{ fontSize: '16px' }}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        {/* Custom dropdown arrow */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg
            className={cn(
              'w-5 h-5 transition-all duration-200',
              isFocused ? 'text-blue-600 rotate-180' : 'text-gray-400'
            )}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      
      {error && (
        <p className="text-sm text-red-600 px-1 animate-slide-down">
          {error}
        </p>
      )}
    </div>
  )
}

interface MobileButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  loading?: boolean
  disabled?: boolean
  onClick?: () => void
  type?: 'button' | 'submit'
  className?: string
}

export function MobileButton({
  children,
  variant = 'primary',
  size = 'lg',
  fullWidth = true,
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  className = ''
}: MobileButtonProps) {
  const baseStyles = cn(
    // Base styles
    'font-semibold rounded-xl transition-all duration-200',
    'active:scale-98 transform-gpu',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'focus:outline-none focus:ring-0',
    // Touch optimizations
    'touch-manipulation select-none',
    // Minimum touch target size
    'min-h-[48px]'
  )

  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-6 py-4 text-base'
  }

  const variantStyles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 active:bg-gray-400',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 active:bg-blue-100'
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        baseStyles,
        sizeStyles[size],
        variantStyles[variant],
        fullWidth && 'w-full',
        className
      )}
    >
      <span className={cn('flex items-center justify-center gap-2', loading && 'opacity-0')}>
        {children}
      </span>
      
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </span>
      )}
    </button>
  )
}

// Complete Mobile Form Example
interface MobileLeadFormProps {
  onSubmit?: (data: any) => void
  className?: string
}

export default function MobileLeadForm({ onSubmit, className = '' }: MobileLeadFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    propertyJourney: '',
    budget: ''
  })
  
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false)

  // Detect virtual keyboard on mobile
  useEffect(() => {
    const handleResize = () => {
      // Simple check for keyboard visibility
      const viewportHeight = window.visualViewport?.height || window.innerHeight
      const windowHeight = window.screen.height
      setIsKeyboardVisible(viewportHeight < windowHeight * 0.75)
    }

    window.addEventListener('resize', handleResize)
    window.visualViewport?.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      window.visualViewport?.removeEventListener('resize', handleResize)
    }
  }, [])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'
    if (!formData.propertyJourney) newErrors.propertyJourney = 'Please select your property journey'
    if (!formData.budget) newErrors.budget = 'Please select your budget range'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsSubmitting(true)
    
    try {
      if (onSubmit) {
        await onSubmit(formData)
      }
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        propertyJourney: '',
        budget: ''
      })
    } catch (error) {
      console.error('Form submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <div className={cn(
      'bg-white rounded-2xl shadow-xl p-6',
      // Adjust layout when keyboard is visible
      isKeyboardVisible && 'pb-4',
      className
    )}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Get Your Property Match
        </h2>
        <p className="text-gray-600">
          Tell us what you're looking for and we'll find perfect options for you
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <MobileInput
          label="Full Name"
          value={formData.name}
          onChange={(value) => updateField('name', value)}
          error={errors.name}
          required
          autoComplete="name"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          }
        />

        <MobileInput
          label="Email Address"
          type="email"
          value={formData.email}
          onChange={(value) => updateField('email', value)}
          error={errors.email}
          required
          autoComplete="email"
          inputMode="email"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          }
        />

        <MobileInput
          label="Phone Number"
          type="tel"
          value={formData.phone}
          onChange={(value) => updateField('phone', value)}
          error={errors.phone}
          required
          autoComplete="tel"
          inputMode="tel"
          placeholder="+65 1234 5678"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          }
        />

        <MobileSelect
          label="Property Journey"
          value={formData.propertyJourney}
          onChange={(value) => updateField('propertyJourney', value)}
          error={errors.propertyJourney}
          required
          options={[
            { value: 'viewing', label: 'Actively viewing properties' },
            { value: 'planning', label: 'Planning to buy in 3 months' },
            { value: 'researching', label: 'Researching options' },
            { value: 'browsing', label: 'Just browsing' }
          ]}
        />

        <MobileSelect
          label="Budget Range"
          value={formData.budget}
          onChange={(value) => updateField('budget', value)}
          error={errors.budget}
          required
          options={[
            { value: 'above-2m', label: 'Above $2M' },
            { value: '1m-2m', label: '$1M - $2M' },
            { value: '500k-1m', label: '$500K - $1M' },
            { value: 'below-500k', label: 'Below $500K' },
            { value: 'not-sure', label: 'Not sure yet' }
          ]}
        />

        <MobileButton
          type="submit"
          loading={isSubmitting}
          className="mt-8"
        >
          Get My Property Matches
        </MobileButton>
      </form>

      <p className="text-xs text-gray-500 text-center mt-4">
        By submitting, you agree to our privacy policy. We'll only contact you with relevant property opportunities.
      </p>
    </div>
  )
}