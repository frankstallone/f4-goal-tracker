'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'

import {
  archiveGoalAction,
  unarchiveGoalAction,
  type ArchiveGoalState,
  type UnarchiveGoalState,
} from '@/app/goals/[goalSlug]/actions'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const initialArchiveState: ArchiveGoalState = { status: 'idle' }
const initialUnarchiveState: UnarchiveGoalState = { status: 'idle' }

type ArchiveGoalDialogProps = {
  goalSlug: string
  goalName: string
  trigger?: React.ReactElement | null
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

type UnarchiveGoalDialogProps = {
  goalId: string
  goalSlug: string
  goalName: string
  trigger?: React.ReactElement | null
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function ArchiveGoalDialog({
  goalSlug,
  goalName,
  trigger,
  open: openProp,
  onOpenChange,
}: ArchiveGoalDialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false)
  const isControlled = typeof openProp === 'boolean'
  const open = isControlled ? openProp : uncontrolledOpen
  const setOpen = React.useCallback(
    (next: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(next)
      }
      onOpenChange?.(next)
    },
    [isControlled, onOpenChange],
  )
  const router = useRouter()
  const hasCustomTrigger = Boolean(trigger)
  const shouldRenderTrigger = trigger !== null
  const triggerElement = trigger ?? <Button variant="outline" />
  const [state, formAction, pending] = React.useActionState(
    archiveGoalAction.bind(null, goalSlug),
    initialArchiveState,
  )

  React.useEffect(() => {
    if (state.status === 'success') {
      setOpen(false)
      router.push('/goals/archived?toast=goal-archived')
    }
    if (state.status === 'error' && state.message) {
      toast.error(state.message)
    }
  }, [router, state.message, state.status])

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      {shouldRenderTrigger ? (
        <AlertDialogTrigger
          render={triggerElement}
          nativeButton={hasCustomTrigger ? false : undefined}
        >
          Archive goal
        </AlertDialogTrigger>
      ) : null}
      <AlertDialogContent className="border-white/10 bg-slate-950 text-slate-100">
        <AlertDialogHeader>
          <AlertDialogTitle>Archive {goalName}?</AlertDialogTitle>
          <AlertDialogDescription className="text-slate-400">
            This will keep the goal and its transactions, but prevent edits
            until it is restored.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Form action={formAction}>
          {state.message ? (
            <p className={cn('text-sm text-rose-300')}>{state.message}</p>
          ) : null}
          <AlertDialogFooter className="mt-6 gap-3">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction type="submit" disabled={pending}>
              {pending ? 'Archiving...' : 'Archive'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export function UnarchiveGoalDialog({
  goalId,
  goalSlug,
  goalName,
  trigger,
  open: openProp,
  onOpenChange,
}: UnarchiveGoalDialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false)
  const isControlled = typeof openProp === 'boolean'
  const open = isControlled ? openProp : uncontrolledOpen
  const setOpen = React.useCallback(
    (next: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(next)
      }
      onOpenChange?.(next)
    },
    [isControlled, onOpenChange],
  )
  const router = useRouter()
  const hasCustomTrigger = Boolean(trigger)
  const shouldRenderTrigger = trigger !== null
  const triggerElement = trigger ?? <Button variant="outline" />
  const [state, formAction, pending] = React.useActionState(
    unarchiveGoalAction.bind(null, goalId),
    initialUnarchiveState,
  )

  React.useEffect(() => {
    if (state.status === 'success') {
      setOpen(false)
      router.push(`/goals/${goalSlug}?toast=goal-unarchived`)
    }
    if (state.status === 'error' && state.message) {
      toast.error(state.message)
    }
  }, [goalSlug, router, state.message, state.status])

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      {shouldRenderTrigger ? (
        <AlertDialogTrigger
          render={triggerElement}
          nativeButton={hasCustomTrigger ? false : undefined}
        >
          Restore goal
        </AlertDialogTrigger>
      ) : null}
      <AlertDialogContent className="border-white/10 bg-slate-950 text-slate-100">
        <AlertDialogHeader>
          <AlertDialogTitle>Restore {goalName}?</AlertDialogTitle>
          <AlertDialogDescription className="text-slate-400">
            This will move the goal back into the active list and re-enable
            edits.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Form action={formAction}>
          {state.message ? (
            <p className={cn('text-sm text-rose-300')}>{state.message}</p>
          ) : null}
          <AlertDialogFooter className="mt-6 gap-3">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction type="submit" disabled={pending}>
              {pending ? 'Restoring...' : 'Restore'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  )
}
