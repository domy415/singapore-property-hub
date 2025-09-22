import Link from 'next/link'
import { getArticleImage } from '@/lib/image-constants'

async function getArticlesData() {
  try {
    const path = require('path')
    const fs = require('fs')
    const articlesPath = path.join(process.cwd(), 'database-articles-check.json')
    
    if (fs.existsSync(articlesPath)) {
      const articlesData = JSON.parse(fs.readFileSync(articlesPath, 'utf-8'))
      return articlesData.articles
    }
    return []
  } catch (error) {
    console.error('Error loading articles:', error)
    return []
  }
}

export default async function DebugArticles() {
  const articles = await getArticlesData()
  return (
    <div className="p-8 bg-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Article Debug Info</h1>
      <p className="text-gray-600 mb-6">
        This page helps identify article slug mismatches and image issues.
      </p>
      
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <h2 className="font-semibold text-blue-900">Total Articles: {articles.length}</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-300 p-3 text-left">Title</th>
              <th className="border border-gray-300 p-3 text-left">Slug</th>
              <th className="border border-gray-300 p-3 text-left">Category</th>
              <th className="border border-gray-300 p-3 text-left">Image</th>
              <th className="border border-gray-300 p-3 text-left">Test Link</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((article: any) => {
              const image = getArticleImage(article)
              return (
                <tr key={article.id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 p-3">
                    <div className="font-medium text-gray-900 max-w-xs truncate">
                      {article.title}
                    </div>
                  </td>
                  <td className="border border-gray-300 p-3">
                    <code className="text-xs text-gray-600 bg-gray-100 p-1 rounded">
                      {article.slug}
                    </code>
                  </td>
                  <td className="border border-gray-300 p-3">
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      {article.category}
                    </span>
                  </td>
                  <td className="border border-gray-300 p-3">
                    <div className="w-16 h-10 overflow-hidden rounded">
                      <img 
                        src={image} 
                        alt="Article thumbnail" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.backgroundColor = '#fee2e2'
                          ;(e.target as HTMLImageElement).style.color = '#dc2626'
                          ;(e.target as HTMLImageElement).alt = 'BROKEN'
                        }}
                      />
                    </div>
                    <div className="text-xs text-gray-500 mt-1 truncate max-w-32">
                      {image.split('/').pop()?.split('?')[0]}
                    </div>
                  </td>
                  <td className="border border-gray-300 p-3">
                    <Link 
                      href={`/articles/${article.slug}`} 
                      className="text-blue-600 hover:text-blue-800 text-sm underline"
                      target="_blank"
                    >
                      Test Link
                    </Link>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-2">How to use this debug page:</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Click "Test Link" to check if article pages load without 404 errors</li>
          <li>• Check if images load properly (broken images will show as red)</li>
          <li>• Verify slug formats match URL patterns</li>
          <li>• Ensure each article has a unique image to avoid repetition</li>
        </ul>
      </div>
    </div>
  )
}