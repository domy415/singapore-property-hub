'use client'

import { useState } from 'react'

export default function CrawlerTest() {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [error, setError] = useState<string>('')

  const testCrawler = async () => {
    setLoading(true)
    setError('')
    setResults(null)

    try {
      const response = await fetch('/api/test-crawler', {
        method: 'POST'
      })

      const data = await response.json()
      
      if (!response.ok) {
        setError(data.error || 'Crawler test failed')
      } else {
        setResults(data)
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const checkEndpoint = async () => {
    setLoading(true)
    setError('')
    setResults(null)

    try {
      const response = await fetch('/api/test-crawler')
      const data = await response.json()
      setResults(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Crawler Test Dashboard</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Test Options</h2>
          
          <div className="space-y-4">
            <button
              onClick={checkEndpoint}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 mr-4"
            >
              {loading ? 'Checking...' : 'Check Endpoint'}
            </button>
            
            <button
              onClick={testCrawler}
              disabled={loading}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:bg-gray-400"
            >
              {loading ? 'Testing...' : 'Test PropertyGuru Crawl'}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-8">
            <h3 className="font-semibold mb-2">Error:</h3>
            <p>{error}</p>
          </div>
        )}

        {results && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Results</h2>
            
            {results.success ? (
              <div>
                <div className="mb-4 p-4 bg-green-50 rounded">
                  <p className="text-green-600 font-semibold">✅ {results.message}</p>
                </div>
                
                {results.pageAnalysis && (
                  <div className="mb-4 p-4 bg-blue-50 rounded">
                    <h3 className="font-semibold mb-2">Page Analysis</h3>
                    <p>Page Title: {results.pageAnalysis.title}</p>
                    <p>Total Elements: {results.pageAnalysis.totalElements}</p>
                    <p>Working Selector: {results.pageAnalysis.workingSelector}</p>
                    <p>Properties Found: {results.pageAnalysis.foundProperties}</p>
                  </div>
                )}
                
                {results.properties && results.properties.length > 0 && (
                  <div className="mb-4 p-4 bg-gray-50 rounded">
                    <h3 className="font-semibold mb-2">Sample Properties</h3>
                    <div className="space-y-2">
                      {results.properties.map((property: any, index: number) => (
                        <div key={index} className="border bg-white p-3 rounded text-sm">
                          <div className="font-medium">{property.title}</div>
                          <div className="text-gray-600">{property.price}</div>
                          <div className="text-gray-500">{property.address}</div>
                          <div className="text-xs text-gray-400">Selector: {property.selector}</div>
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
              <div className="p-4 bg-red-50 rounded">
                <p className="text-red-600 font-semibold">❌ Test failed</p>
                <pre className="mt-2 text-sm">{JSON.stringify(results, null, 2)}</pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}