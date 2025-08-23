interface OutlookPoint {
  title: string
  description: string
}

interface InvestmentOutlookProps {
  pros: OutlookPoint[]
  cons: OutlookPoint[]
  overallRating: number
  rentalYieldRange: string
  capitalGrowthProjection: string
  className?: string
}

export default function InvestmentOutlook({ 
  pros, 
  cons, 
  overallRating, 
  rentalYieldRange,
  capitalGrowthProjection,
  className = "" 
}: InvestmentOutlookProps) {
  const getRatingColor = (rating: number) => {
    if (rating >= 8) return 'text-green-600'
    if (rating >= 6) return 'text-orange-600'
    return 'text-red-600'
  }

  const getRatingLabel = (rating: number) => {
    if (rating >= 8) return 'Excellent'
    if (rating >= 6) return 'Good'
    return 'Average'
  }

  return (
    <div className={`bg-white rounded-xl shadow-lg overflow-hidden ${className}`}>
      <div className="bg-gradient-to-r from-emerald-600 to-green-600 px-6 py-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          Investment Outlook
        </h3>
      </div>

      <div className="p-6">
        {/* Investment Score */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200 mb-8">
          <div className="text-center">
            <h4 className="text-lg font-bold text-primary mb-2">Investment Score</h4>
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className={`text-5xl font-bold ${getRatingColor(overallRating)}`}>
                {overallRating}
              </div>
              <div className="text-left">
                <div className="text-secondary">/ 10</div>
                <div className={`text-sm font-semibold ${getRatingColor(overallRating)}`}>
                  {getRatingLabel(overallRating)}
                </div>
              </div>
            </div>
            
            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-white rounded-lg p-4 border border-green-300">
                <div className="font-semibold text-primary mb-1">Rental Yield</div>
                <div className="text-green-600 font-bold text-lg">{rentalYieldRange}</div>
              </div>
              <div className="bg-white rounded-lg p-4 border border-green-300">
                <div className="font-semibold text-primary mb-1">Capital Growth</div>
                <div className="text-green-600 font-bold text-lg">{capitalGrowthProjection}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Investment Pros */}
          <div>
            <h4 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Investment Advantages
            </h4>
            
            <div className="space-y-4">
              {pros.map((pro, index) => (
                <div key={index} className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg">
                  <h5 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {pro.title}
                  </h5>
                  <p className="text-green-700 text-sm leading-relaxed">{pro.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Investment Cons */}
          <div>
            <h4 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              Investment Considerations
            </h4>
            
            <div className="space-y-4">
              {cons.map((con, index) => (
                <div key={index} className="bg-orange-50 border-l-4 border-orange-400 p-4 rounded-r-lg">
                  <h5 className="font-semibold text-orange-800 mb-2 flex items-center gap-2">
                    <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    {con.title}
                  </h5>
                  <p className="text-orange-700 text-sm leading-relaxed">{con.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Investment Recommendation */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
          <div className="text-center">
            <h4 className="text-lg font-bold text-primary mb-4">Expert Recommendation</h4>
            <div className="flex items-center justify-center gap-2 mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              <span className={`font-bold text-lg ${getRatingColor(overallRating)}`}>
                {overallRating >= 8 ? 'STRONG BUY' : overallRating >= 6 ? 'BUY' : 'HOLD'}
              </span>
            </div>
            <p className="text-primary leading-relaxed max-w-2xl mx-auto">
              {overallRating >= 8 
                ? "This district offers excellent investment potential with strong fundamentals, good rental yields, and promising capital appreciation prospects. Highly recommended for both owner-occupiers and investors."
                : overallRating >= 6 
                ? "This district presents solid investment opportunities with reasonable returns and stable market conditions. Suitable for conservative investors seeking steady growth."
                : "While this district has its merits, investors should carefully consider market conditions and conduct thorough due diligence before making investment decisions."
              }
            </p>
          </div>
        </div>

        {/* Target Investor Profile */}
        <div className="mt-6">
          <h4 className="text-lg font-bold text-primary mb-4">Ideal For:</h4>
          <div className="flex flex-wrap gap-2">
            {overallRating >= 8 && (
              <>
                <span className="bg-green-100 text-green-800 px-3 py-2 rounded-full text-sm font-medium">
                  First-time Investors
                </span>
                <span className="bg-green-100 text-green-800 px-3 py-2 rounded-full text-sm font-medium">
                  Young Families
                </span>
                <span className="bg-green-100 text-green-800 px-3 py-2 rounded-full text-sm font-medium">
                  Long-term Holders
                </span>
              </>
            )}
            {overallRating >= 6 && (
              <>
                <span className="bg-blue-100 text-blue-800 px-3 py-2 rounded-full text-sm font-medium">
                  Conservative Investors
                </span>
                <span className="bg-blue-100 text-blue-800 px-3 py-2 rounded-full text-sm font-medium">
                  Owner-Occupiers
                </span>
              </>
            )}
            <span className="bg-purple-100 text-purple-800 px-3 py-2 rounded-full text-sm font-medium">
              Experienced Investors
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}