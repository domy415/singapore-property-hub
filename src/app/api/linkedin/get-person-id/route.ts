import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const accessToken = process.env.LINKEDIN_ACCESS_TOKEN
    
    if (!accessToken) {
      return NextResponse.json(
        { success: false, error: 'LinkedIn access token not configured' },
        { status: 400 }
      )
    }

    const response = await fetch('https://api.linkedin.com/v2/me', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json(
        { 
          success: false, 
          error: `LinkedIn API error: ${response.status} ${response.statusText}`,
          details: errorText
        },
        { status: response.status }
      )
    }

    const profileData = await response.json()
    
    return NextResponse.json({
      success: true,
      personId: profileData.id,
      profile: {
        id: profileData.id,
        firstName: profileData.localizedFirstName,
        lastName: profileData.localizedLastName
      },
      message: `Found Person ID: ${profileData.id}`
    })
  } catch (error: any) {
    console.error('Error fetching Person ID:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}