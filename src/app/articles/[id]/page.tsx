import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import LeadCaptureForm from '@/components/forms/LeadCaptureForm'

// Mock data - in real app, this would come from database
const mockArticle = {
  id: '1',
  title: 'Singapore Property Market Outlook 2024: What Buyers Need to Know',
  excerpt: 'Comprehensive analysis of the Singapore property market trends, government policies, and investment opportunities for 2024.',
  content: `
    <p>The Singapore property market continues to evolve in 2024, driven by changing government policies, economic conditions, and buyer preferences. This comprehensive analysis examines the key trends that will shape the market for the rest of the year.</p>

    <h2>Market Performance in H1 2024</h2>
    <p>The first half of 2024 has shown resilience in the Singapore property market despite global economic uncertainties. Transaction volumes have remained steady, with private residential prices showing modest growth across most segments.</p>

    <h3>Key Statistics:</h3>
    <ul>
      <li>Overall private residential prices increased by 2.8% year-on-year</li>
      <li>New private home sales reached 6,500 units in Q2 2024</li>
      <li>HDB resale prices grew by 1.2% quarter-on-quarter</li>
      <li>Rental market showed strong performance with 15% annual growth</li>
    </ul>

    <h2>Government Policy Impact</h2>
    <p>Recent policy adjustments have introduced new dynamics to the market. The Additional Buyer's Stamp Duty (ABSD) rates remain elevated, continuing to moderate demand from foreign buyers and investors.</p>

    <blockquote>
      "The government's measured approach to cooling measures has helped maintain market stability while preventing speculative bubbles."
      <cite>- Urban Redevelopment Authority</cite>
    </blockquote>

    <h2>Investment Opportunities</h2>
    <p>Despite the challenging environment, several segments present attractive opportunities for investors:</p>

    <h3>1. Suburban Condominiums</h3>
    <p>Properties in Districts 12-28 are showing strong rental yields and capital appreciation potential, driven by improved connectivity and infrastructure development.</p>

    <h3>2. Commercial Properties</h3>
    <p>The office market is stabilizing post-pandemic, with hybrid work models creating new demand patterns. Well-located Grade A offices continue to command premium rents.</p>

    <h3>3. Industrial Real Estate</h3>
    <p>The logistics and warehouse sector remains robust, supported by e-commerce growth and Singapore's position as a regional hub.</p>

    <h2>Looking Ahead: H2 2024 Predictions</h2>
    <p>Based on current trends and economic indicators, we expect:</p>

    <ul>
      <li>Continued price stability with selective growth in well-connected suburbs</li>
      <li>Strong rental market performance driven by foreign talent inflows</li>
      <li>Increased focus on sustainable and smart building features</li>
      <li>Growing interest in Build-to-Order (BTO) alternatives</li>
    </ul>

    <h2>Advice for Buyers</h2>
    <p>For prospective buyers in the current market:</p>

    <ol>
      <li><strong>Location remains paramount</strong> - Focus on areas with good transport links and upcoming developments</li>
      <li><strong>Consider total cost of ownership</strong> - Factor in ABSD, stamp duties, and ongoing maintenance costs</li>
      <li><strong>Timing the market</strong> - Current conditions favor patient buyers who can wait for the right opportunity</li>
      <li><strong>Financing strategy</strong> - Secure pre-approval and consider fixed-rate options given interest rate volatility</li>
    </ol>

    <h2>Conclusion</h2>
    <p>The Singapore property market in 2024 presents a landscape of measured optimism. While challenges exist, the fundamentals remain strong, supported by Singapore's strategic location, stable political environment, and continued economic growth.</p>

    <p>Buyers and investors who approach the market with careful research, proper financing, and realistic expectations will find opportunities that align with their long-term objectives.</p>
  `,
  category: 'Market Insights',
  author: {
    name: 'Sarah Chen',
    bio: 'Senior Property Analyst with over 15 years of experience in Singapore real estate market research and investment strategy.',
    avatar: '/images/authors/sarah-chen.jpg'
  },
  publishedAt: '2024-08-15',
  readTime: '8 min read',
  image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=800&fit=crop',
  tags: ['market trends', 'investment', '2024 outlook', 'property prices'],
  seoKeywords: ['Singapore property market', 'real estate investment', '2024 property trends']
}

// Related articles
const relatedArticles = [
  {
    id: '2',
    title: 'Complete Guide to Buying Your First Condo in Singapore',
    excerpt: 'Everything first-time buyers need to know about purchasing a condominium in Singapore.',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop',
    readTime: '12 min read'
  },
  {
    id: '3',
    title: 'District 9 vs District 10: Which Premium Location Should You Choose?',
    excerpt: 'Detailed comparison of Singapore\'s most prestigious districts.',
    image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop',
    readTime: '6 min read'
  }
]

interface Props {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // In real app, fetch article data
  const article = mockArticle
  
  return {
    title: `${article.title} | Singapore Property Hub`,
    description: article.excerpt,
    keywords: article.seoKeywords,
    alternates: {
      canonical: `https://singaporepropertyhub.sg/articles/${params.id}`,
    },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [{ url: article.image }],
      type: 'article',
      publishedTime: article.publishedAt,
      authors: [article.author.name],
    }
  }
}

export default function ArticlePage({ params }: Props) {
  // In real app, fetch article from database using params.id
  const article = mockArticle
  
  if (!article) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-96 bg-gray-900">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent">
          <div className="container h-full flex items-end pb-12">
            <div className="max-w-4xl text-white">
              <div className="flex items-center gap-4 mb-4">
                <span className="bg-blue-600 px-3 py-1 rounded text-sm font-semibold">
                  {article.category}
                </span>
                <span className="text-blue-200">{article.readTime}</span>
                <span className="text-blue-200">
                  {new Date(article.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                {article.title}
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-16">
        <div className="container">
          <div className="grid lg:grid-cols-4 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Author Info */}
              <div className="flex items-center gap-4 mb-8 p-6 bg-gray-50 rounded-lg">
                <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
                <div>
                  <h3 className="font-semibold text-lg">{article.author.name}</h3>
                  <p className="text-gray-600 text-sm">{article.author.bio}</p>
                </div>
              </div>

              {/* Article Body */}
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />

              {/* Tags */}
              <div className="mt-12 pt-8 border-t">
                <h3 className="font-semibold mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Share */}
              <div className="mt-8 pt-8 border-t">
                <h3 className="font-semibold mb-4">Share this article</h3>
                <div className="flex gap-4">
                  <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    Facebook
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-blue-400 text-white rounded hover:bg-blue-500">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                    Twitter
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                    LinkedIn
                  </button>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-8">
                {/* Newsletter Signup */}
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="font-semibold mb-4">Stay Updated</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Get the latest property insights delivered to your inbox.
                  </p>
                  <div className="space-y-3">
                    <input
                      type="email"
                      placeholder="Your email"
                      className="w-full px-3 py-2 border rounded"
                    />
                    <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                      Subscribe
                    </button>
                  </div>
                </div>

                {/* Contact Form */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-semibold mb-4">Need Property Advice?</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Get personalized recommendations from our experts.
                  </p>
                  <LeadCaptureForm />
                </div>

                {/* Table of Contents */}
                <div className="bg-white border rounded-lg p-6">
                  <h3 className="font-semibold mb-4">In This Article</h3>
                  <nav className="space-y-2">
                    <a href="#market-performance" className="block text-sm text-blue-600 hover:underline">
                      Market Performance in H1 2024
                    </a>
                    <a href="#government-policy" className="block text-sm text-blue-600 hover:underline">
                      Government Policy Impact
                    </a>
                    <a href="#investment-opportunities" className="block text-sm text-blue-600 hover:underline">
                      Investment Opportunities
                    </a>
                    <a href="#predictions" className="block text-sm text-blue-600 hover:underline">
                      H2 2024 Predictions
                    </a>
                    <a href="#buyer-advice" className="block text-sm text-blue-600 hover:underline">
                      Advice for Buyers
                    </a>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Articles */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <h2 className="text-2xl font-bold mb-8">Related Articles</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {relatedArticles.map((relatedArticle) => (
              <Link
                key={relatedArticle.id}
                href={`/articles/${relatedArticle.id}`}
                className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="h-48 bg-gray-200">
                  <img
                    src={relatedArticle.image}
                    alt={relatedArticle.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-semibold mb-2 group-hover:text-blue-600 transition-colors">
                    {relatedArticle.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">{relatedArticle.excerpt}</p>
                  <span className="text-xs text-gray-500">{relatedArticle.readTime}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Back to Articles */}
      <section className="py-8">
        <div className="container">
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 text-blue-600 hover:underline"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to All Articles
          </Link>
        </div>
      </section>
    </div>
  )
}