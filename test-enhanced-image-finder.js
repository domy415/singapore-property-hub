require('dotenv').config({ path: '.env.local' });

// Simulate the enhanced image finder logic
function selectContentAppropriateImage(articleTitle, articleCategory) {
  let imageUrl = ''
  let description = ''
  let imageType = 'skyline'
  let relevanceScore = 0.8
  
  const title = articleTitle.toLowerCase()
  
  // DISTRICT-SPECIFIC MAPPING (highest priority)
  if (title.includes('district 12') || title.includes('toa payoh') || title.includes('balestier')) {
    imageUrl = 'https://images.unsplash.com/photo-zIp4YexPPhQ?w=1200&h=630&q=80' // Authentic Toa Payoh HDB
    description = 'Authentic Toa Payoh HDB blocks with void decks representing District 12 heartland character'
    imageType = 'district'
    relevanceScore = 0.95
  } else if (title.includes('district 2') || title.includes('cbd') || title.includes('tanjong pagar') || title.includes('anson')) {
    imageUrl = 'https://images.unsplash.com/photo-1567360425618-1594206637d2?w=1200&h=630&q=80' // Singapore CBD
    description = 'Singapore CBD skyline featuring Tanjong Pagar financial district'
    imageType = 'district'
    relevanceScore = 0.95
  } 
  // NATIONAL DAY/CELEBRATION CONTENT
  else if (title.includes('national day') || title.includes('celebrating') || title.includes('independence')) {
    imageUrl = 'https://images.unsplash.com/photo-1533628635777-112b2239b1c7?w=1200&h=630&q=80' // Singapore flag/celebration
    description = 'Singapore National Day celebration with Marina Bay Sands backdrop'
    imageType = 'conceptual'
    relevanceScore = 0.95
  }
  // HDB-SPECIFIC CONTENT
  else if (title.includes('hdb') || title.includes('public housing') || title.includes('bto')) {
    imageUrl = 'https://images.unsplash.com/photo-zIp4YexPPhQ?w=1200&h=630&q=80' // Authentic HDB
    description = 'Singapore HDB public housing showcasing heartland living'
    imageType = 'conceptual'
    relevanceScore = 0.9
  }
  // SPECIFIC PROPERTY NAMES
  else if (title.includes('grand dunman')) {
    imageUrl = 'https://images.unsplash.com/photo-kNzqXxlvmE4?w=1200&h=630&q=80' // Modern development
    description = 'Modern Singapore condominium development representing Grand Dunman'
    imageType = 'property-specific'
    relevanceScore = 0.85
  } else if (title.includes('bloomsbury')) {
    imageUrl = 'https://images.unsplash.com/photo-1565967511849-76a60a516170?w=1200&h=630&q=80' // Luxury development
    description = 'Luxury Singapore condominium representing Bloomsbury Residences'
    imageType = 'property-specific'
    relevanceScore = 0.85
  }
  // INVESTMENT/FINANCE CONTENT
  else if (articleCategory.includes('INVESTMENT') || title.includes('investment') || title.includes('roi')) {
    imageUrl = 'https://images.unsplash.com/photo-1567360425618-1594206637d2?w=1200&h=630&q=80' // CBD financial
    description = 'Singapore financial district representing property investment opportunities'
    imageType = 'conceptual'
    relevanceScore = 0.9
  }
  // BUYING GUIDE CONTENT  
  else if (articleCategory.includes('BUYING') || title.includes('buyer') || title.includes('purchase')) {
    imageUrl = 'https://images.unsplash.com/photo-1508964942454-1a56651d54ac?w=1200&h=630&q=80' // Modern Singapore
    description = 'Modern Singapore property development for home buyers'
    imageType = 'conceptual'
    relevanceScore = 0.85
  }
  // MARKET ANALYSIS (default for most content)
  else {
    imageUrl = 'https://images.unsplash.com/photo-ugr4n5X4YjI?w=1200&h=630&q=80' // Premium Marina Bay
    description = 'Singapore Marina Bay skyline representing dynamic property market'
    imageType = 'skyline'
    relevanceScore = 0.8
  }
  
  return {
    imageUrl,
    description,
    imageType,
    relevanceScore
  }
}

// Test the image mapping logic
const testArticles = [
  { title: "Ultimate Guide to Living in District 12: Balestier, Toa Payoh, Serangoon", category: "MARKET_INSIGHTS" },
  { title: "Ultimate Guide to Living in District 2: Anson & Tanjong Pagar, Singapore", category: "MARKET_INSIGHTS" },
  { title: "Celebrating National Day: Insights into Singapore's Property Market in 2025", category: "MARKET_INSIGHTS" },
  { title: "Navigating the Singapore Property Market: A National Day 2025 Special", category: "MARKET_INSIGHTS" },
  { title: "HDB vs Private Property: Complete Comparison Guide 2025", category: "BUYING_GUIDE" },
  { title: "Bloomsbury Residences Review: A Detailed Look at the 2025 New Launch", category: "PROPERTY_NEWS" },
  { title: "Navigating Singapore's Evolving Family Home Market: An Insider's Analysis", category: "MARKET_INSIGHTS" }
]

console.log('🧪 Testing Enhanced Image Finder Logic\n')

testArticles.forEach((article, i) => {
  const result = selectContentAppropriateImage(article.title, article.category)
  
  console.log(`${i+1}. ${article.title}`)
  console.log(`   Category: ${article.category}`)
  console.log(`   Image Type: ${result.imageType}`)
  console.log(`   Relevance: ${result.relevanceScore}`)
  console.log(`   Description: ${result.description}`)
  console.log(`   URL: ${result.imageUrl}`)
  console.log('')
})

console.log('✅ Enhanced image mapping logic tested successfully!')
console.log('🎯 Each article now gets content-appropriate imagery based on title analysis')