import type { Exercise, Program, ProgramDay, ProgramExercise } from '@/lib/types'

export const PROGRAM_SETTINGS_SQL = `alter table public.programs
  add column if not exists is_active boolean not null default false;

alter table public.programs
  add column if not exists mover_pe_ids text[] not null default '{}';

alter table public.program_exercises
  add column if not exists same_as_id text references public.program_exercises (id) on delete set null;

notify pgrst, 'reload schema';`

export class ProgramSettingsMigrationError extends Error {
  constructor() {
    super(
      'Run the program settings migration in Supabase, then try again.',
    )
    this.name = 'ProgramSettingsMigrationError'
  }
}

export function activeProgram(programs: Program[]): Program | undefined {
  return programs.find((program) => program.isActive) ?? programs[0]
}

export function programDayIds(
  programId: string | undefined,
  days: ProgramDay[],
): string[] {
  if (!programId) return []
  return days.filter((day) => day.programId === programId).map((day) => day.id)
}

export function canonicalPeId(
  rows: ProgramExercise[],
  peId: string,
): string {
  const byId = new Map(rows.map((row) => [row.id, row] as const))
  const seen = new Set<string>()
  let current = peId
  while (true) {
    if (seen.has(current)) return current
    seen.add(current)
    const row = byId.get(current)
    if (!row?.sameAsId || !byId.has(row.sameAsId)) return current
    current = row.sameAsId
  }
}

export function programExercisesFor(
  programId: string | undefined,
  days: ProgramDay[],
  rows: ProgramExercise[],
): ProgramExercise[] {
  const dayIds = new Set(programDayIds(programId, days))
  return rows.filter((row) => dayIds.has(row.programDayId))
}

export function peLabel(
  pe: ProgramExercise,
  rows: ProgramExercise[],
  exercises: Exercise[],
  days: ProgramDay[],
): string {
  const name =
    exercises.find((exercise) => exercise.id === pe.exerciseId)?.name ??
    'Unknown'
  const members = rows.filter(
    (row) => canonicalPeId(rows, row.id) === canonicalPeId(rows, pe.id),
  )
  if (members.length > 1) return name
  const sameName = rows.filter((row) => row.exerciseId === pe.exerciseId)
  if (sameName.length > 1) {
    const day = days.find((item) => item.id === pe.programDayId)
    return `${name} · ${day?.name ?? 'Day'}`
  }
  return name
}

export function peSlotLabel(
  pe: ProgramExercise,
  exercises: Exercise[],
  days: ProgramDay[],
): string {
  const name =
    exercises.find((exercise) => exercise.id === pe.exerciseId)?.name ??
    'Unknown'
  const day = days.find((item) => item.id === pe.programDayId)?.name ?? 'Day'
  return `${name} · ${day}`
}

export function sameAsGroup(
  rows: ProgramExercise[],
  peId: string,
): ProgramExercise[] {
  const key = canonicalPeId(rows, peId)
  return rows.filter((row) => canonicalPeId(rows, row.id) === key)
}

export function wouldCycleSameAs(
  rows: ProgramExercise[],
  peId: string,
  sameAsId: string | null,
): boolean {
  if (!sameAsId) return false
  if (sameAsId === peId) return true
  const patched = rows.map((row) =>
    row.id === peId ? { ...row, sameAsId } : row,
  )
  const seen = new Set<string>()
  let current = peId
  while (true) {
    if (seen.has(current)) return true
    seen.add(current)
    const row = patched.find((item) => item.id === current)
    if (!row?.sameAsId) return false
    current = row.sameAsId
  }
}

export function joinSameAsGroup(
  rows: ProgramExercise[],
  peId: string,
  targetId: string,
): ProgramExercise[] {
  if (!targetId || targetId === peId) return rows
  if (sameAsGroup(rows, peId).length > 1) return rows
  if (!rows.some((row) => row.id === targetId)) return rows
  const root = canonicalPeId(rows, targetId)
  const nextRoot = root === peId ? targetId : root
  if (wouldCycleSameAs(rows, peId, nextRoot)) return rows
  return rows.map((row) =>
    row.id === peId ? { ...row, sameAsId: nextRoot } : row,
  )
}

export function leaveSameAsGroup(
  rows: ProgramExercise[],
  peId: string,
): ProgramExercise[] {
  const oldRoot = canonicalPeId(rows, peId)
  const remaining = sameAsGroup(rows, peId)
    .filter((row) => row.id !== peId)
    .sort((a, b) => a.id.localeCompare(b.id))
  const next = rows.map((row) =>
    row.id === peId ? { ...row, sameAsId: null } : row,
  )
  if (remaining.length <= 1) {
    const leftover = remaining[0]
    if (!leftover) return next
    return next.map((row) =>
      row.id === leftover.id ? { ...row, sameAsId: null } : row,
    )
  }
  const newRoot = remaining.some((row) => row.id === oldRoot)
    ? oldRoot
    : remaining[0]?.id
  if (!newRoot) return next
  const remainingIds = new Set(remaining.map((row) => row.id))
  return next.map((row) => {
    if (!remainingIds.has(row.id)) return row
    if (row.id === newRoot) return { ...row, sameAsId: null }
    return { ...row, sameAsId: newRoot }
  })
}

export function statsKeyForSet(
  programDayId: string | null,
  exerciseId: string,
  rows: ProgramExercise[],
): string {
  if (!programDayId) return exerciseId
  const pe = rows.find(
    (row) => row.programDayId === programDayId && row.exerciseId === exerciseId,
  )
  return pe ? canonicalPeId(rows, pe.id) : exerciseId
}

export function uniqueStatsExercises(
  programId: string | undefined,
  days: ProgramDay[],
  rows: ProgramExercise[],
  exercises: Exercise[],
  dayIds: string[] = [],
): Array<{ id: string; label: string }> {
  const programRows = programExercisesFor(programId, days, rows)
  const allowedDays = new Set(
    dayIds.length > 0 ? dayIds : programDayIds(programId, days),
  )
  const pes = programRows.filter((row) => allowedDays.has(row.programDayId))
  const seen = new Set<string>()
  const options: Array<{ id: string; label: string }> = []
  for (const pe of pes) {
    const id = canonicalPeId(programRows, pe.id)
    if (seen.has(id)) continue
    seen.add(id)
    const root = programRows.find((row) => row.id === id) ?? pe
    options.push({
      id,
      label: peLabel(root, programRows, exercises, days),
    })
  }
  return options.sort((a, b) => a.label.localeCompare(b.label, 'en'))
}
