import {
  addDaysIso,
  compareIso,
  dateOnWeekday,
  isoWeekday,
  nextFreeIso,
  weekMonday,
} from '@/lib/dates'
import type { IsoWeekday, ProgramDay, Session } from '@/lib/types'

export const WEEKDAY_MIGRATION_SQL = `alter table public.program_days
  add column if not exists weekday smallint
  check (weekday is null or (weekday >= 1 and weekday <= 7));

notify pgrst, 'reload schema';`

export class WeekdayMigrationError extends Error {
  constructor() {
    super(
      'Add the weekday column in the Supabase SQL Editor, then set the day again.',
    )
    this.name = 'WeekdayMigrationError'
  }
}

export const WEEKDAYS: Array<{ value: IsoWeekday; label: string; short: string }> =
  [
    { value: 1, label: 'Monday', short: 'Mon' },
    { value: 2, label: 'Tuesday', short: 'Tue' },
    { value: 3, label: 'Wednesday', short: 'Wed' },
    { value: 4, label: 'Thursday', short: 'Thu' },
    { value: 5, label: 'Friday', short: 'Fri' },
    { value: 6, label: 'Saturday', short: 'Sat' },
    { value: 7, label: 'Sunday', short: 'Sun' },
  ]

export function parseIsoWeekday(value: unknown): IsoWeekday | null {
  const n = typeof value === 'string' ? Number(value) : value
  if (n === 1 || n === 2 || n === 3 || n === 4 || n === 5 || n === 6 || n === 7) {
    return n
  }
  return null
}

export function weekdayLabel(weekday: IsoWeekday | null | undefined): string | null {
  if (weekday == null) return null
  return WEEKDAYS.find((day) => day.value === weekday)?.label ?? null
}

export function weekdayShort(weekday: IsoWeekday | null | undefined): string | null {
  if (weekday == null) return null
  return WEEKDAYS.find((day) => day.value === weekday)?.short ?? null
}

export type SessionDateChange = {
  sessionId: string
  from: string
  to: string
}

export type WeekdayHistoryPreview = {
  changes: SessionDateChange[]
  skipped: number
}

function sortSessions(a: Session, b: Session): number {
  const byDate = compareIso(a.performedOn, b.performedOn)
  return byDate !== 0 ? byDate : a.id.localeCompare(b.id)
}

function cyclesByOccurrence(
  sessions: Session[],
  days: ProgramDay[],
): Session[][] {
  const orderedDays = [...days].sort((a, b) => a.sortOrder - b.sortOrder)
  const byDay = new Map(orderedDays.map((day) => [day.id, [] as Session[]]))
  for (const session of sessions) {
    if (!session.programDayId) continue
    byDay.get(session.programDayId)?.push(session)
  }
  for (const list of byDay.values()) list.sort(sortSessions)
  const n = Math.max(0, ...[...byDay.values()].map((list) => list.length))
  const cycles: Session[][] = []
  for (let i = 0; i < n; i++) {
    const cycle: Session[] = []
    for (const day of orderedDays) {
      const session = byDay.get(day.id)?.[i]
      if (session) cycle.push(session)
    }
    if (cycle.length > 0) cycles.push(cycle)
  }
  return cycles
}

function applyDates(
  sessions: Session[],
  planned: Map<string, string>,
): SessionDateChange[] {
  const changes: SessionDateChange[] = []
  for (const session of sessions) {
    const to = planned.get(session.id)
    if (to && to !== session.performedOn) {
      changes.push({ sessionId: session.id, from: session.performedOn, to })
    }
  }
  return changes
}

export function spreadDuplicateDates(
  sessions: Session[],
  days: ProgramDay[],
): SessionDateChange[] {
  const dayById = new Map(days.map((day) => [day.id, day] as const))
  const byDate = new Map<string, Session[]>()
  for (const session of sessions) {
    const list = byDate.get(session.performedOn) ?? []
    list.push(session)
    byDate.set(session.performedOn, list)
  }
  const used = new Set(byDate.keys())
  const planned = new Map<string, string>()

  function keepScore(session: Session): number {
    if (session.status === 'in_progress' || session.id.startsWith('live_')) return 0
    const day = session.programDayId
      ? dayById.get(session.programDayId)
      : undefined
    if (day?.weekday != null && isoWeekday(session.performedOn) === day.weekday) {
      return 1
    }
    return 2
  }

  for (const date of [...byDate.keys()].sort(compareIso)) {
    const group = byDate.get(date)
    if (!group || group.length < 2) continue
    const ranked = [...group].sort((a, b) => {
      const byKeep = keepScore(a) - keepScore(b)
      if (byKeep !== 0) return byKeep
      const orderA = a.programDayId
        ? (dayById.get(a.programDayId)?.sortOrder ?? 99)
        : 99
      const orderB = b.programDayId
        ? (dayById.get(b.programDayId)?.sortOrder ?? 99)
        : 99
      if (orderA !== orderB) return orderA - orderB
      return a.id.localeCompare(b.id)
    })
    planned.set(ranked[0].id, date)
    for (const session of ranked.slice(1)) {
      const to = nextFreeIso(addDaysIso(date, 1), used)
      used.add(to)
      planned.set(session.id, to)
    }
  }
  return applyDates(sessions, planned)
}

export function previewWeekdayHistory(
  sessions: Session[],
  days: ProgramDay[],
): WeekdayHistoryPreview {
  const assigned = days.filter((day) => day.weekday != null)
  const programDayIds = new Set(days.map((day) => day.id))
  const programSessions = sessions.filter(
    (session) =>
      session.programDayId != null && programDayIds.has(session.programDayId),
  )
  if (programSessions.length === 0) return { changes: [], skipped: 0 }

  const used = new Set(
    sessions
      .filter(
        (session) =>
          session.programDayId == null || !programDayIds.has(session.programDayId),
      )
      .map((session) => session.performedOn),
  )
  const planned = new Map<string, string>()

  if (assigned.length === 0) {
    return { changes: spreadDuplicateDates(sessions, days), skipped: 0 }
  }

  const dayById = new Map(days.map((day) => [day.id, day] as const))
  const cycles = cyclesByOccurrence(programSessions, days)
  if (cycles.length === 0) return { changes: [], skipped: 0 }

  const newest = cycles[cycles.length - 1]
  const newestDate = [...newest].sort(sortSessions).at(-1)?.performedOn
  if (!newestDate) return { changes: [], skipped: 0 }
  const monday0 = addDaysIso(
    weekMonday(newestDate),
    -7 * (cycles.length - 1),
  )

  for (let i = 0; i < cycles.length; i++) {
    const monday = addDaysIso(monday0, i * 7)
    const cycle = [...cycles[i]].sort((a, b) => {
      const left = a.programDayId ? dayById.get(a.programDayId)?.sortOrder ?? 0 : 0
      const right = b.programDayId ? dayById.get(b.programDayId)?.sortOrder ?? 0 : 0
      return left - right
    })

    for (const session of cycle) {
      const day = session.programDayId
        ? dayById.get(session.programDayId)
        : undefined
      if (day?.weekday == null) continue
      let to = dateOnWeekday(monday, day.weekday)
      while (used.has(to)) to = addDaysIso(to, 7)
      planned.set(session.id, to)
      used.add(to)
    }

    const rest: string[] = []
    for (let offset = 0; offset < 7; offset++) {
      const slot = addDaysIso(monday, offset)
      if (!used.has(slot)) rest.push(slot)
    }
    for (const session of cycle) {
      if (planned.has(session.id)) continue
      const to = rest.shift() ?? nextFreeIso(addDaysIso(monday, 7), used)
      planned.set(session.id, to)
      used.add(to)
    }
  }

  return { changes: applyDates(programSessions, planned), skipped: 0 }
}
