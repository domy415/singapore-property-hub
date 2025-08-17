import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const error = url.searchParams.get('error')
  
  if (error) {
    return NextResponse.json(
      { error: `LinkedIn authorization failed: ${error}` },
      { status: 400 }
    )
  }
  
  if (!code) {
    return NextResponse.json(
      { error: 'No authorization code received' },
      { status: 400 }
    )
  }

  const clientId = process.env.LINKEDIN_CLIENT_ID
  const clientSecret = process.env.LINKEDIN_CLIENT_SECRET
  const redirectUri = process.env.NODE_ENV === 'production' 
    ? 'https://singapore-property-hub.vercel.app/api/linkedin/callback'
    : 'http://localhost:3000/api/linkedin/callback'

  if (!clientId || !clientSecret) {
    return NextResponse.json(
      { error: 'LinkedIn credentials not configured' },
      { status: 500 }
    )
  }

  try {
    // Exchange authorization code for access token
    const tokenResponse = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        client_id: clientId,
        client_secret: clientSecret,
      }),
    })

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text()
      throw new Error(`Token exchange failed: ${errorText}`)
    }

    const tokenData = await tokenResponse.json()
    const accessToken = tokenData.access_token

    // Get user profile to get person ID
    const profileResponse = await fetch('https://api.linkedin.com/v2/me', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    })

    if (!profileResponse.ok) {
      throw new Error('Failed to fetch profile')
    }

    const profileData = await profileResponse.json()
    
    // Return the credentials that need to be added to environment variables
    return NextResponse.json({
      success: true,
      message: 'LinkedIn authorization successful! Add these to your Vercel environment variables:',
      credentials: {
        LINKEDIN_ACCESS_TOKEN: accessToken,
        LINKEDIN_PERSON_ID: profileData.id,
      },
      profile: {
        id: profileData.id,
        firstName: profileData.localizedFirstName,
        lastName: profileData.localizedLastName,
      },
      instructions: [
        '1. Go to your Vercel project settings',
        '2. Add the environment variables shown above',
        '3. Redeploy your application',
        '4. Test the connection at /admin/linkedin'
      ]
    })
  } catch (error: any) {
    console.error('LinkedIn callback error:', error)
    return NextResponse.json(
      { error: `Authorization failed: ${error.message}` },
      { status: 500 }
    )
  }
}