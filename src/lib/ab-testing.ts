'use client'

export interface ABTest {
  id: string
  name: string
  variants: {
    [key: string]: {
      name: string
      weight: number
    }
  }
  isActive: boolean
}

export interface UserVariants {
  [testId: string]: string
}

class ABTestingManager {
  private static instance: ABTestingManager
  private tests: ABTest[] = []
  private userVariants: UserVariants = {}
  private isClient: boolean = false

  constructor() {
    this.isClient = typeof window !== 'undefined'
    if (this.isClient) {
      this.loadUserVariants()
    }
    this.initializeTests()
  }

  static getInstance(): ABTestingManager {
    if (!ABTestingManager.instance) {
      ABTestingManager.instance = new ABTestingManager()
    }
    return ABTestingManager.instance
  }

  private initializeTests() {
    this.tests = [
      {
        id: 'hero-headline',
        name: 'Hero Headlines Test',
        variants: {
          control: { name: 'Your Trusted Property Investment Guide', weight: 50 },
          variant: { name: 'Discover Singapore\'s Best Property Deals', weight: 50 }
        },
        isActive: true
      },
      {
        id: 'button-color',
        name: 'Button Color Test', 
        variants: {
          blue: { name: 'Primary Blue', weight: 50 },
          gold: { name: 'Premium Gold', weight: 50 }
        },
        isActive: true
      },
      {
        id: 'form-position',
        name: 'Form Position Test',
        variants: {
          sidebar: { name: 'Sidebar Position', weight: 50 },
          inline: { name: 'Inline Position', weight: 50 }
        },
        isActive: true
      }
    ]
  }

  private loadUserVariants() {
    if (!this.isClient) return
    
    try {
      const stored = localStorage.getItem('ab-test-variants')
      if (stored) {
        this.userVariants = JSON.parse(stored)
      }
    } catch (error) {
      console.warn('Failed to load A/B test variants from localStorage:', error)
    }
  }

  private saveUserVariants() {
    if (!this.isClient) return
    
    try {
      localStorage.setItem('ab-test-variants', JSON.stringify(this.userVariants))
    } catch (error) {
      console.warn('Failed to save A/B test variants to localStorage:', error)
    }
  }

  getVariant(testId: string): string {
    const test = this.tests.find(t => t.id === testId)
    if (!test || !test.isActive) {
      return 'control'
    }

    // Return existing variant if user already assigned
    if (this.userVariants[testId]) {
      return this.userVariants[testId]
    }

    // Assign new variant based on weights
    const variant = this.selectVariantByWeight(test.variants)
    this.userVariants[testId] = variant
    this.saveUserVariants()

    // Track assignment in Google Analytics
    this.trackVariantAssignment(testId, variant)

    return variant
  }

  private selectVariantByWeight(variants: ABTest['variants']): string {
    const random = Math.random() * 100
    let cumulative = 0

    for (const [variantId, config] of Object.entries(variants)) {
      cumulative += config.weight
      if (random <= cumulative) {
        return variantId
      }
    }

    // Fallback to first variant
    return Object.keys(variants)[0]
  }

  private trackVariantAssignment(testId: string, variant: string) {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'ab_test_assignment', {
        test_id: testId,
        variant: variant,
        event_category: 'AB Testing',
        event_label: `${testId}:${variant}`
      })
    }
  }

  trackConversion(testId: string, conversionType: string, value?: number) {
    const variant = this.userVariants[testId]
    if (!variant) return

    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'ab_test_conversion', {
        test_id: testId,
        variant: variant,
        conversion_type: conversionType,
        value: value || 1,
        event_category: 'AB Testing',
        event_label: `${testId}:${variant}:${conversionType}`
      })
    }
  }

  getAllVariants(): UserVariants {
    return { ...this.userVariants }
  }

  resetVariant(testId: string) {
    delete this.userVariants[testId]
    this.saveUserVariants()
  }

  resetAllVariants() {
    this.userVariants = {}
    this.saveUserVariants()
  }

  getActiveTests(): ABTest[] {
    return this.tests.filter(test => test.isActive)
  }

  // Admin functions for debugging
  forceVariant(testId: string, variant: string) {
    if (!this.isClient) return
    
    this.userVariants[testId] = variant
    this.saveUserVariants()
  }

  getTestResults(): { [testId: string]: any } {
    // This would integrate with analytics in a production environment
    return {
      'hero-headline': {
        control: { views: 1250, conversions: 45, rate: 3.6 },
        variant: { views: 1180, conversions: 52, rate: 4.4 }
      },
      'button-color': {
        blue: { views: 1200, conversions: 48, rate: 4.0 },
        gold: { views: 1230, conversions: 49, rate: 3.98 }
      },
      'form-position': {
        sidebar: { views: 1150, conversions: 41, rate: 3.57 },
        inline: { views: 1280, conversions: 56, rate: 4.38 }
      }
    }
  }
}

export const abTestManager = ABTestingManager.getInstance()

// React hooks for easy use in components
export function useABTest(testId: string): string {
  if (typeof window === 'undefined') {
    return 'control' // SSR fallback
  }
  
  return abTestManager.getVariant(testId)
}

export function useABTestTracking() {
  return {
    trackConversion: (testId: string, conversionType: string, value?: number) => {
      abTestManager.trackConversion(testId, conversionType, value)
    },
    getAllVariants: () => abTestManager.getAllVariants(),
    resetVariant: (testId: string) => abTestManager.resetVariant(testId),
    resetAllVariants: () => abTestManager.resetAllVariants()
  }
}