import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'

import { updateTransactionAction } from '@/app/goals/[goalSlug]/transactions/actions'
import { DeleteTransactionDialog } from '@/components/delete-transaction-dialog'
import { PageHeader } from '@/components/page-header'
import { TransactionForm } from '@/components/transaction-form'
import { buttonVariants } from '@/components/ui/button'
import { UserMenu } from '@/components/user-menu'
import { requireServerSession } from '@/lib/auth-session'
import { getGoalBySlug } from '@/lib/data/goals'
import { getGoalTransactionById } from '@/lib/data/transactions'
import { getAllowedUsers } from '@/lib/users'

interface EditTransactionPageProps {
  params: Promise<{ goalSlug: string; transactionId: string }>
}

export default async function EditTransactionPage({
  params,
}: EditTransactionPageProps) {
  const { goalSlug, transactionId } = await params
  const sessionPromise = requireServerSession()
  const goalPromise = getGoalBySlug(goalSlug)
  const userOptionsPromise = getAllowedUsers()
  const [session, goal, userOptions] = await Promise.all([
    sessionPromise,
    goalPromise,
    userOptionsPromise,
  ])
  if (!goal) {
    notFound()
  }
  if (goal.isArchived) {
    redirect(`/goals/${goal.slug}`)
  }

  const transaction = await getGoalTransactionById(goal.id, transactionId)
  if (!transaction) {
    notFound()
  }

  const direction = transaction.amountCents < 0 ? 'withdrawal' : 'deposit'
  const amountValue = (Math.abs(transaction.amountCents) / 100).toFixed(2)
  const user = {
    name: session.user?.name ?? null,
    email: session.user?.email ?? null,
    image: session.user?.image ?? null,
  }

  return (
    <main className="bg-background text-foreground">
      <div className="mx-auto w-full max-w-3xl px-6 py-8 sm:py-12">
        <PageHeader
          title="Edit transaction"
          description={`Update this ledger entry for ${goal.name}.`}
        >
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/goals/${goal.slug}`}
              className={buttonVariants({ variant: 'ghost' })}
            >
              Back to goal
            </Link>
            <DeleteTransactionDialog
              goalSlug={goal.slug}
              transactionId={transaction.id}
              description={transaction.description}
            />
            <UserMenu user={user} />
          </div>
        </PageHeader>

        <section className="mt-10 sm:mt-12">
          <TransactionForm
            action={updateTransactionAction.bind(
              null,
              goal.slug,
              transaction.id,
            )}
            successRedirect={`/goals/${goal.slug}`}
            successToastKey="transaction-updated"
            cancelHref={`/goals/${goal.slug}`}
            userOptions={userOptions}
            initialValues={{
              description: transaction.description,
              amount: amountValue,
              direction,
              transactedOn: transaction.transactedOn,
              createdBy: transaction.createdBy ?? '',
            }}
            submitLabel="Save changes"
            pendingLabel="Saving..."
          />
        </section>
      </div>
    </main>
  )
}
