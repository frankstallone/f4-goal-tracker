import { NextResponse } from 'next/server'

const UNSPLASH_BASE_URL = 'https://api.unsplash.com'

export async function POST(request: Request) {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY
  if (!accessKey) {
    return NextResponse.json(
      { error: 'UNSPLASH_ACCESS_KEY is not configured.' },
      { status: 500 },
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
