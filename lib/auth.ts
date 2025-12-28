import { betterAuth } from 'better-auth'
import { Pool } from 'pg'

import { getServerEnv, requireEnv } from '@/lib/env'

const env = getServerEnv()
const baseURL =
  env.BETTER_AUTH_URL ??
  (env.VERCEL_URL ? `https://${env.VERCEL_URL}` : 'http://localhost:3000')

export const auth = betterAuth({
  baseURL,
  secret: requireEnv('BETTER_AUTH_SECRET'),
  database: new Pool({
    connectionString: requireEnv('DATABASE_URL'),
  }),
  socialProviders: {
    google: {
      clientId: requireEnv('GOOGLE_CLIENT_ID'),
      clientSecret: requireEnv('GOOGLE_CLIENT_SECRET'),
    },
  },
})
