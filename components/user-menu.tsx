'use client'

import * as React from 'react'

import { authClient } from '@/lib/auth-client'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

type UserMenuUser = {
  name?: string | null
  email?: string | null
  image?: string | null
}

type UserMenuProps = {
  user: UserMenuUser
  className?: string
}

const getInitials = (user: UserMenuUser) => {
  if (user.name) {
    const parts = user.name.trim().split(/\s+/)
    const first = parts[0]?.[0] ?? ''
    const second = parts[1]?.[0] ?? ''
    return `${first}${second}`.toUpperCase() || 'U'
  }
  if (user.email) {
    return user.email.slice(0, 2).toUpperCase()
  }
  return 'U'
}

export function UserMenu({ user, className }: UserMenuProps) {
  const [isLoading, setIsLoading] = React.useState(false)

  const handleSignOut = async () => {
    setIsLoading(true)
    try {
      await authClient.signOut()
      window.location.assign('/sign-in')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            className={cn(
              'flex h-11 w-11 items-center justify-center rounded-full bg-secondary text-foreground transition-colors hover:bg-white/14 aria-expanded:bg-white/14 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              className,
            )}
            aria-label="Open user menu"
          />
        }
      >
        <Avatar className="h-full w-full">
          {user.image ? (
            <AvatarImage src={user.image} alt={user.name ?? 'User avatar'} />
          ) : null}
          <AvatarFallback className="bg-transparent">
            {getInitials(user)}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-64 border-white/10 bg-popover text-foreground"
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex flex-col items-start gap-1 py-3 text-left">
            <span className="text-sm font-semibold text-foreground">
              {user.name ?? 'Account'}
            </span>
            <span className="break-all text-xs text-muted-foreground">
              {user.email ?? ''}
            </span>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="bg-white/10" />
        <DropdownMenuItem
          variant="destructive"
          onClick={handleSignOut}
          disabled={isLoading}
        >
          {isLoading ? 'Signing out…' : 'Sign out'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
