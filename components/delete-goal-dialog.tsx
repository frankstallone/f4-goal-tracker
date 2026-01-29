'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'

import {
  deleteGoalAction,
  type DeleteGoalState,
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

const initialState: DeleteGoalState = { status: 'idle' }

type DeleteGoalDialogProps = {
  goalId: string
  goalName: string
  trigger?: React.ReactElement | null
  successRedirect?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function DeleteGoalDialog({
  goalId,
  goalName,
  trigger,
  successRedirect,
  open: openProp,
  onOpenChange,
}: DeleteGoalDialogProps) {
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
  const triggerElement = trigger ?? <Button variant="destructive" />
  const [state, formAction, pending] = React.useActionState(
    deleteGoalAction.bind(null, goalId),
    initialState,
  )

  React.useEffect(() => {
    if (state.status === 'success') {
      setOpen(false)
      router.push(successRedirect ?? '/?toast=goal-deleted')
    }
    if (state.status === 'error' && state.message) {
      toast.error(state.message)
    }
  }, [router, state.message, state.status, successRedirect])

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      {shouldRenderTrigger ? (
        <AlertDialogTrigger
          render={triggerElement}
          nativeButton={hasCustomTrigger ? false : undefined}
        >
          Delete goal
        </AlertDialogTrigger>
      ) : null}
      <AlertDialogContent className="border-white/10 bg-slate-950 text-slate-100">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {goalName}?</AlertDialogTitle>
          <AlertDialogDescription className="text-slate-400">
            This will permanently remove the goal and all of its transactions.
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Form action={formAction}>
          {state.message ? (
            <p className={cn('text-sm text-rose-300')}>{state.message}</p>
          ) : null}
          <AlertDialogFooter className="mt-6 gap-3">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              type="submit"
              variant="destructive"
              disabled={pending}
            >
              {pending ? 'Removing...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  )
}
