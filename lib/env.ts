import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string().min(1).optional(),
  UNSPLASH_ACCESS_KEY: z.string().min(1).optional(),
  BETTER_AUTH_SECRET: z.string().min(1).optional(),
  BETTER_AUTH_URL: z.string().url().optional(),
  GOOGLE_CLIENT_ID: z.string().min(1).optional(),
  GOOGLE_CLIENT_SECRET: z.string().min(1).optional(),
  ALLOWED_EMAILS: z.string().optional(),
  VERCEL_URL: z.string().optional(),
})

type ServerEnv = z.infer<typeof envSchema>

let cachedEnv: ServerEnv | null = null

function loadEnv(): ServerEnv {
  const parsed = envSchema.safeParse(process.env)
  if (!parsed.success) {
    throw new Error(
      `Invalid environment configuration: ${JSON.stringify(
        parsed.error.flatten().fieldErrors,
      )}`,
    )
  }
  return parsed.data
}

export function getServerEnv() {
  if (!cachedEnv || process.env.NODE_ENV === 'test') {
    cachedEnv = loadEnv()
  }
  return cachedEnv
}

export function requireEnv<Key extends keyof ServerEnv>(
  key: Key,
): NonNullable<ServerEnv[Key]> {
  const value = getServerEnv()[key]
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
  return value
}
