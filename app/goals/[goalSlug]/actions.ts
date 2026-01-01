'use server'

import { revalidatePath } from 'next/cache'

import { getAuthorizedSession } from '@/lib/auth-session'
import { getAllowedEmails } from '@/lib/access-control'
import { getDb, sql } from '@/lib/db'
import { normalizeGoalPayload } from '@/lib/goals'
export type DeleteGoalState = {
  status: 'idle' | 'success' | 'error'
  message?: string
}

export type ArchiveGoalState = {
  status: 'idle' | 'success' | 'error'
  message?: string
}

export type UnarchiveGoalState = {
  status: 'idle' | 'success' | 'error'
  message?: string
}

export type UpdateGoalState = {
  status: 'idle' | 'success' | 'error'
  message?: string
  fieldErrors?: Record<string, string>
}

export async function deleteGoalAction(
  goalId: string,
  prevState: DeleteGoalState,
  formData: FormData,
): Promise<DeleteGoalState> {
  void prevState
  void formData

  const session = await getAuthorizedSession()
  if (!session) {
    return { status: 'error', message: 'Sign in required.' }
  }

  const db = getDb()
  if (!db) {
    return {
      status: 'error',
      message: 'DATABASE_URL is not configured yet.',
    }
  }

  const goal = await db
    .selectFrom('goals')
    .select(['id', 'slug'])
    .where('id', '=', goalId)
    .executeTakeFirst()
  if (!goal) {
    return { status: 'error', message: 'Goal not found.' }
  }

  await db.deleteFrom('goals').where('id', '=', goal.id).execute()

  revalidatePath('/')
  revalidatePath('/goals/archived')
  revalidatePath(`/goals/${goal.slug}`)
  return { status: 'success', message: 'Goal deleted.' }
}

export async function archiveGoalAction(
  goalSlug: string,
  prevState: ArchiveGoalState,
  formData: FormData,
): Promise<ArchiveGoalState> {
  void prevState
  void formData

  const session = await getAuthorizedSession()
  if (!session) {
    return { status: 'error', message: 'Sign in required.' }
  }

  const db = getDb()
  if (!db) {
    return {
      status: 'error',
      message: 'DATABASE_URL is not configured yet.',
    }
  }

  const goal = await db
    .selectFrom('goals')
    .select(['id', 'is_archived'])
    .where('slug', '=', goalSlug)
    .where('is_archived', '=', false)
    .executeTakeFirst()

  if (!goal) {
    return { status: 'error', message: 'Goal not found.' }
  }

  await db
    .updateTable('goals')
    .set({
      is_archived: true,
      archived_at: sql`now()`,
      archived_by: session.user?.id ?? null,
      updated_at: sql`now()`,
    })
    .where('id', '=', goal.id)
    .execute()

  revalidatePath('/')
  revalidatePath('/goals/archived')
  revalidatePath(`/goals/${goalSlug}`)

  return { status: 'success', message: 'Goal archived.' }
}

export async function unarchiveGoalAction(
  goalId: string,
  prevState: UnarchiveGoalState,
  formData: FormData,
): Promise<UnarchiveGoalState> {
  void prevState
  void formData

  const session = await getAuthorizedSession()
  if (!session) {
    return { status: 'error', message: 'Sign in required.' }
  }

  const db = getDb()
  if (!db) {
    return {
      status: 'error',
      message: 'DATABASE_URL is not configured yet.',
    }
  }

  const goal = await db
    .selectFrom('goals')
    .select(['id', 'slug', 'is_archived'])
    .where('id', '=', goalId)
    .executeTakeFirst()

  if (!goal) {
    return { status: 'error', message: 'Goal not found.' }
  }

  if (!goal.is_archived) {
    return { status: 'error', message: 'Goal is already active.' }
  }

  const conflictingGoal = await db
    .selectFrom('goals')
    .select(['id'])
    .where('slug', '=', goal.slug)
    .where('is_archived', '=', false)
    .executeTakeFirst()

  if (conflictingGoal) {
    return {
      status: 'error',
      message:
        'An active goal already uses this slug. Archive or delete the active goal before restoring this one.',
    }
  }

  await db
    .updateTable('goals')
    .set({
      is_archived: false,
      unarchived_at: sql`now()`,
      unarchived_by: session.user?.id ?? null,
      updated_at: sql`now()`,
    })
    .where('id', '=', goal.id)
    .execute()

  revalidatePath('/')
  revalidatePath('/goals/archived')
  revalidatePath(`/goals/${goal.slug}`)

  return { status: 'success', message: 'Goal restored.' }
}

export async function updateGoalAction(
  goalSlug: string,
  prevState: UpdateGoalState,
  formData: FormData,
): Promise<UpdateGoalState> {
  void prevState
  const session = await getAuthorizedSession()
  if (!session) {
    return { status: 'error', message: 'Sign in required.' }
  }

  const rawPayload = {
    name: String(formData.get('name') ?? ''),
    description: String(formData.get('description') ?? ''),
    targetAmount: String(formData.get('targetAmount') ?? ''),
    coverImageUrl: String(formData.get('coverImageUrl') ?? ''),
    coverImageSource: String(formData.get('coverImageSource') ?? ''),
    coverImageAttributionName: String(
      formData.get('coverImageAttributionName') ?? '',
    ),
    coverImageAttributionUrl: String(
      formData.get('coverImageAttributionUrl') ?? '',
    ),
    coverImageId: String(formData.get('coverImageId') ?? ''),
    champions: String(formData.get('champions') ?? ''),
  }

  const { data, errors } = normalizeGoalPayload(rawPayload)
  if (errors || !data) {
    return {
      status: 'error',
      message: 'Fix the highlighted fields before saving.',
      fieldErrors: errors,
    }
  }

  const db = getDb()
  if (!db) {
    return {
      status: 'error',
      message: 'DATABASE_URL is not configured yet.',
    }
  }

  const goal = await db
    .selectFrom('goals')
    .select(['id', 'is_archived'])
    .where('slug', '=', goalSlug)
    .where('is_archived', '=', false)
    .executeTakeFirst()
  if (!goal) {
    return { status: 'error', message: 'Goal not found.' }
  }

  await db
    .updateTable('goals')
    .set({
      name: data.name,
      description: data.description,
      cover_image_url: data.coverImageUrl,
      cover_image_source: data.coverImageSource,
      cover_image_attribution_name: data.coverImageAttributionName,
      cover_image_attribution_url: data.coverImageAttributionUrl,
      cover_image_id: data.coverImageId,
      target_amount_cents: data.targetAmountCents,
      updated_at: sql`now()`,
    })
    .where('id', '=', goal.id)
    .execute()

  await db.deleteFrom('goal_champions').where('goal_id', '=', goal.id).execute()

  if (data.champions.length) {
    const allowedEmails = getAllowedEmails()
    if (allowedEmails.length) {
      await sql`
        INSERT INTO goal_champions (goal_id, user_id)
        SELECT ${goal.id}::uuid, u.id
        FROM "user" u
        WHERE u.id = ANY(${data.champions}::text[])
          AND u.email = ANY(${allowedEmails}::text[])
        ON CONFLICT DO NOTHING
      `.execute(db)
    } else {
      await sql`
        INSERT INTO goal_champions (goal_id, user_id)
        SELECT ${goal.id}::uuid, u.id
        FROM "user" u
        WHERE u.id = ANY(${data.champions}::text[])
        ON CONFLICT DO NOTHING
      `.execute(db)
    }
  }

  revalidatePath('/')
  revalidatePath(`/goals/${goalSlug}`)

  return { status: 'success', message: 'Goal updated.' }
}
