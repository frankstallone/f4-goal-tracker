import Link from 'next/link'

import { GoalCard } from '@/components/goal-card'
import { GoalEmptyState } from '@/components/goal-empty-state'
import { PageHeader } from '@/components/page-header'
import { RedirectToast } from '@/components/redirect-toast'
import { UserMenu } from '@/components/user-menu'
import { buttonVariants } from '@/components/ui/button'
import { getGoals } from '@/lib/data/goals'
import { formatCurrencyFromCents } from '@/lib/format'
import { requireServerSession } from '@/lib/auth-session'

export default async function HomePage() {
  const sessionPromise = requireServerSession()
  const goalsPromise = getGoals()
  const [session, goals] = await Promise.all([sessionPromise, goalsPromise])
  const user = {
    name: session.user?.name ?? null,
    email: session.user?.email ?? null,
    image: session.user?.image ?? null,
  }
  const totalBalance = goals.reduce((sum, goal) => sum + goal.balanceCents, 0)

  return (
    <main className="bg-background text-foreground">
      <RedirectToast />
      <div className="mx-auto w-full max-w-6xl px-6 py-8 sm:px-10 sm:py-12">
        <nav
          aria-label="Main navigation"
          className="mb-12 flex items-center justify-between gap-4"
        >
          <span className="text-sm font-medium">F4 Goal Tracker</span>
          <div className="flex items-center gap-3 sm:gap-6">
            <Link
              href="/goals/archived"
              className={buttonVariants({ variant: 'ghost' })}
            >
              Archived goals
            </Link>
            <UserMenu user={user} />
          </div>
        </nav>

        <PageHeader
          title="Savings goals"
          description="Track balances, deposits, and withdrawals for every goal."
        >
          {goals.length ? (
            <Link href="/goals/new" className={buttonVariants()}>
              New goal
            </Link>
          ) : null}
        </PageHeader>

        <div className="my-10 flex flex-wrap items-end justify-between gap-4 border-b border-border pb-8">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Total balance</p>
            <p className="text-4xl font-medium tracking-tight tabular-nums sm:text-5xl">
              {formatCurrencyFromCents(totalBalance)}
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            {goals.length} active {goals.length === 1 ? 'goal' : 'goals'}
          </p>
        </div>

        <section
          aria-label="Active goals"
          className="grid gap-x-8 gap-y-12 md:grid-cols-2 xl:grid-cols-3"
        >
          {goals.length ? (
            goals.map((goal) => <GoalCard key={goal.id} goal={goal} />)
          ) : (
            <GoalEmptyState />
          )}
        </section>
      </div>
    </main>
  )
}
