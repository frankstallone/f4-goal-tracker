'use client'

import { useTheme } from 'next-themes'
import { Toaster as Sonner, type ToasterProps } from 'sonner'
import {
  CircleCheckIcon,
  InfoIcon,
  TriangleAlertIcon,
  OctagonXIcon,
  Loader2Icon,
} from 'lucide-react'

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'dark' } = useTheme()
  const resolvedTheme = theme === 'system' ? 'dark' : theme

  return (
    <Sonner
      theme={resolvedTheme as ToasterProps['theme']}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
          '--border-radius': 'var(--radius)',
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast:
            'border border-border bg-popover text-popover-foreground shadow-sm rounded-lg',
          title: 'text-sm font-medium text-foreground',
          description: 'text-sm text-muted-foreground',
          actionButton:
            'bg-secondary text-foreground hover:bg-accent rounded-md px-3 py-1 text-xs',
          cancelButton:
            'bg-transparent text-muted-foreground hover:bg-accent rounded-md px-3 py-1 text-xs',
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
