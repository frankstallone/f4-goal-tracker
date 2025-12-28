import { describe, expect, it } from 'vitest'

import {
  MIN_UNSPLASH_QUERY_LENGTH,
  normalizeSearchQuery,
  shouldSearchUnsplash,
} from '@/lib/unsplash'

describe('unsplash helpers', () => {
  it('normalizes search queries', () => {
    expect(normalizeSearchQuery('  hello ')).toBe('hello')
  })

  it('enforces minimum query length', () => {
    expect(shouldSearchUnsplash('hi')).toBe(false)
    expect(shouldSearchUnsplash('hey')).toBe(true)
    expect(shouldSearchUnsplash('   hey  ')).toBe(true)
    expect(shouldSearchUnsplash('hey', MIN_UNSPLASH_QUERY_LENGTH)).toBe(true)
  })
})
