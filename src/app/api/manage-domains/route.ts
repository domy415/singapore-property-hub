import { NextRequest, NextResponse } from 'next/server'
import { developerDomainManager } from '@/services/developer-domain-manager'

/**
 * API endpoint for managing developer domain whitelisting
 * GET: Validate current domains
 * POST: Auto-update domains from condo data
 */

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action') || 'validate'

    switch (action) {
      case 'validate':
        const validation = await developerDomainManager.validateDomainWhitelist()
        return NextResponse.json({
          success: true,
          action: 'validate',
          data: validation
        })

      case 'extract':
        const extraction = await developerDomainManager.extractDomainsFromCondoData()
        return NextResponse.json({
          success: true,
          action: 'extract',
          data: extraction
        })

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action. Use: validate, extract'
        }, { status: 400 })
    }

  } catch (error) {
    console.error('Domain management API error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json().catch(() => ({ action: 'auto-update' }))

    switch (action) {
      case 'auto-update':
        const result = await developerDomainManager.autoUpdateDomains()
        
        return NextResponse.json({
          success: true,
          action: 'auto-update',
          data: result,
          message: `Added ${result.update.added.length} new domains to Next.js config`
        })

      case 'update-specific':
        const { domains } = await request.json()
        if (!Array.isArray(domains)) {
          return NextResponse.json({
            success: false,
            error: 'domains must be an array of strings'
          }, { status: 400 })
        }

        const updateResult = await developerDomainManager.updateNextConfig(domains)
        
        return NextResponse.json({
          success: true,
          action: 'update-specific',
          data: updateResult
        })

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action. Use: auto-update, update-specific'
        }, { status: 400 })
    }

  } catch (error) {
    console.error('Domain management API error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}