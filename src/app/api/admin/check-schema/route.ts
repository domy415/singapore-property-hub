import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    console.log('Checking database schema...')
    
    // Check Article table columns
    const articleColumns = await prisma.$queryRaw`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'Article'
      ORDER BY ordinal_position
    `
    
    // Check if LinkedIn-related columns exist
    const linkedinColumns = await prisma.$queryRaw`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'Article' 
      AND column_name IN ('linkedinPostId', 'linkedinUrl', 'linkedInPosted', 'linkedInPostDate')
    `
    
    // Test if we can create a simple author (this will tell us if basic operations work)
    let canCreateAuthor = false
    try {
      await prisma.author.findFirst()
      canCreateAuthor = true
    } catch (error) {
      console.log('Author table test failed:', error)
    }
    
    return NextResponse.json({
      success: true,
      schema: {
        articleColumns,
        linkedinColumns,
        linkedinFieldsExist: Array.isArray(linkedinColumns) && linkedinColumns.length === 4,
        canCreateAuthor,
        tablesChecked: ['Article', 'Author']
      },
      timestamp: new Date().toISOString()
    })
  } catch (error: any) {
    console.error('Schema check failed:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to check database schema',
        details: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}