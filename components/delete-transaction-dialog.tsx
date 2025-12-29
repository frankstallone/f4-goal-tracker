'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'

import {
  deleteTransactionAction,
  type DeleteTransactionState,
} from '@/app/goals/[goalSlug]/transactions/actions'
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

const initialState: DeleteTransactionState = { status: 'idle' }

type DeleteTransactionDialogProps = {
  goalSlug: string
  transactionId: string
  description: string
}

export function DeleteTransactionDialog({
  goalSlug,
  transactionId,
  description,
}: DeleteTransactionDialogProps) {
  const [open, setOpen] = React.useState(false)
  const router = useRouter()
  const [state, formAction, pending] = React.useActionState(
    deleteTransactionAction.bind(null, goalSlug, transactionId),
    initialState,
  )

  React.useEffect(() => {
    if (state.status === 'success') {
      setOpen(false)
      router.push(`/goals/${goalSlug}?toast=transaction-deleted`)
    }
    if (state.status === 'error' && state.message) {
      toast.error(state.message)
    }
  }, [goalSlug, router, state.message, state.status])

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        render={<Button variant="destructive">Delete transaction</Button>}
      >
        Delete transaction
      </AlertDialogTrigger>
      <AlertDialogContent className="border-white/10 bg-slate-950 text-slate-100">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this transaction?</AlertDialogTitle>
          <AlertDialogDescription className="text-slate-400">
            This will permanently remove “{description}”. This action cannot be
            undone.
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
