import { beforeEach, describe, expect, it, vi } from 'vitest'

import { createDebouncer } from '@/lib/debounce'

describe('createDebouncer', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  it('runs the latest scheduled callback after the delay', () => {
    const debouncer = createDebouncer(300)
    const callback = vi.fn()

    debouncer.schedule(() => callback('first'))
    debouncer.schedule(() => callback('second'))

    vi.advanceTimersByTime(299)
    expect(callback).not.toHaveBeenCalled()

    vi.advanceTimersByTime(1)
    expect(callback).toHaveBeenCalledTimes(1)
    expect(callback).toHaveBeenCalledWith('second')
  })

  it('cancels scheduled callbacks', () => {
    const debouncer = createDebouncer(200)
    const callback = vi.fn()

    debouncer.schedule(callback)
    debouncer.cancel()

    vi.advanceTimersByTime(200)
    expect(callback).not.toHaveBeenCalled()
  })
})
