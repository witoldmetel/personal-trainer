import type { ReactNode } from 'react'
import { Minus, TrendingDown, TrendingUp } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { formatKg, formatPct, formatSignedKg, type ProgressRow } from '@/lib/stats'
import { cn } from '@/lib/utils'

export function describePoint(
  point: ProgressRow['first'],
  metric: ProgressRow['metric'],
) {
  if (metric === 'reps') return `${point.bestReps} reps`
  return formatKg(point.bestWeightKg)
}

function repsChange(delta: number) {
  if (delta === 0) return '0 reps'
  const sign = delta > 0 ? '+' : '−'
  return `${sign}${Math.abs(delta)} reps`
}

export function changeLabel(row: ProgressRow) {
  if (row.metric === 'reps') {
    return `${repsChange(row.deltaReps)} (${formatPct(row.deltaPct)})`
  }
  return `${formatSignedKg(row.deltaWeight)} (${formatPct(row.deltaPct)})`
}

export function TrendBadge({ trend }: { trend: ProgressRow['trend'] }) {
  if (trend === 'progress') {
    return (
      <Badge variant="success" className="gap-1">
        <TrendingUp className="size-3" />
        Progress
      </Badge>
    )
  }
  if (trend === 'regress') {
    return (
      <Badge variant="destructive" className="gap-1">
        <TrendingDown className="size-3" />
        Regress
      </Badge>
    )
  }
  return (
    <Badge variant="secondary" className="gap-1">
      <Minus className="size-3" />
      Same
    </Badge>
  )
}

export function TrendCallout({ row }: { row: ProgressRow }) {
  const up = row.trend === 'progress'
  const down = row.trend === 'regress'
  return (
    <div
      className={cn(
        'mb-6 flex items-center gap-3 rounded-lg border p-4',
        up && 'border-primary/30 bg-primary-soft',
        down && 'border-destructive/30 bg-destructive/5',
      )}
    >
      {up ? (
        <TrendingUp className="size-5 text-primary" />
      ) : down ? (
        <TrendingDown className="size-5 text-destructive" />
      ) : (
        <Minus className="size-5 text-muted-foreground" />
      )}
      <div>
        <p className="text-sm font-medium">{row.exerciseName}</p>
        <p className="text-sm text-muted-foreground">
          {`${changeLabel(row)} from ${row.first.dateLabel} to ${row.last.dateLabel}.`}
        </p>
      </div>
    </div>
  )
}

export function SummaryCard({
  label,
  value,
  hint,
  tone,
}: {
  label: string
  value: string
  hint?: string
  tone?: 'up' | 'down'
}) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="eyebrow">{label}</div>
      <div
        className={cn(
          'mt-2 text-2xl font-semibold num',
          tone === 'up' && 'text-success',
          tone === 'down' && 'text-destructive',
        )}
      >
        {value}
      </div>
      {hint ? (
        <div className="mt-0.5 text-xs text-muted-foreground">{hint}</div>
      ) : null}
    </div>
  )
}

export function ChartCard({
  title,
  description,
  children,
  className,
}: {
  title: string
  description?: string
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn('overflow-hidden rounded-lg border bg-card', className)}>
      <div className="border-b px-4 py-3">
        <h2 className="text-sm font-semibold">{title}</h2>
        {description ? (
          <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
        ) : null}
      </div>
      <div className="p-4">{children}</div>
    </div>
  )
}
