import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

type PageHeaderProps = {
  title: ReactNode
  description?: ReactNode
  children?: ReactNode
  className?: string
  titleClassName?: string
  descriptionClassName?: string
}

export function PageHeader({
  title,
  description,
  children,
  className,
  titleClassName,
  descriptionClassName,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        'flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between',
        className,
      )}
    >
      <div className="min-w-0 space-y-3">
        <h1
          className={cn(
            'text-3xl font-medium tracking-tight sm:text-4xl',
            titleClassName,
          )}
        >
          {title}
        </h1>
        {description ? (
          <p
            className={cn(
              'max-w-2xl text-base leading-relaxed text-muted-foreground',
              descriptionClassName,
            )}
          >
            {description}
          </p>
        ) : null}
      </div>
      {children ? (
        <div className="flex shrink-0 flex-wrap items-center gap-3 sm:justify-end">
          {children}
        </div>
      ) : null}
    </header>
  )
}
