export function createDebouncer(delay: number) {
  let timer: ReturnType<typeof setTimeout> | null = null

  return {
    schedule(callback: () => void) {
      if (timer) {
        clearTimeout(timer)
      }
      timer = setTimeout(callback, delay)
    },
    cancel() {
      if (timer) {
        clearTimeout(timer)
        timer = null
      }
    },
  }
}
