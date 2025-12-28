import { neon, type NeonQueryFunction } from '@neondatabase/serverless'

let sql: NeonQueryFunction | null = null

export function getSql() {
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) return null
  if (!sql) {
    sql = neon(databaseUrl)
  }
  return sql
}
