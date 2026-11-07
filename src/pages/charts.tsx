import { useMemo, useState } from 'react'
import { FilterChip } from '@/components/filter-chip'
import { PageHeader } from '@/components/page-header'
import { CategoryBarChart, TimeSeriesChart } from '@/components/progress-charts'
import {
  changeLabel,
  ChartCard,
  describePoint,
  SummaryCard,
  TrendBadge,
  TrendCallout,
} from '@/components/progress-ui'
import { Input } from '@/components/ui/input'
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
    <div>
      <PageHeader
        title="Charts"
        subtitle="Pick an exercise to see its weight and 1RM trend."
      />

      <div className="mb-6 flex flex-wrap items-start gap-x-6 gap-y-4 rounded-lg border bg-card p-4 sm:flex-nowrap">
        <div>
          <div className="eyebrow mb-2">Range</div>
          <div className="flex flex-wrap gap-1.5">
            {(
              [
                ['30', 'Last 30'],
                ['90', 'Last 90'],
                ['all', 'All history'],
              ] as const
            ).map(([id, label]) => (
              <FilterChip
                key={id}
                active={preset === id}
                onClick={() => applyPreset(id)}
              >
                {label}
              </FilterChip>
            ))}
          </div>
        </div>
        <div>
          <div className="eyebrow mb-2">From – To</div>
          <div className="flex items-center gap-1.5">
            <Input
              type="date"
              value={from}
              max={to}
              className="h-8 w-36 num"
              onChange={(e) => {
                setPreset('custom')
                setFrom(e.target.value)
              }}
            />
            <span className="text-muted-foreground">–</span>
            <Input
              type="date"
              value={to}
              min={from}
              max={todayIso()}
              className="h-8 w-36 num"
              onChange={(e) => {
                setPreset('custom')
                setTo(e.target.value)
              }}
            />
          </div>
        </div>
        <div>
          <div className="eyebrow mb-2">Program days</div>
          <div className="flex flex-wrap gap-1.5">
            {days.map((day) => (
              <FilterChip
                key={day.id}
                active={dayIds.includes(day.id)}
                onClick={() => toggleDay(day.id)}
              >
                {day.name}
              </FilterChip>
            ))}
          </div>
        </div>
        <div className="shrink-0">
          <div className="eyebrow mb-2">Exercise</div>
          <select
            className="h-8 w-48 rounded-md border border-input bg-card px-2 text-sm outline-none focus:ring-2 focus:ring-ring/30"
            value={exerciseId}
            onChange={(e) => setExerciseId(e.target.value)}
          >
            <option value="all">All exercises</option>
            {exerciseOptions.map((exercise) => (
              <option key={exercise.id} value={exercise.id}>
                {exercise.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard label="Sessions" value={String(view.sessionCount)} />
        <SummaryCard
          label="Volume (kg)"
          value={view.totalVolume === 0 ? '—' : formatKg(view.totalVolume, 0)}
        />
        <SummaryCard
          label="Progressing"
          value={String(view.progressing)}
          hint="lifts up vs first session in range"
          tone="up"
        />
        <SummaryCard
          label="Regressing"
          value={String(view.regressing)}
          hint="lifts down vs first session in range"
          tone="down"
        />
      </div>

      {selectedExercise && selectedMover ? (
        <TrendCallout row={selectedMover} />
      ) : null}

      <div
        className={
          exerciseId === 'all'
            ? 'mb-6 grid gap-4 lg:grid-cols-[2fr_1fr]'
            : 'mb-6 grid gap-4 lg:grid-cols-2'
        }
      >
        {exerciseId === 'all' ? (
          <>
            <ChartCard title="Session volume (kg)">
              <CategoryBarChart
                rows={exerciseVolumeRows}
                ariaLabel="Session volume over time"
                yLabel="Volume (kg)"
              />
            </ChartCard>
            <ChartCard title="Volume by day (kg)">
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
              className="lg:col-span-2"
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

      <div className="overflow-hidden rounded-lg border bg-card">
        <div className="border-b px-4 py-3">
          <h2 className="text-sm font-semibold">Progress and regress</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            First vs last logged session in the current filters.
          </p>
        </div>
        {view.movers.length === 0 ? (
          <p className="px-4 py-6 text-sm text-muted-foreground">
            Log at least two sessions for an exercise in this range.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead className="bg-muted/60 text-left">
                <tr>
                  <th className="eyebrow px-4 py-2">Exercise</th>
                  <th className="eyebrow px-3 py-2">First</th>
                  <th className="eyebrow px-3 py-2">Last</th>
                  <th className="eyebrow px-3 py-2">Change</th>
                  <th className="eyebrow px-3 py-2">Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {view.movers.map((row) => (
                  <tr key={row.exerciseId}>
                    <td className="px-4 py-2.5 align-middle font-medium">
                      {row.exerciseName}
                    </td>
                    <td className="px-3 py-2.5 align-middle text-muted-foreground num whitespace-nowrap">
                      {describePoint(row.first, row.metric)}
                    </td>
                    <td className="px-3 py-2.5 align-middle text-muted-foreground num whitespace-nowrap">
                      {describePoint(row.last, row.metric)}
                    </td>
                    <td className="px-3 py-2.5 align-middle num whitespace-nowrap">
                      {changeLabel(row)}
                    </td>
                    <td className="px-3 py-2.5 align-middle">
                      <TrendBadge trend={row.trend} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
