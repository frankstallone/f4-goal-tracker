'use server'

import { revalidatePath } from 'next/cache'

import { getAuthorizedSession } from '@/lib/auth-session'
import { getSql } from '@/lib/db'
import { normalizeTransactionPayload } from '@/lib/transactions'

export type TransactionFormState = {
  status: 'idle' | 'success' | 'error'
  message?: string
  fieldErrors?: Record<string, string>
}

export type DeleteTransactionState = {
  status: 'idle' | 'success' | 'error'
  message?: string
}

export async function addTransactionAction(
  goalSlug: string,
  prevState: TransactionFormState,
  formData: FormData,
): Promise<TransactionFormState> {
  void prevState
  const session = await getAuthorizedSession()
  if (!session) {
    return { status: 'error', message: 'Sign in required.' }
  }

  const rawPayload = {
    description: String(formData.get('description') ?? ''),
    amount: String(formData.get('amount') ?? ''),
    direction: String(formData.get('direction') ?? ''),
    transactedOn: String(formData.get('transactedOn') ?? ''),
    createdBy: String(formData.get('createdBy') ?? ''),
  }

  const { data, errors } = normalizeTransactionPayload({
    description: rawPayload.description,
    amount: rawPayload.amount,
    direction: rawPayload.direction,
    transactedOn: rawPayload.transactedOn,
    createdBy: rawPayload.createdBy,
  })

  if (errors || !data) {
    return {
      status: 'error',
      message: 'Fix the highlighted fields before saving.',
      fieldErrors: errors,
    }
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
    INSERT INTO goal_transactions (goal_id, description, amount_cents, transacted_on, created_by)
    VALUES (
      ${goal.id},
      ${data.description},
      ${data.amountCents},
      ${data.transactedOn},
      ${data.createdBy}
    )
  `

  revalidatePath('/')
  revalidatePath(`/goals/${goalSlug}`)

  return {
    status: 'success',
    message: 'Transaction added.',
  }
}

export async function updateTransactionAction(
  goalSlug: string,
  transactionId: string,
  prevState: TransactionFormState,
  formData: FormData,
): Promise<TransactionFormState> {
  void prevState
  const session = await getAuthorizedSession()
  if (!session) {
    return { status: 'error', message: 'Sign in required.' }
  }

  const rawPayload = {
    description: String(formData.get('description') ?? ''),
    amount: String(formData.get('amount') ?? ''),
    direction: String(formData.get('direction') ?? ''),
    transactedOn: String(formData.get('transactedOn') ?? ''),
    createdBy: String(formData.get('createdBy') ?? ''),
  }

  const { data, errors } = normalizeTransactionPayload({
    description: rawPayload.description,
    amount: rawPayload.amount,
    direction: rawPayload.direction,
    transactedOn: rawPayload.transactedOn,
    createdBy: rawPayload.createdBy,
  })

  if (errors || !data) {
    return {
      status: 'error',
      message: 'Fix the highlighted fields before saving.',
      fieldErrors: errors,
    }
  }

  const sql = getSql()
  if (!sql) {
    return {
      status: 'error',
      message: 'DATABASE_URL is not configured yet.',
    }
  }

  const rows = (await sql`
    SELECT t.id
    FROM goal_transactions t
    JOIN goals g ON g.id = t.goal_id
    WHERE g.slug = ${goalSlug} AND t.id = ${transactionId}
    LIMIT 1
  `) as { id: string }[]

  if (!rows[0]) {
    return { status: 'error', message: 'Transaction not found.' }
  }

  await sql`
    UPDATE goal_transactions
    SET
      description = ${data.description},
      amount_cents = ${data.amountCents},
      transacted_on = ${data.transactedOn},
      created_by = ${data.createdBy}
    WHERE id = ${transactionId}
  `

  revalidatePath('/')
  revalidatePath(`/goals/${goalSlug}`)

  return { status: 'success', message: 'Transaction updated.' }
}

export async function deleteTransactionAction(
  goalSlug: string,
  transactionId: string,
  prevState: DeleteTransactionState,
  formData: FormData,
): Promise<DeleteTransactionState> {
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

  const rows = (await sql`
    SELECT t.id
    FROM goal_transactions t
    JOIN goals g ON g.id = t.goal_id
    WHERE g.slug = ${goalSlug} AND t.id = ${transactionId}
    LIMIT 1
  `) as { id: string }[]

  if (!rows[0]) {
    return { status: 'error', message: 'Transaction not found.' }
  }

  await sql`
    DELETE FROM goal_transactions WHERE id = ${transactionId}
  `

  revalidatePath('/')
  revalidatePath(`/goals/${goalSlug}`)

  return { status: 'success', message: 'Transaction deleted.' }
}
