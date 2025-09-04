'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    checkAuthentication()
  }, [pathname])

  const checkAuthentication = async () => {
    // Skip auth check for login page
    if (pathname === '/admin/login') {
      setIsAuthenticated(true)
      return
    }

    try {
      console.log('🔍 Checking authentication...')
      const response = await fetch('/api/admin/auth', {
        method: 'GET',
        credentials: 'include'
      })

      console.log('🔍 Auth response status:', response.status)
      const data = await response.json()
      console.log('🔍 Auth response data:', data)

      if (response.ok && data.authenticated) {
        console.log('✅ Authentication successful')
        setIsAuthenticated(true)
      } else {
        console.log('❌ Authentication failed, redirecting to login')
        setIsAuthenticated(false)
        router.push('/admin/login')
      }
    } catch (error) {
      console.error('❌ Auth check failed:', error)
      setIsAuthenticated(false)
      router.push('/admin/login')
    }
  }

  // Show loading while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    )
  }

  // Don't render anything if not authenticated (will redirect)
  if (!isAuthenticated && pathname !== '/admin/login') {
    return null
  }

  return <>{children}</>
}