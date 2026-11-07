import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function FilterChip({
  active,
  children,
  onClick,
}: {
  active: boolean
  children: ReactNode
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'h-8 cursor-pointer rounded-md border px-3 text-sm font-medium transition-colors',
        active
          ? 'border-primary bg-primary-soft text-primary'
          : 'bg-card text-foreground hover:bg-muted',
      )}
    >
      {children}
    </button>
  )
}
