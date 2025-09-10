'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white shadow-md' : 'bg-white'
    }`} style={{ height: '70px' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[70px]">
          {/* Logo */}
          <Link 
            href="/" 
            className="text-2xl font-sans font-medium tracking-tight text-gray-900 hover:text-[#0A66C2] transition-colors duration-200"
            style={{ 
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              letterSpacing: '-0.01em'
            }}
          >
            Singapore Property Hub
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavigationLink href="/" label="Home" />
            <NavigationLink href="/articles" label="Articles" />
            <NavigationLink href="/condos" label="Condos" />
            <NavigationLink href="/news" label="News" />
            <NavigationLink href="/contact" label="Contact" />
          </nav>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-[#0A66C2] hover:bg-gray-100 transition-colors duration-200"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 overflow-hidden ${
          isMobileMenuOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
            <MobileNavigationLink href="/" label="Home" />
            <MobileNavigationLink href="/articles" label="Articles" />
            <MobileNavigationLink href="/condos" label="Condos" />
            <MobileNavigationLink href="/news" label="News" />
            <MobileNavigationLink href="/contact" label="Contact" />
          </div>
        </div>
      </div>
    </header>
  )
}

function NavigationLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="relative text-gray-900 font-medium text-base transition-all duration-200 hover:text-[#0A66C2] group"
      style={{ 
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        fontSize: '16px',
        fontWeight: '500',
        letterSpacing: '-0.01em'
      }}
    >
      {label}
      <span className="absolute -bottom-1 left-0 w-0 h-[3px] bg-[#0A66C2] transition-all duration-200 group-hover:w-full"></span>
    </Link>
  )
}

function MobileNavigationLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="block px-3 py-2 text-base font-medium text-gray-900 hover:text-[#0A66C2] hover:bg-gray-50 transition-colors duration-200"
      style={{ 
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}
    >
      {label}
    </Link>
  )
}