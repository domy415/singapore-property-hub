'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface StickyCTABarProps {
  variant?: 'default' | 'property' | 'contact' | 'newsletter'
  title?: string
  subtitle?: string
  primaryAction?: {
    text: string
    href?: string
    onClick?: () => void
  }
  secondaryAction?: {
    text: string
    href?: string
    onClick?: () => void
  }
  showOnlyOnMobile?: boolean
  hideOnPaths?: string[]
}

export default function StickyCTABar({
  variant = 'default',
  title,
  subtitle,
  primaryAction,
  secondaryAction,
  showOnlyOnMobile = true,
  hideOnPaths = []
}: StickyCTABarProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      // Hide when scrolling down, show when scrolling up
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false)
      } else {
        setIsVisible(true)
      }
      
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  // Hide on specific paths
  useEffect(() => {
    const currentPath = window.location.pathname
    if (hideOnPaths.some(path => currentPath.includes(path))) {
      setIsVisible(false)
    }
  }, [hideOnPaths])

  const getVariantConfig = () => {
    switch (variant) {
      case 'property':
        return {
          title: title || 'Find Your Dream Property',
          subtitle: subtitle || 'Browse 150+ premium Singapore condos',
          primaryAction: primaryAction || { text: 'Browse Properties', href: '/condos' },
          secondaryAction: secondaryAction || { text: 'Get Advice', href: '/contact' },
          bgColor: 'bg-gradient-to-r from-blue-600 to-purple-600',
          textColor: 'text-white'
        }
      case 'contact':
        return {
          title: title || 'Need Expert Advice?',
          subtitle: subtitle || 'Get personalized property recommendations',
          primaryAction: primaryAction || { text: 'Contact Us', href: '/contact' },
          secondaryAction: secondaryAction || { text: 'Call Now', href: 'tel:+6512345678' },
          bgColor: 'bg-gradient-to-r from-green-600 to-emerald-600',
          textColor: 'text-white'
        }
      case 'newsletter':
        return {
          title: title || 'Stay Updated',
          subtitle: subtitle || 'Get weekly property insights',
          primaryAction: primaryAction || { text: 'Subscribe', href: '/newsletter' },
          secondaryAction: secondaryAction || { text: 'Learn More', href: '/guides' },
          bgColor: 'bg-gradient-to-r from-orange-600 to-red-600',
          textColor: 'text-white'
        }
      default:
        return {
          title: title || 'Singapore Property Hub',
          subtitle: subtitle || 'Your trusted property investment guide',
          primaryAction: primaryAction || { text: 'Get Started', href: '/condos' },
          secondaryAction: secondaryAction || { text: 'Learn More', href: '/guides' },
          bgColor: 'bg-white',
          textColor: 'text-gray-900'
        }
    }
  }

  const config = getVariantConfig()

  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 z-30',
        'transform transition-transform duration-300',
        showOnlyOnMobile ? 'lg:hidden' : '',
        isVisible ? 'translate-y-0' : 'translate-y-full'
      )}
    >
      <div className={cn('px-4 py-3 shadow-2xl', config.bgColor)}>
        <div className="flex items-center justify-between">
          {/* Content */}
          <div className="flex-1 min-w-0 pr-4">
            <h3 className={cn('font-semibold text-sm truncate', config.textColor)}>
              {config.title}
            </h3>
            <p className={cn('text-xs opacity-90 truncate', config.textColor)}>
              {config.subtitle}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {config.secondaryAction && (
              <>
                {config.secondaryAction.href ? (
                  <Link
                    href={config.secondaryAction.href}
                    className={cn(
                      'px-3 py-2 text-xs font-medium rounded-lg',
                      'border transition-all duration-200',
                      'min-h-[44px] min-w-[44px] flex items-center justify-center',
                      variant === 'default'
                        ? 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        : 'border-white/30 text-white/90 hover:bg-white/10'
                    )}
                  >
                    {config.secondaryAction.text}
                  </Link>
                ) : (
                  <button
                    onClick={config.secondaryAction.onClick}
                    className={cn(
                      'px-3 py-2 text-xs font-medium rounded-lg',
                      'border transition-all duration-200',
                      'min-h-[44px] min-w-[44px] flex items-center justify-center',
                      variant === 'default'
                        ? 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        : 'border-white/30 text-white/90 hover:bg-white/10'
                    )}
                  >
                    {config.secondaryAction.text}
                  </button>
                )}
              </>
            )}

            {config.primaryAction.href ? (
              <Link
                href={config.primaryAction.href}
                className={cn(
                  'px-4 py-2 text-xs font-semibold rounded-lg',
                  'transition-all duration-200 active:scale-95',
                  'min-h-[44px] min-w-[44px] flex items-center justify-center',
                  variant === 'default'
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
                )}
              >
                {config.primaryAction.text}
              </Link>
            ) : (
              <button
                onClick={config.primaryAction.onClick}
                className={cn(
                  'px-4 py-2 text-xs font-semibold rounded-lg',
                  'transition-all duration-200 active:scale-95',
                  'min-h-[44px] min-w-[44px] flex items-center justify-center',
                  variant === 'default'
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
                )}
              >
                {config.primaryAction.text}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Safe area for devices with home indicator */}
      <div className="bg-inherit h-safe-area-inset-bottom" />
    </div>
  )
}

// Property-specific sticky bar
export function PropertyCTABar() {
  return (
    <StickyCTABar
      variant="property"
      hideOnPaths={['/admin', '/404']}
    />
  )
}

// Contact CTA Bar
export function ContactCTABar() {
  return (
    <StickyCTABar
      variant="contact"
      hideOnPaths={['/contact', '/admin', '/404']}
    />
  )
}

// Newsletter CTA Bar
export function NewsletterCTABar() {
  return (
    <StickyCTABar
      variant="newsletter"
      hideOnPaths={['/admin', '/404']}
    />
  )
}