'use client'

import { useState } from 'react'

interface AnalysisResult {
  score: {
    overallRating: number
    recommendation: string
    categoryScores: {
      location: number
      developer: number
      design: number
      investmentPotential: number
      facilities: number
    }
    dqiResult: {
      totalScore: number
      grade: string
    }
    confidenceLevel: number
  }
  executiveSummary: string
  strengths: string[]
  concerns: string[]
  investmentAnalysis: {
    rentalYield: {
      estimated: string
      confidence: string
    }
    capitalAppreciation: {
      outlook: string
      timeframe: string
      drivers: string[]
    }
  }
  finalVerdict: {
    buyRating: string
    targetPrice: string
    suitability: string[]
  }
}

export default function PropertyScoringAdmin() {
  const [analysisData, setAnalysisData] = useState({
    propertyName: '',
    developer: '',
    district: '',
    analysisType: 'comprehensive',
    generateArticle: false
  })
  
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const predefinedProperties = [
    { name: 'The Orie', developer: 'CDL, Frasers Property, Sekisui House', district: '12' },
    { name: 'ELTA', developer: 'Hong Leong Holdings', district: '5' },
    { name: 'Lentor Central Residences', developer: 'Hong Leong Holdings, GuocoLand, CSC Land Group', district: '26' },
    { name: 'One Marina Gardens', developer: 'Kingsford Development', district: '1' },
    { name: 'Grand Dunman', developer: 'SingLand', district: '15' },
    { name: 'Normanton Park', developer: 'Kingsford Development', district: '5' }
  ]

  const handleAnalyze = async () => {
    if (!analysisData.propertyName || !analysisData.developer || !analysisData.district) {
      setError('Please fill in all required fields')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await fetch('/api/property-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(analysisData),
      })

      if (!response.ok) {
        throw new Error('Analysis failed')
      }

      const data = await response.json()
      setResult(data.analysis)
      
      if (data.articleId) {
        alert(`✅ Analysis complete! Article generated with ID: ${data.articleId}`)
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze property')
    } finally {
      setLoading(false)
    }
  }

  const loadPredefinedProperty = (property: typeof predefinedProperties[0]) => {
    setAnalysisData(prev => ({
      ...prev,
      propertyName: property.name,
      developer: property.developer,
      district: property.district
    }))
  }

  const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-6 h-6 ${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="text-xl font-bold text-blue-600 ml-2">{rating}/5</span>
    </div>
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">🏠 Property Scoring Engine</h1>
          <p className="text-xl text-gray-600">
            Advanced AI-powered property analysis and scoring system for Singapore condominiums
          </p>
        </div>

        {/* Input Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Property Analysis Input</h2>
          
          {/* Predefined Properties */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quick Select (Optional)
            </label>
            <div className="grid md:grid-cols-3 gap-2">
              {predefinedProperties.map((property, index) => (
                <button
                  key={index}
                  onClick={() => loadPredefinedProperty(property)}
                  className="text-left p-3 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                >
                  <div className="font-medium text-gray-900">{property.name}</div>
                  <div className="text-sm text-gray-600">District {property.district}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Name *
              </label>
              <input
                type="text"
                value={analysisData.propertyName}
                onChange={(e) => setAnalysisData(prev => ({ ...prev, propertyName: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., The Orie"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Developer *
              </label>
              <input
                type="text"
                value={analysisData.developer}
                onChange={(e) => setAnalysisData(prev => ({ ...prev, developer: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., CDL, Frasers Property"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                District *
              </label>
              <select
                value={analysisData.district}
                onChange={(e) => setAnalysisData(prev => ({ ...prev, district: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select District</option>
                {Array.from({ length: 28 }, (_, i) => i + 1).map(num => (
                  <option key={num} value={num}>District {num}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Analysis Type
              </label>
              <select
                value={analysisData.analysisType}
                onChange={(e) => setAnalysisData(prev => ({ ...prev, analysisType: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="standard">Standard Analysis</option>
                <option value="comprehensive">Comprehensive Analysis</option>
                <option value="executive">Executive Summary</option>
              </select>
            </div>
          </div>

          <div className="mt-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={analysisData.generateArticle}
                onChange={(e) => setAnalysisData(prev => ({ ...prev, generateArticle: e.target.checked }))}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Generate article content for publication</span>
            </label>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="text-red-800">{error}</div>
            </div>
          )}

          <div className="mt-8">
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="w-full md:w-auto px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Analyzing Property...
                </div>
              ) : (
                '🔍 Analyze Property'
              )}
            </button>
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-8">
            {/* Overall Score */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                  <h2 className="text-3xl font-bold mb-2">{analysisData.propertyName}</h2>
                  <p className="text-xl opacity-90">{analysisData.developer}</p>
                  <div className="mt-4">
                    <StarRating rating={result.score.overallRating} />
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-6xl font-bold mb-2">{result.score.dqiResult.totalScore}</div>
                  <div className="text-xl opacity-90">DQI Score</div>
                  <div className="text-lg font-semibold mt-2">{result.score.dqiResult.grade}</div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">{result.score.recommendation}</div>
                  <div className="opacity-90">Recommendation</div>
                  <div className="text-sm mt-2">{result.score.confidenceLevel}% Confidence</div>
                </div>
              </div>
            </div>

            {/* Category Scores */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Category Breakdown</h3>
              <div className="grid md:grid-cols-5 gap-6">
                {Object.entries(result.score.categoryScores).map(([category, score]) => (
                  <div key={category} className="text-center">
                    <div className="text-4xl font-bold text-blue-600 mb-2">{score}/5</div>
                    <div className="text-sm font-medium text-gray-700 capitalize">
                      {category.replace(/([A-Z])/g, ' $1').trim()}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Executive Summary */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Executive Summary</h3>
              <p className="text-lg text-gray-700 leading-relaxed">{result.executiveSummary}</p>
            </div>

            {/* Strengths & Concerns */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-green-50 rounded-2xl p-8 border border-green-200">
                <h3 className="text-2xl font-bold text-green-800 mb-6">✅ Key Strengths</h3>
                <div className="space-y-3">
                  {result.strengths.map((strength, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="text-green-800">{strength}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-orange-50 rounded-2xl p-8 border border-orange-200">
                <h3 className="text-2xl font-bold text-orange-800 mb-6">⚠️ Areas of Concern</h3>
                <div className="space-y-3">
                  {result.concerns.map((concern, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                      </div>
                      <p className="text-orange-800">{concern}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Investment Analysis */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">💰 Investment Analysis</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold text-gray-700 mb-3">Rental Yield</h4>
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {result.investmentAnalysis.rentalYield.estimated}
                  </div>
                  <div className="text-sm text-gray-600 mb-4">
                    Confidence: {result.investmentAnalysis.rentalYield.confidence}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-gray-700 mb-3">Capital Appreciation</h4>
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {result.investmentAnalysis.capitalAppreciation.outlook}
                  </div>
                  <div className="text-sm text-gray-600 mb-4">
                    Timeframe: {result.investmentAnalysis.capitalAppreciation.timeframe}
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="text-lg font-semibold text-gray-700 mb-3">Growth Drivers</h4>
                <div className="flex flex-wrap gap-2">
                  {result.investmentAnalysis.capitalAppreciation.drivers.map((driver, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      {driver}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Final Verdict */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-6">🎯 Final Verdict</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h4 className="text-lg font-semibold mb-2">Buy Rating</h4>
                  <div className="text-2xl font-bold">{result.finalVerdict.buyRating}</div>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold mb-2">Target Price</h4>
                  <div className="text-2xl font-bold">{result.finalVerdict.targetPrice}</div>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold mb-2">Best Suited For</h4>
                  <div className="text-sm opacity-90">
                    {result.finalVerdict.suitability.join(', ')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}