/**
 * React hook for domain management in condo reviews
 */

import { useState, useEffect, useCallback } from 'react'

interface DomainManagementState {
  isLoading: boolean
  validation: {
    whitelisted: string[]
    missing: string[]
    report: string
  } | null
  error: string | null
}

interface DomainUpdateResult {
  domainsExtracted: string[]
  domainsAdded: string[]
  domainsSkipped: string[]
}

export function useDomainManagement() {
  const [state, setState] = useState<DomainManagementState>({
    isLoading: false,
    validation: null,
    error: null
  })

  /**
   * Validate current domain whitelist
   */
  const validateDomains = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const response = await fetch('/api/manage-domains?action=validate')
      const result = await response.json()

      if (result.success) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          validation: result.data,
          error: null
        }))
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to validate domains'
      }))
    }
  }, [])

  /**
   * Auto-update domains from condo data
   */
  const updateDomains = useCallback(async (): Promise<DomainUpdateResult | null> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const response = await fetch('/api/manage-domains', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action: 'auto-update' })
      })

      const result = await response.json()

      if (result.success) {
        setState(prev => ({ ...prev, isLoading: false, error: null }))
        
        // Refresh validation after update
        await validateDomains()
        
        return {
          domainsExtracted: result.data.extraction.domains,
          domainsAdded: result.data.update.added,
          domainsSkipped: result.data.update.skipped
        }
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to update domains'
      }))
      return null
    }
  }, [validateDomains])

  /**
   * Update specific domains
   */
  const updateSpecificDomains = useCallback(async (domains: string[]): Promise<DomainUpdateResult | null> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const response = await fetch('/api/manage-domains', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          action: 'update-specific',
          domains 
        })
      })

      const result = await response.json()

      if (result.success) {
        setState(prev => ({ ...prev, isLoading: false, error: null }))
        
        // Refresh validation after update
        await validateDomains()
        
        return result.data
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to update specific domains'
      }))
      return null
    }
  }, [validateDomains])

  /**
   * Test domain automation with condo review generation
   */
  const testDomainAutomation = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const response = await fetch('/api/test-domain-automation?action=test-condo-review')
      const result = await response.json()

      setState(prev => ({ ...prev, isLoading: false, error: null }))
      
      // Refresh validation after test
      await validateDomains()
      
      return result.data
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to test domain automation'
      }))
      return null
    }
  }, [validateDomains])

  // Auto-validate on mount
  useEffect(() => {
    validateDomains()
  }, [validateDomains])

  return {
    ...state,
    validateDomains,
    updateDomains,
    updateSpecificDomains,
    testDomainAutomation,
    hasIssues: state.validation?.missing && state.validation.missing.length > 0,
    missingCount: state.validation?.missing?.length || 0,
    whitelistedCount: state.validation?.whitelisted?.length || 0
  }
}

/**
 * Hook for automated domain management during condo operations
 */
export function useAutoDomainManagement() {
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  const autoUpdateOnCondoChange = useCallback(async (condoImages: string[]) => {
    try {
      // Extract domains from image URLs
      const domains = condoImages
        .map(url => {
          try {
            return new URL(url).hostname
          } catch {
            return null
          }
        })
        .filter((domain): domain is string => domain !== null)
        .filter(domain => !domain.includes('unsplash.com') && !domain.includes('images.propertyguru.com.sg'))

      if (domains.length > 0) {
        const response = await fetch('/api/manage-domains', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
            action: 'update-specific',
            domains: Array.from(new Set(domains)) // Remove duplicates
          })
        })

        const result = await response.json()
        
        if (result.success) {
          setLastUpdate(new Date())
          console.log('Auto-updated domains:', result.data.added)
          return result.data
        }
      }
    } catch (error) {
      console.warn('Auto domain update failed:', error)
    }
    
    return null
  }, [])

  return {
    autoUpdateOnCondoChange,
    lastUpdate
  }
}