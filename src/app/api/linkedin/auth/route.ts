import { NextResponse } from 'next/server'

export async function GET() {
  const clientId = process.env.LINKEDIN_CLIENT_ID
  const redirectUri = process.env.NODE_ENV === 'production' 
    ? 'https://singapore-property-hub.vercel.app/api/linkedin/callback'
    : 'http://localhost:3000/api/linkedin/callback'
  
  if (!clientId) {
    return NextResponse.json(
      { error: 'LinkedIn Client ID not configured' },
      { status: 500 }
    )
  }

  // LinkedIn OAuth URL with required scopes for personal posting
  const scopes = [
    'r_liteprofile',
    'w_member_social', 
    'r_emailaddress'
  ].join('%20')

  const authUrl = `https://www.linkedin.com/oauth/v2/authorization?` +
    `response_type=code&` +
    `client_id=${clientId}&` +
    `redirect_uri=${encodeURIComponent(redirectUri)}&` +
    `scope=${scopes}&` +
    `state=linkedin_auth_${Date.now()}`

  return NextResponse.redirect(authUrl)
}