import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'

import { EditGoalForm } from '@/components/edit-goal-form'
import { PageHeader } from '@/components/page-header'
import { UserMenu } from '@/components/user-menu'
import { buttonVariants } from '@/components/ui/button'
import { requireServerSession } from '@/lib/auth-session'
import { getGoalBySlug } from '@/lib/data/goals'
import { getAllowedUsers } from '@/lib/users'

interface EditGoalPageProps {
  params: Promise<{ goalSlug: string }>
}

export default async function EditGoalPage({ params }: EditGoalPageProps) {
  const { goalSlug } = await params
  const sessionPromise = requireServerSession()
  const goalPromise = getGoalBySlug(goalSlug)
  const championOptionsPromise = getAllowedUsers()
  const [session, goal, championOptions] = await Promise.all([
    sessionPromise,
    goalPromise,
    championOptionsPromise,
  ])
  if (!goal) {
    notFound()
  }
  if (goal.isArchived) {
    redirect(`/goals/${goal.slug}`)
  }
  const defaultChampionIds = goal.champions.map((champion) => champion.id)
  const user = {
    name: session.user?.name ?? null,
    email: session.user?.email ?? null,
    image: session.user?.image ?? null,
  }

  return (
    <main className="bg-background text-foreground">
      <div className="mx-auto w-full max-w-3xl px-6 py-8 sm:py-12">
        <PageHeader
          title="Edit goal"
          description={`Update the details for ${goal.name}.`}
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
          <EditGoalForm
            goal={goal}
            championOptions={championOptions}
            defaultChampionIds={defaultChampionIds}
            successRedirect={`/goals/${goal.slug}`}
          />
        </section>
      </div>
    </main>
  )
}
