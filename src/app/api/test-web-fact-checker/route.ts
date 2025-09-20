import { NextRequest, NextResponse } from 'next/server';
import { WebFactChecker } from '../../../../agents/agent-fact-checker-web';

export async function GET(request: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { 
          error: 'OPENAI_API_KEY not configured',
          message: 'OpenAI API key is required for web fact-checking'
        },
        { status: 500 }
      );
    }

    const factChecker = new WebFactChecker();

    // Test article with various claims to verify
    const testArticle = `
    Singapore Property Market Outlook 2025: Expert Analysis

    The Singapore property market continues to evolve with significant regulatory changes. 
    The Additional Buyer's Stamp Duty (ABSD) rates remain at 30% for Singapore citizens 
    purchasing their second property, while foreigners face a hefty 60% ABSD on any 
    residential property purchase.

    For loan limits, the Loan-to-Value (LTV) ratio stands at 75% for first-time buyers 
    with no outstanding property loans. Second property purchases are limited to a 45% LTV, 
    while third and subsequent properties can only secure 35% LTV from banks.

    District 12, encompassing areas like Toa Payoh and Serangoon, continues to be a 
    popular choice for HDB upgraders. The district has seen steady price appreciation 
    of about 5% year-on-year, with new launches like The Myst commanding prices from 
    $1,850 PSF.

    Recent cooling measures introduced in April 2023 have helped moderate price growth, 
    though the market remains resilient. The Total Debt Servicing Ratio (TDSR) framework 
    continues to cap borrowing at 55% of gross monthly income.

    Looking ahead to Q3 2025, analysts expect the property price index to show modest 
    growth of 2-3%, supported by limited new supply and steady demand from upgraders. 
    The government's commitment to maintaining a stable property market through calibrated 
    measures provides confidence for long-term investors.
    `;

    const testTitle = "Singapore Property Market Outlook 2025: Expert Analysis";

    console.log('Testing OpenAI web fact-checker with web search...');
    const result = await factChecker.checkArticle(testArticle, testTitle);

    return NextResponse.json({
      success: true,
      message: 'OpenAI web fact-checker test completed',
      result,
      webSearchEnabled: process.env.USE_WEB_FACT_CHECKER === 'true',
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Test failed:', error);
    return NextResponse.json(
      { 
        error: 'Test failed', 
        message: error?.message || 'Unknown error',
        stack: process.env.NODE_ENV === 'development' ? error?.stack : undefined
      },
      { status: 500 }
    );
  }
}