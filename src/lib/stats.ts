import { compareIso, formatChartDate, isIsoInRange, parseIsoDate } from '@/lib/dates'
import {
  canonicalPeId,
  peLabel,
  programDayIds,
  programExercisesFor,
} from '@/lib/program'
import type {
  Exercise,
  ProgramDay,
  ProgramExercise,
  Session,
  SessionSet,
} from '@/lib/types'

export type DashboardFilters = {
  from: string
  to: string
  dayIds: string[]
  exerciseId: string
  programId?: string
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
  totalReps: number
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
  programExercises?: ProgramExercise[]
  filters: DashboardFilters
}): ExerciseSessionPoint[] {
  const {
    sessions,
    sessionSets,
    exercises,
    programDays,
    programExercises = [],
    filters,
  } = input
  const dayName = new Map(programDays.map((d) => [d.id, d.name] as const))
  const allowedDays =
    filters.dayIds.length > 0
      ? new Set(filters.dayIds)
      : filters.programId
        ? new Set(programDayIds(filters.programId, programDays))
        : null
  const matching = sessions
    .filter((session) => {
      if (!isIsoInRange(session.performedOn, filters.from, filters.to)) {
        return false
      }
      if (
        allowedDays &&
        (session.programDayId == null || !allowedDays.has(session.programDayId))
      ) {
        return false
      }
      return true
    })
    .sort((a, b) => {
      const byDate = compareIso(a.performedOn, b.performedOn)
      return byDate !== 0 ? byDate : a.id.localeCompare(b.id)
    })

  const scopedPes =
    filters.programId != null
      ? programExercisesFor(filters.programId, programDays, programExercises)
      : programExercises
  const peByDayExercise = new Map<string, ProgramExercise>()
  for (const pe of scopedPes) {
    peByDayExercise.set(`${pe.programDayId}:${pe.exerciseId}`, pe)
  }

  const points: ExerciseSessionPoint[] = []
  for (const session of matching) {
    const byKey = new Map<string, { pe: ProgramExercise | null; sets: SessionSet[] }>()
    for (const set of sessionSets) {
      if (set.sessionId !== session.id) continue
      if (set.reps == null || set.reps <= 0) continue
      const pe =
        session.programDayId != null
          ? (peByDayExercise.get(`${session.programDayId}:${set.exerciseId}`) ?? null)
          : null
      const statsKey = pe ? canonicalPeId(scopedPes, pe.id) : set.exerciseId
      if (filters.exerciseId !== 'all' && statsKey !== filters.exerciseId) {
        continue
      }
      const existing = byKey.get(statsKey)
      if (existing) {
        existing.sets.push(set)
      } else {
        byKey.set(statsKey, { pe, sets: [set] })
      }
    }
    for (const [statsKey, { pe, sets }] of byKey) {
      let bestWeightKg = 0
      let bestReps = 0
      let e1rm = 0
      let volume = 0
      let totalReps = 0
      for (const set of sets) {
        const reps = set.reps ?? 0
        const weightKg = set.weightKg ?? 0
        totalReps += reps
        volume += weightKg * reps
        if (weightKg > 0) {
          const estimate = epley1rm(weightKg, reps)
          if (estimate > e1rm) e1rm = estimate
        }
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
        exerciseId: statsKey,
        exerciseName: pe
          ? peLabel(pe, scopedPes, exercises, programDays)
          : (exercises.find((e) => e.id === statsKey)?.name ?? 'Unknown'),
        bestWeightKg,
        bestReps,
        e1rm,
        volume,
        totalReps,
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

export function pickMovers(
  ids: string[],
  programExercises: ProgramExercise[],
  movers: ProgressRow[],
): ProgressRow[] {
  const chosen = [
    ...new Set(ids.map((id) => canonicalPeId(programExercises, id))),
  ]
    .filter((id) => programExercises.some((pe) => pe.id === id))
    .slice(0, 4)
  if (chosen.length === 0) return movers.slice(0, 4)
  const byId = new Map(movers.map((row) => [row.exerciseId, row] as const))
  return chosen.flatMap((id) => {
    const row = byId.get(id)
    return row ? [row] : []
  })
}

export function buildProgressView(input: {
  sessions: Session[]
  sessionSets: SessionSet[]
  exercises: Exercise[]
  programDays: ProgramDay[]
  programExercises?: ProgramExercise[]
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
