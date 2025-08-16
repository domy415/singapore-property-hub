 export default function Header() {
    return (
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="text-2xl font-bold text-blue-600">
              Singapore Property Hub
            </div>
            <nav className="flex space-x-6">
              <a href="/properties" className="text-gray-700">Properties</a>
              <a href="/articles" className="text-gray-700">Articles</a>
              <a href="/contact" className="text-gray-700">Contact</a>
            </nav>
          </div>
        </div>
      </header>
    )
  }
