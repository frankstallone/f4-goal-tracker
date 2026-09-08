import Link from 'next/link'

import { GoalCard } from '@/components/goal-card'
import { PageHeader } from '@/components/page-header'
import { RedirectToast } from '@/components/redirect-toast'
import { UserMenu } from '@/components/user-menu'
import { buttonVariants } from '@/components/ui/button'
import { requireServerSession } from '@/lib/auth-session'
import { getArchivedGoals } from '@/lib/data/goals'

export default async function ArchivedGoalsPage() {
  const sessionPromise = requireServerSession()
  const goalsPromise = getArchivedGoals()
  const [session, goals] = await Promise.all([sessionPromise, goalsPromise])
  const user = {
    name: session.user?.name ?? null,
    email: session.user?.email ?? null,
    image: session.user?.image ?? null,
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <RedirectToast />
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-8 sm:px-10 sm:py-12">
        <PageHeader
          title="Archived goals"
          description="Read-only goals kept for reference, transfers, and history."
          descriptionClassName="max-w-xl"
        >
          <div className="flex gap-2 items-center">
            <Link href="/" className={buttonVariants({ variant: 'outline' })}>
              All goals
            </Link>
            <UserMenu user={user} />
          </div>
        </PageHeader>

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {goals.length ? (
            goals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                href={`/goals/archived/${goal.id}`}
              />
            ))
          ) : (
            <div className="col-span-full py-8 text-sm text-muted-foreground">
              No archived goals yet.
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
