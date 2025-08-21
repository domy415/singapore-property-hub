'use client'

import { useState, useEffect } from 'react'
import { contentCalendar, getContentSuggestions, getTrendingKeywords } from '@/data/content-calendar'

export default function ContentCalendarPage() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [todaySuggestions, setTodaySuggestions] = useState<string[]>([])
  const [generating, setGenerating] = useState(false)
  const [lastResult, setLastResult] = useState<any>(null)

  useEffect(() => {
    // Get today's content suggestions
    const suggestions = getContentSuggestions(new Date())
    setTodaySuggestions(suggestions)
  }, [])

  const currentTheme = contentCalendar.find(theme => theme.month === selectedMonth)
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const testVerifiedGeneration = async () => {
    setGenerating(true)
    setLastResult(null)
    
    try {
      const response = await fetch('/api/test-verified-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          useCalendar: true
        })
      })
      
      const result = await response.json()
      setLastResult(result)
    } catch (error) {
      console.error('Error testing generation:', error)
      setLastResult({
        success: false,
        error: 'Failed to test generation'
      })
    }
    
    setGenerating(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-3xl font-bold mb-6">Content Calendar & Article Review System</h1>
          
          {/* Today's Suggestions */}
          <div className="mb-8 p-4 bg-blue-50 rounded-lg">
            <h2 className="text-xl font-semibold mb-3 text-blue-800">Today's Content Suggestions</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-2">Theme Suggestions:</h3>
                <ul className="list-disc list-inside text-sm">
                  {todaySuggestions.slice(0, 5).map((suggestion, index) => (
                    <li key={index} className="text-gray-700">{suggestion}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-2">Trending Keywords:</h3>
                <div className="flex flex-wrap gap-2">
                  {getTrendingKeywords(new Date().getMonth() + 1).slice(0, 8).map((keyword, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Test Generation */}
            <div className="mt-4 pt-4 border-t">
              <button
                onClick={testVerifiedGeneration}
                disabled={generating}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {generating ? 'Generating & Fact-Checking...' : 'Test Verified Article Generation'}
              </button>
              
              {lastResult && (
                <div className="mt-4 p-3 rounded border">
                  {lastResult.success ? (
                    <div className="text-green-700">
                      <strong>✅ Generation Successful!</strong>
                      <div className="mt-2 text-sm">
                        <p><strong>Title:</strong> {lastResult.article.title}</p>
                        <p><strong>Category:</strong> {lastResult.article.category}</p>
                        <p><strong>Quality Score:</strong> {lastResult.review.qualityScore}/100</p>
                        <p><strong>Fact-Checked:</strong> {lastResult.review.factCheckPassed ? '✅ Passed' : '❌ Failed'}</p>
                        <p><strong>Saved:</strong> {lastResult.saved ? '✅ Yes' : '❌ No'}</p>
                        {lastResult.review.issues.length > 0 && (
                          <div className="mt-2">
                            <strong>Issues Found:</strong>
                            <ul className="list-disc list-inside ml-4">
                              {lastResult.review.issues.map((issue: string, i: number) => (
                                <li key={i} className="text-red-600">{issue}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-red-700">
                      <strong>❌ Generation Failed</strong>
                      <p className="text-sm mt-1">{lastResult.error || lastResult.message}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Month Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Select Month:</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="border border-gray-300 rounded px-3 py-2"
            >
              {monthNames.map((name, index) => (
                <option key={index + 1} value={index + 1}>
                  {name} {index + 1 === new Date().getMonth() + 1 ? '(Current)' : ''}
                </option>
              ))}
            </select>
          </div>
          
          {/* Month Details */}
          {currentTheme && (
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Themes */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">
                  {monthNames[selectedMonth - 1]} Themes
                </h2>
                <ul className="space-y-2">
                  {currentTheme.themes.map((theme, index) => (
                    <li key={index} className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                      {theme}
                    </li>
                  ))}
                </ul>
                
                {currentTheme.specialEvents && (
                  <div className="mt-6">
                    <h3 className="font-semibold mb-2">Special Events:</h3>
                    <div className="flex flex-wrap gap-2">
                      {currentTheme.specialEvents.map((event, index) => (
                        <span key={index} className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-sm">
                          {event}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Keywords */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">SEO Keywords</h2>
                <div className="flex flex-wrap gap-2">
                  {currentTheme.keywords.map((keyword, index) => (
                    <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded text-sm">
                      {keyword}
                    </span>
                  ))}
                </div>
                
                <div className="mt-6">
                  <h3 className="font-semibold mb-2">Content Distribution:</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>New Launches Reviews:</span>
                      <span className="font-medium">40%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Market Insights:</span>
                      <span className="font-medium">35%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Buying/Investment Guides:</span>
                      <span className="font-medium">15%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Location Guides:</span>
                      <span className="font-medium">10%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* System Overview */}
          <div className="mt-8 bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Article Review System</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">📝</div>
                <h3 className="font-semibold">Content Generation</h3>
                <p className="text-sm text-gray-600">AI creates articles using calendar themes and current trends</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">🔍</div>
                <h3 className="font-semibold">Fact Checking</h3>
                <p className="text-sm text-gray-600">Verifies Singapore property regulations, prices, and statistics</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">✅</div>
                <h3 className="font-semibold">Quality Control</h3>
                <p className="text-sm text-gray-600">Only publishes articles that pass fact-checks and quality standards</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}