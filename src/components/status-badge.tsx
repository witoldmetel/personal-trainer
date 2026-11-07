import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export type StatusLabel =
  | 'In progress'
  | 'Done'
  | 'No session'
  | 'Past session'

export function sessionStatusLabel(
  status: 'in_progress' | 'done' | undefined,
): StatusLabel {
  if (status === 'in_progress') return 'In progress'
  if (status === 'done') return 'Done'
  return 'No session'
}

export function StatusBadge({
  status,
  className,
}: {
  status: StatusLabel
  className?: string
}) {
  const variant =
    status === 'In progress'
      ? 'default'
      : status === 'Done'
        ? 'success'
        : status === 'No session'
          ? 'secondary'
          : 'outline'

  return (
    <Badge variant={variant} className={cn('font-medium', className)}>
      {status === 'In progress' ? (
        <span className="size-1.5 animate-pulse rounded-full bg-primary-foreground" />
      ) : null}
      {status}
    </Badge>
  )
}
