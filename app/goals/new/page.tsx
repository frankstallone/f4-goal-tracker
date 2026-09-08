import Link from 'next/link'

import { NewGoalForm } from '@/components/new-goal-form'
import { PageHeader } from '@/components/page-header'
import { UserMenu } from '@/components/user-menu'
import { buttonVariants } from '@/components/ui/button'
import { requireServerSession } from '@/lib/auth-session'
import { getAllowedUsers } from '@/lib/users'

export default async function NewGoalPage() {
  const sessionPromise = requireServerSession()
  const championOptionsPromise = getAllowedUsers()
  const [session, championOptions] = await Promise.all([
    sessionPromise,
    championOptionsPromise,
  ])
  const defaultChampionIds = session?.user?.id ? [session.user.id] : []
  const user = {
    name: session.user?.name ?? null,
    email: session.user?.email ?? null,
    image: session.user?.image ?? null,
  }
  return (
    <main className="bg-background text-foreground">
      <div className="mx-auto w-full max-w-3xl px-6 py-8 sm:py-12">
        <PageHeader
          title="Create a savings goal"
          description="Name your goal and choose who will help it grow."
        >
          <div className="flex flex-wrap items-center gap-2">
            <Link href="/" className={buttonVariants({ variant: 'ghost' })}>
              Back to goals
            </Link>
            <UserMenu user={user} />
          </div>
        </PageHeader>

        <section className="mt-10 sm:mt-12">
          <NewGoalForm
            championOptions={championOptions}
            defaultChampionIds={defaultChampionIds}
          />
        </section>
      </div>
    </main>
  )
}
