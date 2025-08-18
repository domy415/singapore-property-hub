'use client'

import { useState } from 'react'

export default function PropertyAPITest() {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [error, setError] = useState<string>('')
  const [searchCriteria, setSearchCriteria] = useState({
    location: 'Orchard',
    propertyType: 'condo' as 'condo' | 'landed' | 'hdb',
    minPrice: 1000000,
    maxPrice: 3000000
  })

  const testOfficialAPI = async () => {
    setLoading(true)
    setError('')
    setResults(null)

    try {
      const response = await fetch('/api/properties/official-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(searchCriteria)
      })

      const data = await response.json()
      
      if (!response.ok) {
        setError(data.error || 'API request failed')
        if (data.setup) {
          setError(prev => `${prev}\n\nSetup Instructions: ${data.setup}`)
        }
      } else {
        setResults(data)
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const testScraperOnly = async () => {
    setLoading(true)
    setError('')
    setResults(null)

    try {
      const response = await fetch('/api/scraper/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...searchCriteria,
          listingType: 'sale',
          maxResults: 10
        })
      })

      const data = await response.json()
      
      if (!response.ok) {
        setError(data.error || 'Scraper test request failed')
        if (data.tip) {
          setError(prev => `${prev}\n\nTip: ${data.tip}`)
        }
      } else {
        setResults(data)
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const testEnhancedScraper = async () => {
    setLoading(true)
    setError('')
    setResults(null)

    try {
      const response = await fetch('/api/scraper/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...searchCriteria,
          listingType: 'sale',
          maxResults: 20,
          saveToDb: true
        })
      })

      const data = await response.json()
      
      if (!response.ok) {
        setError(data.error || 'Enhanced scraper request failed')
        if (data.tip) {
          setError(prev => `${prev}\n\nTip: ${data.tip}`)
        }
      } else {
        setResults(data)
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const testWebScraper = async () => {
    setLoading(true)
    setError('')
    setResults(null)

    try {
      const response = await fetch('/api/scraper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(searchCriteria)
      })

      const data = await response.json()
      
      if (!response.ok) {
        setError(data.error || 'Scraper request failed')
      } else {
        setResults(data)
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Property API Test Dashboard</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Search Criteria</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                value={searchCriteria.location}
                onChange={(e) => setSearchCriteria({...searchCriteria, location: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Orchard, Tampines"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Type
              </label>
              <select
                value={searchCriteria.propertyType}
                onChange={(e) => setSearchCriteria({...searchCriteria, propertyType: e.target.value as any})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="condo">Condominium</option>
                <option value="landed">Landed</option>
                <option value="hdb">HDB</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Min Price
              </label>
              <input
                type="number"
                value={searchCriteria.minPrice}
                onChange={(e) => setSearchCriteria({...searchCriteria, minPrice: parseInt(e.target.value) || 0})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Price
              </label>
              <input
                type="number"
                value={searchCriteria.maxPrice}
                onChange={(e) => setSearchCriteria({...searchCriteria, maxPrice: parseInt(e.target.value) || 0})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">API Test Options</h2>
          
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-green-700 mb-2">✅ Recommended: Official APIs</h3>
              <p className="text-sm text-gray-600 mb-3">
                Uses URA and OneMap official government APIs for accurate, legal data access.
              </p>
              <button
                onClick={testOfficialAPI}
                disabled={loading}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:bg-gray-400"
              >
                {loading ? 'Testing...' : 'Test Official APIs'}
              </button>
            </div>
            
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-blue-700 mb-2">🚀 Current Listings: Enhanced Scraper</h3>
              <p className="text-sm text-gray-600 mb-3">
                Get real-time property listings from PropertyGuru and 99.co with advanced parsing.
              </p>
              <div className="space-y-2">
                <div>
                  <button
                    onClick={testScraperOnly}
                    disabled={loading}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 mr-2"
                  >
                    {loading ? 'Scraping...' : 'Test Scraper Only'}
                  </button>
                  <span className="text-xs text-gray-500">No database save</span>
                </div>
                <div>
                  <button
                    onClick={testEnhancedScraper}
                    disabled={loading}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:bg-gray-400 mr-2"
                  >
                    {loading ? 'Scraping...' : 'Scrape & Save to DB'}
                  </button>
                  <span className="text-xs text-gray-500">Saves to database</span>
                </div>
                <div>
                  <button
                    onClick={testWebScraper}
                    disabled={loading}
                    className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 disabled:bg-gray-400"
                  >
                    {loading ? 'Testing...' : 'Test Legacy Scraper'}
                  </button>
                  <span className="text-xs text-gray-500">Old implementation</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-8">
            <h3 className="font-semibold mb-2">Error:</h3>
            <pre className="whitespace-pre-wrap text-sm">{error}</pre>
          </div>
        )}

        {results && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Results</h2>
            
            {results.success ? (
              <div>
                <div className="mb-4">
                  <p className="text-green-600 font-semibold">✅ API call successful!</p>
                  {results.message && (
                    <p className="text-sm text-gray-600 mt-1">{results.message}</p>
                  )}
                </div>
                
                {results.data?.summary && (
                  <div className="bg-gray-50 rounded p-4 mb-4">
                    <h3 className="font-semibold mb-2">Summary</h3>
                    <p>Total Transactions: {results.data.summary.totalTransactions}</p>
                    <p>Average Price: ${results.data.summary.averagePrice.toLocaleString()}</p>
                    <p>Price Range: ${results.data.summary.priceRange.min.toLocaleString()} - ${results.data.summary.priceRange.max.toLocaleString()}</p>
                  </div>
                )}

                {results.sources && (
                  <div className="bg-gray-50 rounded p-4 mb-4">
                    <h3 className="font-semibold mb-2">Sources</h3>
                    <p>PropertyGuru: {results.sources.propertyGuru} listings</p>
                    <p>99.co: {results.sources.ninetyNine} listings</p>
                    <p>Total: {results.count} listings</p>
                  </div>
                )}

                {results.listings && results.listings.length > 0 && (
                  <div className="bg-gray-50 rounded p-4 mb-4">
                    <h3 className="font-semibold mb-2">Sample Listings</h3>
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {results.listings.slice(0, 5).map((listing: any, index: number) => (
                        <div key={index} className="border bg-white rounded p-3 text-sm">
                          <div className="font-medium">{listing.title}</div>
                          <div className="text-gray-600">{listing.price} • {listing.address}</div>
                          <div className="text-gray-500">{listing.bedrooms} bed • {listing.area} • {listing.source}</div>
                          {listing.url && (
                            <a href={listing.url} target="_blank" className="text-blue-500 text-xs">View Listing →</a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="bg-gray-50 rounded p-4 overflow-auto">
                  <h3 className="font-semibold mb-2">Raw Response</h3>
                  <pre className="text-xs">{JSON.stringify(results, null, 2)}</pre>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-red-600 font-semibold">❌ API call failed</p>
                <pre className="mt-2 text-sm">{JSON.stringify(results, null, 2)}</pre>
              </div>
            )}
          </div>
        )}

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Setup Instructions</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
            <li>Register for URA API access at <a href="https://www.ura.gov.sg/maps/api/" target="_blank" className="underline">ura.gov.sg/maps/api</a></li>
            <li>Register for OneMap API at <a href="https://www.onemap.gov.sg/apidocs/" target="_blank" className="underline">onemap.gov.sg/apidocs</a></li>
            <li>Add your API credentials to Vercel environment variables</li>
            <li>Redeploy your application</li>
            <li>Test the APIs using this dashboard</li>
          </ol>
        </div>
      </div>
    </div>
  )
}