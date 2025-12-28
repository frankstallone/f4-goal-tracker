import { describe, expect, it } from "vitest"

import {
  formatCurrencyFromCents,
  formatLongDate,
  formatSignedCurrencyFromCents,
} from "@/lib/format"

describe("format helpers", () => {
  it("formats currency with cents", () => {
    expect(formatCurrencyFromCents(250000)).toBe("$2,500.00")
  })

  it("formats signed currency when requested", () => {
    expect(formatSignedCurrencyFromCents(4500)).toBe("$45.00")
    expect(formatSignedCurrencyFromCents(4500, { showPlus: true })).toBe(
      "+$45.00"
    )
    expect(formatSignedCurrencyFromCents(-4500)).toBe("-$45.00")
  })

  it("formats dates in a long form", () => {
    expect(formatLongDate("2025-08-13")).toBe("August 13, 2025")
  })
})
