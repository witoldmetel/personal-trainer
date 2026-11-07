export function dateIso(value: string): string {
  return value.slice(0, 10)
}

export function todayIso(): string {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function isoDaysAgo(n: number): string {
  const d = new Date()
  d.setHours(12, 0, 0, 0)
  d.setDate(d.getDate() - n)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function addDaysIso(iso: string, days: number): string {
  const d = parseIsoDate(iso)
  d.setDate(d.getDate() + days)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function parseIsoDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d, 12, 0, 0)
}

export function isoWeekday(iso: string): number {
  const day = parseIsoDate(iso).getDay()
  return day === 0 ? 7 : day
}

export function weekMonday(iso: string): string {
  return addDaysIso(iso, 1 - isoWeekday(iso))
}

export function formatDate(iso: string): string {
  return parseIsoDate(iso).toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function formatChartDate(iso: string): string {
  return parseIsoDate(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
  })
}

export function formatLastTime(weightKg: number | null, reps: number): string {
  if (weightKg == null || weightKg === 0) return `${reps} reps`
  return `${weightKg} kg × ${reps}`
}
