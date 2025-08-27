'use client'

import Link from 'next/link'
import { useState } from 'react'

interface HeaderProps {
  availability?: {
    categories: Set<string>
    tags: Set<string>
  }
}

const newLaunchesMenu = {
  title: 'New Launches',
  sections: [
    {
      title: 'Content Categories',
      links: [
        { title: 'All New Launch Reviews', href: '/articles?category=NEW_LAUNCH_REVIEW' },
        { title: 'Market Analysis', href: '/articles?category=MARKET_INSIGHTS' },
        { title: 'Investment Guides', href: '/articles?category=INVESTMENT' },
        { title: 'Location Guides', href: '/articles?category=LOCATION_GUIDE' },
      ]
    },
    {
      title: 'By Region Coverage',
      links: [
        { title: 'Central Region (CCR)', href: '/articles?tag=ccr' },
        { title: 'Rest of Central (RCR)', href: '/articles?tag=rcr' },
        { title: 'Outside Central (OCR)', href: '/articles?tag=ocr' },
        { title: 'All Property News', href: '/articles?category=PROPERTY_NEWS' },
      ]
    }
  ]
}

const locationGuidesMenu = {
  title: 'Location Guides',
  sections: [
    {
      title: 'Featured District Guides',
      links: [
        { title: 'All Location Guides', href: '/articles?category=LOCATION_GUIDE' },
        { title: 'Neighborhood Reviews', href: '/articles?category=NEIGHBORHOOD' },
        { title: 'District 9 - Orchard/River Valley', href: '/articles?tag=district-9' },
        { title: 'District 10 - Tanglin/Holland', href: '/articles?tag=district-10' },
        { title: 'District 15 - Katong/Marine Parade', href: '/articles?tag=district-15' },
      ]
    },
    {
      title: 'By Region',
      links: [
        { title: 'Central Region (CCR)', href: '/articles?tag=ccr' },
        { title: 'Rest of Central (RCR)', href: '/articles?tag=rcr' },
        { title: 'Outside Central (OCR)', href: '/articles?tag=ocr' },
        { title: 'North Region', href: '/articles?tag=north' },
        { title: 'East Region', href: '/articles?tag=east' },
        { title: 'West Region', href: '/articles?tag=west' },
      ]
    },
    {
      title: 'Special Features',
      links: [
        { title: 'School Proximity Guides', href: '/articles?tag=schools' },
        { title: 'MRT Connectivity', href: '/articles?tag=transport' },
        { title: 'Lifestyle & Amenities', href: '/articles?tag=amenities' },
        { title: 'Future Development Plans', href: '/articles?tag=future-development' },
      ]
    }
  ]
}

const marketInsightsMenu = {
  title: 'Market Insights',
  sections: [
    {
      title: 'Market Analysis',
      links: [
        { title: 'All Market Insights', href: '/articles?category=MARKET_INSIGHTS' },
        { title: 'Property News', href: '/articles?category=PROPERTY_NEWS' },
        { title: 'Price Trends', href: '/articles?tag=price-trends' },
        { title: 'Market Outlook', href: '/articles?tag=market-outlook' },
      ]
    },
    {
      title: 'Investment & Guides',
      links: [
        { title: 'Investment Strategies', href: '/articles?category=INVESTMENT' },
        { title: 'Buying Guide', href: '/articles?category=BUYING_GUIDE' },
        { title: 'Selling Guide', href: '/articles?category=SELLING_GUIDE' },
        { title: 'First-Time Buyers', href: '/articles?tag=first-time-buyer' },
      ]
    },
    {
      title: 'Policy & Regulations',
      links: [
        { title: 'Cooling Measures', href: '/articles?tag=cooling-measures' },
        { title: 'ABSD Updates', href: '/articles?tag=absd' },
        { title: 'Stamp Duties', href: '/articles?tag=stamp-duty' },
        { title: 'Loan Regulations', href: '/articles?tag=loan-regulations' },
      ]
    }
  ]
}

function MegaMenu({ menu, isOpen, onMouseEnter, onMouseLeave }: { 
  menu: typeof newLaunchesMenu, 
  isOpen: boolean,
  onMouseEnter: () => void,
  onMouseLeave: () => void
}) {
  if (!isOpen) return null

  // Check if this is the location guides menu (has many districts)
  const isLocationGuides = menu.title === 'Location Guides'
  const totalLinks = menu.sections.reduce((acc, section) => acc + section.links.length, 0)
  const needsScroll = totalLinks > 12

  return (
    <div 
      className="absolute top-full left-0 bg-white shadow-xl border-t z-50 min-w-[320px]"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{ maxHeight: needsScroll ? '70vh' : 'auto' }}
    >
      <div className={`${needsScroll ? 'h-full overflow-y-auto dropdown-scroll' : ''}`} style={{ maxHeight: 'inherit' }}>
        <div className="px-6 py-4">
          {menu.sections.map((section, index) => (
            <div key={index} className={index > 0 ? "mt-6 pt-6 border-t border-gray-200" : ""}>
              <h3 className="font-semibold text-primary mb-3 text-sm uppercase tracking-wider">
              {section.title}
            </h3>
            <ul className="space-y-1">
              {section.links.map((link, linkIndex) => (
                <li key={linkIndex}>
                  <Link 
                    href={link.href}
                    className="block px-2 py-1.5 text-secondary hover:text-blue-600 hover:bg-blue-50 rounded transition-all text-sm"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        </div>
      </div>
    </div>
  )
}

export default function Header({ availability }: HeaderProps) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const hasCategory = (category: string) => {
    if (!availability) return true // Show all if no data
    return availability.categories.has(category.toLowerCase())
  }

  const hasTag = (tag: string) => {
    if (!availability) return true // Show all if no data
    return availability.tags.has(tag.toLowerCase())
  }

  const handleMenuHover = (menuName: string) => {
    setActiveMenu(menuName)
  }

  const handleMenuLeave = () => {
    // Add a small delay to prevent flickering when moving between button and dropdown
    setTimeout(() => {
      setActiveMenu(null)
    }, 100)
  }

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50 border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all">
              <span className="text-white font-bold text-xl">SPH</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-primary">Singapore Property Hub</h1>
              <p className="text-xs text-blue-600 font-medium">Expert Reviews & Market Intelligence</p>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8 relative">
            <Link href="/" className="text-primary hover:text-blue-600 font-medium transition-colors">
              Home
            </Link>
            
            <Link href="/condos" className="text-primary hover:text-blue-600 font-medium transition-colors">
              Condos
            </Link>

            {/* Districts Mega Menu */}
            <div className="relative">
              <button 
                className="text-primary hover:text-blue-600 font-medium transition-colors flex items-center gap-1"
                onMouseEnter={() => handleMenuHover('location-guides')}
              >
                Districts
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <MegaMenu 
                menu={locationGuidesMenu} 
                isOpen={activeMenu === 'location-guides'} 
                onMouseEnter={() => setActiveMenu('location-guides')}
                onMouseLeave={handleMenuLeave}
              />
            </div>

            {/* Guides Mega Menu */}
            <div className="relative">
              <button 
                className="text-primary hover:text-blue-600 font-medium transition-colors flex items-center gap-1"
                onMouseEnter={() => handleMenuHover('market-insights')}
              >
                Guides
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <MegaMenu 
                menu={marketInsightsMenu} 
                isOpen={activeMenu === 'market-insights'} 
                onMouseEnter={() => setActiveMenu('market-insights')}
                onMouseLeave={handleMenuLeave}
              />
            </div>

            <Link href="/articles" className="text-primary hover:text-blue-600 font-medium transition-colors">
              News
            </Link>

            <Link href="/tools" className="text-primary hover:text-blue-600 font-medium transition-colors">
              Tools
            </Link>

            <Link href="/contact" className="btn-primary">
              Contact
            </Link>
          </nav>
          
          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-primary hover:text-blue-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 py-4">
            <nav className="space-y-4">
              <Link href="/" className="block text-primary hover:text-blue-600 transition-colors">
                Home
              </Link>
              <Link href="/condos" className="block text-primary hover:text-blue-600 transition-colors">
                Condos
              </Link>
              <Link href="/articles?category=location-guides" className="block text-primary hover:text-blue-600 transition-colors">
                Districts
              </Link>
              <Link href="/articles?category=buying-guide" className="block text-primary hover:text-blue-600 transition-colors">
                Guides
              </Link>
              <Link href="/articles" className="block text-primary hover:text-blue-600 transition-colors">
                News
              </Link>
              <Link href="/tools" className="block text-primary hover:text-blue-600 transition-colors">
                Tools
              </Link>
              <Link href="/contact" className="block btn-primary text-center">
                Contact
              </Link>
            </nav>
          </div>
        )}
      </div>

      {/* Backdrop for mega menus */}
      {activeMenu && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-20 z-40"
          onClick={handleMenuLeave}
        />
      )}
    </header>
  )
}