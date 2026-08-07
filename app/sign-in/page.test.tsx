import { renderToStaticMarkup } from 'react-dom/server'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { getServerSession } from '@/lib/auth-session'

import SignInPage from './page'

vi.mock('next/navigation', () => ({ redirect: vi.fn() }))
vi.mock('@/components/auth-buttons', () => ({
  GoogleSignInButton: () => <button type="button">Sign in with Google</button>,
}))
vi.mock('@/lib/auth-session', () => ({ getServerSession: vi.fn() }))

describe('SignInPage', () => {
  beforeEach(() => {
    vi.mocked(getServerSession).mockResolvedValue(null)
  })

  it('shows the unauthorized message from async search params', async () => {
    const page = await SignInPage({
      searchParams: Promise.resolve({ error: 'unauthorized' }),
    })

    const markup = renderToStaticMarkup(page)

    expect(markup).toContain(
      'This Google account is not authorized to access this app.',
    )
  })
})
