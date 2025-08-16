 export default function LatestArticles() {
    return (
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Latest Property Insights</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Stay informed with expert analysis and market trends.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <article className="bg-white border rounded-lg overflow-hidden">
              <div className="h-48 bg-gradient-to-br from-blue-100 to-blue-200"></div>
              <div className="p-6">
                <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm">
                  Market Insights
                </span>
                <h3 className="text-xl font-semibold my-3">Singapore Property Market Outlook 2025</h3>
                <p className="text-gray-600 mb-4">Expert analysis on market trends and investment opportunities.</p>
                <span className="text-gray-500 text-sm">Jan 15, 2025</span>
              </div>
            </article>

            <article className="bg-white border rounded-lg overflow-hidden">
              <div className="h-48 bg-gradient-to-br from-green-100 to-green-200"></div>
              <div className="p-6">
                <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm">
                  Buying Guide
                </span>
                <h3 className="text-xl font-semibold my-3">Complete Guide to Buying Your First Condo</h3>
                <p className="text-gray-600 mb-4">Everything first-time buyers need to know about condominiums.</p>
                <span className="text-gray-500 text-sm">Jan 12, 2025</span>
              </div>
            </article>

            <article className="bg-white border rounded-lg overflow-hidden">
              <div className="h-48 bg-gradient-to-br from-purple-100 to-purple-200"></div>
              <div className="p-6">
                <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm">
                  Investment
                </span>
                <h3 className="text-xl font-semibold my-3">Top 5 Districts for Property Investment</h3>
                <p className="text-gray-600 mb-4">Discover the most promising areas with detailed ROI analysis.</p>
                <span className="text-gray-500 text-sm">Jan 10, 2025</span>
              </div>
            </article>
          </div>
        </div>
      </section>
    )
  }
