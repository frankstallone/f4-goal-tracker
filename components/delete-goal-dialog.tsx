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
  goalSlug: string
  goalName: string
  trigger?: React.ReactElement
}

export function DeleteGoalDialog({
  goalSlug,
  goalName,
  trigger,
}: DeleteGoalDialogProps) {
  const [open, setOpen] = React.useState(false)
  const router = useRouter()
  const hasCustomTrigger = Boolean(trigger)
  const [state, formAction, pending] = React.useActionState(
    deleteGoalAction.bind(null, goalSlug),
    initialState,
  )

  React.useEffect(() => {
    if (state.status === 'success') {
      setOpen(false)
      router.push('/?toast=goal-deleted')
    }
    if (state.status === 'error' && state.message) {
      toast.error(state.message)
    }
  }, [router, state.message, state.status])

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        render={trigger ?? <Button variant="destructive" />}
        nativeButton={hasCustomTrigger ? false : undefined}
      >
        Delete goal
      </AlertDialogTrigger>
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
