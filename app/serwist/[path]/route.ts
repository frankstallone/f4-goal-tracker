import { spawnSync } from 'node:child_process'
import { createSerwistRoute } from '@serwist/turbopack'

const revision =
  process.env.VERCEL_GIT_COMMIT_SHA ||
  spawnSync('git', ['rev-parse', 'HEAD'], {
    encoding: 'utf8',
  }).stdout?.trim() ||
  'local'

export const { dynamic, dynamicParams, revalidate, generateStaticParams, GET } =
  createSerwistRoute({
    additionalPrecacheEntries: [{ url: '/~offline', revision }],
    swSrc: 'app/sw.ts',
    useNativeEsbuild: true,
  })
