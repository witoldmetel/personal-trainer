import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  ChartLine,
  ChevronRight,
  History,
  LayoutList,
  Upload,
} from 'lucide-react'
import { CategoryBarChart } from '@/components/progress-charts'
import {
  changeLabel,
  ChartCard,
  describePoint,
  SummaryCard,
  TrendBadge,
} from '@/components/progress-ui'
import { FadeIn } from '@/components/motion-ui'
import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { compareIso, formatDate, isoDaysAgo, todayIso } from '@/lib/dates'
import { useStore } from '@/lib/store'
import { buildProgressView, formatPct } from '@/lib/stats'
import { isFilledSet } from '@/lib/types'

export function DashboardPage() {
  const {
    programs,
    sessions,
    sessionSets,
    exercises,
    programDays,
    todaySession,
    sessionDay,
  } = useStore()
  const session = todaySession()
  const day = session ? sessionDay(session) : undefined
  const program = programs.find((p) => p.id === day?.programId) ?? programs[0]

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

  const prior = useMemo(
    () =>
      buildProgressView({
        sessions,
        sessionSets,
        exercises,
        programDays,
        filters: {
          from: isoDaysAgo(180),
          to: isoDaysAgo(91),
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
  const todaySets = session
    ? sessionSets.filter((set) => set.sessionId === session.id)
    : []
  const loggedSets = todaySets.filter((set) => set.reps != null).length
  const volumeDelta =
    prior.totalVolume > 0
      ? (view.totalVolume - prior.totalVolume) / prior.totalVolume
      : 0
  const recentSessions = useMemo(() => {
    const withSets = sessions.filter((row) =>
      sessionSets.some((set) => set.sessionId === row.id && isFilledSet(set)),
    )
    return [...withSets]
      .sort((a, b) => {
        const byDate = compareIso(b.performedOn, a.performedOn)
        return byDate !== 0 ? byDate : a.id.localeCompare(b.id)
      })
      .slice(0, 4)
  }, [sessions, sessionSets])

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Last 90 days of training, and today’s session."
      />

      <div className="grid gap-4 lg:grid-cols-[1.1fr_2fr]">
        <FadeIn className="flex flex-col justify-between rounded-lg border border-primary/30 bg-primary-soft p-5">
          <div>
            <div className="eyebrow text-primary">Today</div>
            <div className="mt-2 text-sm text-muted-foreground num">
              {formatDate(todayIso())}
            </div>
            <div className="mt-1 text-xl font-semibold">
              {session
                ? `${program?.name ?? 'Session'}${day ? ` · ${day.name}` : ''}`
                : 'No session yet'}
            </div>
            <div className="mt-3 text-sm text-muted-foreground">
              {session ? (
                <span className="num">
                  {loggedSets} of {todaySets.length} sets logged
                </span>
              ) : (
                <span>Pick a program day and start logging.</span>
              )}
            </div>
          </div>
          <Button asChild className="mt-6 self-start">
            <Link to="/today">
              {session
                ? session.status === 'done'
                  ? 'Edit session'
                  : 'Continue session'
                : 'Start session'}
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </FadeIn>

        <FadeIn delay={0.05} className="grid grid-cols-2 gap-4">
          <SummaryCard
            label="Sessions"
            value={String(view.sessionCount)}
            hint={
              view.sessionCount > 0
                ? `~${(view.sessionCount / (90 / 7)).toFixed(0)} per week`
                : undefined
            }
          />
          <SummaryCard
            label="Volume (kg)"
            value={
              view.totalVolume === 0
                ? '—'
                : Math.round(view.totalVolume).toLocaleString('en-GB')
            }
            hint={
              prior.totalVolume > 0
                ? `${formatPct(volumeDelta * 100)} vs prior 90 days`
                : undefined
            }
          />
          <SummaryCard
            label="Progressing"
            value={String(view.progressing)}
            hint="lifts trending up"
            tone="up"
          />
          <SummaryCard
            label="Regressing"
            value={String(view.regressing)}
            hint="lifts trending down"
            tone="down"
          />
        </FadeIn>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[3fr_2fr]">
        <FadeIn delay={0.08}>
        <ChartCard title="Session volume (kg) · last 90 days">
          <CategoryBarChart
            rows={volumeRows}
            ariaLabel="Session volume over the last 90 days"
            yLabel="Volume (kg)"
          />
        </ChartCard>
        </FadeIn>
        <FadeIn delay={0.12} className="overflow-hidden rounded-lg border bg-card">
          <div className="border-b px-4 py-3">
            <h2 className="text-sm font-semibold">Top movers</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              First vs last in the last 90 days.
            </p>
          </div>
          {topMovers.length === 0 ? (
            <p className="px-4 py-6 text-sm text-muted-foreground">
              Log at least two sessions to see progress.
            </p>
          ) : (
            <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/60 text-left">
                <tr>
                  <th className="eyebrow px-4 py-2">Exercise</th>
                  <th className="eyebrow px-3 py-2">First</th>
                  <th className="eyebrow px-3 py-2">Last</th>
                  <th className="eyebrow px-3 py-2">Change</th>
                  <th className="eyebrow px-3 py-2">Trend</th>
                </tr>
              </thead>
              <tbody>
                {topMovers.map((row) => (
                  <tr key={row.exerciseId} className="border-t">
                    <td className="px-4 py-2 align-middle font-medium">
                      {row.exerciseName}
                    </td>
                    <td className="px-3 py-2 align-middle text-muted-foreground num whitespace-nowrap">
                      {describePoint(row.first, row.metric)}
                    </td>
                    <td className="px-3 py-2 align-middle text-muted-foreground num whitespace-nowrap">
                      {describePoint(row.last, row.metric)}
                    </td>
                    <td className="px-3 py-2 align-middle num whitespace-nowrap">
                      {changeLabel(row)}
                    </td>
                    <td className="px-3 py-2 align-middle">
                      <TrendBadge trend={row.trend} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          )}
        </FadeIn>
      </div>

      <FadeIn delay={0.16} className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { to: '/programs', label: 'Programs', icon: LayoutList },
          { to: '/history', label: 'History', icon: History },
          { to: '/charts', label: 'Charts', icon: ChartLine },
          { to: '/import', label: 'Import', icon: Upload },
        ].map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="group flex items-center gap-3 rounded-lg border bg-card px-4 py-3 text-sm font-medium hover:border-primary/40"
          >
            <item.icon className="size-4 text-primary" />
            {item.label}
            <ArrowRight className="ml-auto size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
          </Link>
        ))}
      </FadeIn>

      <FadeIn delay={0.2} className="mt-4 overflow-hidden rounded-lg border bg-card">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h2 className="text-sm font-semibold">Recent trainings</h2>
          <Button asChild variant="ghost" size="sm" className="h-7 text-primary">
            <Link to="/history">
              All history
              <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        </div>
        {recentSessions.length === 0 ? (
          <p className="px-4 py-6 text-sm text-muted-foreground">
            Finish a session to see it here.
          </p>
        ) : (
          <div className="divide-y">
            {recentSessions.map((row) => {
              const rowDay = sessionDay(row)
              const setCount = sessionSets.filter(
                (set) => set.sessionId === row.id && isFilledSet(set),
              ).length
              return (
                <Link
                  key={row.id}
                  to={`/history/${row.id}`}
                  className="flex items-center gap-4 px-4 py-2.5 hover:bg-muted/50"
                >
                  <span className="w-36 text-sm font-medium num">
                    {formatDate(row.performedOn)}
                  </span>
                  <span className="flex-1 text-sm text-muted-foreground num">
                    {rowDay?.name ?? 'Session'} · {setCount} sets
                  </span>
                  <ChevronRight className="size-4 text-muted-foreground" />
                </Link>
              )
            })}
          </div>
        )}
      </FadeIn>
    </div>
  )
}
