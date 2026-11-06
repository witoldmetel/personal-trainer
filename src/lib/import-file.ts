import * as XLSX from 'xlsx'
import type { ProgramPlanDay } from '@/lib/types'

export const APP_FIELDS = [
  'Date',
  'Workout / split',
  'Exercise',
  'Set',
  'Reps',
  'Weight',
] as const

export type AppField = (typeof APP_FIELDS)[number]

export type MappedSet = {
  date: string
  dayName: string
  exerciseName: string
  setNumber: number
  reps: number
  weightKg: number
}

export type ParsedSpreadsheet = {
  kind: 'tall' | 'atj'
  fileName: string
  headers: string[]
  grid: unknown[][]
  guessed: Partial<Record<AppField, string>>
  preview: MappedSet[]
  allRows: MappedSet[]
  planDays: ProgramPlanDay[]
  warnings: string[]
}

export function planFromRows(rows: MappedSet[]): ProgramPlanDay[] {
  const days: ProgramPlanDay[] = []
  const index = new Map<string, ProgramPlanDay>()
  for (const row of rows) {
    const key = row.dayName.toLowerCase()
    let day = index.get(key)
    if (!day) {
      day = { dayName: row.dayName, exercises: [] }
      index.set(key, day)
      days.push(day)
    }
    const existing = day.exercises.find(
      (exercise) => exercise.name.toLowerCase() === row.exerciseName.toLowerCase(),
    )
    if (existing) {
      existing.targetSets = Math.max(existing.targetSets, row.setNumber)
      if (row.weightKg > 0) existing.usesWeight = true
    } else {
      day.exercises.push({
        name: row.exerciseName,
        targetSets: row.setNumber,
        targetReps: row.reps,
        usesWeight: row.weightKg > 0,
      })
    }
  }
  return days
}

function cellText(value: unknown): string {
  if (value == null) return ''
  if (value instanceof Date) return value.toISOString().slice(0, 10)
  return String(value).trim()
}

export function parseNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  const text = cellText(value).replace(/\s/g, '').replace('kg', '').replace('KG', '')
  if (!text) return null
  const normalized = text.includes(',') && !text.includes('.')
    ? text.replace(',', '.')
    : text.replace(/,/g, '')
  const n = Number(normalized)
  return Number.isFinite(n) ? n : null
}

export function usableExerciseName(value: unknown): string | null {
  const name = cellText(value)
    .replace(/\s*\(\d+\)\s*$/, '')
    .replace(/\s+/g, ' ')
    .trim()
  if (!name) return null
  if (/^[-–—._/\\]+$/.test(name)) return null
  if (/^(n\/a|na|none|null|undefined|-)$/i.test(name)) return null
  return name
}

function parseWhole(value: unknown, min: number, max: number): number | null {
  const n = parseNumber(value)
  if (n == null || !Number.isInteger(n) || n < min || n > max) return null
  return n
}

function parseDate(value: unknown): string | null {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    const y = value.getFullYear()
    const m = String(value.getMonth() + 1).padStart(2, '0')
    const d = String(value.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
  }
  const text = cellText(value)
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) return text
  const n = parseNumber(text)
  if (n != null && n > 20000 && n < 60000) {
    const parsed = XLSX.SSF.parse_date_code(n)
    if (parsed) {
      const m = String(parsed.m).padStart(2, '0')
      const d = String(parsed.d).padStart(2, '0')
      return `${parsed.y}-${m}-${d}`
    }
  }
  return null
}

function guessHeader(headers: string[], aliases: string[]): string | undefined {
  const lower = headers.map((h) => h.toLowerCase())
  for (const alias of aliases) {
    const i = lower.findIndex((h) => h === alias || h.includes(alias))
    if (i >= 0) return headers[i]
  }
  return undefined
}

function isAtjGrid(rows: unknown[][]): boolean {
  const sample = rows
    .slice(0, 40)
    .flat()
    .map(cellText)
    .join(' | ')
    .toLowerCase()
  return sample.includes('workout goal') && sample.includes('1st set')
}

function parseSetLabel(text: string): number | null {
  const match = text.match(/^(\d+)(st|nd|rd|th)?\s*set/i)
  if (match) return Number(match[1])
  return parseWhole(text, 1, 30)
}

function columnWeight(headerRow: unknown[], col: number): number | null {
  for (let c = col; c >= 3; c--) {
    const kg = parseNumber(cellText(headerRow[c]).replace(/kg/i, ''))
    if (cellText(headerRow[c]).toLowerCase().includes('kg') && kg != null) {
      return kg
    }
  }
  return null
}

function parseAtjSheet(
  rows: unknown[][],
  dayName: string,
): { sets: MappedSet[]; plan: ProgramPlanDay } {
  const out: MappedSet[] = []
  const planExercises: ProgramPlanDay['exercises'] = []
  let exercise = ''
  let headerRow: unknown[] = []
  let sessionDates: string[] = []

  for (const row of rows) {
    const a = cellText(row[0])
    const b = cellText(row[1])
    if (b.toLowerCase() === 'workout goal') {
      const next = usableExerciseName(a)
      if (!next || /^warm up/i.test(next)) {
        exercise = ''
        continue
      }
      exercise = next
      if (
        !planExercises.some(
          (item) => item.name.toLowerCase() === next.toLowerCase(),
        )
      ) {
        planExercises.push({
          name: next,
          targetSets: 0,
          targetReps: 8,
          usesWeight: true,
        })
      }
      headerRow = row
      const lastCol = Math.max(row.length - 1, 2)
      sessionDates = Array.from({ length: lastCol + 1 }, (_, col) => {
        if (col < 2) return ''
        const d = new Date()
        d.setHours(12, 0, 0, 0)
        const age = col === 2 ? 0 : lastCol - col + 1
        d.setDate(d.getDate() - age * 3)
        const y = d.getFullYear()
        const m = String(d.getMonth() + 1).padStart(2, '0')
        const day = String(d.getDate()).padStart(2, '0')
        return `${y}-${m}-${day}`
      })
      continue
    }
    const setNumber = parseSetLabel(a)
    if (!exercise || setNumber == null) continue
    const current = planExercises.find(
      (item) => item.name.toLowerCase() === exercise.toLowerCase(),
    )
    if (current) {
      current.targetSets = Math.max(current.targetSets, setNumber)
      const goalReps = parseWhole(row[2], 1, 100)
      if (goalReps != null) current.targetReps = goalReps
    }
    for (let col = 2; col < row.length; col++) {
      const reps = parseWhole(row[col], 1, 100)
      if (reps == null) continue
      const weightKg =
        col === 2
          ? columnWeight(headerRow, headerRow.length - 1) ?? 0
          : columnWeight(headerRow, col) ?? 0
      const date = sessionDates[col]
      if (!date) continue
      out.push({
        date,
        dayName,
        exerciseName: exercise,
        setNumber,
        reps,
        weightKg,
      })
    }
  }
  for (const item of planExercises) {
    if (item.targetSets < 1) item.targetSets = 3
    const related = out.filter(
      (set) => set.exerciseName.toLowerCase() === item.name.toLowerCase(),
    )
    if (related.length > 0) {
      item.usesWeight = related.some((set) => set.weightKg > 0)
    }
  }
  return { sets: out, plan: { dayName, exercises: planExercises } }
}

function mapTallRows(
  headers: string[],
  body: unknown[][],
  mapping: Partial<Record<AppField, string>>,
  defaultDay: string,
): MappedSet[] {
  const index = (field: AppField) => {
    const name = mapping[field]
    return name ? headers.indexOf(name) : -1
  }
  const iDate = index('Date')
  const iDay = index('Workout / split')
  const iEx = index('Exercise')
  const iSet = index('Set')
  const iReps = index('Reps')
  const iWt = index('Weight')
  const out: MappedSet[] = []

  body.forEach((row, rowIndex) => {
    const exerciseName = iEx >= 0 ? usableExerciseName(row[iEx]) : null
    const reps = iReps >= 0 ? parseWhole(row[iReps], 1, 100) : null
    const setNumber =
      iSet >= 0
        ? parseSetLabel(cellText(row[iSet])) ?? parseWhole(row[iSet], 1, 30)
        : 1
    if (!exerciseName || reps == null || setNumber == null) return
    const date = iDate >= 0 ? parseDate(row[iDate]) : null
    const dayName = iDay >= 0 && cellText(row[iDay]) ? cellText(row[iDay]) : defaultDay
    const weightKg = iWt >= 0 ? parseNumber(row[iWt]) ?? 0 : 0
    out.push({
      date: date ?? `1970-01-${String((rowIndex % 28) + 1).padStart(2, '0')}`,
      dayName,
      exerciseName,
      setNumber,
      reps,
      weightKg,
    })
  })
  return out
}

export function parseWorkbook(fileName: string, data: ArrayBuffer): ParsedSpreadsheet {
  const workbook = XLSX.read(data, { type: 'array', cellDates: true })
  const warnings: string[] = []
  const atjSheets = workbook.SheetNames.filter((name) => {
    const grid = XLSX.utils.sheet_to_json(workbook.Sheets[name], {
      header: 1,
      defval: '',
      raw: true,
    }) as unknown[][]
    return isAtjGrid(grid)
  })

  if (atjSheets.length > 0) {
    const parsedSheets = atjSheets.map((name) => {
      const grid = XLSX.utils.sheet_to_json(workbook.Sheets[name], {
        header: 1,
        defval: '',
        raw: true,
      }) as unknown[][]
      return parseAtjSheet(grid, name)
    })
    const allRows = parsedSheets.flatMap((sheet) => sheet.sets)
    const planDays = parsedSheets.map((sheet) => sheet.plan)
    if (allRows.length === 0) {
      warnings.push('Average To Jacked layout detected, but no set cells could be read.')
    } else {
      warnings.push(
        'Average To Jacked sheet: dates are estimated (every 3 days). Weight is taken from the kg band above each column.',
      )
    }
    return {
      kind: 'atj',
      fileName,
      headers: ['Date', 'Day', 'Exercise', 'Set', 'Reps', 'Weight'],
      grid: [],
      guessed: {
        Date: 'Date',
        'Workout / split': 'Day',
        Exercise: 'Exercise',
        Set: 'Set',
        Reps: 'Reps',
        Weight: 'Weight',
      },
      preview: allRows.slice(0, 12),
      allRows,
      planDays,
      warnings,
    }
  }

  const sheet = workbook.Sheets[workbook.SheetNames[0]]
  const grid = XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    defval: '',
    raw: true,
  }) as unknown[][]
  const headerRow = (grid[0] ?? []).map((c) => cellText(c) || `Column ${String(c)}`)
  const headers = headerRow.map((h, i) => h || `Column ${i + 1}`)
  const guessed: Partial<Record<AppField, string>> = {
    Date: guessHeader(headers, ['date', 'performed', 'day of']),
    'Workout / split': guessHeader(headers, ['workout', 'split', 'day', 'routine']),
    Exercise: guessHeader(headers, ['exercise', 'lift', 'movement']),
    Set: guessHeader(headers, ['set']),
    Reps: guessHeader(headers, ['reps', 'rep']),
    Weight: guessHeader(headers, ['weight', 'kg', 'load']),
  }
  const allRows = mapTallRows(headers, grid.slice(1), guessed, 'Day 1')
  if (allRows.length === 0) {
    warnings.push('No set rows found. Use columns: date, day, exercise, set, reps, weight_kg.')
  }
  return {
    kind: 'tall',
    fileName,
    headers,
    grid,
    guessed,
    preview: allRows.slice(0, 12),
    allRows,
    planDays: planFromRows(allRows),
    warnings,
  }
}

export function remapTall(
  headers: string[],
  body: unknown[][],
  mapping: Partial<Record<AppField, string>>,
): MappedSet[] {
  return mapTallRows(headers, body, mapping, 'Day 1')
}

export async function parseUpload(file: File): Promise<ParsedSpreadsheet> {
  const buffer = await file.arrayBuffer()
  return parseWorkbook(file.name, buffer)
}
