import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import pg from 'pg'

const { Client } = pg
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const MIGRATIONS_DIR = path.join(__dirname, '..', 'db', 'migrations')

async function ensureSchemaMigrations(client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id text PRIMARY KEY,
      applied_at timestamptz DEFAULT now()
    )
  `)
}

async function assertAuthTables(client) {
  const result = await client.query(
    "SELECT to_regclass('public.user') AS user_table",
  )
  if (!result.rows[0]?.user_table) {
    throw new Error(
      'Missing "user" table. Run the Better Auth schema setup before applying app migrations.',
    )
  }
}

function getMigrationFiles() {
  if (!fs.existsSync(MIGRATIONS_DIR)) {
    return []
  }
  return fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((file) => file.endsWith('.sql'))
    .sort()
}

async function getAppliedMigrations(client) {
  const result = await client.query('SELECT id FROM schema_migrations')
  return new Set(result.rows.map((row) => row.id))
}

async function applyMigration(client, file) {
  const fullPath = path.join(MIGRATIONS_DIR, file)
  const sql = fs.readFileSync(fullPath, 'utf8')
  await client.query('BEGIN')
  try {
    await client.query(sql)
    await client.query('INSERT INTO schema_migrations (id) VALUES ($1)', [file])
    await client.query('COMMIT')
    console.log(`Applied ${file}`)
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  }
}

async function main() {
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is not configured.')
  }

  const client = new Client({ connectionString: databaseUrl })
  await client.connect()
  try {
    await ensureSchemaMigrations(client)
    await assertAuthTables(client)
    const applied = await getAppliedMigrations(client)
    const files = getMigrationFiles()
    for (const file of files) {
      if (!applied.has(file)) {
        await applyMigration(client, file)
      }
    }
  } finally {
    await client.end()
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
