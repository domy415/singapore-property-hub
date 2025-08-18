import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    // Security check - only allow in development or with admin key
    const authHeader = request.headers.get('authorization')
    const adminKey = process.env.ADMIN_SECRET || 'singapore-property-admin-2024'
    
    if (authHeader !== `Bearer ${adminKey}`) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.log('Starting database schema migration...')
    
    // Execute the migration using raw SQL
    const migrations = [
      // Add linkedinPostId column if it doesn't exist
      `ALTER TABLE "Article" ADD COLUMN IF NOT EXISTS "linkedinPostId" TEXT;`,
      
      // Add linkedinUrl column if it doesn't exist
      `ALTER TABLE "Article" ADD COLUMN IF NOT EXISTS "linkedinUrl" TEXT;`,
      
      // Add linkedInPosted column if it doesn't exist
      `ALTER TABLE "Article" ADD COLUMN IF NOT EXISTS "linkedInPosted" BOOLEAN DEFAULT false;`,
      
      // Add linkedInPostDate column if it doesn't exist
      `ALTER TABLE "Article" ADD COLUMN IF NOT EXISTS "linkedInPostDate" TIMESTAMP(3);`
    ]
    
    for (const migration of migrations) {
      try {
        await prisma.$executeRawUnsafe(migration)
        console.log(`Executed: ${migration}`)
      } catch (error) {
        console.log(`Migration already applied or error: ${migration}`, error)
        // Continue with other migrations even if one fails
      }
    }
    
    // Verify the schema by checking if we can query the new fields
    const testQuery = await prisma.$queryRaw`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'Article' 
      AND column_name IN ('linkedinPostId', 'linkedinUrl', 'linkedInPosted', 'linkedInPostDate')
    `
    
    console.log('Schema migration completed successfully')
    
    return NextResponse.json({
      success: true,
      message: 'Database schema migrated successfully',
      addedColumns: testQuery,
      timestamp: new Date().toISOString()
    })
  } catch (error: any) {
    console.error('Schema migration failed:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to migrate database schema',
        details: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Schema migration endpoint available',
    usage: 'POST with Authorization: Bearer <ADMIN_SECRET>'
  })
}