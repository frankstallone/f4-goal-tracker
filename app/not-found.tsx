import Link from 'next/link'

import { buttonVariants } from '@/components/ui/button'

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center bg-background px-6 text-foreground">
      <div className="mx-auto w-full max-w-lg py-12">
        <p className="text-sm text-muted-foreground">404</p>
        <h1 className="mt-4 text-3xl font-medium tracking-tight">
          Goal not found
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          The goal you requested does not exist. Return to your savings goals to
          choose another.
        </p>
        <Link href="/" className={buttonVariants({ className: 'mt-6' })}>
          Return to goals
        </Link>
      </div>
    </main>
  )
}
