export type AmountRecord = {
  amountCents: number
}

export type GoalAmountRecord = AmountRecord & {
  goalId: string
}

export function sumAmounts(records: AmountRecord[]) {
  return records.reduce((total, record) => total + record.amountCents, 0)
}

export function groupTotalsByGoal(records: GoalAmountRecord[]) {
  return records.reduce<Record<string, number>>((totals, record) => {
    totals[record.goalId] = (totals[record.goalId] ?? 0) + record.amountCents
    return totals
  }, {})
}

export function splitInflowOutflow(records: AmountRecord[]) {
  return records.reduce(
    (totals, record) => {
      if (record.amountCents >= 0) {
        totals.inflow += record.amountCents
      } else {
        totals.outflow += Math.abs(record.amountCents)
      }
      return totals
    },
    { inflow: 0, outflow: 0 }
  )
}
