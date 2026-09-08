import Link from 'next/link'

import { buttonVariants } from '@/components/ui/button'

export function GoalEmptyState() {
  return (
    <div className="col-span-full py-8 sm:py-12">
      <h2 className="text-2xl font-medium tracking-tight">No goals yet</h2>
      <p className="mt-3 max-w-lg text-base leading-relaxed text-muted-foreground">
        Create a savings goal, choose its champions, and record deposits and
        withdrawals in its ledger.
      </p>
      <Link href="/goals/new" className={buttonVariants({ className: 'mt-6' })}>
        Add your first goal
      </Link>
    </div>
  )
}
