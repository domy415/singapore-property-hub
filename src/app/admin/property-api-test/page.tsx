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
              <h3 className="font-semibold text-orange-700 mb-2">⚠️ Legacy: Web Scraper</h3>
              <p className="text-sm text-gray-600 mb-3">
                Web scraping approach - may violate terms of service and break frequently.
              </p>
              <button
                onClick={testWebScraper}
                disabled={loading}
                className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 disabled:bg-gray-400"
              >
                {loading ? 'Testing...' : 'Test Web Scraper'}
              </button>
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