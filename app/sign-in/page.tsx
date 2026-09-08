import { redirect } from 'next/navigation'

import { GoogleSignInButton } from '@/components/auth-buttons'
import { getServerSession } from '@/lib/auth-session'

export default async function SignInPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string }>
}) {
  const session = await getServerSession()
  if (session) {
    redirect('/')
  }
  const resolvedSearchParams = searchParams ? await searchParams : undefined
  const isUnauthorized = resolvedSearchParams?.error === 'unauthorized'

  return (
    <main className="bg-background text-foreground">
      <div className="mx-auto flex min-h-svh w-full max-w-lg flex-col justify-center px-6 py-12 sm:px-10">
        <p className="mb-8 text-sm font-medium text-muted-foreground">
          F4 Goal Tracker
        </p>
        <h1 className="text-3xl font-medium tracking-tight sm:text-4xl">
          Sign in to F4 Goal Tracker
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          Use your Google account to access the goal ledger.
        </p>
        {isUnauthorized ? (
          <p
            role="alert"
            className="mt-6 text-sm leading-relaxed text-rose-200"
          >
            This Google account is not authorized to access this app.
          </p>
        ) : null}
        <GoogleSignInButton className="mt-8 w-full" />
      </div>
    </main>
  )
}
