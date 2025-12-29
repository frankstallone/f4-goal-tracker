'use server'

import { revalidatePath } from 'next/cache'

import { getAuthorizedSession } from '@/lib/auth-session'
import { getSql } from '@/lib/db'
export type DeleteGoalState = {
  status: 'idle' | 'success' | 'error'
  message?: string
}

export async function deleteGoalAction(
  goalSlug: string,
  prevState: DeleteGoalState,
  formData: FormData,
): Promise<DeleteGoalState> {
  void prevState
  void formData

  const session = await getAuthorizedSession()
  if (!session) {
    return { status: 'error', message: 'Sign in required.' }
  }

  const sql = getSql()
  if (!sql) {
    return {
      status: 'error',
      message: 'DATABASE_URL is not configured yet.',
    }
  }

  const goalRows = (await sql`
    SELECT id FROM goals WHERE slug = ${goalSlug} LIMIT 1
  `) as { id: string }[]

  const goal = goalRows[0]
  if (!goal) {
    return { status: 'error', message: 'Goal not found.' }
  }

  await sql`
    DELETE FROM goals WHERE id = ${goal.id}
  `

  revalidatePath('/')
  return { status: 'success', message: 'Goal deleted.' }
}
