import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'

import { addTransactionAction } from '@/app/goals/[goalSlug]/transactions/actions'
import { PageHeader } from '@/components/page-header'
import { TransactionForm } from '@/components/transaction-form'
import { buttonVariants } from '@/components/ui/button'
import { UserMenu } from '@/components/user-menu'
import { requireServerSession } from '@/lib/auth-session'
import { getGoalBySlug } from '@/lib/data/goals'
import { getAllowedUsers } from '@/lib/users'

interface NewTransactionPageProps {
  params: Promise<{ goalSlug: string }>
}

export default async function NewTransactionPage({
  params,
}: NewTransactionPageProps) {
  const { goalSlug } = await params
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
  const user = {
    name: session.user?.name ?? null,
    email: session.user?.email ?? null,
    image: session.user?.image ?? null,
  }

  return (
    <main className="bg-background text-foreground">
      <div className="mx-auto w-full max-w-3xl px-6 py-8 sm:py-12">
        <PageHeader
          title="Add transaction"
          description={`Record a deposit or withdrawal for ${goal.name}.`}
        >
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/goals/${goal.slug}`}
              className={buttonVariants({ variant: 'ghost' })}
            >
              Back to goal
            </Link>
            <UserMenu user={user} />
          </div>
        </PageHeader>

        <section className="mt-10 sm:mt-12">
          <TransactionForm
            action={addTransactionAction.bind(null, goal.slug)}
            successRedirect={`/goals/${goal.slug}`}
            successToastKey="transaction-added"
            cancelHref={`/goals/${goal.slug}`}
            userOptions={userOptions}
          />
        </section>
      </div>
    </main>
  )
}
