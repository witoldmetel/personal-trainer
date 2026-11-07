import {
  addDays,
  compareAsc,
  format,
  getISODay,
  isMatch,
  isValid,
  parse,
  startOfDay,
  startOfWeek,
  subDays,
} from 'date-fns'
import { enGB } from 'date-fns/locale'

const ISO = 'yyyy-MM-dd'

export function dateIso(value: string | Date): string {
  if (value instanceof Date) {
    return isValid(value) ? format(value, ISO) : ''
  }
  const trimmed = value.trim()
  if (isMatch(trimmed.slice(0, 10), ISO)) {
    const parsed = parse(trimmed.slice(0, 10), ISO, new Date())
    if (isValid(parsed)) return format(parsed, ISO)
  }
  return trimmed.slice(0, 10)
}

export function parseIsoDate(iso: string): Date {
  return startOfDay(parse(dateIso(iso), ISO, new Date()))
}

export function isIsoDate(value: string): boolean {
  const iso = value.trim()
  if (!isMatch(iso, ISO)) return false
  return isValid(parse(iso, ISO, new Date()))
}

export function todayIso(): string {
  return format(startOfDay(new Date()), ISO)
}

export function isoDaysAgo(n: number): string {
  return format(subDays(startOfDay(new Date()), n), ISO)
}

export function addDaysIso(iso: string, days: number): string {
  return format(addDays(parseIsoDate(iso), days), ISO)
}

export function isoWeekday(iso: string): number {
  return getISODay(parseIsoDate(iso))
}

export function weekMonday(iso: string): string {
  return format(startOfWeek(parseIsoDate(iso), { weekStartsOn: 1 }), ISO)
}

export function dateOnWeekday(iso: string, weekday: number): string {
  return addDaysIso(weekMonday(iso), weekday - 1)
}

export function compareIso(a: string, b: string): number {
  return compareAsc(parseIsoDate(a), parseIsoDate(b))
}

export function isSameIsoDay(a: string, b: string): boolean {
  return compareIso(a, b) === 0
}

export function isIsoInRange(iso: string, from: string, to: string): boolean {
  return compareIso(iso, from) >= 0 && compareIso(iso, to) <= 0
}

export function nextFreeIso(start: string, used: Set<string>): string {
  let current = dateIso(start)
  for (let i = 0; i < 800; i++) {
    if (!used.has(current)) return current
    current = addDaysIso(current, 1)
  }
  return current
}

export function formatDate(iso: string): string {
  return format(parseIsoDate(iso), 'EEE, d MMM yyyy', { locale: enGB })
}

export function formatChartDate(iso: string): string {
  return format(parseIsoDate(iso), 'd MMM', { locale: enGB })
}

export function formatLastTime(weightKg: number | null, reps: number): string {
  if (weightKg == null || weightKg === 0) return `${reps} reps`
  return `${weightKg} kg × ${reps}`
}
