// Image audit script based on Singapore Property Image Finder Agent rules
const { createRequire } = require('module');
const require = createRequire(import.meta.url || __filename);

// Use the existing lib/prisma.ts configuration  
const path = require('path');
const { execSync } = require('child_process');

// Run a simple database query through the Next.js API instead
const https = require('https');
const http = require('http');

// Singapore Property Image Finder Agent - Authentic Singapore-Specific Images
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
    console.log(`Best match "${bestMatch.keyword}" (score: ${bestMatch.score}) for title: ${title}`)
    return `${bestMatch.imageUrl}&t=${timestamp}`
  }
  
  // Fall back to category-specific image
  console.log(`Using category fallback for: ${title}`)
  const fallbackImage = CATEGORY_FALLBACKS[category] || CATEGORY_FALLBACKS['MARKET_INSIGHTS']
  return `${fallbackImage}&t=${timestamp}`
}

async function auditAndUpdateImages() {
  try {
    console.log('=== Starting Singapore Property Image Finder Agent Audit ===')
    
    // Get all articles
    const articles = await prisma.article.findMany({
      select: {
        id: true,
        title: true,
        content: true,
        category: true,
        featuredImage: true,
        slug: true
      },
      orderBy: { createdAt: 'desc' }
    })

    console.log(`Found ${articles.length} articles to audit`)

    const updates = []
    
    for (const article of articles) {
      const suggestedImage = getRelevantImage(article.title, article.content, article.category)
      const currentImage = article.featuredImage
      
      console.log(`\n--- Article: ${article.title} ---`)
      console.log(`Category: ${article.category}`)
      console.log(`Current Image: ${currentImage}`)
      console.log(`Suggested Image: ${suggestedImage}`)
      console.log(`URL: https://singapore-property-hub.vercel.app/articles/${article.slug}`)
      
      if (suggestedImage !== currentImage) {
        console.log('❌ NEEDS UPDATE - Image does not follow Singapore Property Image Finder rules')
        
        // Update the image in database
        await prisma.article.update({
          where: { id: article.id },
          data: { featuredImage: suggestedImage }
        })
        
        updates.push({
          id: article.id,
          title: article.title,
          category: article.category,
          oldImage: currentImage,
          newImage: suggestedImage,
          url: `https://singapore-property-hub.vercel.app/articles/${article.slug}`
        })
        
        console.log('✅ UPDATED - Image now follows Singapore Property Image Finder rules')
      } else {
        console.log('✅ COMPLIANT - Image already follows Singapore Property Image Finder rules')
      }
    }

    console.log(`\n=== AUDIT COMPLETE ===`)
    console.log(`Total articles audited: ${articles.length}`)
    console.log(`Articles updated: ${updates.length}`)
    console.log(`Compliant articles: ${articles.length - updates.length}`)
    
    if (updates.length > 0) {
      console.log('\n=== UPDATES MADE ===')
      updates.forEach(update => {
        console.log(`• ${update.title}`)
        console.log(`  Category: ${update.category}`)
        console.log(`  URL: ${update.url}`)
      })
    }

    return {
      success: true,
      articlesAudited: articles.length,
      articlesUpdated: updates.length,
      updatesCompliant: articles.length - updates.length,
      updates: updates
    }

  } catch (error) {
    console.error('Error during image audit:', error)
    return {
      success: false,
      error: error.message
    }
  } finally {
    await prisma.$disconnect()
  }
}

// Run the audit
auditAndUpdateImages().then(result => {
  if (result.success) {
    console.log('\n🎉 Singapore Property Image Finder Agent audit completed successfully!')
    if (result.articlesUpdated > 0) {
      console.log('\n⚡ DEPLOYMENT NEEDED: Changes made to database. Vercel deployment required.')
    } else {
      console.log('\n✅ NO CHANGES NEEDED: All images already compliant with Singapore Property Image Finder rules.')
    }
  } else {
    console.log('\n❌ Audit failed:', result.error)
  }
}).catch(console.error)