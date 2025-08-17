import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    // Safety check - only allow in development or with proper authorization
    const authHeader = request.headers.get('authorization')
    const isAuthorized = authHeader === `Bearer ${process.env.ADMIN_SECRET || 'singapore-property-admin-2024'}`
    
    if (!isAuthorized && process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { action } = await request.json()

    let result = { message: '', deletedCount: 0 }

    switch (action) {
      case 'clear-sample-properties':
        // Delete all properties (assuming they're all sample data initially)
        const deletedProperties = await prisma.property.deleteMany({})
        result = {
          message: 'Sample properties cleared',
          deletedCount: deletedProperties.count
        }
        break

      case 'clear-sample-agents':
        // Delete agents with sample emails
        const deletedAgents = await prisma.agent.deleteMany({
          where: {
            OR: [
              { email: { contains: 'example.com' } },
              { email: { contains: 'sample.com' } },
              { email: { contains: 'test.com' } },
            ]
          }
        })
        result = {
          message: 'Sample agents cleared',
          deletedCount: deletedAgents.count
        }
        break

      case 'clear-test-leads':
        // Delete test leads
        const deletedLeads = await prisma.lead.deleteMany({
          where: {
            OR: [
              { name: 'Test User' },
              { email: { contains: 'test@' } },
              { email: { contains: 'example.com' } },
            ]
          }
        })
        result = {
          message: 'Test leads cleared',
          deletedCount: deletedLeads.count
        }
        break

      case 'initialize-real-author':
        // Create a real author to replace the default one
        const realAuthor = await prisma.author.upsert({
          where: { email: 'admin@singaporepropertyhub.sg' },
          update: {},
          create: {
            name: 'Singapore Property Hub Team',
            email: 'admin@singaporepropertyhub.sg',
            bio: 'Professional property analysts and market experts providing insights into Singapore\'s real estate market.',
          }
        })
        result = {
          message: 'Real author initialized',
          deletedCount: 0,
          authorId: realAuthor.id
        }
        break

      case 'clear-all-sample-data':
        // Clear all sample data in sequence
        await prisma.propertyImage.deleteMany({})
        await prisma.property.deleteMany({})
        const deletedSampleAgents = await prisma.agent.deleteMany({
          where: {
            OR: [
              { email: { contains: 'example.com' } },
              { email: { contains: 'sample.com' } },
              { email: { contains: 'test.com' } },
            ]
          }
        })
        const deletedTestLeads = await prisma.lead.deleteMany({
          where: {
            OR: [
              { name: 'Test User' },
              { email: { contains: 'test@' } },
              { email: { contains: 'example.com' } },
            ]
          }
        })
        
        result = {
          message: 'All sample data cleared',
          deletedCount: deletedSampleAgents.count + deletedTestLeads.count
        }
        break

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        )
    }

    console.log(`Cleanup completed: ${result.message}`)

    return NextResponse.json({
      success: true,
      ...result,
      timestamp: new Date().toISOString()
    })
  } catch (error: any) {
    console.error('Cleanup failed:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Cleanup failed',
        details: error.message 
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Cleanup endpoint available',
    actions: [
      'clear-sample-properties',
      'clear-sample-agents', 
      'clear-test-leads',
      'initialize-real-author',
      'clear-all-sample-data'
    ]
  })
}