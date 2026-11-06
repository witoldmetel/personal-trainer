import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  CalendarDays,
  ChartLine,
  History,
  LayoutList,
  Upload,
} from 'lucide-react'
import { CategoryBarChart } from '@/components/progress-charts'
import {
  changeLabel,
  ChartCard,
  SummaryCard,
  TrendBadge,
} from '@/components/progress-ui'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { formatDate, isoDaysAgo, todayIso } from '@/lib/dates'
import { useStore } from '@/lib/store'
import { buildProgressView, formatKg } from '@/lib/stats'

export function DashboardPage() {
  const {
    sessions,
    sessionSets,
    exercises,
    programDays,
    todaySession,
    sessionDay,
  } = useStore()
  const session = todaySession()
  const day = session ? sessionDay(session) : undefined

  const view = useMemo(
    () =>
      buildProgressView({
        sessions,
        sessionSets,
        exercises,
        programDays,
        filters: {
          from: isoDaysAgo(90),
          to: todayIso(),
          dayIds: [],
          exerciseId: 'all',
        },
      }),
    [sessions, sessionSets, exercises, programDays],
  )

  const volumeRows = view.volumeSeries.map((point) => ({
    label: point.dateLabel,
    value: Math.round(point.volume),
  }))
  const topMovers = view.movers.slice(0, 5)

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-base font-medium">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Last 90 days at a glance. Open Charts for filters and lift-level trends.
        </p>
      </div>

      <Card>
        <CardHeader className="border-b">
          <CardTitle>Today</CardTitle>
          <CardDescription>{formatDate(todayIso())}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center justify-between gap-3">
          {session ? (
            <>
              <p className="text-sm">
                {day?.name ?? 'Session'} ·{' '}
                {session.status === 'done' ? 'marked done' : 'in progress'}
              </p>
              <Button asChild>
                <Link to="/today">
                  {session.status === 'done' ? 'Review session' : 'Continue logging'}
                </Link>
              </Button>
            </>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                No session yet. Pick a program day and start logging.
              </p>
              <Button asChild>
                <Link to="/today">Start session</Link>
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard label="Sessions" value={String(view.sessionCount)} />
        <SummaryCard
          label="Volume"
          value={view.totalVolume === 0 ? '—' : formatKg(view.totalVolume, 0)}
        />
        <SummaryCard label="Progressing" value={String(view.progressing)} />
        <SummaryCard label="Regressing" value={String(view.regressing)} />
      </div>

      <ChartCard
        title="Session volume"
        description="Total kg × reps per training day in the last 90 days."
      >
        <CategoryBarChart
          rows={volumeRows}
          ariaLabel="Session volume over the last 90 days"
          yLabel="Volume (kg)"
        />
      </ChartCard>

      <Card>
        <CardHeader className="border-b">
          <CardTitle>Biggest movers</CardTitle>
          <CardDescription>
            First vs last session in the last 90 days.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0">
          {topMovers.length === 0 ? (
            <p className="px-4 py-6 text-sm text-muted-foreground">
              Log at least two sessions to see progress.
            </p>
          ) : (
            <ul>
              {topMovers.map((row) => (
                <li
                  key={row.exerciseId}
                  className="flex items-center justify-between gap-3 border-b px-4 py-2.5 last:border-0"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{row.exerciseName}</p>
                    <p className="text-xs text-muted-foreground tabular-nums">
                      {changeLabel(row)}
                    </p>
                  </div>
                  <TrendBadge trend={row.trend} />
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <ActionCard
          to="/today"
          icon={CalendarDays}
          title="Log today"
          body="Open the session table and fill sets."
        />
        <ActionCard
          to="/charts"
          icon={ChartLine}
          title="Open charts"
          body="Filter by day, range, and exercise."
        />
        <ActionCard
          to="/history"
          icon={History}
          title="History"
          body="Fix a mistyped set or delete a day."
        />
        <ActionCard
          to="/programs"
          icon={LayoutList}
          title="Programs"
          body="Edit the Home routine days and lifts."
        />
        <ActionCard
          to="/import"
          icon={Upload}
          title="Import"
          body="Bring in Excel or CSV history."
        />
      </div>
    </div>
  )
}

function ActionCard({
  to,
  icon: Icon,
  title,
  body,
}: {
  to: string
  icon: typeof CalendarDays
  title: string
  body: string
}) {
  return (
    <Link
      to={to}
      className="rounded-xl ring-1 ring-foreground/10 hover:bg-muted"
    >
      <Card className="h-full ring-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon className="size-4" />
            {title}
          </CardTitle>
          <CardDescription>{body}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  )
}
