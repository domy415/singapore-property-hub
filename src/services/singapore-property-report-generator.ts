/**
 * Singapore Property Report Generator Agent - Creates professional HTML/PDF reports
 * This service interfaces with the singapore-property-report-generator agent via Task tool
 */

interface PropertyData {
  name: string
  district: number
  tenure: string
  totalUnits: number
  topYear: number
  averagePsf: number
  dqiScore?: number
  categoryScores?: {
    location: number
    development: number
    investment: number
    quality: number
    facilities: number
  }
  rentalYield?: number
  capitalAppreciation?: number
  occupancyRate?: number
  pricePsfVsDistrict?: number
  recentTransactions?: Array<{
    date: string
    unitType: string
    size: number
    floor: number
    price: number
    psf: number
    marketLevel: 'Above' | 'At' | 'Below'
  }>
  pros?: string[]
  cons?: string[]
  investmentSummary?: string
}

interface ReportGenerationResult {
  htmlReport: string
  reportType: 'property-analysis' | 'market-overview' | 'investment-report'
  success: boolean
  error?: string
}

export class AgentPropertyReportGenerator {
  
  async generatePropertyReport(
    propertyData: PropertyData,
    reportType: 'property-analysis' | 'market-overview' | 'investment-report' = 'property-analysis'
  ): Promise<ReportGenerationResult> {
    try {
      console.log(`Calling singapore-property-report-generator agent for: ${propertyData.name}`)
      
      // Prepare the detailed prompt for the report generator agent
      const agentPrompt = this.buildReportGenerationPrompt(propertyData, reportType)
      
      // Call the report generator agent using Task tool
      try {
        const agentResult = await this.callReportGeneratorAgent(agentPrompt)
        return this.parseAgentResponse(agentResult, reportType)
      } catch (agentError) {
        console.warn('Report generator agent call failed, using fallback generation:', agentError)
        // Return fallback report
        return this.generateFallbackReport(propertyData, reportType)
      }
      
    } catch (error) {
      console.error('Error in report generation:', error)
      throw new Error(`Report generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
  
  private buildReportGenerationPrompt(propertyData: PropertyData, reportType: string): string {
    const currentDate = new Date().toLocaleDateString('en-SG', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
    
    // Convert transactions to readable format
    const transactionsData = propertyData.recentTransactions?.map(t => ({
      ...t,
      formattedDate: new Date(t.date).toLocaleDateString('en-SG', { month: 'short', year: 'numeric' }),
      formattedPrice: `$${t.price.toLocaleString()}`,
      formattedPsf: `$${t.psf.toLocaleString()}`
    }))
    
    return `
# Property Report Generation Request

## Report Type: ${reportType}
## Generation Date: ${currentDate}

## Property Information
- **Name**: ${propertyData.name}
- **District**: ${propertyData.district}
- **Tenure**: ${propertyData.tenure}
- **Total Units**: ${propertyData.totalUnits}
- **TOP Year**: ${propertyData.topYear}
- **Average PSF**: $${propertyData.averagePsf}

## DQI Scoring (if available)
${propertyData.dqiScore ? `
- **Overall DQI Score**: ${propertyData.dqiScore}/100
- **Location**: ${propertyData.categoryScores?.location || 'N/A'}/100
- **Development**: ${propertyData.categoryScores?.development || 'N/A'}/100
- **Investment**: ${propertyData.categoryScores?.investment || 'N/A'}/100
- **Quality**: ${propertyData.categoryScores?.quality || 'N/A'}/100
- **Facilities**: ${propertyData.categoryScores?.facilities || 'N/A'}/100
` : 'DQI scoring not available'}

## Investment Metrics
- **Rental Yield**: ${propertyData.rentalYield ? `${propertyData.rentalYield}%` : 'N/A'}
- **Capital Appreciation**: ${propertyData.capitalAppreciation ? `${propertyData.capitalAppreciation}%` : 'N/A'}
- **Occupancy Rate**: ${propertyData.occupancyRate ? `${propertyData.occupancyRate}%` : 'N/A'}
- **Price PSF vs District**: ${propertyData.pricePsfVsDistrict ? `${propertyData.pricePsfVsDistrict > 0 ? '+' : ''}${propertyData.pricePsfVsDistrict}%` : 'N/A'}

## Recent Transactions
${transactionsData ? JSON.stringify(transactionsData, null, 2) : 'No recent transaction data'}

## Analysis
### Pros
${propertyData.pros ? propertyData.pros.join('\n') : 'Analysis pending'}

### Cons
${propertyData.cons ? propertyData.cons.join('\n') : 'Analysis pending'}

## Investment Summary
${propertyData.investmentSummary || 'Comprehensive investment analysis pending'}

## Report Requirements
Generate a professional HTML report following Singapore Property Hub Analytics standards:
- Self-contained HTML with inline CSS
- Professional gradient header (#1e40af to #3b82f6)
- Card-based layout with proper spacing
- Responsive design (1200px max width)
- Print-optimized with page breaks
- WCAG 2.1 Level AA compliant
- Email-client compatible

Include all sections as specified in the singapore-property-report-generator agent documentation.`
  }
  
  private async callReportGeneratorAgent(prompt: string): Promise<string> {
    // This method would use Claude's Task tool to call the singapore-property-report-generator agent
    // For now, throwing error to trigger fallback
    throw new Error('Property report generator agent ready for Task tool integration')
  }

  private parseAgentResponse(agentResult: string, reportType: string): ReportGenerationResult {
    try {
      // The agent should return HTML directly
      return {
        htmlReport: agentResult,
        reportType: reportType as any,
        success: true
      }
    } catch (error) {
      throw new Error(`Failed to parse agent response: ${error instanceof Error ? error.message : 'Invalid format'}`)
    }
  }
  
  private generateFallbackReport(propertyData: PropertyData, reportType: string): ReportGenerationResult {
    // Generate a basic HTML report as fallback
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${propertyData.name} - Property Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); color: white; padding: 30px; margin: -30px -30px 30px -30px; border-radius: 8px 8px 0 0; }
        h1 { margin: 0; font-size: 32px; }
        .subtitle { opacity: 0.9; margin-top: 10px; }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin: 30px 0; }
        .card { background: #f8f9fa; padding: 20px; border-radius: 8px; border: 1px solid #e9ecef; }
        .metric { font-size: 24px; font-weight: bold; color: #1e40af; }
        .label { color: #666; font-size: 14px; margin-bottom: 5px; }
        .section { margin: 30px 0; }
        .section-title { font-size: 20px; color: #333; margin-bottom: 15px; border-bottom: 2px solid #e9ecef; padding-bottom: 10px; }
        .list { list-style-type: none; padding: 0; }
        .list li { padding: 8px 0; padding-left: 20px; position: relative; }
        .list li:before { content: "✓"; position: absolute; left: 0; color: #16a34a; }
        .warning { background: #fef3c7; border: 1px solid #f59e0b; padding: 15peaceful; border-radius: 8px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>${propertyData.name}</h1>
            <div class="subtitle">Property Investment Report - Singapore Property Hub Analytics</div>
        </div>
        
        <div class="grid">
            <div class="card">
                <div class="label">District</div>
                <div class="metric">${propertyData.district}</div>
            </div>
            <div class="card">
                <div class="label">Average PSF</div>
                <div class="metric">$${propertyData.averagePsf.toLocaleString()}</div>
            </div>
            <div class="card">
                <div class="label">Total Units</div>
                <div class="metric">${propertyData.totalUnits}</div>
            </div>
            <div class="card">
                <div class="label">TOP Year</div>
                <div class="metric">${propertyData.topYear}</div>
            </div>
        </div>
        
        <div class="warning">
            <strong>Note:</strong> This is a fallback report. Full report generation service is temporarily unavailable.
        </div>
        
        <div class="section">
            <h2 class="section-title">Investment Summary</h2>
            <p>${propertyData.investmentSummary || 'Detailed investment analysis pending.'}</p>
        </div>
        
        <div class="section">
            <h2 class="section-title">Key Strengths</h2>
            <ul class="list">
                ${propertyData.pros?.map(pro => `<li>${pro}</li>`).join('') || '<li>Analysis pending</li>'}
            </ul>
        </div>
        
        <div class="section">
            <h2 class="section-title">Considerations</h2>
            <ul class="list">
                ${propertyData.cons?.map(con => `<li>${con}</li>`).join('') || '<li>Analysis pending</li>'}
            </ul>
        </div>
    </div>
</body>
</html>`
    
    return {
      htmlReport: html,
      reportType: reportType as any,
      success: false,
      error: 'Agent unavailable - fallback report generated'
    }
  }
  
  async generateArticleReport(
    articleTitle: string,
    articleContent: string,
    articleExcerpt: string,
    propertyScore?: any
  ): Promise<ReportGenerationResult> {
    // Convert article data to property data format for report generation
    const propertyData: PropertyData = {
      name: articleTitle,
      district: 0, // Will be extracted from content if available
      tenure: 'N/A',
      totalUnits: 0,
      topYear: new Date().getFullYear(),
      averagePsf: 0,
      investmentSummary: articleExcerpt
    }
    
    // If property score data is available, integrate it
    if (propertyScore) {
      propertyData.dqiScore = propertyScore.overallRating * 20 // Convert 5-star to 100 scale
      propertyData.pros = propertyScore.strengths
      propertyData.cons = propertyScore.concerns
      propertyData.rentalYield = parseFloat(propertyScore.investmentAnalysis?.rentalYield?.match(/[\d.]+/)?.[0] || '0')
    }
    
    return this.generatePropertyReport(propertyData, 'property-analysis')
  }
}