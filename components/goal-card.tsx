import Image from 'next/image'
import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
import { formatCurrencyFromCents } from '@/lib/format'
import type { GoalSummary } from '@/lib/types'
import { getUserLabel } from '@/lib/user-label'

type GoalCardProps = {
  goal: GoalSummary
  href?: string
}

export function GoalCard({ goal, href }: GoalCardProps) {
  const linkHref = href ?? `/goals/${goal.slug}`

  return (
    <Link
      href={linkHref}
      className="group block min-w-0 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
    >
      <article>
        {goal.coverImageUrl ? (
          <figure className="mb-5">
            <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
              <Image
                src={goal.coverImageUrl}
                alt={`${goal.name} cover`}
                fill
                sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 33vw"
                className="object-cover"
              />
            </div>
            {goal.coverImageAttributionName ? (
              <figcaption className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Photo by {goal.coverImageAttributionName}
              </figcaption>
            ) : null}
          </figure>
        ) : null}
        <div className="space-y-3">
          <div className="space-y-1.5">
            <h2 className="text-xl font-medium leading-snug tracking-tight group-hover:underline group-hover:underline-offset-4">
              {goal.name}
            </h2>
            {goal.description ? (
              <p className="text-sm leading-relaxed text-muted-foreground">
                {goal.description}
              </p>
            ) : null}
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Balance</p>
            <p className="text-2xl font-medium tracking-tight tabular-nums">
              {formatCurrencyFromCents(goal.balanceCents)}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs leading-relaxed text-muted-foreground">
            <span>
              {goal.champions.length
                ? goal.champions.map(getUserLabel).join(' · ')
                : 'Shared goal'}
            </span>
            {goal.isArchived ? (
              <Badge
                variant="secondary"
                className="bg-amber-500/15 text-amber-200"
              >
                Archived
              </Badge>
            ) : null}
          </div>
        </div>
      </article>
    </Link>
  )
}
