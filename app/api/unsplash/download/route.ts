import { NextResponse } from 'next/server'

import { requireEnv } from '@/lib/env'
import { getClientIp, rateLimit } from '@/lib/rate-limit'

const UNSPLASH_BASE_URL = 'https://api.unsplash.com'

export async function POST(request: Request) {
  let accessKey: string
  try {
    accessKey = requireEnv('UNSPLASH_ACCESS_KEY')
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    )
  }
  const ip = getClientIp(request)
  const { allowed, resetAt } = rateLimit(`unsplash-download:${ip}`, {
    windowMs: 60_000,
    max: 30,
  })
  if (!allowed) {
    const retryAfter = Math.max(1, Math.ceil((resetAt - Date.now()) / 1000))
    return NextResponse.json(
      { error: 'Too many download requests. Try again soon.' },
      {
        status: 429,
        headers: {
          'Retry-After': retryAfter.toString(),
        },
      },
    )
  }

  const body = await request.json()
  const downloadLocation = body?.downloadLocation

  if (!downloadLocation) {
    return NextResponse.json(
      { error: 'Missing downloadLocation.' },
      { status: 400 },
    )
  }

  const url = downloadLocation.startsWith('http')
    ? downloadLocation
    : `${UNSPLASH_BASE_URL}${downloadLocation}`

  const response = await fetch(url, {
    headers: {
      Authorization: `Client-ID ${accessKey}`,
    },
  })

  if (!response.ok) {
    return NextResponse.json(
      { error: 'Unsplash download tracking failed.' },
      { status: response.status },
    )
  }

  return NextResponse.json({ ok: true })
}
