import { execFileSync } from 'node:child_process'
import { readFile } from 'node:fs/promises'

const usage =
  'Usage: npm run vercel:preview-alias -- <hostname> (or set PREVIEW_ALIAS)'

async function main() {
  const args = process.argv.slice(2)
  if (args.length === 1 && args[0] === '--help') {
    console.log(usage)
    return
  }

  const alias = args[0] || process.env.PREVIEW_ALIAS
  if (
    args.length > 1 ||
    !alias ||
    !/^(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i.test(
      alias,
    )
  ) {
    throw new Error(usage)
  }

  let project
  try {
    project = JSON.parse(await readFile('.vercel/project.json', 'utf8'))
  } catch {
    throw new Error(
      'Run vercel link for the intended project before assigning a preview alias.',
    )
  }
  if (!project.projectId || !project.orgId) {
    throw new Error(
      'The Vercel project link is incomplete. Run vercel link again.',
    )
  }

  const metadata = JSON.parse(
    execFileSync(
      'vercel',
      [
        'api',
        `/v9/projects/${encodeURIComponent(project.projectId)}`,
        '--method',
        'GET',
        '--raw',
        '--scope',
        project.orgId,
      ],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'] },
    ),
  )
  const productionAliases = metadata.targets?.production?.alias ?? []
  if (
    metadata.id !== project.projectId ||
    !Array.isArray(productionAliases) ||
    productionAliases.some((hostname) => typeof hostname !== 'string')
  ) {
    throw new Error(
      'Unable to verify production aliases for the linked project.',
    )
  }
  if (
    productionAliases.some(
      (hostname) => hostname.toLowerCase() === alias.toLowerCase(),
    )
  ) {
    throw new Error(
      'The requested hostname belongs to Production. Use a preview hostname.',
    )
  }

  const output = execFileSync(
    'vercel',
    [
      'list',
      project.projectId,
      '--environment',
      'preview',
      '--status',
      'READY',
      '--format',
      'json',
      '--scope',
      project.orgId,
    ],
    { encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'] },
  )
  const { deployments } = JSON.parse(output)
  const latest = deployments?.[0]
  if (!latest?.url || latest.target === 'production') {
    throw new Error('No ready preview deployment found for the linked project.')
  }

  console.log(`Assigning ${alias} to ${latest.url}`)
  execFileSync(
    'vercel',
    ['alias', 'set', latest.url, alias, '--scope', project.orgId],
    {
      stdio: 'inherit',
    },
  )
}

main().catch((error) => {
  console.error(error.message)
  process.exitCode = 1
})
