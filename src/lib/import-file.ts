import * as XLSX from 'xlsx'

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
  warnings: string[]
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
  const n = parseNumber(text)
  return n != null && n >= 1 && n <= 20 ? n : null
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

function parseAtjSheet(rows: unknown[][], dayName: string): MappedSet[] {
  const out: MappedSet[] = []
  let exercise = ''
  let headerRow: unknown[] = []
  let sessionDates: string[] = []

  for (const row of rows) {
    const a = cellText(row[0])
    const b = cellText(row[1])
    if (b.toLowerCase() === 'workout goal' && a && !/^warm up/i.test(a)) {
      exercise = a.replace(/\s*\(\d+\)\s*$/, '').trim()
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
    for (let col = 2; col < row.length; col++) {
      const reps = parseNumber(row[col])
      if (reps == null || reps <= 0) continue
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
  return out
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
    const exerciseName = iEx >= 0 ? cellText(row[iEx]) : ''
    const reps = iReps >= 0 ? parseNumber(row[iReps]) : null
    const setNumber = iSet >= 0 ? parseSetLabel(cellText(row[iSet])) ?? parseNumber(row[iSet]) : 1
    if (!exerciseName || reps == null || reps <= 0 || setNumber == null) return
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
    const allRows = atjSheets.flatMap((name) => {
      const grid = XLSX.utils.sheet_to_json(workbook.Sheets[name], {
        header: 1,
        defval: '',
        raw: true,
      }) as unknown[][]
      return parseAtjSheet(grid, name)
    })
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
