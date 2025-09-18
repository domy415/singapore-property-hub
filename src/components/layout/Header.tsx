'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function Header() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Articles', href: '/articles' },
    { name: 'Condo Reviews', href: '/condos' },
    { name: 'News', href: '/news' },
    { name: 'Contact', href: '/contact' },
  ]

  return (
    <header className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b z-50" style={{ borderBottomColor: 'var(--border)' }}>
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between max-w-7xl">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
          >
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--primary)' }}>
              <span className="text-white font-bold text-lg">SP</span>
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-xl" style={{ color: 'var(--text-primary)' }}>
                Singapore Property Hub
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`font-medium transition-colors ${
                  pathname === item.href
                    ? 'text-blue-600' 
                    : 'hover:text-blue-600'
                }`}
                style={{ color: pathname === item.href ? 'var(--accent)' : 'var(--text-secondary)' }}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Link
              href="/contact"
              className="btn-primary"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
            style={{ color: 'var(--text-secondary)' }}
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center">
              <span className={`block w-5 h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1' : ''}`} />
              <span className={`block w-5 h-0.5 bg-current mt-1 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-5 h-0.5 bg-current mt-1 transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1' : ''}`} />
            </div>
          </button>

        {/* Mobile Navigation */}
        <div className={`md:hidden absolute top-full left-0 right-0 z-50 transition-all duration-300 overflow-hidden ${
          isMobileMenuOpen ? 'max-h-80 opacity-100 visible' : 'max-h-0 opacity-0 invisible'
        }`}>
          <nav className="bg-white/95 backdrop-blur-md shadow-xl p-6 space-y-4 mx-4 mt-2 rounded-xl border" style={{ borderColor: 'var(--border)' }}>
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block font-medium py-2 px-3 rounded-lg transition-all duration-200 hover:bg-gray-50"
                style={{ 
                  color: pathname === item.href ? 'var(--primary)' : 'var(--text-secondary)',
                  backgroundColor: pathname === item.href ? 'var(--surface)' : 'transparent'
                }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4 border-t" style={{ borderTopColor: 'var(--border)' }}>
              <Link
                href="/contact"
                className="btn-primary block w-full text-center py-3"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Get Started
              </Link>
            </div>
          </nav>
        </div>
      </nav>
    </header>
  )
}