import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import CondoImageGallery from '@/components/CondoImageGallery'
import { getCondoBySlug, getAllCondos } from '@/lib/condo-data'
import Link from 'next/link'

export const runtime = 'nodejs'

interface Props {
  params: { slug: string }
}

// Calculate investment scores based on condo characteristics
function getInvestmentScores(condo: any) {
  // Capital Appreciation Score (1-5)
  let capitalScore = 3.0; // Base score
  
  // Prime regions get higher scores
  if (condo.region === 'CCR') capitalScore += 1.0;
  else if (condo.region === 'RCR') capitalScore += 0.5;
  
  // Freehold properties have better appreciation
  if (condo.tenure === 'Freehold') capitalScore += 0.5;
  
  // New launches have good potential
  if (condo.status === 'NEW LAUNCH') capitalScore += 0.3;
  
  // Cap at 5.0
  capitalScore = Math.min(5.0, capitalScore);
  
  // Rental Yield Calculation
  let rentalYield = 3.0; // Base yield
  
  // OCR typically has higher yields
  if (condo.region === 'OCR') rentalYield += 0.8;
  else if (condo.region === 'RCR') rentalYield += 0.4;
  
  // Smaller units tend to have higher yields
  if (condo.bedrooms.includes('1 BR') || condo.bedrooms.includes('2 BR')) {
    rentalYield += 0.3;
  }
  
  // Near MRT stations (for specific districts)
  const mrtDistricts = [1, 2, 7, 8, 9, 10, 11, 12, 14, 15];
  if (mrtDistricts.includes(condo.district)) {
    rentalYield += 0.2;
  }
  
  // Liquidity Assessment
  let liquidity = 'Medium';
  
  // CCR and popular RCR districts have high liquidity
  if (condo.region === 'CCR' || [15, 14, 12, 11].includes(condo.district)) {
    liquidity = 'High';
  }
  // Less accessible OCR areas have lower liquidity
  else if (condo.region === 'OCR' && [25, 26, 27, 28].includes(condo.district)) {
    liquidity = 'Low';
  }
  
  return {
    capitalAppreciation: capitalScore.toFixed(1),
    rentalYield: rentalYield.toFixed(1),
    liquidity: liquidity
  };
}

export default function CondoReviewPage({ params }: Props) {
  const condo = getCondoBySlug(params.slug)
  
  if (!condo) {
    notFound()
  }
  
  // Calculate investment scores for this condo
  const investmentScores = getInvestmentScores(condo)
  
  // Get related condos (same region, different project)
  const relatedCondos = getAllCondos()
    .filter(c => c.slug !== params.slug && c.region === condo.region)
    .slice(0, 3)
  
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Hero Section */}
      <section className="bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Breadcrumb */}
            <nav className="text-sm text-gray-600 mb-4">
              <Link href="/" className="hover:text-blue-600">Home</Link>
              <span className="mx-2">•</span>
              <Link href="/condos" className="hover:text-blue-600">Condo Reviews</Link>
              <span className="mx-2">•</span>
              <span className="text-gray-900">{condo.name}</span>
            </nav>
            
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">{condo.name}</h1>
                <p className="text-xl text-gray-600">
                  District {condo.district} • {condo.districtName} • {condo.region}
                </p>
              </div>
              
              <div className="mt-4 lg:mt-0 text-right">
                {/* Rating Display */}
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex text-yellow-400 mr-2">
                    {[...Array(5)].map((_, i) => (
                      <svg 
                        key={i} 
                        className={`w-6 h-6 ${i < Math.floor(Number(condo.rating) || 0) ? 'fill-current' : 'fill-gray-300'}`}
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-lg font-semibold">
                    {condo.rating} {(condo as any).dqiScore && `(DQI: ${(condo as any).dqiScore}/100)`}
                  </span>
                </div>
                <p className="text-3xl font-bold text-blue-600">From {condo.priceFromDisplay}</p>
                <p className="text-gray-600">{condo.pricePsf}</p>
              </div>
            </div>
            
            {/* Image Gallery */}
            <CondoImageGallery images={condo.images} condoName={condo.name} condoSlug={condo.slug} />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                {/* Overview */}
                <div className="mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">Project Overview</h2>
                  <p className="text-lg text-gray-700 leading-relaxed mb-6">
                    {condo.excerpt}
                  </p>
                  
                  {/* Key Features */}
                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">Key Features</h3>
                      <ul className="space-y-2">
                        {condo.highlights.map((highlight, index) => (
                          <li key={index} className="flex items-start">
                            <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-gray-700">{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">Project Stats</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Units</span>
                          <span className="font-semibold">{condo.totalUnits}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Developer</span>
                          <span className="font-semibold">{condo.developer}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Completion</span>
                          <span className="font-semibold">{condo.completionYear}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tenure</span>
                          <span className="font-semibold">{condo.tenure}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expert Analysis */}
                <div className="mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">Expert Analysis</h2>
                  
                  {/* Pros and Cons */}
                  <div className="grid md:grid-cols-2 gap-8 mb-8">
                    <div className="bg-green-50 p-6 rounded-lg">
                      <h3 className="text-xl font-semibold text-green-800 mb-4 flex items-center">
                        <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Strengths
                      </h3>
                      <ul className="space-y-2">
                        <li className="text-green-700">Prime location with excellent connectivity</li>
                        <li className="text-green-700">High-quality developer with proven track record</li>
                        <li className="text-green-700">Comprehensive facilities and amenities</li>
                        <li className="text-green-700">Strong rental and resale potential</li>
                        <li className="text-green-700">Well-designed units with efficient layouts</li>
                      </ul>
                    </div>
                    
                    <div className="bg-amber-50 p-6 rounded-lg">
                      <h3 className="text-xl font-semibold text-amber-800 mb-4 flex items-center">
                        <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        Considerations
                      </h3>
                      <ul className="space-y-2">
                        <li className="text-amber-700">Premium pricing due to prime location</li>
                        <li className="text-amber-700">High competition from similar developments</li>
                        <li className="text-amber-700">Potential traffic congestion in area</li>
                        <li className="text-amber-700">Maintenance fees may be substantial</li>
                        <li className="text-amber-700">Market conditions subject to change</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Investment Potential */}
                <div className="mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">Investment Potential</h2>
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600 mb-2">{investmentScores.capitalAppreciation}/5</div>
                        <div className="text-sm text-blue-800 font-medium">Capital Appreciation</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600 mb-2">{investmentScores.rentalYield}%</div>
                        <div className="text-sm text-blue-800 font-medium">Est. Rental Yield</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600 mb-2">{investmentScores.liquidity}</div>
                        <div className="text-sm text-blue-800 font-medium">Liquidity</div>
                      </div>
                    </div>
                    
                    {/* Investment Disclaimer */}
                    <div className="mt-4 text-center">
                      <p className="text-xs text-gray-600">
                        Investment metrics are estimates based on market analysis. 
                        Data sourced from {condo.dataSource || 'Market Research'}.
                        {condo.lastUpdated && ` Last updated: ${condo.lastUpdated}.`}
                      </p>
                    </div>
                  </div>
                </div>

                {/* DQI Breakdown */}
                {(condo as any).dqiScore && (condo as any).dqiBreakdown && (
                  <div className="mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Development Quality Index (DQI)</h2>
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <div className="mb-4 text-center">
                        <div className="text-4xl font-bold text-blue-600 mb-2">
                          {(condo as any).dqiScore}/100
                        </div>
                        <div className="text-lg text-gray-700">
                          Overall DQI Score ({(condo as any).dqiScore >= 85 ? 'Excellent' : 
                                            (condo as any).dqiScore >= 70 ? 'Good' : 
                                            (condo as any).dqiScore >= 55 ? 'Average' : 'Below Average'})
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                        <div className="text-center p-4 bg-white rounded-lg">
                          <div className="text-2xl font-bold text-gray-700">{(condo as any).dqiBreakdown.location}/100</div>
                          <div className="text-sm text-gray-600">Location</div>
                        </div>
                        <div className="text-center p-4 bg-white rounded-lg">
                          <div className="text-2xl font-bold text-gray-700">{(condo as any).dqiBreakdown.developer}/100</div>
                          <div className="text-sm text-gray-600">Developer</div>
                        </div>
                        <div className="text-center p-4 bg-white rounded-lg">
                          <div className="text-2xl font-bold text-gray-700">{(condo as any).dqiBreakdown.design}/100</div>
                          <div className="text-sm text-gray-600">Design</div>
                        </div>
                        <div className="text-center p-4 bg-white rounded-lg">
                          <div className="text-2xl font-bold text-gray-700">{(condo as any).dqiBreakdown.facilities}/100</div>
                          <div className="text-sm text-gray-600">Facilities</div>
                        </div>
                        <div className="text-center p-4 bg-white rounded-lg">
                          <div className="text-2xl font-bold text-gray-700">{(condo as any).dqiBreakdown.buildQuality}/100</div>
                          <div className="text-sm text-gray-600">Build Quality</div>
                        </div>
                        <div className="text-center p-4 bg-white rounded-lg">
                          <div className="text-2xl font-bold text-gray-700">{(condo as any).dqiBreakdown.investment}/100</div>
                          <div className="text-sm text-gray-600">Investment</div>
                        </div>
                      </div>
                      
                      <div className="mt-4 text-center">
                        <p className="text-xs text-gray-600">
                          DQI Score based on {(condo as any).scoreSource}. 
                          {(condo as any).scoringDate && ` Scored: ${(condo as any).scoringDate}.`}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                {/* Quick Facts */}
                <div className="bg-gray-50 p-6 rounded-lg mb-8 sticky top-24">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Facts</h3>
                  <dl className="space-y-4">
                    <div>
                      <dt className="text-sm text-gray-600">Location</dt>
                      <dd className="text-base font-medium text-gray-900">{condo.location}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-600">Year Built</dt>
                      <dd className="text-base font-medium text-gray-900">{condo.yearBuilt}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-600">Total Units</dt>
                      <dd className="text-base font-medium text-gray-900">{condo.totalUnits}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-600">Price Range</dt>
                      <dd className="text-base font-medium text-gray-900">${condo.priceMin}M - ${condo.priceMax}M</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-600">PSF Range</dt>
                      <dd className="text-base font-medium text-gray-900">{condo.currentPSF || condo.pricePsf}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-600">Room Types</dt>
                      <dd className="text-base font-medium text-gray-900">{condo.bedrooms}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-600">Tenure</dt>
                      <dd className="text-base font-medium text-gray-900">{condo.tenure}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-600">Developer</dt>
                      <dd className="text-base font-medium text-gray-900">{condo.developer}</dd>
                    </div>
                    {condo.soldPercentage && (
                      <div>
                        <dt className="text-sm text-gray-600">Sales Progress</dt>
                        <dd className="text-base font-medium text-gray-900">{condo.soldPercentage}% Sold</dd>
                      </div>
                    )}
                  </dl>
                  
                  {/* Contact CTA */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <Link
                      href="/contact"
                      className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-3 px-4 rounded-lg font-semibold transition-colors"
                    >
                      Get More Information
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Condos */}
      {relatedCondos.length > 0 && (
        <section className="bg-gray-50 py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                Other {condo.region} Developments
              </h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                {relatedCondos.map(related => (
                  <Link 
                    key={related.slug}
                    href={`/condos/${related.slug}`}
                    className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
                  >
                    <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                      <img
                        src={related.images[0]}
                        alt={related.name}
                        className="w-full h-48 object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{related.name}</h3>
                      <p className="text-gray-600 text-sm mb-2">District {related.district} • {related.districtName}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-blue-600 font-semibold">From {related.priceFromDisplay}</span>
                        <div className="flex items-center">
                          <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="text-sm text-gray-600">{related.rating}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const condo = getCondoBySlug(params.slug)
  
  if (!condo) {
    return {
      title: 'Condo Not Found',
      description: 'The requested condo review could not be found.',
    }
  }
  
  return {
    title: `${condo.name} Review - ${condo.districtName} Condo | Singapore Property Hub`,
    description: `Comprehensive review of ${condo.name} in District ${condo.district}, ${condo.districtName}. Expert analysis, pricing, and investment potential. Rating: ${condo.rating}/5.`,
    openGraph: {
      title: `${condo.name} Review - ${condo.districtName} Condo`,
      description: condo.excerpt,
      images: [condo.images[0]],
    },
  }
}

// Generate static params for all condos
export async function generateStaticParams() {
  const condos = getAllCondos()
  return condos.map((condo) => ({
    slug: condo.slug,
  }))
}