import { NextRequest } from 'next/server'
import { cookies } from 'next/headers'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'singapore-property-2025'
const AUTH_COOKIE = 'admin-authenticated'
const COOKIE_DURATION = 24 * 60 * 60 * 1000 // 24 hours

export interface AdminAuthResult {
  authenticated: boolean
  error?: string
}

export async function validateAdminPassword(password: string): Promise<boolean> {
  return password === ADMIN_PASSWORD
}

export async function setAdminSession(): Promise<void> {
  const cookieStore = cookies()
  cookieStore.set(AUTH_COOKIE, 'true', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: COOKIE_DURATION / 1000, // Convert to seconds
    path: '/admin'
  })
}

export async function clearAdminSession(): Promise<void> {
  const cookieStore = cookies()
  cookieStore.delete(AUTH_COOKIE)
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = cookies()
  const authCookie = cookieStore.get(AUTH_COOKIE)
  return authCookie?.value === 'true'
}

export async function requireAdminAuth(request?: NextRequest): Promise<AdminAuthResult> {
  const authenticated = await isAdminAuthenticated()
  
  if (!authenticated) {
    return {
      authenticated: false,
      error: 'Authentication required'
    }
  }

  return { authenticated: true }
}

// Utility function to hash passwords (for future enhancement)
export function hashPassword(password: string): string {
  // Simple hash for demo - in production, use bcrypt or similar
  return Buffer.from(password).toString('base64')
}

// Rate limiting for login attempts (basic implementation)
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>()

export function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const attempts = loginAttempts.get(ip)
  
  if (!attempts) {
    loginAttempts.set(ip, { count: 1, lastAttempt: now })
    return true
  }
  
  // Reset attempts after 15 minutes
  if (now - attempts.lastAttempt > 15 * 60 * 1000) {
    loginAttempts.set(ip, { count: 1, lastAttempt: now })
    return true
  }
  
  // Allow max 5 attempts per 15 minutes
  if (attempts.count >= 5) {
    return false
  }
  
  attempts.count++
  attempts.lastAttempt = now
  return true
}