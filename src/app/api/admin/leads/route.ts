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
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    const category = searchParams.get('category') // HOT, WARM, COLD
    const search = searchParams.get('search')

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    
    if (category && ['HOT', 'WARM', 'COLD'].includes(category)) {
      where.category = category
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Build order by clause
    const orderBy: any = {}
    if (sortBy === 'score') {
      orderBy.leadScore = sortOrder
    } else if (sortBy === 'name') {
      orderBy.name = sortOrder
    } else if (sortBy === 'email') {
      orderBy.email = sortOrder
    } else {
      orderBy.createdAt = sortOrder
    }

    // Fetch leads with pagination
    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          message: true,
          source: true,
          status: true,
          createdAt: true,
          updatedAt: true
        }
      }),
      prisma.lead.count({ where })
    ])

    // Get statistics
    const stats = await prisma.lead.groupBy({
      by: ['status'],
      _count: {
        status: true
      }
    })

    const statusStats = {
      NEW: stats.find((s: any) => s.status === 'NEW')?._count.status || 0,
      CONTACTED: stats.find((s: any) => s.status === 'CONTACTED')?._count.status || 0,
      QUALIFIED: stats.find((s: any) => s.status === 'QUALIFIED')?._count.status || 0,
      CONVERTED: stats.find((s: any) => s.status === 'CONVERTED')?._count.status || 0,
      LOST: stats.find((s: any) => s.status === 'LOST')?._count.status || 0,
      TOTAL: total
    }

    // No lead score field available in current schema
    const avgScoreResult = null

    return NextResponse.json({
      success: true,
      data: {
        leads,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        },
        stats: {
          ...statusStats,
          averageScore: 0
        }
      }
    })
  } catch (error) {
    console.error('Error fetching leads:', error)
    return NextResponse.json(
      { error: 'Failed to fetch leads' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
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
    const leadId = searchParams.get('id')

    if (!leadId) {
      return NextResponse.json(
        { error: 'Lead ID is required' },
        { status: 400 }
      )
    }

    await prisma.lead.delete({
      where: { id: leadId }
    })

    return NextResponse.json({
      success: true,
      message: 'Lead deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting lead:', error)
    return NextResponse.json(
      { error: 'Failed to delete lead' },
      { status: 500 }
    )
  }
}