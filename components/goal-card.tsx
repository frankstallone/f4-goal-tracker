import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { formatCurrencyFromCents } from "@/lib/format"
import type { GoalSummary } from "@/lib/types"
import { cn } from "@/lib/utils"

const FALLBACK_GRADIENTS = [
  "from-emerald-500/30 via-emerald-500/10 to-transparent",
  "from-sky-500/30 via-sky-500/10 to-transparent",
  "from-amber-500/30 via-amber-500/10 to-transparent",
  "from-rose-500/30 via-rose-500/10 to-transparent",
  "from-indigo-500/30 via-indigo-500/10 to-transparent",
]

type GoalCardProps = {
  goal: GoalSummary
  index: number
}

export function GoalCard({ goal, index }: GoalCardProps) {
  const gradient = FALLBACK_GRADIENTS[index % FALLBACK_GRADIENTS.length]
  const progress = goal.targetAmountCents
    ? Math.max(0, Math.min(1, goal.balanceCents / goal.targetAmountCents))
    : null

  return (
    <Link
      href={`/goals/${goal.slug}`}
      className="group block h-full transition"
    >
      <Card className="relative h-full overflow-hidden border-white/10 bg-slate-900/60 text-slate-100 shadow-[0_20px_60px_-40px_rgba(0,0,0,0.8)]">
        <div className="absolute inset-0">
          <div
            className={cn(
              "absolute inset-0 bg-gradient-to-br",
              gradient
            )}
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_55%)]" />
        </div>
        <div className="relative">
          {goal.coverImageUrl ? (
            <div className="h-32 w-full overflow-hidden">
              <img
                src={goal.coverImageUrl}
                alt={`${goal.name} cover`}
                className="h-full w-full object-cover opacity-60 transition duration-500 group-hover:scale-105"
              />
            </div>
          ) : (
            <div className="h-32 w-full" />
          )}
          <CardHeader className="space-y-3">
            <CardTitle className="text-xl font-semibold tracking-tight">
              {goal.name}
            </CardTitle>
            {goal.description ? (
              <CardDescription className="text-slate-300">
                {goal.description}
              </CardDescription>
            ) : null}
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                Balance
              </p>
              <p className="text-2xl font-semibold text-white">
                {formatCurrencyFromCents(goal.balanceCents)}
              </p>
            </div>
            {progress !== null ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Target</span>
                  <span>{Math.round(progress * 100)}%</span>
                </div>
                <div className="h-2 rounded-full bg-white/10">
                  <div
                    className="h-2 rounded-full bg-emerald-400/80"
                    style={{ width: `${Math.round(progress * 100)}%` }}
                  />
                </div>
              </div>
            ) : null}
          </CardContent>
          <CardFooter className="flex flex-wrap items-center gap-2">
            {goal.champions.length ? (
              goal.champions.map((champion) => (
                <Badge key={champion} variant="secondary" className="bg-white/10 text-white">
                  {champion}
                </Badge>
              ))
            ) : (
              <Badge variant="secondary" className="bg-white/10 text-white">
                Shared Goal
              </Badge>
            )}
            <Badge variant="secondary" className="ml-auto bg-white/10 text-white">
              View
            </Badge>
          </CardFooter>
        </div>
      </Card>
    </Link>
  )
}
