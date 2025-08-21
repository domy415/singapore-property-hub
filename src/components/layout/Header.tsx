'use client'

import Link from 'next/link'
import { useState } from 'react'

const newLaunchesMenu = {
  title: 'New Launches',
  sections: [
    {
      title: 'By Status',
      links: [
        { title: 'All New Launches', href: '/new-launches' },
        { title: 'Recently Launched', href: '/new-launches?status=recent' },
        { title: 'Coming Soon', href: '/new-launches?status=upcoming' },
        { title: 'TOP Coming', href: '/new-launches?status=top' },
      ]
    },
    {
      title: 'By Region',
      links: [
        { title: 'Central Region (CCR)', href: '/new-launches?region=central' },
        { title: 'Rest of Central (RCR)', href: '/new-launches?region=rcr' },
        { title: 'Outside Central (OCR)', href: '/new-launches?region=ocr' },
        { title: 'North Region', href: '/new-launches?region=north' },
        { title: 'Northeast Region', href: '/new-launches?region=northeast' },
      ]
    },
    {
      title: 'Featured Projects',
      links: [
        { title: 'The Continuum', href: '/projects/the-continuum' },
        { title: 'Grand Dunman', href: '/projects/grand-dunman' },
        { title: 'Lentor Mansion', href: '/projects/lentor-mansion' },
        { title: 'View All Projects', href: '/new-launches' },
      ]
    }
  ]
}

const locationGuidesMenu = {
  title: 'Location Guides',
  sections: [
    {
      title: 'Central Region',
      links: [
        { title: 'Orchard', href: '/location-guides/orchard' },
        { title: 'Marina Bay', href: '/location-guides/marina-bay' },
        { title: 'CBD / Raffles Place', href: '/location-guides/cbd' },
        { title: 'Tanjong Pagar', href: '/location-guides/tanjong-pagar' },
      ]
    },
    {
      title: 'East Region',
      links: [
        { title: 'Marine Parade', href: '/location-guides/marine-parade' },
        { title: 'Katong / Joo Chiat', href: '/location-guides/katong' },
        { title: 'Bedok', href: '/location-guides/bedok' },
        { title: 'Pasir Ris', href: '/location-guides/pasir-ris' },
      ]
    },
    {
      title: 'Popular Districts',
      links: [
        { title: 'District 9', href: '/location-guides/district-9' },
        { title: 'District 10', href: '/location-guides/district-10' },
        { title: 'District 15', href: '/location-guides/district-15' },
        { title: 'All Districts', href: '/location-guides' },
      ]
    }
  ]
}

const marketInsightsMenu = {
  title: 'Market Insights',
  sections: [
    {
      title: 'Market Reports',
      links: [
        { title: 'Monthly Market Report', href: '/market-insights/monthly' },
        { title: 'Quarterly Analysis', href: '/market-insights/quarterly' },
        { title: 'Price Index Trends', href: '/market-insights/price-trends' },
        { title: 'Transaction Data', href: '/market-insights/transactions' },
      ]
    },
    {
      title: 'Investment Analysis',
      links: [
        { title: 'Rental Yield Analysis', href: '/market-insights/rental-yields' },
        { title: 'Capital Growth Trends', href: '/market-insights/capital-growth' },
        { title: 'Investment Hotspots', href: '/market-insights/hotspots' },
        { title: 'ROI Calculator', href: '/tools/roi-calculator' },
      ]
    },
    {
      title: 'Policy Updates',
      links: [
        { title: 'Cooling Measures', href: '/market-insights/cooling-measures' },
        { title: 'ABSD Changes', href: '/market-insights/absd' },
        { title: 'Government Policies', href: '/market-insights/policies' },
        { title: 'Market Impact Analysis', href: '/market-insights/impact' },
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

  return (
    <div 
      className="absolute top-full left-0 bg-white shadow-xl border-t z-50 min-w-[280px]"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="px-6 py-4">
        {menu.sections.map((section, index) => (
          <div key={index} className={index > 0 ? "mt-6 pt-6 border-t border-gray-200" : ""}>
            <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wider">{section.title}</h3>
            <ul className="space-y-2">
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
  )
}

export default function Header() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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
              Get Floor Plans
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
              <Link href="/new-launches" className="block text-gray-700 hover:text-blue-600 transition-colors">
                New Launches
              </Link>
              <Link href="/market-insights" className="block text-gray-700 hover:text-blue-600 transition-colors">
                Market Insights
              </Link>
              <Link href="/location-guides" className="block text-gray-700 hover:text-blue-600 transition-colors">
                Location Guides
              </Link>
              <Link href="/about" className="block text-gray-700 hover:text-blue-600 transition-colors">
                About
              </Link>
              <Link href="/contact" className="block bg-blue-600 text-white px-4 py-2 rounded-lg font-medium text-center">
                Get Floor Plans
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