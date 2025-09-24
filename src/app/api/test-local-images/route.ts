import { NextRequest, NextResponse } from 'next/server'
import { getArticleImage } from '@/lib/image-constants'

export async function GET(request: NextRequest) {
  // Test articles with different content types to verify image matching
  const testArticles = [
    // HDB Articles
    {
      title: 'HDB vs Private Property: Complete Comparison Guide 2025',
      slug: 'hdb-vs-private-property-complete-comparison-guide-2025',
      category: 'BUYER_GUIDES'
    },
    {
      title: 'Ultimate Guide to Living in District 12: Toa Payoh Area',
      slug: 'ultimate-guide-to-living-in-district-12-toa-payoh',
      category: 'LOCATION_GUIDES'
    },
    // Government/Policy Articles
    {
      title: 'Understanding Singapore\'s Cooling Measures in 2025',
      slug: 'understanding-singapore-cooling-measures-2025',
      category: 'POLICY_UPDATES'
    },
    // District Articles
    {
      title: 'District 2 Property Guide: Tanjong Pagar & Anson',
      slug: 'district-2-property-guide-tanjong-pagar-anson',
      category: 'LOCATION_GUIDES'
    },
    {
      title: 'Orchard Road Shopping District: District 9 Overview',
      slug: 'orchard-road-shopping-district-9-overview',
      category: 'LOCATION_GUIDES'
    },
    // Condo Articles
    {
      title: 'Grand Dunman Condo Review 2025',
      slug: 'grand-dunman-condo-review-2025',
      category: 'NEW_LAUNCH_REVIEW'
    },
    {
      title: 'Luxury Waterfront Condos in Singapore',
      slug: 'luxury-waterfront-condos-singapore',
      category: 'PROPERTY_TYPES'
    },
    // Market Analysis Articles
    {
      title: 'Singapore Property Market Outlook 2025',
      slug: 'singapore-property-market-outlook-2025',
      category: 'MARKET_ANALYSIS'
    },
    {
      title: 'Marina Bay Property Investment Trends',
      slug: 'marina-bay-property-investment-trends',
      category: 'INVESTMENT_GUIDES'
    },
    // National Day Articles
    {
      title: 'Celebrating National Day: Singapore Property Market Insights',
      slug: 'celebrating-national-day-singapore-property-insights',
      category: 'MARKET_ANALYSIS'
    },
    // River/Waterfront Articles
    {
      title: 'Singapore River Properties: Investment Guide',
      slug: 'singapore-river-properties-investment-guide',
      category: 'INVESTMENT_GUIDES'
    }
  ]

  const results = testArticles.map(article => {
    const selectedImage = getArticleImage(article)
    return {
      article: {
        title: article.title,
        slug: article.slug,
        category: article.category
      },
      selectedImage,
      isLocal: selectedImage.startsWith('/property-images/'),
      imageCategory: selectedImage.includes('/hdb/') ? 'HDB' :
                    selectedImage.includes('/condos/') ? 'Condos' :
                    selectedImage.includes('/districts/') ? 'Districts' :
                    selectedImage.includes('/government/') ? 'Government' :
                    selectedImage.includes('/misc/') ? 'Misc' : 'Unknown'
    }
  })

  const summary = {
    totalTested: results.length,
    localImages: results.filter(r => r.isLocal).length,
    externalImages: results.filter(r => !r.isLocal).length,
    imageBreakdown: {
      HDB: results.filter(r => r.imageCategory === 'HDB').length,
      Condos: results.filter(r => r.imageCategory === 'Condos').length,
      Districts: results.filter(r => r.imageCategory === 'Districts').length,
      Government: results.filter(r => r.imageCategory === 'Government').length,
      Misc: results.filter(r => r.imageCategory === 'Misc').length
    }
  }

  return NextResponse.json({
    success: true,
    summary,
    results
  })
}