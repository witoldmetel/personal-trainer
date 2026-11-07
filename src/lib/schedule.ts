import { addDaysIso, weekMonday } from '@/lib/dates'
import type { IsoWeekday, ProgramDay, Session } from '@/lib/types'

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

export function previewWeekdayHistory(
  sessions: Session[],
  days: ProgramDay[],
): WeekdayHistoryPreview {
  const assigned = days.filter((day) => day.weekday != null)
  if (assigned.length === 0) return { changes: [], skipped: 0 }

  const dayById = new Map(days.map((day) => [day.id, day] as const))
  const programDayIds = new Set(days.map((day) => day.id))
  const programSessions = sessions
    .filter(
      (session) =>
        session.programDayId != null && programDayIds.has(session.programDayId),
    )
    .sort((a, b) => {
      const byDate = a.performedOn.localeCompare(b.performedOn)
      return byDate !== 0 ? byDate : a.id.localeCompare(b.id)
    })

  const cycles: Session[][] = []
  let current: Session[] = []
  let lastOrder = -1
  for (const session of programSessions) {
    const day = session.programDayId
      ? dayById.get(session.programDayId)
      : undefined
    if (!day) continue
    if (current.length > 0 && day.sortOrder <= lastOrder) {
      cycles.push(current)
      current = []
    }
    current.push(session)
    lastOrder = day.sortOrder
  }
  if (current.length > 0) cycles.push(current)

  const proposed = new Map<string, string>()
  for (const cycle of cycles) {
    const anchor = cycle[0]
    if (!anchor) continue
    const monday = weekMonday(anchor.performedOn)
    for (const session of cycle) {
      const day = session.programDayId
        ? dayById.get(session.programDayId)
        : undefined
      if (day?.weekday == null) continue
      const to = addDaysIso(monday, day.weekday - 1)
      if (to !== session.performedOn) proposed.set(session.id, to)
    }
  }

  const movingIds = new Set(proposed.keys())
  const used = new Set(
    sessions
      .filter((session) => !movingIds.has(session.id))
      .map((session) => session.performedOn),
  )
  const sessionById = new Map(sessions.map((session) => [session.id, session]))
  const ordered = [...proposed.entries()].sort((a, b) => {
    const left = sessionById.get(a[0])
    const right = sessionById.get(b[0])
    if (!left || !right) return 0
    const byDate = left.performedOn.localeCompare(right.performedOn)
    return byDate !== 0 ? byDate : left.id.localeCompare(right.id)
  })

  const changes: SessionDateChange[] = []
  let skipped = 0
  for (const [sessionId, to] of ordered) {
    const session = sessionById.get(sessionId)
    if (!session) continue
    if (used.has(to)) {
      skipped += 1
      continue
    }
    used.add(to)
    changes.push({ sessionId, from: session.performedOn, to })
  }
  return { changes, skipped }
}
