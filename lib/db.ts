import { neon, type NeonQueryFunction } from '@neondatabase/serverless'

import { getServerEnv } from '@/lib/env'

let sql: NeonQueryFunction<false, false> | null = null

export function getSql() {
  if (process.env.NODE_ENV === 'test') return null
  const databaseUrl = getServerEnv().DATABASE_URL
  if (!databaseUrl) return null
  if (!sql) {
    sql = neon(databaseUrl)
  }
  return sql
}
