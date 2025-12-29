import { describe, expect, it } from 'vitest'

import { sampleTransactions } from '@/lib/data/sample'
import { getGoalTransactionById } from '@/lib/data/transactions'

describe('getGoalTransactionById', () => {
  it('returns a transaction for the matching goal in sample mode', async () => {
    const sample = sampleTransactions[0]
    const result = await getGoalTransactionById(sample.goalId, sample.id)

    expect(result).toMatchObject({
      id: sample.id,
      goalId: sample.goalId,
      description: sample.description,
    })
  })

  it('returns null when the transaction is missing', async () => {
    const result = await getGoalTransactionById('goal-retirement', 'missing-id')

    expect(result).toBeNull()
  })
})
