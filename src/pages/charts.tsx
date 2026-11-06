import { useMemo, useState } from 'react'
import { CategoryBarChart, TimeSeriesChart } from '@/components/progress-charts'
import {
  changeLabel,
  ChartCard,
  describePoint,
  SummaryCard,
  TrendBadge,
  TrendCallout,
} from '@/components/progress-ui'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { isoDaysAgo, todayIso } from '@/lib/dates'
import { useStore } from '@/lib/store'
import { buildProgressView, formatKg, type DashboardFilters } from '@/lib/stats'

type RangePreset = '30' | '90' | 'all' | 'custom'

export function ChartsPage() {
  const { sessions, sessionSets, exercises, programDays, programExercises } =
    useStore()
  const [preset, setPreset] = useState<RangePreset>('90')
  const [from, setFrom] = useState(isoDaysAgo(90))
  const [to, setTo] = useState(todayIso())
  const [dayIds, setDayIds] = useState<string[]>([])
  const [exerciseId, setExerciseId] = useState('all')

  const earliest = sessions.reduce(
    (min, session) => (session.performedOn < min ? session.performedOn : min),
    todayIso(),
  )

  function applyPreset(next: RangePreset) {
    setPreset(next)
    setTo(todayIso())
    if (next === '30') setFrom(isoDaysAgo(30))
    if (next === '90') setFrom(isoDaysAgo(90))
    if (next === 'all') setFrom(earliest)
  }

  const days = useMemo(
    () => [...programDays].sort((a, b) => a.sortOrder - b.sortOrder),
    [programDays],
  )

  const exerciseOptions = useMemo(() => {
    const allowed =
      dayIds.length === 0
        ? new Set(exercises.map((e) => e.id))
        : new Set(
            programExercises
              .filter((pe) => dayIds.includes(pe.programDayId))
              .map((pe) => pe.exerciseId),
          )
    return [...exercises]
      .filter((e) => allowed.has(e.id))
      .sort((a, b) => a.name.localeCompare(b.name, 'en'))
  }, [dayIds, exercises, programExercises])

  const filters: DashboardFilters = { from, to, dayIds, exerciseId }

  const view = useMemo(
    () =>
      buildProgressView({
        sessions,
        sessionSets,
        exercises,
        programDays,
        filters,
      }),
    [sessions, sessionSets, exercises, programDays, from, to, dayIds, exerciseId],
  )

  const selectedExercise = exercises.find((e) => e.id === exerciseId)
  const selectedMover = view.movers.find((row) => row.exerciseId === exerciseId)
  const loadRows = view.points.map((p) => ({
    date: p.date,
    dateIso: p.dateIso,
    value: p.bestWeightKg,
  }))
  const e1rmRows = view.points.map((p) => ({
    date: p.date,
    dateIso: p.dateIso,
    value: Math.round(p.e1rm * 10) / 10,
  }))
  const exerciseVolumeRows = view.volumeSeries.map((p) => ({
    label: p.dateLabel,
    value: Math.round(p.volume),
  }))
  const dayVolumeRows = view.dayVolume.map((p) => ({
    label: p.dayName,
    value: Math.round(p.volume),
  }))

  function toggleDay(id: string) {
    setDayIds((current) =>
      current.includes(id) ? current.filter((d) => d !== id) : [...current, id],
    )
    setExerciseId('all')
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-base font-medium">Charts</h1>
        <p className="text-sm text-muted-foreground">
          Filter by day, date range, and exercise. See load, volume, and estimated 1RM.
        </p>
      </div>

      <Card>
        <CardHeader className="border-b">
          <CardTitle>Filters</CardTitle>
          <CardDescription>
            Narrow by program day, date range, and exercise.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label>Range</Label>
            <div className="flex flex-wrap gap-1.5">
              {(
                [
                  ['30', 'Last 30 days'],
                  ['90', 'Last 90 days'],
                  ['all', 'All history'],
                ] as const
              ).map(([id, label]) => (
                <Button
                  key={id}
                  type="button"
                  size="sm"
                  variant={preset === id ? 'default' : 'outline'}
                  onClick={() => applyPreset(id)}
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="from">From</Label>
              <Input
                id="from"
                type="date"
                value={from}
                max={to}
                onChange={(e) => {
                  setPreset('custom')
                  setFrom(e.target.value)
                }}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="to">To</Label>
              <Input
                id="to"
                type="date"
                value={to}
                min={from}
                max={todayIso()}
                onChange={(e) => {
                  setPreset('custom')
                  setTo(e.target.value)
                }}
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Program days</Label>
            <div className="flex flex-wrap gap-1.5">
              <Button
                type="button"
                size="sm"
                variant={dayIds.length === 0 ? 'default' : 'outline'}
                onClick={() => {
                  setDayIds([])
                  setExerciseId('all')
                }}
              >
                All days
              </Button>
              {days.map((day) => (
                <Button
                  key={day.id}
                  type="button"
                  size="sm"
                  variant={dayIds.includes(day.id) ? 'default' : 'outline'}
                  onClick={() => toggleDay(day.id)}
                >
                  {day.name}
                </Button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Exercise</Label>
            <Select value={exerciseId} onValueChange={setExerciseId}>
              <SelectTrigger className="w-full max-w-sm">
                <SelectValue placeholder="All exercises" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All exercises</SelectItem>
                {exerciseOptions.map((exercise) => (
                  <SelectItem key={exercise.id} value={exercise.id}>
                    {exercise.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard label="Sessions" value={String(view.sessionCount)} />
        <SummaryCard
          label="Volume"
          value={view.totalVolume === 0 ? '—' : formatKg(view.totalVolume, 0)}
        />
        <SummaryCard
          label="Progressing"
          value={String(view.progressing)}
          hint="lifts up vs first session in range"
        />
        <SummaryCard
          label="Regressing"
          value={String(view.regressing)}
          hint="lifts down vs first session in range"
        />
      </div>

      {selectedExercise && selectedMover ? (
        <TrendCallout row={selectedMover} />
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2">
        {exerciseId === 'all' ? (
          <>
            <ChartCard
              title="Session volume"
              description="Total kg × reps across every filled set that day."
            >
              <CategoryBarChart
                rows={exerciseVolumeRows}
                ariaLabel="Session volume over time"
                yLabel="Volume (kg)"
              />
            </ChartCard>
            <ChartCard
              title="Volume by day"
              description="Which program days contributed the work."
            >
              <CategoryBarChart
                rows={dayVolumeRows}
                ariaLabel="Volume by program day"
                yLabel="Volume (kg)"
              />
            </ChartCard>
          </>
        ) : (
          <>
            <ChartCard
              title={`Best weight · ${selectedExercise?.name ?? 'Exercise'}`}
              description="Heaviest filled set each session. Dashed line is the trend."
            >
              <TimeSeriesChart
                rows={loadRows}
                ariaLabel="Best weight over time"
                yLabel="kg"
                showTrend
              />
            </ChartCard>
            <ChartCard
              title="Estimated 1RM"
              description="Epley estimate from the strongest set that session."
            >
              <TimeSeriesChart
                rows={e1rmRows}
                ariaLabel="Estimated one-rep max over time"
                yLabel="kg"
                showTrend
              />
            </ChartCard>
            <ChartCard
              title="Exercise volume"
              description="kg × reps for this lift only."
            >
              <CategoryBarChart
                rows={exerciseVolumeRows}
                ariaLabel="Exercise volume over time"
                yLabel="Volume (kg)"
              />
            </ChartCard>
          </>
        )}
      </div>

      <Card>
        <CardHeader className="border-b">
          <CardTitle>Progress and regress</CardTitle>
          <CardDescription>
            First vs last logged session in the current filters.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0">
          {view.movers.length === 0 ? (
            <p className="px-4 py-6 text-sm text-muted-foreground">
              Log at least two sessions for an exercise in this range.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-sm">
                <thead className="bg-muted/50 text-left text-muted-foreground">
                  <tr className="border-b">
                    <th className="px-4 py-2 font-medium">Exercise</th>
                    <th className="px-4 py-2 font-medium">First</th>
                    <th className="px-4 py-2 font-medium">Last</th>
                    <th className="px-4 py-2 font-medium">Change</th>
                    <th className="px-4 py-2 font-medium">Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {view.movers.map((row) => (
                    <tr key={row.exerciseId} className="border-b last:border-0">
                      <td className="px-4 py-2 font-medium">{row.exerciseName}</td>
                      <td className="px-4 py-2 tabular-nums text-muted-foreground">
                        {describePoint(row.first, row.metric)}
                      </td>
                      <td className="px-4 py-2 tabular-nums text-muted-foreground">
                        {describePoint(row.last, row.metric)}
                      </td>
                      <td className="px-4 py-2 tabular-nums">{changeLabel(row)}</td>
                      <td className="px-4 py-2">
                        <TrendBadge trend={row.trend} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
