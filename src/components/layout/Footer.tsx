import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const navigation = {
    main: [
      { name: 'Articles', href: '/articles' },
      { name: 'Condo Reviews', href: '/condos' },
      { name: 'Market News', href: '/news' },
      { name: 'About Us', href: '/about' },
      { name: 'Contact', href: '/contact' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Cookie Policy', href: '/cookies' },
    ],
    social: [
      {
        name: 'LinkedIn',
        href: 'https://www.linkedin.com/company/singaporepropertyhub',
        icon: (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        ),
      },
    ],
  }

  return (
    <footer style={{ backgroundColor: 'var(--text-primary)', color: 'white' }}>
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--primary)' }}>
                <span className="text-white font-bold text-lg">SP</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">Singapore Property Hub</h3>
                <p className="text-sm opacity-70">Property Intelligence Platform</p>
              </div>
            </div>
            
            <p className="mb-6 max-w-md leading-relaxed opacity-80">
              Singapore's premier property intelligence platform, providing expert insights 
              and unbiased reviews for serious property buyers and investors.
            </p>
            
            <div className="flex items-center space-x-4">
              <p className="text-sm opacity-70">Follow us:</p>
              {navigation.social.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 hover:-translate-y-1"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--accent)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Follow us on ${item.name}`}
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {navigation.main.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="opacity-80 hover:opacity-100 transition-all duration-300 text-sm hover:translate-x-1 block"
                    style={{ color: 'white' }}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Stay Updated</h4>
            <p className="text-sm mb-4 opacity-80">
              Get weekly property insights delivered to your inbox.
            </p>
            
            <form className="space-y-3">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full px-4 py-3 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 transition-all duration-300"
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  focusRingColor: 'var(--accent)'
                }}
                required
              />
              <button
                type="submit"
                className="btn-primary w-full py-3"
              >
                Subscribe
              </button>
            </form>
            
            <p className="text-xs mt-3 opacity-60">
              No spam. Unsubscribe anytime.
            </p>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
              <p className="text-sm opacity-70">
                &copy; {currentYear} Singapore Property Hub. All rights reserved.
              </p>
              <div className="flex items-center space-x-4">
                {navigation.legal.map((item, index) => (
                  <div key={item.name} className="flex items-center">
                    {index > 0 && <span className="mx-2 opacity-50">•</span>}
                    <Link
                      href={item.href}
                      className="text-xs opacity-70 hover:opacity-100 transition-all duration-300"
                    >
                      {item.name}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <p className="text-xs opacity-70">
                Built with ❤️ in Singapore
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Badge */}
      <div className="py-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-center items-center space-y-2 md:space-y-0 md:space-x-8 text-center">
            <p className="text-xs opacity-60">
              Independent Property Intelligence • No Developer Partnerships • Unbiased Reviews
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}