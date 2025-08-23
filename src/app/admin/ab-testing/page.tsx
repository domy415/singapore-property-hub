'use client'

import { useState, useEffect } from 'react'
import { abTestManager } from '@/lib/ab-testing'
import { Section, Container, H1, H2, H3, Card, Grid, Flex } from '@/components/design-system'

interface TestResult {
  views: number
  conversions: number
  rate: number
}

interface TestResults {
  [testId: string]: {
    [variant: string]: TestResult
  }
}

export default function ABTestingAdminPage() {
  const [activeTests, setActiveTests] = useState<any[]>([])
  const [testResults, setTestResults] = useState<TestResults>({})
  const [userVariants, setUserVariants] = useState<any>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load test data
    const loadTestData = () => {
      setActiveTests(abTestManager.getActiveTests())
      setTestResults(abTestManager.getTestResults())
      setUserVariants(abTestManager.getAllVariants())
      setIsLoading(false)
    }

    loadTestData()
  }, [])

  const resetVariant = (testId: string) => {
    abTestManager.resetVariant(testId)
    setUserVariants(abTestManager.getAllVariants())
  }

  const resetAllVariants = () => {
    abTestManager.resetAllVariants()
    setUserVariants({})
  }

  const forceVariant = (testId: string, variant: string) => {
    abTestManager.forceVariant(testId, variant)
    setUserVariants(abTestManager.getAllVariants())
  }

  const calculateConfidenceInterval = (conversions: number, views: number, confidence = 0.95) => {
    const rate = conversions / views
    const z = confidence === 0.95 ? 1.96 : 1.645 // 95% or 90%
    const margin = z * Math.sqrt((rate * (1 - rate)) / views)
    return {
      lower: Math.max(0, rate - margin),
      upper: Math.min(1, rate + margin)
    }
  }

  const calculateSignificance = (testA: TestResult, testB: TestResult) => {
    const rateA = testA.conversions / testA.views
    const rateB = testB.conversions / testB.views
    const pooledRate = (testA.conversions + testB.conversions) / (testA.views + testB.views)
    
    const se = Math.sqrt(pooledRate * (1 - pooledRate) * (1/testA.views + 1/testB.views))
    const zScore = Math.abs(rateA - rateB) / se
    
    // Approximate p-value calculation
    const pValue = 2 * (1 - normalCDF(Math.abs(zScore)))
    
    return {
      zScore,
      pValue,
      isSignificant: pValue < 0.05,
      winner: rateB > rateA ? 'variant' : 'control',
      improvement: ((rateB - rateA) / rateA * 100)
    }
  }

  // Approximation of normal CDF
  const normalCDF = (x: number) => {
    return 0.5 * (1 + erf(x / Math.sqrt(2)))
  }

  const erf = (x: number) => {
    const a1 =  0.254829592
    const a2 = -0.284496736
    const a3 =  1.421413741
    const a4 = -1.453152027
    const a5 =  1.061405429
    const p  =  0.3275911
    
    const sign = x >= 0 ? 1 : -1
    x = Math.abs(x)
    
    const t = 1.0 / (1.0 + p * x)
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x)
    
    return sign * y
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Section padding="lg">
          <Container>
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-gray-300 rounded w-64"></div>
              <div className="h-4 bg-gray-300 rounded w-96"></div>
              <div className="grid grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-32 bg-gray-300 rounded"></div>
                ))}
              </div>
            </div>
          </Container>
        </Section>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Section padding="lg">
        <Container>
          <div className="space-y-8">
            {/* Header */}
            <div className="flex justify-between items-start">
              <div>
                <H1>A/B Testing Dashboard</H1>
                <p className="text-gray-600 mt-2">Monitor and manage ongoing experiments</p>
              </div>
              <button 
                onClick={resetAllVariants}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                Reset All Variants
              </button>
            </div>

            {/* Current User Variants */}
            <Card padding="lg">
              <H3 className="mb-4">Current User Assignments</H3>
              <Grid cols={1} responsive={{ md: 3 }}>
                {Object.entries(userVariants).map(([testId, variant]) => (
                  <div key={testId} className="bg-blue-50 rounded-lg p-4">
                    <div className="font-semibold text-blue-900">{testId}</div>
                    <div className="text-blue-700 text-sm mb-2">{String(variant)}</div>
                    <button
                      onClick={() => resetVariant(testId)}
                      className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors"
                    >
                      Reset
                    </button>
                  </div>
                ))}
              </Grid>
            </Card>

            {/* Test Results */}
            {activeTests.map(test => {
              const results = testResults[test.id]
              if (!results) return null

              const variants = Object.entries(results)
              const [controlKey, control] = variants.find(([key]) => key === 'control') || variants[0]
              const [variantKey, variant] = variants.find(([key]) => key !== 'control') || variants[1]

              const significance = control && variant ? calculateSignificance(control, variant) : null

              return (
                <Card key={test.id} padding="lg">
                  <div className="mb-6">
                    <H2>{test.name}</H2>
                    <p className="text-gray-600">Test ID: {test.id}</p>
                    
                    {/* Force Variant Buttons */}
                    <div className="flex gap-2 mt-4">
                      {Object.keys(test.variants).map(variantId => (
                        <button
                          key={variantId}
                          onClick={() => forceVariant(test.id, variantId)}
                          className={`px-3 py-1 text-sm rounded transition-colors ${
                            userVariants[test.id] === variantId 
                              ? 'bg-blue-500 text-white' 
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          Force {variantId}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Grid cols={1} responsive={{ md: 2 }} className="mb-6">
                    {variants.map(([key, data]) => {
                      const confidence = data.views > 0 ? calculateConfidenceInterval(data.conversions, data.views) : null
                      
                      return (
                        <div key={key} className="bg-gray-50 rounded-lg p-6">
                          <H3 className="mb-4 capitalize">{key}</H3>
                          
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Views:</span>
                              <span className="font-semibold">{data.views.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Conversions:</span>
                              <span className="font-semibold">{data.conversions.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Conversion Rate:</span>
                              <span className="font-semibold text-blue-600">{data.rate.toFixed(2)}%</span>
                            </div>
                            
                            {confidence && (
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-500">95% CI:</span>
                                <span className="text-gray-500">
                                  {(confidence.lower * 100).toFixed(2)}% - {(confidence.upper * 100).toFixed(2)}%
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </Grid>

                  {/* Statistical Significance */}
                  {significance && (
                    <div className={`rounded-lg p-4 ${
                      significance.isSignificant ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold">Statistical Analysis</span>
                        <span className={`px-2 py-1 rounded text-sm ${
                          significance.isSignificant ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'
                        }`}>
                          {significance.isSignificant ? 'Significant' : 'Not Significant'}
                        </span>
                      </div>
                      
                      <Grid cols={1} responsive={{ md: 4 }} className="text-sm">
                        <div>
                          <span className="text-gray-600">P-value:</span>
                          <div className="font-semibold">{significance.pValue.toFixed(4)}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Z-score:</span>
                          <div className="font-semibold">{significance.zScore.toFixed(2)}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Winner:</span>
                          <div className="font-semibold capitalize">{significance.winner}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Improvement:</span>
                          <div className={`font-semibold ${significance.improvement > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {significance.improvement > 0 ? '+' : ''}{significance.improvement.toFixed(1)}%
                          </div>
                        </div>
                      </Grid>
                    </div>
                  )}
                </Card>
              )
            })}

            {/* Debug Information */}
            <Card padding="lg">
              <H3 className="mb-4">Debug Information</H3>
              <div className="bg-gray-100 rounded-lg p-4 overflow-x-auto">
                <pre className="text-sm">
                  {JSON.stringify({ activeTests, testResults, userVariants }, null, 2)}
                </pre>
              </div>
            </Card>
          </div>
        </Container>
      </Section>
    </div>
  )
}