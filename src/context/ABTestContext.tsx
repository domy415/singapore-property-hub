'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { abTestManager, UserVariants } from '@/lib/ab-testing'

interface ABTestContextType {
  variants: UserVariants
  getVariant: (testId: string) => string
  trackConversion: (testId: string, conversionType: string, value?: number) => void
  isLoading: boolean
}

const ABTestContext = createContext<ABTestContextType | undefined>(undefined)

export function ABTestProvider({ children }: { children: React.ReactNode }) {
  const [variants, setVariants] = useState<UserVariants>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Initialize variants after component mounts (client-side only)
    const initializeVariants = () => {
      const heroVariant = abTestManager.getVariant('hero-headline')
      const buttonVariant = abTestManager.getVariant('button-color')
      const formVariant = abTestManager.getVariant('form-position')
      
      setVariants({
        'hero-headline': heroVariant,
        'button-color': buttonVariant,
        'form-position': formVariant
      })
      setIsLoading(false)
    }

    initializeVariants()
  }, [])

  const getVariant = (testId: string): string => {
    return variants[testId] || 'control'
  }

  const trackConversion = (testId: string, conversionType: string, value?: number) => {
    abTestManager.trackConversion(testId, conversionType, value)
  }

  return (
    <ABTestContext.Provider value={{
      variants,
      getVariant,
      trackConversion,
      isLoading
    }}>
      {children}
    </ABTestContext.Provider>
  )
}

export function useABTestContext() {
  const context = useContext(ABTestContext)
  if (context === undefined) {
    throw new Error('useABTestContext must be used within an ABTestProvider')
  }
  return context
}

// Component-level hook for easier usage
export function useABVariant(testId: string) {
  const { getVariant, isLoading } = useABTestContext()
  return {
    variant: getVariant(testId),
    isLoading
  }
}