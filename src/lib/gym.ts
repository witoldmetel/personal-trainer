import { createId } from '@/lib/ids'
import { supabase } from '@/lib/supabase'
import type {
  Exercise,
  Program,
  ProgramDay,
  ProgramExercise,
  Session,
  SessionSet,
  SessionStatus,
  StoreState,
} from '@/lib/types'

export const emptyGym: StoreState = {
  programs: [],
  programDays: [],
  exercises: [],
  programExercises: [],
  sessions: [],
  sessionSets: [],
}

type ProgramRow = { id: string; name: string }
type ProgramDayRow = {
  id: string
  program_id: string
  name: string
  sort_order: number
}
type ExerciseRow = { id: string; name: string; muscle_group: string | null }
type ProgramExerciseRow = {
  id: string
  program_day_id: string
  exercise_id: string
  sort_order: number
  target_sets: number
  target_reps: number
  uses_weight?: boolean | null
}
type SessionRow = {
  id: string
  program_day_id: string | null
  performed_on: string
  status: SessionStatus
}
type SessionSetRow = {
  id: string
  session_id: string
  exercise_id: string
  set_number: number
  reps: number | null
  weight_kg: number | string | null
}

function client() {
  if (!supabase) throw new Error('Supabase is not configured.')
  return supabase
}

async function userId(): Promise<string> {
  const { data, error } = await client().auth.getUser()
  if (error || !data.user) throw new Error('Not signed in.')
  return data.user.id
}

async function throwIfError(error: { message: string } | null) {
  if (error) throw new Error(error.message)
}

export async function loadGym(): Promise<StoreState> {
  const db = client()
  const [
    programs,
    programDays,
    exercises,
    programExercises,
    sessions,
    sessionSets,
  ] = await Promise.all([
    db.from('programs').select('id, name'),
    db.from('program_days').select('id, program_id, name, sort_order'),
    db.from('exercises').select('id, name, muscle_group'),
    db
      .from('program_exercises')
      .select(
        'id, program_day_id, exercise_id, sort_order, target_sets, target_reps, uses_weight',
      ),
    db.from('sessions').select('id, program_day_id, performed_on, status'),
    db
      .from('session_sets')
      .select('id, session_id, exercise_id, set_number, reps, weight_kg'),
  ])

  let peResult = programExercises
  if (peResult.error && /uses_weight/i.test(peResult.error.message)) {
    peResult = await db
      .from('program_exercises')
      .select(
        'id, program_day_id, exercise_id, sort_order, target_sets, target_reps',
      )
  }

  for (const result of [
    programs,
    programDays,
    exercises,
    peResult,
    sessions,
    sessionSets,
  ]) {
    await throwIfError(result.error)
  }

  const state: StoreState = {
    programs: ((programs.data ?? []) as ProgramRow[]).map((row) => ({
      id: row.id,
      name: row.name,
    })),
    programDays: ((programDays.data ?? []) as ProgramDayRow[]).map((row) => ({
      id: row.id,
      programId: row.program_id,
      name: row.name,
      sortOrder: row.sort_order,
    })),
    exercises: ((exercises.data ?? []) as ExerciseRow[]).map((row) => ({
      id: row.id,
      name: row.name,
      muscleGroup: row.muscle_group ?? undefined,
    })),
    programExercises: ((peResult.data ?? []) as ProgramExerciseRow[]).map(
      (row) => ({
        id: row.id,
        programDayId: row.program_day_id,
        exerciseId: row.exercise_id,
        sortOrder: row.sort_order,
        targetSets: row.target_sets,
        targetReps: row.target_reps,
        usesWeight: row.uses_weight !== false,
      }),
    ),
    sessions: ((sessions.data ?? []) as SessionRow[]).map((row) => ({
      id: row.id,
      programDayId: row.program_day_id,
      performedOn: row.performed_on,
      status: row.status,
    })),
    sessionSets: ((sessionSets.data ?? []) as SessionSetRow[]).map((row) => ({
      id: row.id,
      sessionId: row.session_id,
      exerciseId: row.exercise_id,
      setNumber: row.set_number,
      reps: row.reps,
      weightKg: row.weight_kg == null ? null : Number(row.weight_kg),
    })),
  }

  const missing = deriveMissingProgramExercises(state)
  const withMissing = {
    ...state,
    programExercises: [...state.programExercises, ...missing],
  }
  const flagged = applySkipWeightFromHistory(withMissing)
  const changedFlags = flagged.filter((pe) => {
    const prev = withMissing.programExercises.find((row) => row.id === pe.id)
    return prev != null && prev.usesWeight !== pe.usesWeight
  })
  if (missing.length === 0 && changedFlags.length === 0) return state
  const uid = await userId()
  if (missing.length > 0) {
    try {
      await insertChunked(
        'program_exercises',
        missing.map((row) => ({
          id: row.id,
          user_id: uid,
          program_day_id: row.programDayId,
          exercise_id: row.exerciseId,
          sort_order: row.sortOrder,
          target_sets: row.targetSets,
          target_reps: row.targetReps,
          uses_weight: row.usesWeight,
        })),
      )
    } catch {
      await insertChunked(
        'program_exercises',
        missing.map((row) => ({
          id: row.id,
          user_id: uid,
          program_day_id: row.programDayId,
          exercise_id: row.exerciseId,
          sort_order: row.sortOrder,
          target_sets: row.targetSets,
          target_reps: row.targetReps,
        })),
      )
    }
  }
  for (const row of changedFlags) {
    try {
      await persistProgramExerciseTargets(
        row.id,
        row.targetSets,
        row.targetReps,
        row.usesWeight,
      )
    } catch {
      break
    }
  }
  return { ...state, programExercises: flagged }
}

function deriveMissingProgramExercises(state: StoreState): ProgramExercise[] {
  const missing: ProgramExercise[] = []
  for (const day of state.programDays) {
    if (state.programExercises.some((pe) => pe.programDayId === day.id)) continue
    const daySessions = state.sessions
      .filter((session) => session.programDayId === day.id)
      .sort((a, b) => a.performedOn.localeCompare(b.performedOn))
    const order: string[] = []
    const byExercise = new Map<string, SessionSet[]>()
    for (const session of daySessions) {
      for (const set of state.sessionSets) {
        if (set.sessionId !== session.id) continue
        if (!order.includes(set.exerciseId)) order.push(set.exerciseId)
        const list = byExercise.get(set.exerciseId) ?? []
        list.push(set)
        byExercise.set(set.exerciseId, list)
      }
    }
    for (const [sortOrder, exerciseId] of order.entries()) {
      const exSets = byExercise.get(exerciseId) ?? []
      const targetSets = Math.max(...exSets.map((set) => set.setNumber), 1)
      const targetReps = exSets.find((set) => set.reps != null)?.reps ?? 8
      missing.push({
        id: createId('pe'),
        programDayId: day.id,
        exerciseId,
        sortOrder,
        targetSets,
        targetReps,
        usesWeight: exSets.some((set) => (set.weightKg ?? 0) > 0),
      })
    }
  }
  return missing
}

function applySkipWeightFromHistory(state: StoreState): ProgramExercise[] {
  return state.programExercises.map((pe) => {
    if (!pe.usesWeight) return pe
    const daySessionIds = new Set(
      state.sessions
        .filter((session) => session.programDayId === pe.programDayId)
        .map((session) => session.id),
    )
    const sets = state.sessionSets.filter(
      (set) =>
        daySessionIds.has(set.sessionId) && set.exerciseId === pe.exerciseId,
    )
    if (sets.length === 0) return pe
    if (sets.some((set) => (set.weightKg ?? 0) > 0)) return pe
    return { ...pe, usesWeight: false }
  })
}

export async function ensureProfile(githubUsername: string) {
  const db = client()
  const uid = await userId()
  const { error } = await db.from('profiles').upsert({
    id: uid,
    github_username: githubUsername,
  })
  await throwIfError(error)
}

async function insertChunked(table: string, rows: object[]) {
  const db = client()
  for (let i = 0; i < rows.length; i += 100) {
    const { error } = await db.from(table).insert(rows.slice(i, i + 100))
    await throwIfError(error)
  }
}

export async function persistProgram(program: Program) {
  const uid = await userId()
  const { error } = await client()
    .from('programs')
    .insert({ id: program.id, user_id: uid, name: program.name })
  await throwIfError(error)
}

export async function persistDay(day: ProgramDay) {
  const uid = await userId()
  const { error } = await client()
    .from('program_days')
    .insert({
      id: day.id,
      user_id: uid,
      program_id: day.programId,
      name: day.name,
      sort_order: day.sortOrder,
    })
  await throwIfError(error)
}

export async function persistExercise(exercise: Exercise) {
  const uid = await userId()
  const { error } = await client()
    .from('exercises')
    .insert({
      id: exercise.id,
      user_id: uid,
      name: exercise.name,
      muscle_group: exercise.muscleGroup ?? null,
    })
  await throwIfError(error)
}

export async function persistProgramExercise(row: ProgramExercise) {
  const uid = await userId()
  const { error } = await client()
    .from('program_exercises')
    .insert({
      id: row.id,
      user_id: uid,
      program_day_id: row.programDayId,
      exercise_id: row.exerciseId,
      sort_order: row.sortOrder,
      target_sets: row.targetSets,
      target_reps: row.targetReps,
      uses_weight: row.usesWeight,
    })
  await throwIfError(error)
}

export async function persistSession(session: Session) {
  const uid = await userId()
  const { error } = await client()
    .from('sessions')
    .insert({
      id: session.id,
      user_id: uid,
      program_day_id: session.programDayId,
      performed_on: session.performedOn,
      status: session.status,
    })
  await throwIfError(error)
}

export async function persistSets(sets: SessionSet[]) {
  if (sets.length === 0) return
  const uid = await userId()
  await insertChunked(
    'session_sets',
    sets.map((set) => ({
      id: set.id,
      user_id: uid,
      session_id: set.sessionId,
      exercise_id: set.exerciseId,
      set_number: Math.round(set.setNumber),
      reps: set.reps == null ? null : Math.round(set.reps),
      weight_kg: set.weightKg,
    })),
  )
}

export async function persistSessionStatus(sessionId: string, status: SessionStatus) {
  const { error } = await client()
    .from('sessions')
    .update({ status })
    .eq('id', sessionId)
  await throwIfError(error)
}

export async function persistSetPatch(
  setId: string,
  patch: { reps?: number | null; weightKg?: number | null },
) {
  const row: { reps?: number | null; weight_kg?: number | null } = {}
  if ('reps' in patch) {
    row.reps = patch.reps == null ? null : Math.round(patch.reps)
  }
  if ('weightKg' in patch) row.weight_kg = patch.weightKg
  const { error } = await client().from('session_sets').update(row).eq('id', setId)
  await throwIfError(error)
}

export async function persistRemoveSession(sessionId: string) {
  const { error } = await client().from('sessions').delete().eq('id', sessionId)
  await throwIfError(error)
}

export async function persistRenameExercise(exerciseId: string, name: string) {
  const { error } = await client()
    .from('exercises')
    .update({ name })
    .eq('id', exerciseId)
  await throwIfError(error)
}

export async function persistRemoveProgramExercise(id: string) {
  const { error } = await client().from('program_exercises').delete().eq('id', id)
  await throwIfError(error)
}

export async function persistProgramExerciseOrder(
  updates: Array<{ id: string; sortOrder: number }>,
) {
  const db = client()
  for (const row of updates) {
    const { error } = await db
      .from('program_exercises')
      .update({ sort_order: row.sortOrder })
      .eq('id', row.id)
    await throwIfError(error)
  }
}

export async function persistProgramExerciseTargets(
  id: string,
  targetSets: number,
  targetReps: number,
  usesWeight: boolean,
) {
  const { error } = await client()
    .from('program_exercises')
    .update({
      target_sets: targetSets,
      target_reps: targetReps,
      uses_weight: usesWeight,
    })
    .eq('id', id)
  await throwIfError(error)
}

export async function persistImport(next: StoreState, previous: StoreState) {
  const uid = await userId()
  const prevProgramIds = new Set(previous.programs.map((row) => row.id))
  const prevDayIds = new Set(previous.programDays.map((row) => row.id))
  const prevExerciseIds = new Set(previous.exercises.map((row) => row.id))
  const prevSessionIds = new Set(previous.sessions.map((row) => row.id))
  const prevPeIds = new Set(previous.programExercises.map((row) => row.id))
  const prevSetById = new Map(previous.sessionSets.map((row) => [row.id, row]))

  await insertChunked(
    'programs',
    next.programs
      .filter((row) => !prevProgramIds.has(row.id))
      .map((row) => ({ id: row.id, user_id: uid, name: row.name })),
  )
  await insertChunked(
    'program_days',
    next.programDays
      .filter((row) => !prevDayIds.has(row.id))
      .map((row) => ({
        id: row.id,
        user_id: uid,
        program_id: row.programId,
        name: row.name,
        sort_order: row.sortOrder,
      })),
  )
  await insertChunked(
    'exercises',
    next.exercises
      .filter((row) => !prevExerciseIds.has(row.id) && row.name.trim() !== '')
      .map((row) => ({
        id: row.id,
        user_id: uid,
        name: row.name,
        muscle_group: row.muscleGroup ?? null,
      })),
  )
  await insertChunked(
    'program_exercises',
    next.programExercises
      .filter((row) => !prevPeIds.has(row.id))
      .map((row) => ({
        id: row.id,
        user_id: uid,
        program_day_id: row.programDayId,
        exercise_id: row.exerciseId,
        sort_order: row.sortOrder,
        target_sets: row.targetSets,
        target_reps: row.targetReps,
        uses_weight: row.usesWeight,
      })),
  )
  const db = client()
  for (const row of next.programExercises) {
    if (!prevPeIds.has(row.id)) continue
    const prev = previous.programExercises.find((pe) => pe.id === row.id)
    if (
      prev &&
      prev.sortOrder === row.sortOrder &&
      prev.targetSets === row.targetSets &&
      prev.targetReps === row.targetReps &&
      prev.usesWeight === row.usesWeight
    ) {
      continue
    }
    const { error } = await db
      .from('program_exercises')
      .update({
        sort_order: row.sortOrder,
        target_sets: row.targetSets,
        target_reps: row.targetReps,
        uses_weight: row.usesWeight,
      })
      .eq('id', row.id)
    await throwIfError(error)
  }
  await insertChunked(
    'sessions',
    next.sessions
      .filter((row) => !prevSessionIds.has(row.id))
      .map((row) => ({
        id: row.id,
        user_id: uid,
        program_day_id: row.programDayId,
        performed_on: row.performedOn,
        status: row.status,
      })),
  )

  const newSets: object[] = []
  for (const set of next.sessionSets) {
    const prev = prevSetById.get(set.id)
    if (!prev) {
      newSets.push({
        id: set.id,
        user_id: uid,
        session_id: set.sessionId,
        exercise_id: set.exerciseId,
        set_number: Math.round(set.setNumber),
        reps: set.reps == null ? null : Math.round(set.reps),
        weight_kg: set.weightKg,
      })
      continue
    }
    if (prev.reps === set.reps && prev.weightKg === set.weightKg) continue
    const { error } = await db
      .from('session_sets')
      .update({
        reps: set.reps == null ? null : Math.round(set.reps),
        weight_kg: set.weightKg,
      })
      .eq('id', set.id)
    await throwIfError(error)
  }
  await insertChunked('session_sets', newSets)
}
