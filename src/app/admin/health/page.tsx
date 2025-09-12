import { validateDatabaseConnection, getArticleCount, validateArticleImages, getSystemHealth } from '@/lib/db-health'
import { validateSingaporeImage, getImageComplianceReport } from '@/lib/image-validator'

// Force Node.js runtime for Prisma compatibility
export const runtime = 'nodejs'

async function getRecentArticles() {
  // Build-time guard: Skip database operations during build
  if (process.env.NODE_ENV !== 'production' && !process.env.DATABASE_URL) {
    return []
  }

  try {
    // Dynamic import to avoid build-time initialization
    const { prisma } = await import('@/lib/prisma')
    
    return await prisma.article.findMany({
      where: { status: 'PUBLISHED' },
      select: { 
        id: true, 
        title: true, 
        featuredImage: true,
        publishedAt: true,
        slug: true
      },
      orderBy: { publishedAt: 'desc' },
      take: 15
    })
  } catch (error) {
    console.warn('Failed to fetch recent articles:', error)
    return []
  }
}

export default async function HealthDashboard() {
  const systemHealth = await getSystemHealth()
  
  // Get recent articles for detailed analysis
  const recentArticles = await getRecentArticles()

  const complianceReport = getImageComplianceReport(recentArticles)
  const complianceRate = Math.round((complianceReport.compliant / complianceReport.total) * 100) || 0

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">System Health Dashboard</h1>
        
        {/* System Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Database Status</h3>
            <div className="flex items-center">
              <div className={`w-4 h-4 rounded-full mr-3 ${
                systemHealth.database.connected ? 'bg-green-500' : 'bg-red-500'
              }`}></div>
              <span className={`font-medium ${
                systemHealth.database.connected ? 'text-green-600' : 'text-red-600'
              }`}>
                {systemHealth.database.connected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            {systemHealth.database.error && (
              <p className="text-red-500 text-sm mt-2">{systemHealth.database.error}</p>
            )}
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Published Articles</h3>
            <p className="text-3xl font-bold text-blue-600">{systemHealth.content.articleCount}</p>
            <p className="text-sm text-gray-600 mt-1">Total articles</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Image Compliance</h3>
            <p className="text-3xl font-bold text-green-600">{complianceRate}%</p>
            <p className="text-sm text-gray-600 mt-1">
              {complianceReport.compliant} of {complianceReport.total} compliant
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Overall Status</h3>
            <div className="flex items-center">
              <div className={`w-4 h-4 rounded-full mr-3 ${
                systemHealth.status === 'healthy' ? 'bg-green-500' : 'bg-yellow-500'
              }`}></div>
              <span className={`font-medium capitalize ${
                systemHealth.status === 'healthy' ? 'text-green-600' : 'text-yellow-600'
              }`}>
                {systemHealth.status}
              </span>
            </div>
          </div>
        </div>

        {/* Image Analysis */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Image Analysis</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{systemHealth.images.total}</p>
                <p className="text-sm text-gray-600">Total Articles</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{systemHealth.images.singaporeSpecific}</p>
                <p className="text-sm text-gray-600">Singapore-Specific</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">{systemHealth.images.generic}</p>
                <p className="text-sm text-gray-600">Generic Images</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">{systemHealth.images.withoutImages}</p>
                <p className="text-sm text-gray-600">Missing Images</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
              <div 
                className="bg-green-600 h-4 rounded-full transition-all duration-500" 
                style={{ width: `${complianceRate}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 text-center">
              {complianceRate}% of images follow Singapore Property Image Finder Agent guidelines
            </p>
          </div>
        </div>

        {/* Recent Articles Audit */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-semibold">Recent Articles Image Audit</h2>
            <span className="text-sm text-gray-500">
              Last updated: {new Date().toLocaleString()}
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Article
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Image Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Published
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentArticles.map((article) => {
                  const validation = validateSingaporeImage(article.featuredImage || '', article.title)
                  const isCompliant = validation.isValid && validation.issues.length === 0
                  
                  return (
                    <tr key={article.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900 line-clamp-2">
                            {article.title}
                          </p>
                          <p className="text-sm text-gray-500">ID: {article.id}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full mr-2 ${
                            isCompliant ? 'bg-green-500' : 'bg-red-500'
                          }`}></div>
                          <div>
                            <p className={`text-sm font-medium ${
                              isCompliant ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {isCompliant ? '✅ Compliant' : '❌ Non-compliant'}
                            </p>
                            {validation.imageType && (
                              <p className="text-xs text-gray-500">{validation.imageType}</p>
                            )}
                            {validation.issues.length > 0 && (
                              <p className="text-xs text-red-500 mt-1">
                                {validation.issues[0]}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <a
                            href={`/articles/${article.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            View
                          </a>
                          {!isCompliant && (
                            <button className="text-red-600 hover:text-red-800 text-sm">
                              Fix Image
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Items */}
        {complianceReport.nonCompliant > 0 && (
          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">
              Action Required: {complianceReport.nonCompliant} Non-Compliant Images
            </h3>
            <p className="text-yellow-700 mb-4">
              Some articles are using generic images instead of Singapore-specific imagery. 
              This affects the professional appearance and local relevance of your content.
            </p>
            <button className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 transition-colors">
              Fix All Images Automatically
            </button>
          </div>
        )}

        {/* System Information */}
        <div className="mt-8 bg-gray-100 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">System Information</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Environment:</span>
              <span className="ml-2 font-medium">{process.env.NODE_ENV}</span>
            </div>
            <div>
              <span className="text-gray-500">Last Health Check:</span>
              <span className="ml-2 font-medium">
                {new Date(systemHealth.timestamp).toLocaleTimeString()}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Database:</span>
              <span className="ml-2 font-medium">Supabase PostgreSQL</span>
            </div>
            <div>
              <span className="text-gray-500">Deployment:</span>
              <span className="ml-2 font-medium">Vercel</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}