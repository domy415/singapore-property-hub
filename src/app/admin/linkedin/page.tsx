'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Article {
  id: string
  title: string
  slug: string
  summary: string
  publishedAt: string
  linkedInPosted: boolean
  linkedInPostDate?: string
}

interface LinkedInConfig {
  configured: boolean
  hasAccessToken: boolean
  hasPersonId: boolean
  hasCompanyId: boolean
}

export default function LinkedInAdminPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [config, setConfig] = useState<LinkedInConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [posting, setPosting] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      
      // Load LinkedIn config
      const configResponse = await fetch('/api/linkedin/post-article')
      const configData = await configResponse.json()
      setConfig(configData.config)
      
      // Load articles
      const articlesResponse = await fetch('/api/articles')
      const articlesData = await articlesResponse.json()
      setArticles(articlesData.articles || [])
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setLoading(false)
    }
  }

  const postToLinkedIn = async (articleId: string) => {
    try {
      setPosting(articleId)
      
      const response = await fetch('/api/linkedin/post-article', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleId })
      })
      
      const result = await response.json()
      
      if (result.success) {
        alert('Article posted to LinkedIn successfully!')
        loadData() // Refresh data
      } else {
        alert(`Failed to post: ${result.error}`)
      }
    } catch (error) {
      alert('Error posting to LinkedIn')
      console.error(error)
    } finally {
      setPosting(null)
    }
  }

  const postAllUnposted = async () => {
    try {
      setPosting('all')
      
      const response = await fetch('/api/linkedin/post-all', {
        method: 'POST'
      })
      
      const result = await response.json()
      
      if (result.success) {
        alert(`Posted ${result.postedCount} articles to LinkedIn!`)
        loadData() // Refresh data
      } else {
        alert(`Failed to post: ${result.error}`)
      }
    } catch (error) {
      alert('Error posting to LinkedIn')
      console.error(error)
    } finally {
      setPosting(null)
    }
  }

  const testConnection = async () => {
    try {
      const response = await fetch('/api/linkedin/test-connection')
      const result = await response.json()
      
      if (result.success) {
        alert(`LinkedIn connected successfully! Profile: ${result.profile.firstName} ${result.profile.lastName}`)
      } else {
        alert(`Connection failed: ${result.error}`)
      }
    } catch (error) {
      alert('Error testing connection')
      console.error(error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    )
  }

  const publishedArticles = articles.filter(article => article.publishedAt)
  const unpostedArticles = publishedArticles.filter(article => !article.linkedInPosted)

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">LinkedIn Integration</h1>
            <Link 
              href="/"
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
            >
              ← Back to Site
            </Link>
          </div>
          <p className="text-gray-600 mt-2">Manage LinkedIn posting for your articles</p>
        </div>

        {/* Configuration Status */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Configuration Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`p-4 rounded-lg ${config?.hasAccessToken ? 'bg-green-100' : 'bg-red-100'}`}>
              <div className="font-medium">Access Token</div>
              <div className={config?.hasAccessToken ? 'text-green-600' : 'text-red-600'}>
                {config?.hasAccessToken ? '✓ Configured' : '✗ Missing'}
              </div>
            </div>
            <div className={`p-4 rounded-lg ${config?.hasPersonId ? 'bg-green-100' : 'bg-red-100'}`}>
              <div className="font-medium">Person ID</div>
              <div className={config?.hasPersonId ? 'text-green-600' : 'text-red-600'}>
                {config?.hasPersonId ? '✓ Configured' : '✗ Missing'}
              </div>
            </div>
            <div className={`p-4 rounded-lg ${config?.hasCompanyId ? 'bg-green-100' : 'bg-yellow-100'}`}>
              <div className="font-medium">Company ID</div>
              <div className={config?.hasCompanyId ? 'text-green-600' : 'text-yellow-600'}>
                {config?.hasCompanyId ? '✓ Configured' : '○ Optional'}
              </div>
            </div>
          </div>
          
          {config?.configured && (
            <button
              onClick={testConnection}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Test Connection
            </button>
          )}
        </div>

        {/* Setup Instructions */}
        {!config?.configured && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">LinkedIn Personal Account Setup</h3>
            <div className="text-yellow-700 space-y-4">
              <div>
                <h4 className="font-medium mb-2">Option 1: Quick Setup (Recommended)</h4>
                <p className="text-sm mb-3">First, add your LinkedIn app credentials to Vercel:</p>
                <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                  <li><code>LINKEDIN_CLIENT_ID</code> - From your LinkedIn app</li>
                  <li><code>LINKEDIN_CLIENT_SECRET</code> - From your LinkedIn app</li>
                </ul>
                <a 
                  href="/api/linkedin/auth"
                  className="inline-block mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
                >
                  Authorize with LinkedIn →
                </a>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Option 2: Manual Setup</h4>
                <p className="text-sm mb-2">Add these environment variables to Vercel:</p>
                <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                  <li><code>LINKEDIN_ACCESS_TOKEN</code> - Your personal access token</li>
                  <li><code>LINKEDIN_PERSON_ID</code> - Your LinkedIn person ID</li>
                </ul>
                <p className="mt-2 text-sm">
                  See LINKEDIN_SETUP.md for detailed instructions.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        {config?.configured && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="flex space-x-4">
              <button
                onClick={postAllUnposted}
                disabled={posting === 'all' || unpostedArticles.length === 0}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
              >
                {posting === 'all' ? 'Posting...' : `Post All Unposted (${unpostedArticles.length})`}
              </button>
            </div>
          </div>
        )}

        {/* Articles List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Published Articles</h2>
          
          {publishedArticles.length === 0 ? (
            <p className="text-gray-500">No published articles found.</p>
          ) : (
            <div className="space-y-4">
              {publishedArticles.map((article) => (
                <div key={article.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{article.title}</h3>
                      <p className="text-gray-600 text-sm mt-1">{article.summary}</p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        <span>Published: {new Date(article.publishedAt).toLocaleDateString()}</span>
                        {article.linkedInPosted && article.linkedInPostDate && (
                          <span className="text-green-600">
                            ✓ Posted to LinkedIn: {new Date(article.linkedInPostDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/articles/${article.slug}`}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                        target="_blank"
                      >
                        View Article
                      </Link>
                      
                      {config?.configured && (
                        <button
                          onClick={() => postToLinkedIn(article.id)}
                          disabled={posting === article.id}
                          className={`px-4 py-2 rounded text-sm font-medium ${
                            article.linkedInPosted
                              ? 'bg-gray-100 text-gray-600 cursor-not-allowed'
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                          }`}
                        >
                          {posting === article.id 
                            ? 'Posting...' 
                            : article.linkedInPosted 
                              ? 'Posted' 
                              : 'Post to LinkedIn'
                          }
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}