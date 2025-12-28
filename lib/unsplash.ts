export const MIN_UNSPLASH_QUERY_LENGTH = 3

export function normalizeSearchQuery(value: string) {
  return value.trim()
}

export function shouldSearchUnsplash(
  value: string,
  minLength = MIN_UNSPLASH_QUERY_LENGTH,
) {
  return normalizeSearchQuery(value).length >= minLength
}
