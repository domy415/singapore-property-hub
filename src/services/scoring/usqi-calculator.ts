import { DQICalculator, DQIInput, DQIResult } from './dqi-calculator'

export interface USQIInput extends DQIInput {
  // Unit-specific characteristics
  unitSize: number // in sqft
  unitType: '1BR' | '2BR' | '3BR' | '4BR' | 'PENTHOUSE' | 'STUDIO'
  floorLevel: number
  viewType: 'SEA' | 'CITY' | 'PARK' | 'WATER' | 'POOL' | 'NEUTRAL' | 'BLOCKED'
  unitPosition: 'CORNER' | 'END' | 'REGULAR_GOOD' | 'REGULAR_AVG' | 'POOR'
  facing?: string // North, South, East, West, etc.
}

export interface USQIResult extends Omit<DQIResult, 'breakdown'> {
  breakdown: {
    locationConnectivity: number // out of 35
    unitCharacteristics: number // out of 20 (replaces developmentCharacteristics)
    investmentPerformance: number // out of 15
    constructionQuality: number // out of 10
    facilities: number // out of 10
    sustainability: number // out of 5
    marketPosition: number // out of 5
  }
  unitSpecificInsights: string[]
}

export class USQICalculator extends DQICalculator {
  calculateUSQI(input: USQIInput): USQIResult {
    // Get base DQI scores (except development characteristics)
    const dqiResult = super.calculate(input)
    
    // Replace development characteristics with unit-specific characteristics
    const unitCharacteristics = this.calculateUnitCharacteristics(input)
    
    const breakdown = {
      ...dqiResult.breakdown,
      unitCharacteristics // This replaces developmentCharacteristics
    }
    
    // Recalculate total with unit characteristics
    const totalScore = 
      breakdown.locationConnectivity +
      breakdown.unitCharacteristics +
      breakdown.investmentPerformance +
      breakdown.constructionQuality +
      breakdown.facilities +
      breakdown.sustainability +
      breakdown.marketPosition

    const unitInsights = this.generateUnitInsights(input, breakdown)

    return {
      totalScore,
      breakdown,
      grade: this.getGrade(totalScore),
      interpretation: this.getUSQIInterpretation(totalScore, breakdown, input),
      unitSpecificInsights: unitInsights
    }
  }

  private calculateUnitCharacteristics(input: USQIInput): number {
    let score = 0

    // Unit Size & Layout (8 points)
    score += this.calculateUnitSizeScore(input.unitSize, input.unitType)

    // Floor Level (4 points)
    if (input.floorLevel > 20) score += 4
    else if (input.floorLevel >= 11) score += 3
    else if (input.floorLevel >= 6) score += 2
    else if (input.floorLevel >= 2) score += 1
    // Ground floor gets 0 points

    // View & Facing (4 points)
    switch (input.viewType) {
      case 'SEA':
      case 'CITY': score += 4; break
      case 'PARK':
      case 'WATER': score += 3; break
      case 'POOL': score += 2; break
      case 'NEUTRAL': score += 1; break
      case 'BLOCKED': score += 0; break
    }

    // Unit Position (4 points)
    switch (input.unitPosition) {
      case 'CORNER': score += 4; break
      case 'END': score += 3; break
      case 'REGULAR_GOOD': score += 2; break
      case 'REGULAR_AVG': score += 1; break
      case 'POOR': score += 0; break
    }

    return Math.min(score, 20)
  }

  private calculateUnitSizeScore(size: number, type: USQIInput['unitType']): number {
    // Optimal size ranges for each unit type
    const optimalRanges = {
      'STUDIO': { min: 300, ideal: 400, max: 500 },
      '1BR': { min: 450, ideal: 550, max: 650 },
      '2BR': { min: 650, ideal: 800, max: 950 },
      '3BR': { min: 900, ideal: 1100, max: 1300 },
      '4BR': { min: 1200, ideal: 1500, max: 1800 },
      'PENTHOUSE': { min: 2000, ideal: 3000, max: 4000 }
    }

    const range = optimalRanges[type]
    if (!range) return 4 // Default middle score

    if (size >= range.ideal * 0.9 && size <= range.ideal * 1.1) {
      return 8 // Perfect size
    } else if (size >= range.min && size <= range.max) {
      return 6 // Good size
    } else if (size < range.min && size >= range.min * 0.8) {
      return 4 // Slightly small
    } else if (size > range.max && size <= range.max * 1.2) {
      return 5 // Slightly large (some prefer this)
    } else {
      return 2 // Too small or too large
    }
  }

  private generateUnitInsights(input: USQIInput, breakdown: USQIResult['breakdown']): string[] {
    const insights: string[] = []

    // Floor level insights
    if (input.floorLevel > 20) {
      insights.push('High floor unit with excellent privacy and likely unblocked views')
    } else if (input.floorLevel < 5) {
      insights.push('Low floor may have noise concerns but offers convenience')
    }

    // View insights
    if (input.viewType === 'SEA' || input.viewType === 'CITY') {
      insights.push('Premium view commands higher rental yield and resale value')
    } else if (input.viewType === 'BLOCKED') {
      insights.push('Blocked view may impact resale value and rental appeal')
    }

    // Unit position insights
    if (input.unitPosition === 'CORNER') {
      insights.push('Corner unit offers better ventilation and privacy')
    } else if (input.unitPosition === 'POOR') {
      insights.push('Unit position may face noise or privacy issues')
    }

    // Size insights
    const sizeScore = this.calculateUnitSizeScore(input.unitSize, input.unitType)
    if (sizeScore >= 6) {
      insights.push('Unit size is optimal for its type, appealing to target buyers')
    } else if (sizeScore <= 3) {
      insights.push('Unit size may limit buyer pool or rental potential')
    }

    // Investment specific insights
    if (breakdown.investmentPerformance >= 12 && input.floorLevel > 10) {
      insights.push('Combination of high floor and strong development metrics makes this ideal for investment')
    }

    return insights
  }

  private getUSQIInterpretation(
    totalScore: number, 
    breakdown: USQIResult['breakdown'],
    input: USQIInput
  ): string {
    const grade = this.getGrade(totalScore)
    let interpretation = `With a USQI score of ${totalScore}/100, this ${input.unitType} unit is rated as "${grade}". `

    // Unit-specific commentary
    interpretation += `This ${this.getFloorDescription(input.floorLevel)} ${input.unitType} unit `
    
    if (input.viewType === 'SEA' || input.viewType === 'CITY') {
      interpretation += 'with premium views '
    } else if (input.viewType === 'PARK' || input.viewType === 'WATER') {
      interpretation += 'with pleasant views '
    }

    interpretation += `scores ${breakdown.unitCharacteristics}/20 for unit-specific attributes. `

    // Add specific recommendations
    if (totalScore >= 70 && breakdown.unitCharacteristics >= 16) {
      interpretation += 'This is a premium unit that should command above-average prices and strong rental demand. '
    } else if (totalScore >= 55 && breakdown.unitCharacteristics >= 12) {
      interpretation += 'A solid unit choice balancing location benefits with decent unit attributes. '
    } else if (breakdown.unitCharacteristics < 10) {
      interpretation += 'Unit-specific limitations may affect marketability despite development strengths. '
    }

    return interpretation
  }

  private getFloorDescription(floor: number): string {
    if (floor > 30) return 'ultra-high floor'
    if (floor > 20) return 'high floor'
    if (floor > 10) return 'mid-high floor'
    if (floor > 5) return 'mid floor'
    if (floor > 1) return 'low floor'
    return 'ground floor'
  }

}