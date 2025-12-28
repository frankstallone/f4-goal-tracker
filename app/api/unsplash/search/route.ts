import { NextResponse } from 'next/server'

import { requireEnv } from '@/lib/env'
import { getClientIp, rateLimit } from '@/lib/rate-limit'

const UNSPLASH_BASE_URL = 'https://api.unsplash.com'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('query')

  if (!query) {
    return NextResponse.json({ error: 'Missing query.' }, { status: 400 })
  }

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
  const { allowed, resetAt } = rateLimit(`unsplash-search:${ip}`, {
    windowMs: 15_000,
    max: 12,
  })
  if (!allowed) {
    const retryAfter = Math.max(1, Math.ceil((resetAt - Date.now()) / 1000))
    return NextResponse.json(
      { error: 'Too many search requests. Try again soon.' },
      {
        status: 429,
        headers: {
          'Retry-After': retryAfter.toString(),
        },
      },
    )
  }

  const response = await fetch(
    `${UNSPLASH_BASE_URL}/search/photos?query=${encodeURIComponent(
      query,
    )}&per_page=12&orientation=landscape`,
    {
      headers: {
        Authorization: `Client-ID ${accessKey}`,
      },
      next: { revalidate: 60 },
    },
  )

  if (!response.ok) {
    return NextResponse.json(
      { error: 'Unsplash search failed.' },
      { status: response.status },
    )
  }

  type UnsplashPhoto = {
    id: string
    alt_description: string | null
    description: string | null
    urls?: { small?: string; regular?: string }
    user?: { name?: string; username?: string }
    links?: { download_location?: string }
  }

  const data = (await response.json()) as { results?: UnsplashPhoto[] }
  const results = (data.results ?? []).map((photo) => ({
    id: photo.id,
    alt: photo.alt_description ?? photo.description ?? 'Unsplash photo',
    urls: {
      small: photo.urls?.small,
      regular: photo.urls?.regular,
    },
    user: {
      name: photo.user?.name,
      username: photo.user?.username,
    },
    links: {
      downloadLocation: photo.links?.download_location,
    },
  }))

  return NextResponse.json(
    { results },
    {
      headers: {
        'Cache-Control': 'public, max-age=60',
      },
    },
  )
}
