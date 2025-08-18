export interface SingaporeDistrict {
  code: string
  name: string
  areas: string[]
  region: 'CCR' | 'RCR' | 'OCR' // Core Central Region, Rest of Central Region, Outside Central Region
  postalCodes: string[]
}

export const SINGAPORE_DISTRICTS: SingaporeDistrict[] = [
  // Core Central Region (CCR)
  {
    code: 'D01',
    name: 'District 01',
    areas: ['Raffles Place', 'Cecil', 'Marina', "People's Park"],
    region: 'CCR',
    postalCodes: ['01', '02', '03', '04', '05', '06']
  },
  {
    code: 'D02',
    name: 'District 02',
    areas: ['Anson Road', 'Tanjong Pagar'],
    region: 'CCR',
    postalCodes: ['07', '08']
  },
  {
    code: 'D03',
    name: 'District 03',
    areas: ['Bukit Merah', 'Queenstown', 'Tiong Bahru'],
    region: 'RCR',
    postalCodes: ['14', '15', '16']
  },
  {
    code: 'D04',
    name: 'District 04',
    areas: ['Telok Blangah', 'HarbourFront'],
    region: 'RCR',
    postalCodes: ['09', '10']
  },
  {
    code: 'D05',
    name: 'District 05',
    areas: ['Pasir Panjang', 'Hong Leong Garden', 'Clementi New Town'],
    region: 'RCR',
    postalCodes: ['11', '12', '13']
  },
  {
    code: 'D06',
    name: 'District 06',
    areas: ['High Street', 'Beach Road'],
    region: 'CCR',
    postalCodes: ['17']
  },
  {
    code: 'D07',
    name: 'District 07',
    areas: ['Middle Road', 'Golden Mile'],
    region: 'CCR',
    postalCodes: ['18', '19']
  },
  {
    code: 'D08',
    name: 'District 08',
    areas: ['Little India', 'Farrer Park'],
    region: 'CCR',
    postalCodes: ['20', '21']
  },
  {
    code: 'D09',
    name: 'District 09',
    areas: ['Orchard', 'Cairnhill', 'River Valley'],
    region: 'CCR',
    postalCodes: ['22', '23']
  },
  {
    code: 'D10',
    name: 'District 10',
    areas: ['Ardmore', 'Bukit Timah', 'Holland Road', 'Tanglin'],
    region: 'CCR',
    postalCodes: ['24', '25', '26', '27']
  },
  {
    code: 'D11',
    name: 'District 11',
    areas: ['Watten Estate', 'Novena', 'Thomson'],
    region: 'CCR',
    postalCodes: ['28', '29', '30']
  },
  
  // Rest of Central Region (RCR)
  {
    code: 'D12',
    name: 'District 12',
    areas: ['Balestier', 'Toa Payoh', 'Serangoon'],
    region: 'RCR',
    postalCodes: ['31', '32', '33']
  },
  {
    code: 'D13',
    name: 'District 13',
    areas: ['Macpherson', 'Braddell', 'Potong Pasir'],
    region: 'RCR',
    postalCodes: ['34', '35', '36', '37']
  },
  {
    code: 'D14',
    name: 'District 14',
    areas: ['Geylang', 'Eunos', 'Aljunied'],
    region: 'RCR',
    postalCodes: ['38', '39', '40', '41']
  },
  {
    code: 'D15',
    name: 'District 15',
    areas: ['Katong', 'Joo Chiat', 'Amber Road'],
    region: 'RCR',
    postalCodes: ['42', '43', '44', '45']
  },
  {
    code: 'D16',
    name: 'District 16',
    areas: ['Bedok', 'Upper East Coast', 'Eastwood', 'Kew Drive'],
    region: 'RCR',
    postalCodes: ['46', '47', '48']
  },
  {
    code: 'D17',
    name: 'District 17',
    areas: ['Loyang', 'Changi'],
    region: 'RCR',
    postalCodes: ['49', '50', '81']
  },
  {
    code: 'D18',
    name: 'District 18',
    areas: ['Tampines', 'Pasir Ris'],
    region: 'RCR',
    postalCodes: ['51', '52']
  },
  {
    code: 'D19',
    name: 'District 19',
    areas: ['Serangoon Garden', 'Hougang', 'Punggol'],
    region: 'RCR',
    postalCodes: ['53', '54', '55', '82']
  },
  {
    code: 'D20',
    name: 'District 20',
    areas: ['Bishan', 'Ang Mo Kio'],
    region: 'RCR',
    postalCodes: ['56', '57']
  },
  {
    code: 'D21',
    name: 'District 21',
    areas: ['Upper Bukit Timah', 'Clementi Park', 'Ulu Pandan'],
    region: 'RCR',
    postalCodes: ['58', '59']
  },
  
  // Outside Central Region (OCR)
  {
    code: 'D22',
    name: 'District 22',
    areas: ['Jurong', 'Tuas'],
    region: 'OCR',
    postalCodes: ['60', '61', '62', '63', '64']
  },
  {
    code: 'D23',
    name: 'District 23',
    areas: ['Hillview', 'Dairy Farm', 'Bukit Panjang', 'Choa Chu Kang'],
    region: 'OCR',
    postalCodes: ['65', '66', '67', '68']
  },
  {
    code: 'D24',
    name: 'District 24',
    areas: ['Lim Chu Kang', 'Tengah'],
    region: 'OCR',
    postalCodes: ['69', '70', '71']
  },
  {
    code: 'D25',
    name: 'District 25',
    areas: ['Kranji', 'Woodlands'],
    region: 'OCR',
    postalCodes: ['72', '73']
  },
  {
    code: 'D26',
    name: 'District 26',
    areas: ['Upper Thomson', 'Springleaf'],
    region: 'OCR',
    postalCodes: ['77', '78']
  },
  {
    code: 'D27',
    name: 'District 27',
    areas: ['Yishun', 'Sembawang'],
    region: 'OCR',
    postalCodes: ['75', '76']
  },
  {
    code: 'D28',
    name: 'District 28',
    areas: ['Seletar', 'Sengkang'],
    region: 'OCR',
    postalCodes: ['79', '80']
  }
]

// Helper functions
export const getDistrictByCode = (code: string): SingaporeDistrict | undefined => {
  return SINGAPORE_DISTRICTS.find(district => district.code === code)
}

export const getDistrictsByRegion = (region: 'CCR' | 'RCR' | 'OCR'): SingaporeDistrict[] => {
  return SINGAPORE_DISTRICTS.filter(district => district.region === region)
}

export const searchDistrictsByArea = (areaName: string): SingaporeDistrict[] => {
  const searchTerm = areaName.toLowerCase()
  return SINGAPORE_DISTRICTS.filter(district => 
    district.areas.some(area => area.toLowerCase().includes(searchTerm))
  )
}

export const getAllDistrictOptions = () => {
  return SINGAPORE_DISTRICTS.map(district => ({
    value: district.code,
    label: `${district.code} - ${district.areas.join(', ')}`,
    region: district.region
  }))
}