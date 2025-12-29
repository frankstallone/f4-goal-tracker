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
            'border border-white/10 bg-slate-950 text-slate-100 shadow-2xl rounded-3xl',
          title: 'text-sm font-semibold text-slate-100',
          description: 'text-xs text-slate-400',
          actionButton:
            'bg-white/10 text-slate-100 hover:bg-white/20 rounded-full px-3 py-1 text-xs',
          cancelButton:
            'bg-transparent text-slate-400 hover:bg-white/10 rounded-full px-3 py-1 text-xs',
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
