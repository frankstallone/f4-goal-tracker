import { NextResponse } from 'next/server'

const UNSPLASH_BASE_URL = 'https://api.unsplash.com'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('query')

  if (!query) {
    return NextResponse.json({ error: 'Missing query.' }, { status: 400 })
  }

  const accessKey = process.env.UNSPLASH_ACCESS_KEY
  if (!accessKey) {
    return NextResponse.json(
      { error: 'UNSPLASH_ACCESS_KEY is not configured.' },
      { status: 500 },
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
      cache: 'no-store',
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

  return NextResponse.json({ results })
}
