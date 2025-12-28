import { describe, expect, it, vi, beforeEach } from 'vitest'

import { getServerSession } from '@/lib/auth-session'
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
    vi.mocked(headers).mockResolvedValue(mockHeaders)
    vi.mocked(auth.api.getSession).mockResolvedValue({ user: { id: '1' } })

    const session = await getServerSession()

    expect(headers).toHaveBeenCalledTimes(1)
    expect(auth.api.getSession).toHaveBeenCalledWith({ headers: mockHeaders })
    expect(session).toEqual({ user: { id: '1' } })
  })
})
