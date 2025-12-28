import { neon, type NeonQueryFunction } from '@neondatabase/serverless'

import { getServerEnv } from '@/lib/env'

let sql: NeonQueryFunction<false, false> | null = null

export function getSql() {
  const databaseUrl = getServerEnv().DATABASE_URL
  if (!databaseUrl) return null
  if (!sql) {
    sql = neon(databaseUrl)
  }
  return sql
}
