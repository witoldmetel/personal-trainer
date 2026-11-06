import type { ReactNode } from 'react'
import { Minus, TrendingDown, TrendingUp } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { formatKg, formatPct, formatSignedKg, type ProgressRow } from '@/lib/stats'
import { cn } from '@/lib/utils'

export function describePoint(
  point: ProgressRow['first'],
  metric: ProgressRow['metric'],
) {
  if (metric === 'reps') {
    return `${point.bestReps} reps · ${point.dateLabel}`
  }
  return `${formatKg(point.bestWeightKg)} × ${point.bestReps} · ${point.dateLabel}`
}

export function changeLabel(row: ProgressRow) {
  if (row.metric === 'weight') {
    if (Math.abs(row.deltaWeight) < 0.24) {
      return `e1RM ${formatSignedKg(row.deltaE1rm)}`
    }
    return `${formatSignedKg(row.deltaWeight)} (${formatPct(row.deltaPct)})`
  }
  const sign = row.deltaReps > 0 ? '+' : row.deltaReps < 0 ? '−' : ''
  return `${sign}${Math.abs(row.deltaReps)} reps`
}

export function TrendBadge({ trend }: { trend: ProgressRow['trend'] }) {
  if (trend === 'progress') {
    return (
      <Badge className="gap-1">
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
    <Card className={cn(up && 'ring-primary/30', down && 'ring-destructive/30')}>
      <CardContent className="flex items-center gap-3 py-4">
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
            {row.metric === 'reps'
              ? `${row.deltaReps > 0 ? '+' : ''}${row.deltaReps} reps from ${row.first.dateLabel} to ${row.last.dateLabel}.`
              : Math.abs(row.deltaWeight) < 0.24
                ? `Load unchanged; e1RM ${formatSignedKg(row.deltaE1rm)} from ${row.first.dateLabel} to ${row.last.dateLabel}.`
                : `${formatSignedKg(row.deltaWeight)} (${formatPct(row.deltaPct)}) from ${row.first.dateLabel} to ${row.last.dateLabel}. e1RM ${formatSignedKg(row.deltaE1rm)}.`}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export function SummaryCard({
  label,
  value,
  hint,
}: {
  label: string
  value: string
  hint?: string
}) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-xl tabular-nums">{value}</CardTitle>
        {hint ? <CardDescription>{hint}</CardDescription> : null}
      </CardHeader>
    </Card>
  )
}

export function ChartCard({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: ReactNode
}) {
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}
