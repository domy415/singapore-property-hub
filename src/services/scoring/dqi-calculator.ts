import { DeveloperTier, GreenMarkLevel } from '@prisma/client'

export interface DQIInput {
  // Location
  district: number
  mrtDistance: number // in meters
  schoolProximity: {
    elite1km: boolean
    good1km: boolean
    elite2km: boolean
    good2km: boolean
  }
  amenitiesScore?: number // 0-5, calculated externally

  // Development Characteristics
  totalUnits: number
  propertyAge: number // in years
  tenure: string // "Freehold", "99-year", etc.
  remainingLease?: number // for leasehold
  unitMixStrategy?: {
    oneBed: number
    twoBed: number
    threeBed: number
    fourBed: number
    penthouse: number
  }

  // Investment Performance
  historicalReturns?: number // percentage
  rentalYield?: number // percentage
  transactionVolume?: number // last 12 months

  // Construction Quality
  conquasScore?: number
  developerTier?: DeveloperTier

  // Facilities
  facilitiesCount: number
  facilitiesQuality?: number // 1-4 rating

  // Sustainability
  greenMarkLevel?: GreenMarkLevel

  // Market Position
  currentPsf: number
  districtAvgPsf: number
  hasAwards?: boolean
}

export interface DQIResult {
  totalScore: number
  breakdown: {
    locationConnectivity: number // out of 35
    developmentCharacteristics: number // out of 20
    investmentPerformance: number // out of 15
    constructionQuality: number // out of 10
    facilities: number // out of 10
    sustainability: number // out of 5
    marketPosition: number // out of 5
  }
  grade: 'Premium Investment Grade' | 'Strong Buy' | 'Good Value' | 'Fair Value' | 'Caution Advised'
  interpretation: string
}

export class DQICalculator {
  calculate(input: DQIInput): DQIResult {
    const breakdown = {
      locationConnectivity: this.calculateLocationScore(input),
      developmentCharacteristics: this.calculateDevelopmentScore(input),
      investmentPerformance: this.calculateInvestmentScore(input),
      constructionQuality: this.calculateQualityScore(input),
      facilities: this.calculateFacilitiesScore(input),
      sustainability: this.calculateSustainabilityScore(input),
      marketPosition: this.calculateMarketScore(input)
    }

    const totalScore = Object.values(breakdown).reduce((sum, score) => sum + score, 0)

    return {
      totalScore,
      breakdown,
      grade: this.getGrade(totalScore),
      interpretation: this.getInterpretation(totalScore, breakdown)
    }
  }

  private calculateLocationScore(input: DQIInput): number {
    let score = 0

    // MRT Proximity (15 points)
    if (input.mrtDistance <= 200) score += 15
    else if (input.mrtDistance <= 400) score += 12
    else if (input.mrtDistance <= 600) score += 9
    else if (input.mrtDistance <= 800) score += 6
    else if (input.mrtDistance <= 1000) score += 3
    // else 0 points

    // Regional Position (10 points)
    const ccrPrime = [9, 10, 11]
    const ccrSecondary = [1, 2, 6]
    const rcr = [3, 4, 5, 7, 8, 12, 13, 14, 15, 20]
    
    if (ccrPrime.includes(input.district)) score += 10
    else if (ccrSecondary.includes(input.district)) score += 8
    else if (rcr.includes(input.district)) score += 9
    else if ([16, 17, 18, 19].includes(input.district)) score += 7 // OCR growth
    else score += 6 // OCR mature

    // School Proximity (5 points)
    const { elite1km, good1km, elite2km, good2km } = input.schoolProximity
    if (elite1km) score += 5
    else if (good1km) score += 4
    else if (elite2km) score += 3
    else if (good2km) score += 2
    // else 0 points

    // Amenities (5 points)
    score += input.amenitiesScore || 0

    return Math.min(score, 35) // Cap at maximum
  }

  private calculateDevelopmentScore(input: DQIInput): number {
    let score = 0

    // Unit Mix Strategy (8 points)
    if (input.unitMixStrategy) {
      const total = Object.values(input.unitMixStrategy).reduce((sum, count) => sum + count, 0)
      const diversity = Object.values(input.unitMixStrategy).filter(count => count > 0).length
      
      // Good mix has diversity
      if (diversity >= 4) score += 8
      else if (diversity >= 3) score += 6
      else if (diversity >= 2) score += 4
      else score += 2
    } else {
      score += 4 // Default if not provided
    }

    // Property Age (6 points)
    if (input.propertyAge <= 5) score += 6
    else if (input.propertyAge <= 15) score += 5
    else if (input.propertyAge <= 30) score += 3
    else if (input.propertyAge <= 50) score += 2
    // else 0 points

    // Tenure (6 points)
    if (input.tenure === 'Freehold') {
      score += 6
    } else if (input.tenure.includes('99')) {
      const remaining = input.remainingLease || (99 - input.propertyAge)
      if (remaining >= 90) score += 5
      else if (remaining >= 70) score += 3
      else if (remaining >= 50) score += 2
      // else 0 points
    }

    return Math.min(score, 20)
  }

  private calculateInvestmentScore(input: DQIInput): number {
    let score = 0

    // Historical Returns (6 points)
    if (input.historicalReturns !== undefined) {
      if (input.historicalReturns >= 8) score += 6
      else if (input.historicalReturns >= 6) score += 5
      else if (input.historicalReturns >= 4) score += 4
      else if (input.historicalReturns >= 2) score += 3
      else if (input.historicalReturns >= 0) score += 2
      else score += 1
    } else {
      score += 3 // Default if not available
    }

    // Rental Yield (5 points)
    if (input.rentalYield !== undefined) {
      if (input.rentalYield > 4) score += 5
      else if (input.rentalYield >= 3.5) score += 4
      else if (input.rentalYield >= 3) score += 3
      else if (input.rentalYield >= 2.5) score += 2
      else score += 1
    } else {
      score += 2.5 // Default
    }

    // Transaction Volume (4 points)
    if (input.transactionVolume !== undefined) {
      if (input.transactionVolume >= 100) score += 4
      else if (input.transactionVolume >= 50) score += 3
      else if (input.transactionVolume >= 20) score += 2
      else if (input.transactionVolume >= 10) score += 1
      // else 0 points
    } else {
      score += 2 // Default
    }

    return Math.min(score, 15)
  }

  private calculateQualityScore(input: DQIInput): number {
    let score = 0

    // CONQUAS Score (5 points)
    if (input.conquasScore !== undefined) {
      if (input.conquasScore >= 95) score += 5
      else if (input.conquasScore >= 90) score += 4
      else if (input.conquasScore >= 85) score += 3
      else if (input.conquasScore >= 80) score += 2
      else score += 1
    } else {
      score += 2.5 // Default
    }

    // Developer Tier (5 points)
    switch (input.developerTier) {
      case 'TIER_1': score += 5; break
      case 'ESTABLISHED': score += 4; break
      case 'MID_TIER': score += 3; break
      case 'NEW': score += 2; break
      case 'UNKNOWN': 
      default: score += 0; break
    }

    return Math.min(score, 10)
  }

  private calculateFacilitiesScore(input: DQIInput): number {
    let score = 0

    // Comprehensiveness (6 points)
    if (input.facilitiesCount >= 50) score += 6
    else if (input.facilitiesCount >= 30) score += 5
    else if (input.facilitiesCount >= 20) score += 4
    else if (input.facilitiesCount >= 10) score += 3
    else score += 1

    // Quality (4 points)
    if (input.facilitiesQuality !== undefined) {
      score += input.facilitiesQuality
    } else {
      // Default based on property age
      if (input.propertyAge <= 5) score += 3
      else if (input.propertyAge <= 10) score += 2
      else score += 1
    }

    return Math.min(score, 10)
  }

  private calculateSustainabilityScore(input: DQIInput): number {
    switch (input.greenMarkLevel) {
      case 'PLATINUM': return 5
      case 'GOLDPLUS': return 4
      case 'GOLD': return 3
      case 'CERTIFIED': return 2
      case 'NONE':
      default: return 0
    }
  }

  private calculateMarketScore(input: DQIInput): number {
    let score = 0

    // Pricing vs Market (3 points)
    const pricingRatio = input.currentPsf / input.districtAvgPsf
    if (pricingRatio <= 0.9) score += 3 // Undervalued
    else if (pricingRatio <= 1.0) score += 2 // Fair value
    else if (pricingRatio <= 1.1) score += 1 // Slightly premium
    // else 0 points for overpriced

    // Awards/Recognition (2 points)
    if (input.hasAwards) score += 2

    return Math.min(score, 5)
  }

  private getGrade(totalScore: number): DQIResult['grade'] {
    if (totalScore >= 85) return 'Premium Investment Grade'
    if (totalScore >= 70) return 'Strong Buy'
    if (totalScore >= 55) return 'Good Value'
    if (totalScore >= 40) return 'Fair Value'
    return 'Caution Advised'
  }

  private getInterpretation(totalScore: number, breakdown: DQIResult['breakdown']): string {
    const grade = this.getGrade(totalScore)
    const strengths = []
    const weaknesses = []

    // Identify strengths and weaknesses
    if (breakdown.locationConnectivity >= 28) strengths.push('Excellent location and connectivity')
    else if (breakdown.locationConnectivity <= 17) weaknesses.push('Location challenges')

    if (breakdown.investmentPerformance >= 12) strengths.push('Strong investment metrics')
    else if (breakdown.investmentPerformance <= 7) weaknesses.push('Weak investment performance')

    if (breakdown.facilities >= 8) strengths.push('Comprehensive facilities')
    else if (breakdown.facilities <= 5) weaknesses.push('Limited facilities')

    let interpretation = `With a DQI score of ${totalScore}/100, this development is rated as "${grade}". `
    
    if (strengths.length > 0) {
      interpretation += `Key strengths include: ${strengths.join(', ')}. `
    }
    
    if (weaknesses.length > 0) {
      interpretation += `Areas of concern: ${weaknesses.join(', ')}. `
    }

    // Add recommendation based on grade
    switch (grade) {
      case 'Premium Investment Grade':
        interpretation += 'This is a top-tier development suitable for both investment and own-stay.'
        break
      case 'Strong Buy':
        interpretation += 'This development offers excellent value with strong fundamentals.'
        break
      case 'Good Value':
        interpretation += 'A solid choice for buyers seeking balanced value and quality.'
        break
      case 'Fair Value':
        interpretation += 'Consider this development if it meets your specific needs and budget.'
        break
      case 'Caution Advised':
        interpretation += 'Careful evaluation recommended. Consider alternatives unless specific factors appeal to you.'
        break
    }

    return interpretation
  }
}