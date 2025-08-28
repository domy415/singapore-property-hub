// Content Calendar Configuration for Singapore Property Hub
// This defines seasonal topics, special events, and content themes throughout the year

export interface ContentTheme {
  month: number // 1-12
  themes: string[]
  specialEvents?: string[]
  keywords: string[]
}

export const contentCalendar: ContentTheme[] = [
  {
    month: 1, // January
    themes: [
      'Q4 URA Property Price Index Comprehensive Review',
      'URA Annual Property Market Report Analysis',
      'Full Year Property Statistics Deep Dive',
      'New Year Property Investment Strategies',
      'Post-Holiday Market Recovery Analysis',
      'CNY Property Buying Guide',
      'Year-End Property Tax Planning'
    ],
    specialEvents: ['Q4 URA Statistics Release', 'URA Annual Report', 'Chinese New Year Preparation'],
    keywords: ['Q4 URA statistics', 'annual report', 'full year analysis', 'new year investment', 'CNY property', 'january market', 'property tax']
  },
  {
    month: 2, // February
    themes: [
      'Chinese New Year Property Traditions',
      'Feng Shui for New Launches',
      'Budget Season Impact on Property',
      'Valentine\'s Day Couple Home Buying'
    ],
    specialEvents: ['Chinese New Year', 'Budget Announcement'],
    keywords: ['CNY traditions', 'feng shui', 'budget impact', 'couple buying']
  },
  {
    month: 3, // March
    themes: [
      'Q1 URA Property Price Index Analysis',
      'URA Q1 Private Property Statistics Review',
      'Q1 Market Review and Outlook',
      'School Registration Property Guide',
      'Spring Property Maintenance Tips',
      'Financial Year End Investment'
    ],
    specialEvents: ['Q1 URA Statistics Release', 'URA Property Price Index Q1'],
    keywords: ['Q1 review', 'URA statistics', 'property price index', 'school registration', 'property maintenance', 'financial year']
  },
  {
    month: 4, // April
    themes: [
      'Q2 Investment Opportunities',
      'Cooling Measures Anniversary Analysis',
      'HDB BTO vs Private Condo',
      'Earth Day Sustainable Properties'
    ],
    specialEvents: ['Cooling Measures Review'],
    keywords: ['Q2 outlook', 'cooling measures', 'BTO comparison', 'sustainable homes']
  },
  {
    month: 5, // May
    themes: [
      'Mid-Year Property Market Assessment',
      'Vesak Day Property Charity',
      'Mother\'s Day Family Home Upgrade',
      'Labour Day Construction Updates'
    ],
    specialEvents: ['Vesak Day', 'Mother\'s Day'],
    keywords: ['mid-year review', 'family upgrade', 'construction updates', 'property charity']
  },
  {
    month: 6, // June
    themes: [
      'URA Q2 Property Market Data Preview',
      'School Holiday Property Viewings',
      'Mid-Year Investment Review',
      'Father\'s Day Investment Planning',
      'GSS Property Deals'
    ],
    specialEvents: ['Great Singapore Sale', 'School Holidays', 'Q2 URA Data Preparation'],
    keywords: ['school holidays', 'investment review', 'GSS deals', 'father\'s day', 'URA data']
  },
  {
    month: 7, // July
    themes: [
      'Q2 URA Property Price Index Deep Dive',
      'URA Q2 Private Property Transaction Analysis',
      'Q2 Market Statistics Analysis',
      'National Day Property Pride',
      'Mid-Year New Launch Review',
      'Property Investment for Retirement'
    ],
    specialEvents: ['Q2 URA Statistics Release', 'URA Property Price Index Q2', 'National Day Preparation'],
    keywords: ['Q2 statistics', 'URA property price index', 'transaction analysis', 'national day', 'new launch review', 'retirement planning']
  },
  {
    month: 8, // August
    themes: [
      'National Day Special Features',
      'Singapore Property History',
      'Property Independence Planning',
      'Hungry Ghost Festival Considerations'
    ],
    specialEvents: ['National Day', 'Hungry Ghost Festival'],
    keywords: ['national day', 'property history', 'independence', 'hungry ghost']
  },
  {
    month: 9, // September
    themes: [
      'URA Q3 Market Data Anticipation',
      'Q3 Market Predictions',
      'F1 Season Luxury Properties',
      'Children\'s Education Property',
      'Year-End Planning Begins'
    ],
    specialEvents: ['F1 Singapore Grand Prix', 'Mid-Autumn Festival', 'Q3 URA Data Preparation'],
    keywords: ['Q3 predictions', 'URA data anticipation', 'F1 luxury', 'education property', 'year-end planning']
  },
  {
    month: 10, // October
    themes: [
      'Q3 URA Property Price Index Analysis',
      'URA Q3 Private Property Market Report',
      'Q3 Statistics Deep Dive',
      'Deepavali Property Prosperity',
      'Halloween Themed Properties',
      'Q4 Investment Strategy'
    ],
    specialEvents: ['Q3 URA Statistics Release', 'URA Property Price Index Q3', 'Deepavali'],
    keywords: ['Q3 statistics', 'URA property price index', 'market report', 'deepavali', 'Q4 strategy', 'festive properties']
  },
  {
    month: 11, // November
    themes: [
      'Black Friday Property Insights',
      '11.11 Property Deals',
      'Year-End Bonus Investment',
      'Christmas Planning Guide'
    ],
    specialEvents: ['11.11 Sales', 'Black Friday'],
    keywords: ['black friday', '11.11 deals', 'bonus investment', 'christmas planning']
  },
  {
    month: 12, // December
    themes: [
      'URA Q4 Market Data Preview',
      'Year in Review Special',
      'Next Year Market Predictions',
      'Christmas Property Gifting',
      'New Year Resolution Properties'
    ],
    specialEvents: ['Christmas', 'Year-End Review', 'Q4 URA Data Anticipation'],
    keywords: ['year review', 'URA Q4 preview', 'predictions', 'christmas', 'new year properties']
  }
]

// Topic categories with seasonal variations
export const topicCategories = {
  marketAnalysis: [
    'URA Property Price Index Analysis',
    'URA Quarterly Statistics Review',
    'URA Private Property Market Report',
    'URA Transaction Volume Analysis',
    'Quarterly Market Review',
    'Price Trend Analysis',
    'Cooling Measures Impact',
    'Interest Rate Effects',
    'Supply and Demand Dynamics'
  ],
  newLaunches: [
    'Upcoming Project Preview',
    'Launch Weekend Analysis',
    'Developer Track Record',
    'Location Deep Dive',
    'Investment Potential Assessment'
  ],
  investmentGuides: [
    'First-Time Buyer Guide',
    'Upgrader Strategies',
    'Foreign Buyer Updates',
    'Portfolio Diversification',
    'Rental Yield Analysis'
  ],
  locationGuides: [
    'District Transformation',
    'Transport Connectivity',
    'School Proximity Analysis',
    'Amenities Overview',
    'Future Development Plans'
  ],
  specialFeatures: [
    'Celebrity Property Picks',
    'Architect Interviews',
    'Smart Home Technologies',
    'Sustainable Living',
    'Heritage Properties'
  ]
}

// Get content suggestions for a specific date
export function getContentSuggestions(date: Date): string[] {
  const month = date.getMonth() + 1
  const dayOfWeek = date.getDay()
  const suggestions: string[] = []
  
  // Get monthly themes
  const monthTheme = contentCalendar.find(theme => theme.month === month)
  if (monthTheme) {
    suggestions.push(...monthTheme.themes)
  }
  
  // Add weekly patterns
  switch (dayOfWeek) {
    case 1: // Monday - Market Analysis
      suggestions.push('Weekly Market Outlook', 'Monday Market Movers')
      break
    case 2: // Tuesday - New Launches
      suggestions.push('New Launch Tuesday', 'Developer Spotlight')
      break
    case 3: // Wednesday - Investment Tips
      suggestions.push('Investment Wednesday', 'Wealth Building Tips')
      break
    case 4: // Thursday - Location Guides
      suggestions.push('District Discovery Thursday', 'Neighborhood Spotlight')
      break
    case 5: // Friday - Special Features
      suggestions.push('Feature Friday', 'Weekend Property Picks')
      break
    case 6: // Saturday - Buyer Guides
      suggestions.push('Saturday Showroom Tours', 'Weekend Buyer Guide')
      break
    case 0: // Sunday - Lifestyle
      suggestions.push('Sunday Property Lifestyle', 'Family Home Features')
      break
  }
  
  return suggestions
}

// Get trending keywords for SEO
export function getTrendingKeywords(month: number): string[] {
  const theme = contentCalendar.find(t => t.month === month)
  const baseKeywords = [
    'singapore property',
    'new launch condo',
    'property investment',
    'real estate singapore',
    'property market'
  ]
  
  if (theme) {
    return [...baseKeywords, ...theme.keywords]
  }
  
  return baseKeywords
}