type RateLimitConfig = {
  windowMs: number
  max: number
}

type RateLimitEntry = {
  count: number
  resetAt: number
}

type RateLimitResult = {
  allowed: boolean
  remaining: number
  resetAt: number
}

const DEFAULT_CONFIG: RateLimitConfig = {
  windowMs: 10_000,
  max: 10,
}

const store =
  (
    globalThis as typeof globalThis & {
      __rateLimitStore?: Map<string, RateLimitEntry>
    }
  ).__rateLimitStore ?? new Map<string, RateLimitEntry>()

;(
  globalThis as typeof globalThis & {
    __rateLimitStore?: Map<string, RateLimitEntry>
  }
).__rateLimitStore = store

export function rateLimit(
  key: string,
  config: RateLimitConfig = DEFAULT_CONFIG,
): RateLimitResult {
  const now = Date.now()
  const entry = store.get(key)

  if (!entry || entry.resetAt <= now) {
    const resetAt = now + config.windowMs
    store.set(key, { count: 1, resetAt })
    return { allowed: true, remaining: config.max - 1, resetAt }
  }

  if (entry.count >= config.max) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: entry.resetAt,
    }
  }

  const nextCount = entry.count + 1
  store.set(key, { count: nextCount, resetAt: entry.resetAt })
  return {
    allowed: true,
    remaining: Math.max(0, config.max - nextCount),
    resetAt: entry.resetAt,
  }
}

export function getClientIp(request: Request) {
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) {
    return forwardedFor.split(',')[0]?.trim() || 'unknown'
  }

  const realIp = request.headers.get('x-real-ip')
  return realIp ?? 'unknown'
}
