import { compareIso, formatChartDate, isIsoInRange, parseIsoDate } from '@/lib/dates'
import type { Exercise, ProgramDay, Session, SessionSet } from '@/lib/types'

export type DashboardFilters = {
  from: string
  to: string
  dayIds: string[]
  exerciseId: string
}

export type ExerciseSessionPoint = {
  sessionId: string
  date: Date
  dateIso: string
  dateLabel: string
  programDayId: string
  programDayName: string
  exerciseId: string
  exerciseName: string
  bestWeightKg: number
  bestReps: number
  e1rm: number
  volume: number
  setCount: number
}

export type VolumePoint = {
  date: Date
  dateIso: string
  dateLabel: string
  volume: number
}

export type DayVolume = {
  dayName: string
  volume: number
}

export type ProgressRow = {
  exerciseId: string
  exerciseName: string
  first: ExerciseSessionPoint
  last: ExerciseSessionPoint
  deltaWeight: number
  deltaE1rm: number
  deltaReps: number
  deltaPct: number
  trend: 'progress' | 'regress' | 'same'
  metric: 'weight' | 'reps'
}

export function epley1rm(weightKg: number, reps: number): number {
  if (reps <= 1) return weightKg
  return weightKg * (1 + reps / 30)
}

export function exerciseSessionPoints(input: {
  sessions: Session[]
  sessionSets: SessionSet[]
  exercises: Exercise[]
  programDays: ProgramDay[]
  filters: DashboardFilters
}): ExerciseSessionPoint[] {
  const { sessions, sessionSets, exercises, programDays, filters } = input
  const exerciseName = new Map(exercises.map((e) => [e.id, e.name] as const))
  const dayName = new Map(programDays.map((d) => [d.id, d.name] as const))
  const matching = sessions
    .filter((session) => {
      if (!isIsoInRange(session.performedOn, filters.from, filters.to)) {
        return false
      }
      if (
        filters.dayIds.length > 0 &&
        (session.programDayId == null || !filters.dayIds.includes(session.programDayId))
      ) {
        return false
      }
      return true
    })
    .sort((a, b) => {
      const byDate = compareIso(a.performedOn, b.performedOn)
      return byDate !== 0 ? byDate : a.id.localeCompare(b.id)
    })

  const points: ExerciseSessionPoint[] = []
  for (const session of matching) {
    const byExercise = new Map<string, SessionSet[]>()
    for (const set of sessionSets) {
      if (set.sessionId !== session.id) continue
      if (set.reps == null || set.weightKg == null) continue
      if (filters.exerciseId !== 'all' && set.exerciseId !== filters.exerciseId) {
        continue
      }
      const list = byExercise.get(set.exerciseId) ?? []
      list.push(set)
      byExercise.set(set.exerciseId, list)
    }
    for (const [exerciseId, sets] of byExercise) {
      let bestWeightKg = 0
      let bestReps = 0
      let e1rm = 0
      let volume = 0
      for (const set of sets) {
        const reps = set.reps ?? 0
        const weightKg = set.weightKg ?? 0
        volume += weightKg * reps
        const estimate = epley1rm(weightKg, reps)
        if (estimate > e1rm) e1rm = estimate
        if (weightKg > bestWeightKg || (weightKg === bestWeightKg && reps > bestReps)) {
          bestWeightKg = weightKg
          bestReps = reps
        }
        if (weightKg === 0 && reps > bestReps) bestReps = reps
      }
      points.push({
        sessionId: session.id,
        date: parseIsoDate(session.performedOn),
        dateIso: session.performedOn,
        dateLabel: formatChartDate(session.performedOn),
        programDayId: session.programDayId ?? '',
        programDayName: session.programDayId
          ? (dayName.get(session.programDayId) ?? 'Day')
          : 'Day',
        exerciseId,
        exerciseName: exerciseName.get(exerciseId) ?? 'Unknown',
        bestWeightKg,
        bestReps,
        e1rm,
        volume,
        setCount: sets.length,
      })
    }
  }
  return points
}

export function volumeBySession(points: ExerciseSessionPoint[]): VolumePoint[] {
  const byDate = new Map<string, VolumePoint>()
  for (const point of points) {
    const existing = byDate.get(point.dateIso)
    if (existing) {
      existing.volume += point.volume
    } else {
      byDate.set(point.dateIso, {
        date: point.date,
        dateIso: point.dateIso,
        dateLabel: point.dateLabel,
        volume: point.volume,
      })
    }
  }
  return [...byDate.values()].sort((a, b) => compareIso(a.dateIso, b.dateIso))
}

export function volumeByDay(points: ExerciseSessionPoint[]): DayVolume[] {
  const byDay = new Map<string, number>()
  for (const point of points) {
    byDay.set(point.programDayName, (byDay.get(point.programDayName) ?? 0) + point.volume)
  }
  return [...byDay.entries()]
    .map(([dayName, volume]) => ({ dayName, volume }))
    .sort((a, b) => a.dayName.localeCompare(b.dayName, 'en'))
}

export function progressRows(points: ExerciseSessionPoint[]): ProgressRow[] {
  const byExercise = new Map<string, ExerciseSessionPoint[]>()
  for (const point of points) {
    const list = byExercise.get(point.exerciseId) ?? []
    list.push(point)
    byExercise.set(point.exerciseId, list)
  }
  const rows: ProgressRow[] = []
  for (const group of byExercise.values()) {
    const ordered = [...group].sort((a, b) => compareIso(a.dateIso, b.dateIso))
    const weighted = ordered.filter((point) => point.bestWeightKg > 0)
    const metric: ProgressRow['metric'] = weighted.length >= 2 ? 'weight' : 'reps'
    const series = metric === 'weight' ? weighted : ordered
    const first = series[0]
    const last = series[series.length - 1]
    if (!first || !last || first.sessionId === last.sessionId) continue
    const deltaWeight = last.bestWeightKg - first.bestWeightKg
    const deltaE1rm = last.e1rm - first.e1rm
    const deltaReps = last.bestReps - first.bestReps
    const delta = metric === 'weight' ? deltaWeight : deltaReps
    const base = metric === 'weight' ? first.bestWeightKg : first.bestReps
    const deltaPct = base === 0 ? 0 : (delta / base) * 100
    const trend =
      Math.abs(deltaPct) < 0.05
        ? 'same'
        : metric === 'weight'
          ? deltaWeight > 0.24
            ? 'progress'
            : deltaWeight < -0.24
              ? 'regress'
              : 'same'
          : deltaReps > 0
            ? 'progress'
            : deltaReps < 0
              ? 'regress'
              : 'same'
    rows.push({
      exerciseId: first.exerciseId,
      exerciseName: first.exerciseName,
      first,
      last,
      deltaWeight,
      deltaE1rm,
      deltaReps,
      deltaPct,
      trend,
      metric,
    })
  }
  return rows.sort((a, b) => {
    const rank = { progress: 0, regress: 1, same: 2 }
    if (rank[a.trend] !== rank[b.trend]) return rank[a.trend] - rank[b.trend]
    return Math.abs(b.deltaPct) - Math.abs(a.deltaPct)
  })
}

export function buildProgressView(input: {
  sessions: Session[]
  sessionSets: SessionSet[]
  exercises: Exercise[]
  programDays: ProgramDay[]
  filters: DashboardFilters
}) {
  const points = exerciseSessionPoints(input)
  const volumeSeries = volumeBySession(points)
  const dayVolume = volumeByDay(points)
  const movers = progressRows(points)
  return {
    points,
    volumeSeries,
    dayVolume,
    movers,
    sessionCount: new Set(points.map((p) => p.sessionId)).size,
    totalVolume: points.reduce((sum, p) => sum + p.volume, 0),
    progressing: movers.filter((row) => row.trend === 'progress').length,
    regressing: movers.filter((row) => row.trend === 'regress').length,
  }
}

export function formatKg(value: number, digits = 1): string {
  return `${value.toLocaleString('en-GB', {
    maximumFractionDigits: digits,
    minimumFractionDigits: value % 1 === 0 ? 0 : Math.min(digits, 1),
  })} kg`
}

export function formatSignedKg(value: number): string {
  const abs = formatKg(Math.abs(value))
  if (Math.abs(value) < 0.05) return '0 kg'
  return value > 0 ? `+${abs}` : `−${abs}`
}

export function formatPct(value: number): string {
  const abs = Math.abs(value).toLocaleString('en-GB', {
    maximumFractionDigits: 1,
  })
  if (Math.abs(value) < 0.05) return '0%'
  return value > 0 ? `+${abs}%` : `−${abs}%`
}
