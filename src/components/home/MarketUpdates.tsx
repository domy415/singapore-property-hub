import Link from 'next/link'

interface MarketUpdate {
  id: string
  title: string
  excerpt: string
  date: Date
  category: string
}

interface MarketUpdatesProps {
  updates: MarketUpdate[]
}

export default function MarketUpdates({ updates }: MarketUpdatesProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Market Updates</h2>
        <Link 
          href="/market-insights"
          className="text-blue-600 font-semibold hover:text-blue-700 text-sm flex items-center gap-1"
        >
          View All
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
      
      <div className="space-y-4">
        {updates.map((update) => (
          <article key={update.id} className="group border-b border-gray-100 pb-4 last:border-b-0">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                    {update.category}
                  </span>
                  <span className="text-xs text-gray-500">
                    {update.date.toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                  <Link href="#" className="line-clamp-1">
                    {update.title}
                  </Link>
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {update.excerpt}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-gray-900">Breaking News Alerts</p>
            <p className="text-sm text-gray-600">Get instant updates on policy changes</p>
          </div>
        </div>
      </div>
    </div>
  )
}