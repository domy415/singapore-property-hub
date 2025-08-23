import DistrictGuideTemplate from './DistrictGuideTemplate'

const sampleDistrictData = {
  districtNumber: 9,
  districtName: 'Orchard & River Valley',
  region: 'CCR' as const,
  overview: 'The crown jewel of Singapore\'s retail and entertainment scene, District 9 encompasses the iconic Orchard Road shopping belt and the upscale River Valley area. This prime district offers unparalleled urban convenience with world-class shopping, dining, and entertainment options.',
  keyHighlights: [
    'Prime Orchard Road shopping district',
    'Excellent MRT connectivity (3 lines)',
    'Premium lifestyle amenities',
    'Strong rental demand from expatriates',
    'Prestigious address with capital appreciation potential'
  ],
  mapImage: 'placeholder-map-district-9.jpg',
  topCondos: [
    {
      rank: 1,
      name: 'The Orchard Residences',
      slug: 'the-orchard-residences',
      rating: 5,
      priceFrom: '$3.2M',
      pricePsf: '$2,400',
      completionYear: '2020',
      developer: 'Far East Organization',
      units: 108
    },
    {
      rank: 2,
      name: 'Orchard Sophia',
      slug: 'orchard-sophia',
      rating: 4.8,
      priceFrom: '$2.8M',
      pricePsf: '$2,200',
      completionYear: '2024',
      developer: 'Far East Organization',
      units: 299
    },
    {
      rank: 3,
      name: 'Boulevard Vue',
      slug: 'boulevard-vue',
      rating: 4.6,
      priceFrom: '$2.1M',
      pricePsf: '$1,950',
      completionYear: '2018',
      developer: 'Wheelock Properties',
      units: 154
    },
    {
      rank: 4,
      name: 'The Scotts Tower',
      slug: 'the-scotts-tower',
      rating: 4.5,
      priceFrom: '$4.5M',
      pricePsf: '$2,800',
      completionYear: '2016',
      developer: 'Far East Organization',
      units: 231
    },
    {
      rank: 5,
      name: '8 Claymore Hill',
      slug: '8-claymore-hill',
      rating: 4.4,
      priceFrom: '$2.9M',
      pricePsf: '$2,150',
      completionYear: '2019',
      developer: 'Wheelock Properties',
      units: 178
    },
    {
      rank: 6,
      name: 'Grange Residences',
      slug: 'grange-residences',
      rating: 4.3,
      priceFrom: '$1.8M',
      pricePsf: '$1,800',
      completionYear: '2017',
      developer: 'GuocolLand',
      units: 140
    },
    {
      rank: 7,
      name: 'The Marq',
      slug: 'the-marq',
      rating: 4.2,
      priceFrom: '$2.4M',
      pricePsf: '$2,000',
      completionYear: '2019',
      developer: 'Wheelock Properties',
      units: 168
    },
    {
      rank: 8,
      name: 'Cairnhill Nine',
      slug: 'cairnhill-nine',
      rating: 4.1,
      priceFrom: '$1.9M',
      pricePsf: '$1,850',
      completionYear: '2018',
      developer: 'UOL Group',
      units: 95
    },
    {
      rank: 9,
      name: 'Draycott Eight',
      slug: 'draycott-eight',
      rating: 4.0,
      priceFrom: '$2.2M',
      pricePsf: '$1,900',
      completionYear: '2016',
      developer: 'UOL Group',
      units: 154
    },
    {
      rank: 10,
      name: 'The Regent',
      slug: 'the-regent',
      rating: 3.9,
      priceFrom: '$1.7M',
      pricePsf: '$1,750',
      completionYear: '2015',
      developer: 'Keppel Land',
      units: 120
    }
  ],
  priceData: [
    {
      year: '2020',
      averagePrice: '$1,980',
      growth: '-2.1%'
    },
    {
      year: '2021',
      averagePrice: '$2,125',
      growth: '+7.3%'
    },
    {
      year: '2022',
      averagePrice: '$2,280',
      growth: '+7.3%'
    },
    {
      year: '2023',
      averagePrice: '$2,310',
      growth: '+1.3%'
    },
    {
      year: '2024',
      averagePrice: '$2,385',
      growth: '+3.2%'
    }
  ],
  amenities: [
    {
      name: 'Shopping Malls',
      count: 15,
      description: 'ION Orchard, Takashimaya, Paragon, and more',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      )
    },
    {
      name: 'Fine Dining',
      count: 50,
      description: 'Michelin-starred restaurants and celebrity chef outlets',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
        </svg>
      )
    },
    {
      name: 'Hotels',
      count: 25,
      description: 'Luxury international hotel chains',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    },
    {
      name: 'Medical Centers',
      count: 12,
      description: 'Mount Elizabeth Hospital and specialist clinics',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      )
    },
    {
      name: 'Entertainment',
      count: 8,
      description: 'Cinemas, KTV lounges, and nightlife venues',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-9 0a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2M9 10h6M9 14h6" />
        </svg>
      )
    },
    {
      name: 'Parks',
      count: 4,
      description: 'Fort Canning Park and Istana Park nearby',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      )
    }
  ],
  schools: [
    {
      name: 'Anglo-Chinese School (Primary)',
      type: 'Primary' as const,
      distance: '1.2km',
      rating: 5,
      description: 'Top-tier Methodist primary school with excellent academic results and strong character development programs.',
      website: 'https://acspri.moe.edu.sg'
    },
    {
      name: 'River Valley Primary School',
      type: 'Primary' as const,
      distance: '800m',
      rating: 4,
      description: 'Neighborhood primary school known for its nurturing environment and innovative teaching methods.',
      website: 'https://rivervalleypri.moe.edu.sg'
    },
    {
      name: 'Fort Canning Primary School',
      type: 'Primary' as const,
      distance: '1.5km',
      rating: 4,
      description: 'Established school with strong arts and music programs, located near Fort Canning Park.'
    },
    {
      name: 'River Valley High School',
      type: 'Secondary' as const,
      distance: '900m',
      rating: 5,
      description: 'Special Assistance Plan (SAP) school offering integrated program for academically gifted students.',
      website: 'https://rvhs.edu.sg'
    },
    {
      name: 'Singapore Management University',
      type: 'Special' as const,
      distance: '2km',
      rating: 5,
      description: 'Premier university located in the heart of the city, known for business and social sciences programs.',
      website: 'https://smu.edu.sg'
    },
    {
      name: 'Chatsworth International School',
      type: 'International' as const,
      distance: '1.8km',
      rating: 4,
      description: 'International Baccalaureate school serving expat families with comprehensive curriculum.',
      website: 'https://chatsworth.com.sg'
    }
  ],
  transportation: {
    mrtStations: [
      {
        name: 'Orchard',
        line: 'North-South',
        distance: '200m',
        walkingTime: '3 mins'
      },
      {
        name: 'Somerset',
        line: 'North-South',
        distance: '400m',
        walkingTime: '5 mins'
      },
      {
        name: 'Newton',
        line: 'Downtown',
        distance: '800m',
        walkingTime: '10 mins'
      },
      {
        name: 'Dhoby Ghaut',
        line: 'Circle',
        distance: '600m',
        walkingTime: '8 mins'
      }
    ],
    busServices: [
      {
        number: '7',
        description: 'Orchard Road - Marina Centre',
        frequency: '5-8 mins'
      },
      {
        number: '14',
        description: 'Orchard - Bedok Interchange',
        frequency: '8-12 mins'
      },
      {
        number: '36',
        description: 'Orchard - Changi Airport',
        frequency: '15-20 mins'
      },
      {
        number: '77',
        description: 'Orchard - Upper East Coast',
        frequency: '10-15 mins'
      },
      {
        number: '106',
        description: 'Orchard - Jurong East',
        frequency: '12-18 mins'
      },
      {
        number: '124',
        description: 'Orchard - Upp Thomson',
        frequency: '15-20 mins'
      }
    ],
    highways: ['CTE (Central Expressway)', 'PIE (Pan Island Expressway)', 'ECP (East Coast Parkway)']
  },
  investment: {
    pros: [
      {
        title: 'Premier Location',
        description: 'Orchard Road is synonymous with luxury and prestige, commanding premium prices and strong rental yields from expatriate executives and tourists.'
      },
      {
        title: 'Excellent Transport Connectivity',
        description: 'Multiple MRT lines converge in the area, providing unparalleled accessibility to all parts of Singapore and enhancing property values.'
      },
      {
        title: 'Tourism & Retail Hub',
        description: 'Constant tourist traffic and shopping activity ensures sustained demand for both residential and commercial properties in the area.'
      },
      {
        title: 'Limited Supply',
        description: 'Very few new residential developments due to land scarcity, ensuring existing properties maintain their exclusivity and value.'
      },
      {
        title: 'Lifestyle Premium',
        description: 'Residents enjoy world-class shopping, dining, and entertainment within walking distance, justifying premium property prices.'
      }
    ],
    cons: [
      {
        title: 'High Entry Costs',
        description: 'Property prices are among the highest in Singapore, limiting affordability and requiring substantial capital investment.'
      },
      {
        title: 'Traffic Congestion',
        description: 'Heavy tourist and shopping traffic can cause congestion, especially during weekends and holiday periods.'
      },
      {
        title: 'Noise & Crowds',
        description: 'The bustling retail environment may not suit those seeking quiet residential living, especially properties facing main roads.'
      },
      {
        title: 'ABSD Impact',
        description: 'High property values make Additional Buyer\'s Stamp Duty particularly costly for foreign buyers and multiple property owners.'
      },
      {
        title: 'Market Volatility',
        description: 'Luxury property segment can be more volatile during economic downturns, affecting both capital values and rental rates.'
      }
    ],
    overallRating: 8.5,
    rentalYieldRange: '2.5% - 3.2%',
    capitalGrowthProjection: '+4-6% annually'
  }
}

export default function SampleDistrictGuide() {
  return <DistrictGuideTemplate data={sampleDistrictData} />
}