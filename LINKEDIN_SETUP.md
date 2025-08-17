# LinkedIn Integration Setup Guide

## Overview
This guide will help you set up LinkedIn API integration for automated article posting.

## Step 1: Create a LinkedIn App

1. Go to [LinkedIn Developer Portal](https://developer.linkedin.com/)
2. Sign in with your LinkedIn account
3. Click "Create app"
4. Fill in the required information:
   - **App name**: Singapore Property Hub
   - **LinkedIn Page**: Your business page (or personal profile)
   - **Privacy policy URL**: https://singapore-property-hub.vercel.app/privacy
   - **App logo**: Upload your logo
5. Select the following products:
   - **Share on LinkedIn** (for posting content)
   - **Marketing Developer Platform** (if available)

## Step 2: Configure App Permissions

1. In your app dashboard, go to the "Auth" tab
2. Add the following redirect URLs:
   - `http://localhost:3000/auth/linkedin/callback` (for testing)
   - `https://singapore-property-hub.vercel.app/auth/linkedin/callback`
3. Note down your **Client ID** and **Client Secret**

## Step 3: Request Required Scopes

Ensure your app has these scopes:
- `r_liteprofile` - Access to basic profile info
- `w_member_social` - Post on behalf of user
- `r_organization_social` - Read organization info (if posting as company)
- `w_organization_social` - Post as organization (if posting as company)

## Step 4: Get Access Token

### Option A: Using LinkedIn OAuth Flow (Recommended)

1. Create an OAuth URL:
```
https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id={YOUR_CLIENT_ID}&redirect_uri={YOUR_REDIRECT_URI}&scope=r_liteprofile%20w_member_social
```

2. Visit this URL and authorize your app
3. LinkedIn will redirect to your callback URL with an authorization code
4. Exchange the code for an access token:

```bash
curl -X POST https://www.linkedin.com/oauth/v2/accessToken \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=authorization_code" \
  -d "code={AUTHORIZATION_CODE}" \
  -d "redirect_uri={YOUR_REDIRECT_URI}" \
  -d "client_id={YOUR_CLIENT_ID}" \
  -d "client_secret={YOUR_CLIENT_SECRET}"
```

### Option B: Using LinkedIn's Developer Tools

1. In your app dashboard, use the "Token Generator" if available
2. Generate tokens for the required scopes

## Step 5: Get Your Person ID

After getting your access token, fetch your person ID:

```bash
curl -X GET https://api.linkedin.com/v2/people/(id:{id}) \
  -H "Authorization: Bearer {YOUR_ACCESS_TOKEN}"
```

Or use the simplified "me" endpoint:
```bash
curl -X GET https://api.linkedin.com/v2/me \
  -H "Authorization: Bearer {YOUR_ACCESS_TOKEN}"
```

## Step 6: Configure Environment Variables

Add these to your Vercel environment variables:

```env
LINKEDIN_ACCESS_TOKEN=your_access_token_here
LINKEDIN_PERSON_ID=your_person_id_here
LINKEDIN_COMPANY_ID=your_company_id_here (optional)
```

### Setting Environment Variables in Vercel:

1. Go to your Vercel dashboard
2. Select your project (singapore-property-hub)
3. Go to Settings → Environment Variables
4. Add each variable for Production, Preview, and Development

## Step 7: Test the Integration

1. Visit `/admin/linkedin` on your website
2. Click "Test Connection" to verify your credentials
3. Try posting an article to LinkedIn

## Troubleshooting

### Common Issues:

1. **"Invalid token" error**:
   - Check that your access token is correctly copied
   - Ensure the token hasn't expired
   - Verify you have the correct scopes

2. **"Forbidden" error**:
   - Check that your app has the required permissions
   - Ensure you're using the correct Person ID
   - Verify your LinkedIn app is approved for posting

3. **Rate limiting**:
   - LinkedIn has strict rate limits
   - Our system includes delays between posts
   - Consider posting during off-peak hours

### Token Expiration:

LinkedIn access tokens typically expire after 60 days. You'll need to:
1. Refresh the token using the refresh token (if available)
2. Or re-authorize your app to get a new token

## Security Notes

- Never commit access tokens to your repository
- Store tokens securely in environment variables only
- Monitor your app's usage in LinkedIn Developer Portal
- Regularly rotate tokens for security

## Rate Limits

LinkedIn API has these limits:
- Personal posts: 5 posts per person per day
- Company posts: 25 posts per company per day
- API calls: 500 calls per member per day

Our system respects these limits by:
- Adding delays between posts
- Limiting bulk operations
- Providing warnings in the admin interface

## Support

If you encounter issues:
1. Check LinkedIn's [API documentation](https://docs.microsoft.com/en-us/linkedin/)
2. Visit LinkedIn Developer [support forums](https://developer.linkedin.com/support)
3. Review the logs in your Vercel function dashboard