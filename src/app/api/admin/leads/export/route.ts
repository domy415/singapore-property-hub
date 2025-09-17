import { NextRequest, NextResponse } from 'next/server'
import { requireAdminAuth } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  // Check authentication
  const authResult = await requireAdminAuth()
  if (!authResult.authenticated) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    // Build where clause
    const where: any = {}
    
    if (category && ['NEW', 'CONTACTED', 'QUALIFIED', 'CONVERTED', 'LOST'].includes(category)) {
      where.status = category
    }
    
    if (startDate || endDate) {
      where.createdAt = {}
      if (startDate) {
        where.createdAt.gte = new Date(startDate)
      }
      if (endDate) {
        where.createdAt.lte = new Date(endDate + 'T23:59:59.999Z')
      }
    }

    // Fetch all leads matching criteria
    const leads = await prisma.lead.findMany({
      where,
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        name: true,
        email: true,
        phone: true,
        message: true,
        source: true,
        status: true,
        createdAt: true
      }
    })

    // Convert to CSV format
    const csvHeaders = [
      'Name',
      'Email',
      'Phone',
      'Message',
      'Source',
      'Status',
      'Date Created'
    ].join(',')

    const csvRows = leads.map((lead: any) => [
      `"${lead.name || ''}"`,
      `"${lead.email || ''}"`,
      `"${lead.phone || ''}"`,
      `"${lead.message || ''}"`,
      `"${lead.source || ''}"`,
      `"${lead.status || ''}"`,
      `"${lead.createdAt.toISOString().split('T')[0]}"`
    ].join(','))

    const csvContent = [csvHeaders, ...csvRows].join('\n')

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().split('T')[0]
    const filename = `singapore-property-hub-leads-${timestamp}.csv`

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-cache'
      }
    })
  } catch (error) {
    console.error('Error exporting leads:', error)
    return NextResponse.json(
      { error: 'Failed to export leads' },
      { status: 500 }
    )
  }
}