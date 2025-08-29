// Singapore Property Image Finder Agent - Comprehensive Article Image Audit
// Based on enhanced agent rules from CLAUDE.md Session 16-17

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Singapore Property Image Finder Agent - Authentic Singapore-Specific Images (Updated 2025-08-29)
const COMPREHENSIVE_IMAGE_MAP = {
  // District 12 - Toa Payoh, Balestier, Serangoon (HDB heartland) - Dragon Playground iconic
  'district 12': 'https://images.unsplash.com/photo-zIp4YexPPhQ?w=1200&h=630&q=80', // Authentic Toa Payoh HDB blocks by Danist Soh
  'balestier': 'https://images.unsplash.com/photo-zIp4YexPPhQ?w=1200&h=630&q=80', // Singapore HDB with void decks
  'toa payoh': 'https://images.unsplash.com/photo-zIp4YexPPhQ?w=1200&h=630&q=80', // Toa Payoh Dragon Playground area
  'serangoon': 'https://images.unsplash.com/photo-zIp4YexPPhQ?w=1200&h=630&q=80', // Northeast HDB heartland
  
  // District 2 - CBD, Tanjong Pagar, Anson (Financial district) - Marina Bay Sands backdrop
  'district 2': 'https://images.unsplash.com/photo-1567360425618?w=1200&h=630&q=80', // Singapore CBD skyline with Marina Bay
  'tanjong pagar': 'https://images.unsplash.com/photo-1567360425618?w=1200&h=630&q=80', // CBD financial district
  'anson': 'https://images.unsplash.com/photo-1567360425618?w=1200&h=630&q=80', // Singapore business district
  'cbd': 'https://images.unsplash.com/photo-1567360425618?w=1200&h=630&q=80', // Central Business District
  
  // National Day themed - Singapore celebrations with Marina Bay Sands
  'national day': 'https://images.unsplash.com/photo-1533628635777-112b2239b1c7?w=1200&h=630&q=80', // Marina Bay Sands Singapore celebration
  'independence': 'https://images.unsplash.com/photo-1533628635777-112b2239b1c7?w=1200&h=630&q=80', // Singapore skyline patriotic
  '59th independence': 'https://images.unsplash.com/photo-1533628635777-112b2239b1c7?w=1200&h=630&q=80', // National Day 2025
  'singapore independence': 'https://images.unsplash.com/photo-1533628635777-112b2239b1c7?w=1200&h=630&q=80', // Singapore flag Marina Bay
  
  // Specific property types with authentic Singapore architecture
  'hdb': 'https://images.unsplash.com/photo-zIp4YexPPhQ?w=1200&h=630&q=80', // Authentic Singapore HDB flats
  'public housing': 'https://images.unsplash.com/photo-zIp4YexPPhQ?w=1200&h=630&q=80', // HDB with void decks
  'condo': 'https://images.unsplash.com/photo-kNzqXxlvmE4?w=1200&h=630&q=80', // Singapore condo development
  'condominium': 'https://images.unsplash.com/photo-kNzqXxlvmE4?w=1200&h=630&q=80', // Modern Singapore condos
  'cooling measures': 'https://images.unsplash.com/photo-1567360425618?w=1200&h=630&q=80', // Government district CBD
  
  // Market insights with Marina Bay prominence
  'property market': 'https://images.unsplash.com/photo-1533628635777-112b2239b1c7?w=1200&h=630&q=80', // Singapore skyline Marina Bay Sands
  'market insight': 'https://images.unsplash.com/photo-1533628635777-112b2239b1c7?w=1200&h=630&q=80', // Iconic Singapore cityscape
  'market outlook': 'https://images.unsplash.com/photo-1533628635777-112b2239b1c7?w=1200&h=630&q=80', // Singapore financial center
  'weekend property': 'https://images.unsplash.com/photo-zIp4YexPPhQ?w=1200&h=630&q=80', // Singapore residential living
  'navigating the waves': 'https://images.unsplash.com/photo-1533628635777-112b2239b1c7?w=1200&h=630&q=80', // Singapore Marina Bay for market navigation
  
  // URA and government related
  'ura': 'https://images.unsplash.com/photo-1567360425618?w=1200&h=630&q=80', // Singapore government district
  'urban redevelopment': 'https://images.unsplash.com/photo-kNzqXxlvmE4?w=1200&h=630&q=80', // Development construction
  'property price index': 'https://images.unsplash.com/photo-1533628635777-112b2239b1c7?w=1200&h=630&q=80', // Singapore economic center
  
  // Specific developments with Marina Bay backdrop
  'bloomsbury': 'https://images.unsplash.com/photo-kNzqXxlvmE4?w=1200&h=630&q=80', // New Singapore development
  'wallich residence': 'https://images.unsplash.com/photo-1567360425618?w=1200&h=630&q=80', // Tallest residential CBD
  'greater southern waterfront': 'https://images.unsplash.com/photo-1533628635777-112b2239b1c7?w=1200&h=630&q=80', // Marina Bay waterfront
}

// Fallback images by category - Singapore Property Image Finder Agent Standards
const CATEGORY_FALLBACKS = {
  'MARKET_INSIGHTS': 'https://images.unsplash.com/photo-1533628635777-112b2239b1c7?w=1200&h=630&q=80', // Marina Bay Sands economic center
  'BUYING_GUIDE': 'https://images.unsplash.com/photo-kNzqXxlvmE4?w=1200&h=630&q=80', // Singapore condo development
  'NEIGHBORHOOD': 'https://images.unsplash.com/photo-zIp4YexPPhQ?w=1200&h=630&q=80', // Authentic HDB heartland by Danist Soh
  'LOCATION_GUIDE': 'https://images.unsplash.com/photo-1567360425618?w=1200&h=630&q=80', // Singapore CBD district
  'PROPERTY_NEWS': 'https://images.unsplash.com/photo-1533628635777-112b2239b1c7?w=1200&h=630&q=80', // Singapore skyline news
  'NEW_LAUNCH_REVIEW': 'https://images.unsplash.com/photo-kNzqXxlvmE4?w=1200&h=630&q=80', // New Singapore development
  'INVESTMENT': 'https://images.unsplash.com/photo-1567360425618?w=1200&h=630&q=80', // CBD financial district
  'SELLING_GUIDE': 'https://images.unsplash.com/photo-1533628635777-112b2239b1c7?w=1200&h=630&q=80', // Singapore property market
}

function getRelevantImage(title, content, category) {
  const searchText = (title + ' ' + content.slice(0, 500)).toLowerCase()
  const timestamp = Date.now() // Cache-busting timestamp
  
  // Check for specific matches with priority scoring
  let bestMatch = { keyword: '', score: 0, imageUrl: '' }
  
  for (const [keyword, imageUrl] of Object.entries(COMPREHENSIVE_IMAGE_MAP)) {
    if (searchText.includes(keyword)) {
      const score = keyword.length // Longer matches get higher priority
      if (score > bestMatch.score) {
        bestMatch = { keyword, score, imageUrl }
      }
    }
  }
  
  if (bestMatch.imageUrl) {
    return {
      url: `${bestMatch.imageUrl}&t=${timestamp}`,
      reason: `Singapore-specific match: "${bestMatch.keyword}" (score: ${bestMatch.score})`,
      compliant: true,
      agentApproved: true
    }
  }
  
  // Fall back to category-specific image
  const fallbackImage = CATEGORY_FALLBACKS[category] || CATEGORY_FALLBACKS['MARKET_INSIGHTS']
  return {
    url: `${fallbackImage}&t=${timestamp}`,
    reason: `Category fallback: ${category}`,
    compliant: true,
    agentApproved: true
  }
}

async function singaporePropertyImageAudit() {
  try {
    console.log('🇸🇬 SINGAPORE PROPERTY IMAGE FINDER AGENT - COMPREHENSIVE AUDIT')
    console.log('==================================================================')
    console.log('📋 Checking all article images against Singapore Property Image Finder rules...\n')
    
    // Get all articles
    const articles = await prisma.article.findMany({
      select: {
        id: true,
        title: true,
        content: true,
        category: true,
        featuredImage: true,
        slug: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    })

    console.log(`📊 Found ${articles.length} articles to audit\n`)

    const updates = []
    let compliantCount = 0
    let nonCompliantCount = 0
    
    for (let i = 0; i < articles.length; i++) {
      const article = articles[i]
      const analysis = getRelevantImage(article.title, article.content, article.category)
      const currentImage = article.featuredImage
      
      console.log(`\n${i + 1}. 📄 ${article.title}`)
      console.log(`   📂 Category: ${article.category}`)
      console.log(`   🌐 URL: https://singapore-property-hub.vercel.app/articles/${article.slug}`)
      console.log(`   📷 Current Image: ${currentImage}`)
      console.log(`   💡 Agent Analysis: ${analysis.reason}`)
      
      // Check if current image matches Singapore Property Image Finder standards
      const needsUpdate = analysis.url !== currentImage
      
      if (needsUpdate) {
        console.log(`   ❌ NON-COMPLIANT: Image does not follow Singapore Property Image Finder rules`)
        console.log(`   🔄 Suggested Image: ${analysis.url}`)
        
        // Update the image in database
        await prisma.article.update({
          where: { id: article.id },
          data: { featuredImage: analysis.url }
        })
        
        updates.push({
          id: article.id,
          title: article.title,
          category: article.category,
          oldImage: currentImage,
          newImage: analysis.url,
          reason: analysis.reason,
          url: `https://singapore-property-hub.vercel.app/articles/${article.slug}`
        })
        
        console.log(`   ✅ FIXED: Image now compliant with Singapore Property Image Finder rules`)
        nonCompliantCount++
      } else {
        console.log(`   ✅ COMPLIANT: Image already follows Singapore Property Image Finder rules`)
        compliantCount++
      }
    }

    // Final summary
    console.log(`\n🇸🇬 SINGAPORE PROPERTY IMAGE FINDER AGENT - AUDIT COMPLETE`)
    console.log('================================================================')
    console.log(`📊 AUDIT RESULTS:`)
    console.log(`   📄 Total articles audited: ${articles.length}`)
    console.log(`   ✅ Compliant articles: ${compliantCount}`)
    console.log(`   ❌ Non-compliant articles: ${nonCompliantCount}`)
    console.log(`   🔄 Articles updated: ${updates.length}`)
    
    if (updates.length > 0) {
      console.log(`\n📝 DETAILED UPDATE SUMMARY:`)
      updates.forEach((update, index) => {
        console.log(`\n   ${index + 1}. ${update.title}`)
        console.log(`      📂 Category: ${update.category}`)
        console.log(`      💡 Reason: ${update.reason}`)
        console.log(`      🌐 URL: ${update.url}`)
      })
      
      console.log(`\n⚡ DEPLOYMENT REQUIRED:`)
      console.log(`   Database changes made. Vercel deployment needed to sync live website.`)
      console.log(`   All images now follow enhanced Singapore Property Image Finder Agent standards.`)
      
      return {
        success: true,
        articlesAudited: articles.length,
        compliantImages: compliantCount,
        updatedImages: nonCompliantCount,
        updates: updates,
        deploymentNeeded: true
      }
    } else {
      console.log(`\n🎉 PERFECT COMPLIANCE!`)
      console.log(`   All article images already follow Singapore Property Image Finder rules.`)
      console.log(`   No deployment needed - website images are fully compliant.`)
      
      return {
        success: true,
        articlesAudited: articles.length,
        compliantImages: compliantCount,
        updatedImages: 0,
        updates: [],
        deploymentNeeded: false
      }
    }

  } catch (error) {
    console.error('\n❌ AUDIT FAILED:', error.message)
    return {
      success: false,
      error: error.message
    }
  } finally {
    await prisma.$disconnect()
  }
}

// Run the comprehensive Singapore Property Image Finder Agent audit
singaporePropertyImageAudit().then(result => {
  if (result.success) {
    console.log('\n🇸🇬 Singapore Property Image Finder Agent audit completed successfully!')
  } else {
    console.log('\n❌ Audit failed:', result.error)
    process.exit(1)
  }
}).catch(error => {
  console.error('\n💥 Fatal error:', error.message)
  process.exit(1)
})