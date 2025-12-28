import { describe, expect, it } from "vitest"

import { groupTotalsByGoal, splitInflowOutflow, sumAmounts } from "@/lib/ledger"

describe("ledger utilities", () => {
  it("sums amounts across transactions", () => {
    const total = sumAmounts([
      { amountCents: 1200 },
      { amountCents: -500 },
      { amountCents: 300 },
    ])

    expect(total).toBe(1000)
  })

  it("groups totals by goal", () => {
    const totals = groupTotalsByGoal([
      { goalId: "goal-a", amountCents: 500 },
      { goalId: "goal-b", amountCents: 300 },
      { goalId: "goal-a", amountCents: -200 },
    ])

    expect(totals).toEqual({
      "goal-a": 300,
      "goal-b": 300,
    })
  })

  it("splits inflow and outflow", () => {
    const totals = splitInflowOutflow([
      { amountCents: 1500 },
      { amountCents: -250 },
      { amountCents: 100 },
    ])

    expect(totals).toEqual({ inflow: 1600, outflow: 250 })
  })
})
