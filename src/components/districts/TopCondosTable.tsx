import Link from 'next/link'

interface TopCondo {
  rank: number
  name: string
  slug: string
  rating: number
  priceFrom: string
  pricePsf: string
  completionYear: string
  developer: string
  units: number
}

interface TopCondosTableProps {
  condos: TopCondo[]
  className?: string
}

export default function TopCondosTable({ condos, className = "" }: TopCondosTableProps) {
  const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-4 h-4 ${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )

  return (
    <div className={`bg-white rounded-xl shadow-lg overflow-hidden ${className}`}>
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          Top 10 Condominiums
        </h3>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-secondary uppercase tracking-wider">Rank</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-secondary uppercase tracking-wider">Development</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-secondary uppercase tracking-wider">Rating</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-secondary uppercase tracking-wider">Price From</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-secondary uppercase tracking-wider">PSF</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-secondary uppercase tracking-wider">Year</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-secondary uppercase tracking-wider">Units</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-secondary uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {condos.map((condo) => (
              <tr key={condo.rank} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                    condo.rank <= 3 ? 'bg-gold' : 'bg-blue-600'
                  }`}>
                    {condo.rank}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <div className="font-semibold text-primary">{condo.name}</div>
                    <div className="text-sm text-secondary">{condo.developer}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <StarRating rating={condo.rating} />
                </td>
                <td className="px-6 py-4">
                  <div className="font-semibold text-primary">{condo.priceFrom}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-secondary">{condo.pricePsf}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-secondary">{condo.completionYear}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-secondary">{condo.units}</div>
                </td>
                <td className="px-6 py-4">
                  <Link 
                    href={`/condos/${condo.slug}/review-2025`}
                    className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                  >
                    View Review
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden divide-y divide-gray-200">
        {condos.map((condo) => (
          <div key={condo.rank} className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-sm ${
                  condo.rank <= 3 ? 'bg-gold' : 'bg-blue-600'
                }`}>
                  {condo.rank}
                </div>
                <div>
                  <h4 className="font-semibold text-primary">{condo.name}</h4>
                  <p className="text-sm text-secondary">{condo.developer}</p>
                </div>
              </div>
              <StarRating rating={condo.rating} />
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm mb-3">
              <div>
                <span className="text-secondary">From: </span>
                <span className="font-semibold text-primary">{condo.priceFrom}</span>
              </div>
              <div>
                <span className="text-secondary">PSF: </span>
                <span className="font-medium">{condo.pricePsf}</span>
              </div>
              <div>
                <span className="text-secondary">Year: </span>
                <span>{condo.completionYear}</span>
              </div>
              <div>
                <span className="text-secondary">Units: </span>
                <span>{condo.units}</span>
              </div>
            </div>
            
            <Link 
              href={`/condos/${condo.slug}/review-2025`}
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-blue-700 transition-colors"
            >
              View Review
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}