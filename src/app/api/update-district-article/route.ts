import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ArticleStatus } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    console.log('Updating district discovery article with proper district content...')
    
    // Target the specific article we know is problematic
    const articleSlug = 'district-discovery-thursday-navigating-singapore-s-property-market-in-2025'
    
    const article = await prisma.article.findUnique({
      where: { slug: articleSlug },
      select: { id: true, title: true, slug: true }
    })

    if (!article) {
      return NextResponse.json({
        success: false,
        message: `Article with slug "${articleSlug}" not found`
      })
    }

    // New district-specific content
    const newTitle = "District 9 Orchard Complete Living Guide: Singapore's Premier Shopping and Lifestyle Hub"
    const newSlug = "district-9-orchard-complete-living-guide-singapore-premier-shopping-lifestyle-hub"
    const newExcerpt = "Discover everything about living in District 9 Orchard - from luxury condos and GCBs to MRT stations, schools, shopping centers, and property prices in Singapore's most prestigious district."
    
    const newContent = `# District 9 Orchard Complete Living Guide: Singapore's Premier Shopping and Lifestyle Hub

## District Overview - Singapore's Retail and Residential Epicenter

District 9, anchored by the internationally acclaimed Orchard Road, stands as Singapore's premier lifestyle district. This Central Region enclave commands premium valuations across all property segments, from the ultra-luxury penthouses overlooking the shopping belt to the conservation shophouses nestled in quiet residential pockets. The district's strategic position within the Core Central Region continues to attract high-net-worth individuals and institutional investors seeking stable returns in Singapore's most established precinct.

## Historical Evolution - From Nutmeg Plantations to Luxury Lifestyle Hub

District 9's transformation reflects Singapore's rapid urbanization over the past century. Originally dominated by nutmeg and pepper plantations in the 1800s, the area began its metamorphosis in the early 1900s when European merchants established grand residences along what is now Orchard Road. The iconic shopping strip emerged in the 1970s as international retailers recognized Singapore's growing affluence, transforming former plantation land into Southeast Asia's most prestigious retail corridor. The district's residential character was shaped by the development of Cairnhill and Scotts Road in the 1980s, establishing the template for luxury living that defines the area today.

## Geographic Boundaries and Key Areas

District 9 encompasses several prestigious neighborhoods, each with its distinct character:

### Orchard Road Corridor
The main artery of District 9, Orchard Road stretches approximately 2.2 kilometers and serves as Singapore's premier shopping district. Key sections include:

- **Tanglin Shopping Centre area** - The western end featuring antique shops and specialty stores
- **Paragon and Ngee Ann City vicinity** - The central luxury shopping zone
- **ION Orchard and Wisma Atria area** - The eastern retail hub connecting to Somerset

### Cairnhill and Oxley Rise
These exclusive residential areas offer:
- **Cairnhill Circle** - Home to luxury condominiums like The Cairnhill and Scotts Square
- **Oxley Rise** - Traditional landed property enclave with good class bungalows
- **Cairnhill Road** - Mixed development corridor with both residential and commercial properties

### Emerald Hill and Peranakan Place
Historic conservation areas featuring:
- **Emerald Hill Road** - Famous for its beautifully preserved Peranakan shophouses
- **Cuppage Road** - Local food haven with traditional coffee shops and restaurants
- **Peranakan Place** - Cultural heritage zone with restored shophouses

## Transportation Excellence

### MRT Connectivity
District 9 boasts exceptional public transport connectivity with multiple MRT stations:

**North-South Line:**
- **Orchard MRT Station** - The district's main transport hub, directly connected to major shopping centers
- **Somerset MRT Station** - Eastern gateway serving the younger crowd and trendy shopping areas

**Circle Line:**
- **Dhoby Ghaut MRT Station** - Northern boundary providing connections to three MRT lines
- **Botanic Gardens MRT Station** - Western access point near the UNESCO World Heritage site

## Education Excellence

### Primary Schools
- **CHIJ Primary (Toa Payoh)** - Prestigious girls' school with strong academic reputation
- **Anglo-Chinese School (Primary)** - Elite Methodist institution
- **Singapore Chinese Girls' Primary School** - Traditional Chinese-medium education

### International Schools
- **Chatsworth International School (Orchard Campus)** - IB program for international students
- **ISS International School** - Comprehensive international curriculum

## Property Market Overview

### Residential Property Types

**Luxury Condominiums**
- **Orchard Residences** - Ultra-luxury development above ION Orchard (From $8.5M)
- **The Scotts Tower** - Iconic twisted tower design (From $6.2M)
- **Cairnhill Nine** - Premium development with city views (From $4.8M)
- **One Cairnhill** - Luxury living with retail integration (From $3.9M)

**Conservation Shophouses**
- **Emerald Hill Road** - Historic Peranakan properties (From $12M)
- **Blair Road area** - Restored shophouses for residential use (From $8M)
- **Club Street vicinity** - Mixed-use conservation properties (From $6.5M)

**Good Class Bungalows (GCB)**
- **Oxley Rise** - Exclusive landed estate (From $25M)
- **Chatsworth Road** - Prime bungalow lots (From $30M)
- **Anderson Road** - Prestigious landed properties (From $22M)

### Commercial Properties

**Retail Spaces**
- **Prime Orchard Road frontage** - $45-80 per sqft monthly
- **Shopping center units** - $30-60 per sqft depending on location
- **Ground floor shop units** - $25-45 per sqft for secondary streets

## Healthcare Facilities

### Major Hospitals
- **Mount Elizabeth Hospital** - Premier private hospital with specialist services
- **Gleneagles Hospital** - Leading private healthcare facility
- **Paragon Medical Centre** - Comprehensive medical hub with specialist clinics

## Target Demographics and Lifestyle Fit

### Ideal Residents

**Expatriate Professionals**
- International executives and their families
- Easy access to international schools and healthcare
- Familiar Western-style shopping and dining options
- Central location for business activities

**Affluent Local Professionals**
- Senior executives and business owners
- Empty nesters seeking luxury and convenience
- Young professionals who prioritize lifestyle and accessibility

## Investment Considerations

District 9 remains one of Singapore's most sought-after addresses, offering:
- **Capital appreciation potential** - Historical price growth averaging 3-5% annually
- **Strong rental demand** - High occupancy rates from expatriate professionals
- **Limited supply** - Restricted land availability maintains exclusivity
- **Government support** - Continued investment in infrastructure and amenities

## Market Outlook and Investment Strategy

District 9's property fundamentals remain robust, supported by limited land supply and sustained demand from high-net-worth buyers. The government's measured approach to new supply in the Core Central Region suggests continued price resilience, particularly for well-located developments with unique selling propositions.

Investment activity has shown renewed vigor following the easing of travel restrictions, with foreign buyers returning to established precincts. The rental market benefits from the district's appeal to expatriate professionals and corporate relocations, maintaining occupancy rates above district averages.

Looking ahead, the planned enhancements to Orchard Road's retail ecosystem and transport connectivity should further cement District 9's position as Singapore's premier lifestyle address. Savvy investors continue to view quality assets in this precinct as core portfolio holdings, recognizing the district's enduring appeal across market cycles.

For property professionals tracking market dynamics, District 9 represents a benchmark for luxury residential performance in Singapore's evolving real estate landscape.`

    // Update the article
    const updatedArticle = await prisma.article.update({
      where: { id: article.id },
      data: {
        title: newTitle,
        slug: newSlug,
        content: newContent,
        excerpt: newExcerpt,
        seoTitle: "District 9 Orchard Living Guide - Property Prices, MRT Stations & Amenities",
        seoDescription: "Complete guide to District 9 Orchard Singapore - luxury condos, GCBs, MRT stations, schools, shopping centers, and property investment insights.",
        seoKeywords: ["District 9", "Orchard Road", "Singapore property", "luxury condos", "property guide", "MRT stations"],
        category: "NEIGHBORHOOD",
        updatedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Successfully updated district article with proper content',
      article: {
        id: article.id,
        oldTitle: article.title,
        oldSlug: article.slug,
        newTitle: newTitle,
        newSlug: newSlug,
        url: `https://singapore-property-hub.vercel.app/articles/${newSlug}`
      }
    })

  } catch (error) {
    console.error('❌ Error updating district article:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}