'use client'

import * as React from 'react'
import Link from 'next/link'

import {
  ArchiveGoalDialog,
  UnarchiveGoalDialog,
} from '@/components/archive-goal-dialog'
import { DeleteGoalDialog } from '@/components/delete-goal-dialog'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { Ellipsis } from 'lucide-react'

export type GoalActionsMenuVariant = 'active' | 'archived' | 'archived-detail'

type GoalActionsMenuProps = {
  goalId: string
  goalSlug: string
  goalName: string
  variant: GoalActionsMenuVariant
  deleteRedirect?: string
  triggerVariant?: React.ComponentProps<typeof Button>['variant']
  triggerClassName?: string
}

export function GoalActionsMenu({
  goalId,
  goalSlug,
  goalName,
  variant,
  deleteRedirect,
  triggerVariant = 'default',
  triggerClassName,
}: GoalActionsMenuProps) {
  const [archiveOpen, setArchiveOpen] = React.useState(false)
  const [unarchiveOpen, setUnarchiveOpen] = React.useState(false)
  const [deleteOpen, setDeleteOpen] = React.useState(false)

  const showEdit = variant === 'active'
  const showArchive = variant === 'active'
  const showUnarchive = variant === 'archived'
  const showDivider = showEdit || showArchive || showUnarchive

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant={triggerVariant}
              size="icon"
              className={cn(triggerClassName)}
              aria-label="Open goal actions"
            />
          }
        >
          <Ellipsis />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="border-white/10 bg-slate-950 text-slate-100"
        >
          {showEdit ? (
            <DropdownMenuItem
              render={
                <Link href={`/goals/${goalSlug}/edit`} className="w-full" />
              }
            >
              Edit goal
            </DropdownMenuItem>
          ) : null}
          {showArchive ? (
            <DropdownMenuItem onClick={() => setArchiveOpen(true)}>
              Archive goal
            </DropdownMenuItem>
          ) : null}
          {showUnarchive ? (
            <DropdownMenuItem onClick={() => setUnarchiveOpen(true)}>
              Restore goal
            </DropdownMenuItem>
          ) : null}
          {showDivider ? (
            <DropdownMenuSeparator className="bg-white/10" />
          ) : null}
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setDeleteOpen(true)}
          >
            Delete goal
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {showArchive ? (
        <ArchiveGoalDialog
          goalSlug={goalSlug}
          goalName={goalName}
          open={archiveOpen}
          onOpenChange={setArchiveOpen}
          trigger={null}
        />
      ) : null}
      {showUnarchive ? (
        <UnarchiveGoalDialog
          goalId={goalId}
          goalSlug={goalSlug}
          goalName={goalName}
          open={unarchiveOpen}
          onOpenChange={setUnarchiveOpen}
          trigger={null}
        />
      ) : null}
      <DeleteGoalDialog
        goalId={goalId}
        goalName={goalName}
        successRedirect={deleteRedirect}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        trigger={null}
      />
    </>
  )
}
