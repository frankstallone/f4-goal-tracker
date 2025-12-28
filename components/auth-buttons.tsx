'use client'

import { useState, type ComponentProps } from 'react'

import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth-client'
import { cn } from '@/lib/utils'

export function GoogleSignInButton({ className }: { className?: string }) {
  const [isLoading, setIsLoading] = useState(false)

  const handleSignIn = async () => {
    setIsLoading(true)
    try {
      await authClient.signIn.social({ provider: 'google' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleSignIn}
      disabled={isLoading}
      className={cn('gap-2', className)}
    >
      {isLoading ? 'Connecting…' : 'Continue with Google'}
    </Button>
  )
}

export function SignOutButton({
  className,
  ...props
}: ComponentProps<typeof Button>) {
  const [isLoading, setIsLoading] = useState(false)

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
    <Button
      variant="outline"
      className={className}
      onClick={handleSignOut}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? 'Signing out…' : 'Sign out'}
    </Button>
  )
}
