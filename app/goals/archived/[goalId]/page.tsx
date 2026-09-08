import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'

import { UnarchiveGoalDialog } from '@/components/archive-goal-dialog'
import { GoalActionsMenu } from '@/components/goal-actions-menu'
import { GoalTransactionsTable } from '@/components/goal-transactions-table'
import { PageHeader } from '@/components/page-header'
import { RedirectToast } from '@/components/redirect-toast'
import { UserMenu } from '@/components/user-menu'
import { Badge } from '@/components/ui/badge'
import { Button, buttonVariants } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { requireServerSession } from '@/lib/auth-session'
import { getArchivedGoalById, getGoalTransactions } from '@/lib/data/goals'
import {
  formatCurrencyFromCents,
  formatLongDate,
  formatSignedCurrencyFromCents,
} from '@/lib/format'
import { splitDepositsWithdrawals, sumAmounts } from '@/lib/ledger'
import { getUserLabel } from '@/lib/user-label'

interface ArchivedGoalDetailPageProps {
  params: Promise<{ goalId: string }>
}

export default async function ArchivedGoalDetailPage({
  params,
}: ArchivedGoalDetailPageProps) {
  const { goalId } = await params
  const sessionPromise = requireServerSession()
  const goalPromise = getArchivedGoalById(goalId)
  const [session, goal] = await Promise.all([sessionPromise, goalPromise])
  if (!goal) {
    notFound()
  }
  if (!goal.isArchived) {
    redirect(`/goals/${goal.slug}`)
  }

  const transactions = await getGoalTransactions(goal.id)
  const balanceFromTransactions = sumAmounts(transactions)
  const balance = transactions.length
    ? balanceFromTransactions
    : goal.balanceCents
  const { deposits, withdrawals } = splitDepositsWithdrawals(transactions)
  const user = {
    name: session.user?.name ?? null,
    email: session.user?.email ?? null,
    image: session.user?.image ?? null,
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <RedirectToast />
      <div className="mx-auto w-full max-w-6xl px-6 py-8 sm:px-10 sm:py-12">
        <PageHeader
          title={goal.name}
          description={goal.description || undefined}
        >
          <Link
            href="/goals/archived"
            className={buttonVariants({ variant: 'outline' })}
          >
            Archived goals
          </Link>
          <ButtonGroup>
            <UnarchiveGoalDialog
              goalId={goal.id}
              goalSlug={goal.slug}
              goalName={goal.name}
              trigger={<Button />}
            />
            <GoalActionsMenu
              goalId={goal.id}
              goalSlug={goal.slug}
              goalName={goal.name}
              variant="archived-detail"
              deleteRedirect="/goals/archived?toast=goal-deleted"
            />
          </ButtonGroup>
          <UserMenu user={user} />
        </PageHeader>

        <section className="mt-8 sm:mt-12" aria-label="Goal summary">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <p className="text-sm text-muted-foreground">
              {goal.champions.length ? (
                <>
                  {goal.champions.length === 1 ? 'Champion' : 'Champions'}{' '}
                  <span className="text-foreground">
                    {goal.champions.map(getUserLabel).join(', ')}
                  </span>
                </>
              ) : (
                'Shared goal'
              )}
            </p>
            <Badge
              variant="secondary"
              className="rounded-md bg-amber-500/15 text-amber-200"
            >
              Archived
            </Badge>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-amber-200">
            {goal.archivedAt
              ? `Archived on ${formatLongDate(goal.archivedAt)}. This goal is read-only.`
              : 'This goal is archived and read-only.'}
          </p>

          <dl className="mt-8 grid gap-x-8 gap-y-5 sm:grid-cols-3 lg:grid-cols-5 lg:items-start">
            <div className="col-span-full lg:col-span-2">
              <dt className="text-sm text-muted-foreground">Current balance</dt>
              <dd className="mt-2 text-4xl font-medium tracking-tight tabular-nums sm:text-5xl">
                {formatCurrencyFromCents(balance)}
              </dd>
              {goal.targetAmountCents ? (
                <dd className="mt-2 text-sm text-muted-foreground">
                  Target: {formatCurrencyFromCents(goal.targetAmountCents)}
                </dd>
              ) : null}
            </div>
            <div className="flex items-baseline justify-between gap-4 sm:block">
              <dt className="text-sm text-muted-foreground">Deposits</dt>
              <dd className="text-xl font-medium tabular-nums sm:mt-2">
                {formatSignedCurrencyFromCents(deposits)}
              </dd>
            </div>
            <div className="flex items-baseline justify-between gap-4 sm:block">
              <dt className="text-sm text-muted-foreground">Withdrawals</dt>
              <dd className="text-xl font-medium tabular-nums sm:mt-2">
                {formatSignedCurrencyFromCents(-withdrawals)}
              </dd>
            </div>
            <div className="flex items-baseline justify-between gap-4 sm:block">
              <dt className="text-sm text-muted-foreground">Net movement</dt>
              <dd className="text-xl font-medium tabular-nums sm:mt-2">
                {formatSignedCurrencyFromCents(balance)}
              </dd>
            </div>
          </dl>
        </section>

        <div className="mt-10 sm:mt-14">
          <GoalTransactionsTable
            goalSlug={goal.slug}
            transactions={transactions}
            readOnly
          />
        </div>
      </div>
    </main>
  )
}
