import { describe, expect, it, vi, beforeEach } from 'vitest'

import { getServerSession } from '@/lib/auth-session'
import { isEmailAllowed } from '@/lib/access-control'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

vi.mock('@/lib/auth', () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}))

vi.mock('next/headers', () => ({
  headers: vi.fn(),
}))

describe('getServerSession', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns the session from Better Auth using request headers', async () => {
    const mockHeaders = new Headers()
    const mockUser = {
      id: '1',
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      updatedAt: new Date('2026-01-01T00:00:00.000Z'),
      email: 'test@example.com',
      emailVerified: true,
      name: 'Test User',
      image: null,
    }
    const mockSession = {
      id: 'session-1',
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      updatedAt: new Date('2026-01-01T00:00:00.000Z'),
      userId: mockUser.id,
      expiresAt: new Date('2026-02-01T00:00:00.000Z'),
      token: 'test-token',
      ipAddress: null,
      userAgent: null,
    }
    vi.mocked(headers).mockResolvedValue(mockHeaders)
    vi.mocked(auth.api.getSession).mockResolvedValue({
      session: mockSession,
      user: mockUser,
    })

    const session = await getServerSession()

    expect(headers).toHaveBeenCalledTimes(1)
    expect(auth.api.getSession).toHaveBeenCalledWith({ headers: mockHeaders })
    expect(session).toEqual({ session: mockSession, user: mockUser })
  })
})

describe('isEmailAllowed', () => {
  const original = process.env.ALLOWED_EMAILS

  beforeEach(() => {
    if (original === undefined) {
      delete process.env.ALLOWED_EMAILS
    } else {
      process.env.ALLOWED_EMAILS = original
    }
  })

  it('allows any email when the allowlist is empty', () => {
    delete process.env.ALLOWED_EMAILS
    expect(isEmailAllowed('anyone@example.com')).toBe(true)
  })

  it('only allows emails in the allowlist', () => {
    process.env.ALLOWED_EMAILS = 'first@example.com, second@example.com'
    expect(isEmailAllowed('first@example.com')).toBe(true)
    expect(isEmailAllowed('second@example.com')).toBe(true)
    expect(isEmailAllowed('other@example.com')).toBe(false)
  })
})
