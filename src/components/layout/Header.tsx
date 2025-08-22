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
        { title: 'All New Launch Articles', href: '/articles?category=new-launches' },
        { title: 'Recent Launch Reviews', href: '/articles?category=launch-reviews' },
        { title: 'Upcoming Projects', href: '/articles?category=upcoming' },
        { title: 'TOP Updates', href: '/articles?category=top-updates' },
      ]
    },
    {
      title: 'By Region Coverage',
      links: [
        { title: 'Central Region (CCR)', href: '/articles?tag=ccr' },
        { title: 'Rest of Central (RCR)', href: '/articles?tag=rcr' },
        { title: 'Outside Central (OCR)', href: '/articles?tag=ocr' },
        { title: 'All Regional Coverage', href: '/articles?category=regional' },
      ]
    }
  ]
}

const locationGuidesMenu = {
  title: 'Location Guides',
  sections: [
    {
      title: 'Central Region (CCR)',
      links: [
        { title: 'District 1 - Boat Quay/Raffles Place', href: '/articles?tag=district-1' },
        { title: 'District 2 - Chinatown/Tanjong Pagar', href: '/articles?tag=district-2' },
        { title: 'District 3 - Alexandra/Commonwealth', href: '/articles?tag=district-3' },
        { title: 'District 4 - Harbourfront/Telok Blangah', href: '/articles?tag=district-4' },
        { title: 'District 6 - Beach Road/City Hall', href: '/articles?tag=district-6' },
        { title: 'District 9 - Orchard/River Valley', href: '/articles?tag=district-9' },
        { title: 'District 10 - Tanglin/Holland', href: '/articles?tag=district-10' },
        { title: 'District 11 - Newton/Novena', href: '/articles?tag=district-11' },
      ]
    },
    {
      title: 'Rest of Central (RCR)',
      links: [
        { title: 'District 5 - Buona Vista/Pasir Panjang', href: '/articles?tag=district-5' },
        { title: 'District 7 - Beach Road/Bugis', href: '/articles?tag=district-7' },
        { title: 'District 8 - Little India/Farrer Park', href: '/articles?tag=district-8' },
        { title: 'District 12 - Balestier/Toa Payoh', href: '/articles?tag=district-12' },
        { title: 'District 13 - Macpherson/Potong Pasir', href: '/articles?tag=district-13' },
        { title: 'District 14 - Geylang/Eunos', href: '/articles?tag=district-14' },
        { title: 'District 15 - Katong/Joo Chiat/Amber Road', href: '/articles?tag=district-15' },
        { title: 'District 20 - Bishan/Thomson', href: '/articles?tag=district-20' },
      ]
    },
    {
      title: 'Outside Central (OCR)',
      links: [
        { title: 'District 16 - Bedok/Upper East Coast', href: '/articles?tag=district-16' },
        { title: 'District 17 - Loyang/Changi', href: '/articles?tag=district-17' },
        { title: 'District 18 - Pasir Ris/Tampines', href: '/articles?tag=district-18' },
        { title: 'District 19 - Serangoon Gardens', href: '/articles?tag=district-19' },
        { title: 'District 21 - Clementi/Upper Bukit Timah', href: '/articles?tag=district-21' },
        { title: 'District 22 - Jurong', href: '/articles?tag=district-22' },
        { title: 'District 23 - Dairy Farm/Bukit Panjang', href: '/articles?tag=district-23' },
        { title: 'All Districts Overview', href: '/articles?category=location-guides' },
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
        { title: 'Market Outlook Articles', href: '/articles?category=market-outlook' },
        { title: 'Price Trend Analysis', href: '/articles?category=price-trends' },
        { title: 'Market Commentary', href: '/articles?category=market-analysis' },
        { title: 'Expert Opinions', href: '/articles?category=expert-views' },
      ]
    },
    {
      title: 'Investment Insights',
      links: [
        { title: 'Investment Strategies', href: '/articles?category=investment' },
        { title: 'Buying Guide', href: '/articles?category=buying-guide' },
        { title: 'Market Education', href: '/articles?category=education' },
      ]
    },
    {
      title: 'Policy Updates',
      links: [
        { title: 'Cooling Measures', href: '/articles?tag=cooling-measures' },
        { title: 'ABSD Updates', href: '/articles?tag=absd' },
        { title: 'Government Policies', href: '/articles?tag=policies' },
        { title: 'Regulatory Changes', href: '/articles?tag=regulations' },
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
              <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wider">
              {section.title}
            </h3>
            <ul className="space-y-1">
              {section.links.map((link, linkIndex) => (
                <li key={linkIndex}>
                  <Link 
                    href={link.href}
                    className="block px-2 py-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-all text-sm"
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
              <h1 className="text-xl font-bold text-gray-900">Singapore Property Hub</h1>
              <p className="text-xs text-blue-600 font-medium">Expert Reviews & Market Intelligence</p>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8 relative">
            <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Home
            </Link>
            
            {/* New Launches Mega Menu */}
            <div className="relative">
              <button 
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors flex items-center gap-1"
                onMouseEnter={() => handleMenuHover('new-launches')}
              >
                New Launches
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <MegaMenu 
                menu={newLaunchesMenu} 
                isOpen={activeMenu === 'new-launches'} 
                onMouseEnter={() => setActiveMenu('new-launches')}
                onMouseLeave={handleMenuLeave}
              />
            </div>

            {/* Market Insights Mega Menu */}
            <div className="relative">
              <button 
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors flex items-center gap-1"
                onMouseEnter={() => handleMenuHover('market-insights')}
              >
                Market Insights
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

            {/* Location Guides Mega Menu */}
            <div className="relative">
              <button 
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors flex items-center gap-1"
                onMouseEnter={() => handleMenuHover('location-guides')}
              >
                Location Guides
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

            <Link href="/about" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              About
            </Link>
            <Link href="/contact" className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2.5 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
              Contact Us
            </Link>
          </nav>
          
          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-blue-600 transition-colors"
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
              <Link href="/" className="block text-gray-700 hover:text-blue-600 transition-colors">
                Home
              </Link>
              <Link href="/articles?category=new-launches" className="block text-gray-700 hover:text-blue-600 transition-colors">
                New Launches
              </Link>
              <Link href="/articles?category=market-analysis" className="block text-gray-700 hover:text-blue-600 transition-colors">
                Market Insights
              </Link>
              <Link href="/articles?category=location-guides" className="block text-gray-700 hover:text-blue-600 transition-colors">
                Location Guides
              </Link>
              <Link href="/about" className="block text-gray-700 hover:text-blue-600 transition-colors">
                About
              </Link>
              <Link href="/contact" className="block bg-blue-600 text-white px-4 py-2 rounded-lg font-medium text-center">
                Contact Us
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