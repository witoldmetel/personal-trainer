import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { formatLastTime, todayIso } from '@/lib/dates'
import {
  emptyGym,
  loadGym,
  persistDay,
  persistDayOrder,
  persistExercise,
  persistImport,
  persistProgram,
  persistProgramExercise,
  persistProgramExerciseOrder,
  persistProgramExerciseTargets,
  persistRemoveDay,
  persistRemoveProgram,
  persistRemoveProgramExercise,
  persistRemoveSession,
  persistRenameDay,
  persistRenameExercise,
  persistRenameProgram,
  persistSession,
  persistSessionStatus,
  persistSetPatch,
  persistSets,
} from '@/lib/gym'
import { createId } from '@/lib/ids'
import type {
  LoggerRow,
  ProgramDay,
  ProgramExercise,
  ProgramPlanDay,
  Session,
  StoreState,
} from '@/lib/types'

type StoreApi = StoreState & {
  todaySession: () => Session | undefined
  sessionDay: (session: Session) => ProgramDay | undefined
  loggerRows: (sessionId: string) => LoggerRow[]
  lastTimeFor: (exerciseId: string, beforeSessionId?: string) => string | null
  startSession: (programDayId: string) => string
  markSessionDone: (sessionId: string) => void
  updateSet: (
    setId: string,
    patch: { reps?: number | null; weightKg?: number | null },
  ) => void
  addSet: (sessionId: string, exerciseId: string) => void
  removeSession: (sessionId: string) => void
  addProgram: (name: string) => string
  renameProgram: (programId: string, name: string) => void
  removeProgram: (programId: string) => void
  addDay: (programId: string, name: string) => string
  renameDay: (dayId: string, name: string) => void
  removeDay: (dayId: string) => void
  addExerciseToDay: (input: {
    programDayId: string
    name: string
    targetSets: number
    targetReps: number
    usesWeight: boolean
  }) => void
  renameExercise: (exerciseId: string, name: string) => void
  removeProgramExercise: (programExerciseId: string) => void
  moveProgramExercise: (
    programExerciseId: string,
    direction: 'up' | 'down',
  ) => void
  updateProgramExerciseTargets: (
    programExerciseId: string,
    targetSets: number,
    targetReps: number,
    usesWeight: boolean,
  ) => void
  importHistory: (
    rows: Array<{
      date: string
      dayName: string
      exerciseName: string
      setNumber: number
      reps: number
      weightKg: number
    }>,
    planDays?: ProgramPlanDay[],
  ) => { sessions: number; sets: number }
}

const StoreContext = createContext<StoreApi | null>(null)
const GYM_KEY = ['gym'] as const

function compareSessionRecency(a: Session, b: Session): number {
  if (a.performedOn === b.performedOn) return a.id.localeCompare(b.id)
  return a.performedOn < b.performedOn ? 1 : -1
}

function toastPersist(error: unknown) {
  toast.error('Could not save', {
    description: error instanceof Error ? error.message : 'Try again.',
  })
}

function runPersist(action: () => Promise<void>) {
  void action().catch(toastPersist)
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const gymQuery = useQuery({
    queryKey: GYM_KEY,
    queryFn: loadGym,
  })
  const persistTimers = useRef(new Map<string, ReturnType<typeof setTimeout>>())

  useEffect(() => {
    const timers = persistTimers.current
    return () => {
      for (const timer of timers.values()) clearTimeout(timer)
    }
  }, [])

  const state = gymQuery.data ?? emptyGym

  const api = useMemo<StoreApi>(() => {
    function setGym(updater: (current: StoreState) => StoreState) {
      queryClient.setQueryData<StoreState>(GYM_KEY, (current) =>
        updater(current ?? emptyGym),
      )
    }

    const lastTimeFor = (exerciseId: string, beforeSessionId?: string) => {
      const before = beforeSessionId
        ? state.sessions.find((s) => s.id === beforeSessionId)
        : undefined
      const candidates = state.sessions
        .filter((s) => {
          if (s.id === beforeSessionId) return false
          if (before && s.performedOn > before.performedOn) return false
          return true
        })
        .sort(compareSessionRecency)

      for (const session of candidates) {
        const sets = state.sessionSets
          .filter((set) => set.sessionId === session.id && set.exerciseId === exerciseId)
          .sort((a, b) => a.setNumber - b.setNumber)
        const first = sets.find((set) => set.reps != null)
        if (first && first.reps != null) {
          return formatLastTime(first.weightKg, first.reps)
        }
      }
      return null
    }

    const loggerRows = (sessionId: string): LoggerRow[] => {
      const session = state.sessions.find((s) => s.id === sessionId)
      if (!session) return []
      const sessionSets = state.sessionSets.filter(
        (set) => set.sessionId === sessionId,
      )
      const exerciseOrder: string[] = []
      for (const pe of [...state.programExercises]
        .filter((row) => row.programDayId === session.programDayId)
        .sort((a, b) => a.sortOrder - b.sortOrder)) {
        if (
          sessionSets.some((set) => set.exerciseId === pe.exerciseId) &&
          !exerciseOrder.includes(pe.exerciseId)
        ) {
          exerciseOrder.push(pe.exerciseId)
        }
      }
      for (const set of sessionSets) {
        if (!exerciseOrder.includes(set.exerciseId)) {
          exerciseOrder.push(set.exerciseId)
        }
      }
      const sets = [...sessionSets].sort((a, b) => {
        const aOrder = exerciseOrder.indexOf(a.exerciseId)
        const bOrder = exerciseOrder.indexOf(b.exerciseId)
        if (aOrder !== bOrder) return aOrder - bOrder
        return a.setNumber - b.setNumber
      })

      return sets.map((set, index) => {
        const exercise = state.exercises.find((e) => e.id === set.exerciseId)
        const pe = state.programExercises.find(
          (row) =>
            row.programDayId === session.programDayId &&
            row.exerciseId === set.exerciseId,
        )
        const next = sets[index + 1]
        const usesWeight =
          pe?.usesWeight ??
          sessionSets.some(
            (row) => row.exerciseId === set.exerciseId && (row.weightKg ?? 0) > 0,
          )
        return {
          setId: set.id,
          sessionId: set.sessionId,
          exerciseId: set.exerciseId,
          exerciseName: exercise?.name ?? 'Unknown',
          setNumber: set.setNumber,
          reps: set.reps,
          weightKg: set.weightKg,
          lastTime: lastTimeFor(set.exerciseId, sessionId),
          usesWeight,
          isLastOfExercise: !next || next.exerciseId !== set.exerciseId,
          rowIndex: index,
        }
      })
    }

    return {
      ...state,
      lastTimeFor,
      loggerRows,
      todaySession: () =>
        state.sessions.find((s) => s.performedOn === todayIso()),
      sessionDay: (session) =>
        session.programDayId
          ? state.programDays.find((d) => d.id === session.programDayId)
          : undefined,
      startSession: (programDayId) => {
        const id = createId('ses')
        const dayExercises = state.programExercises
          .filter((pe) => pe.programDayId === programDayId)
          .sort((a, b) => a.sortOrder - b.sortOrder)
        const newSets = dayExercises.flatMap((pe) =>
          Array.from({ length: pe.targetSets }, (_, i) => ({
            id: createId('set'),
            sessionId: id,
            exerciseId: pe.exerciseId,
            setNumber: i + 1,
            reps: null,
            weightKg: null,
          })),
        )
        const session: Session = {
          id,
          programDayId,
          performedOn: todayIso(),
          status: 'in_progress',
        }
        setGym((s) => ({
          ...s,
          sessions: [...s.sessions, session],
          sessionSets: [...s.sessionSets, ...newSets],
        }))
        runPersist(async () => {
          await persistSession(session)
          await persistSets(newSets)
        })
        return id
      },
      markSessionDone: (sessionId) => {
        setGym((s) => ({
          ...s,
          sessions: s.sessions.map((session) =>
            session.id === sessionId ? { ...session, status: 'done' } : session,
          ),
        }))
        runPersist(() => persistSessionStatus(sessionId, 'done'))
      },
      updateSet: (setId, patch) => {
        setGym((s) => ({
          ...s,
          sessionSets: s.sessionSets.map((set) =>
            set.id === setId ? { ...set, ...patch } : set,
          ),
        }))
        const timers = persistTimers.current
        const pending = timers.get(setId)
        if (pending) clearTimeout(pending)
        timers.set(
          setId,
          setTimeout(() => {
            timers.delete(setId)
            const latest = queryClient.getQueryData<StoreState>(GYM_KEY)
            const set = latest?.sessionSets.find((row) => row.id === setId)
            if (!set) return
            runPersist(() =>
              persistSetPatch(setId, { reps: set.reps, weightKg: set.weightKg }),
            )
          }, 400),
        )
      },
      addSet: (sessionId, exerciseId) => {
        const existing = state.sessionSets.filter(
          (set) => set.sessionId === sessionId && set.exerciseId === exerciseId,
        )
        const setNumber =
          existing.reduce((max, set) => Math.max(max, set.setNumber), 0) + 1
        const row = {
          id: createId('set'),
          sessionId,
          exerciseId,
          setNumber,
          reps: null,
          weightKg: null,
        }
        setGym((s) => ({ ...s, sessionSets: [...s.sessionSets, row] }))
        runPersist(() => persistSets([row]))
      },
      removeSession: (sessionId) => {
        setGym((s) => ({
          ...s,
          sessions: s.sessions.filter((session) => session.id !== sessionId),
          sessionSets: s.sessionSets.filter((set) => set.sessionId !== sessionId),
        }))
        runPersist(() => persistRemoveSession(sessionId))
      },
      addProgram: (name) => {
        const id = createId('prog')
        const program = { id, name }
        setGym((s) => ({ ...s, programs: [...s.programs, program] }))
        runPersist(() => persistProgram(program))
        return id
      },
      renameProgram: (programId, name) => {
        const trimmed = name.trim()
        if (!trimmed) return
        setGym((s) => ({
          ...s,
          programs: s.programs.map((program) =>
            program.id === programId ? { ...program, name: trimmed } : program,
          ),
        }))
        runPersist(() => persistRenameProgram(programId, trimmed))
      },
      removeProgram: (programId) => {
        const dayIds = state.programDays
          .filter((day) => day.programId === programId)
          .map((day) => day.id)
        setGym((s) => ({
          ...s,
          programs: s.programs.filter((program) => program.id !== programId),
          programDays: s.programDays.filter((day) => day.programId !== programId),
          programExercises: s.programExercises.filter(
            (pe) => !dayIds.includes(pe.programDayId),
          ),
          sessions: s.sessions.map((session) =>
            session.programDayId && dayIds.includes(session.programDayId)
              ? { ...session, programDayId: null }
              : session,
          ),
        }))
        runPersist(() => persistRemoveProgram(programId))
      },
      addDay: (programId, name) => {
        const id = createId('day')
        const sortOrder = state.programDays.filter((d) => d.programId === programId)
          .length
        const day: ProgramDay = { id, programId, name, sortOrder }
        setGym((s) => ({ ...s, programDays: [...s.programDays, day] }))
        runPersist(() => persistDay(day))
        return id
      },
      renameDay: (dayId, name) => {
        const trimmed = name.trim()
        if (!trimmed) return
        setGym((s) => ({
          ...s,
          programDays: s.programDays.map((day) =>
            day.id === dayId ? { ...day, name: trimmed } : day,
          ),
        }))
        runPersist(() => persistRenameDay(dayId, trimmed))
      },
      removeDay: (dayId) => {
        const target = state.programDays.find((day) => day.id === dayId)
        if (!target) return
        const remaining = state.programDays
          .filter((day) => day.id !== dayId)
          .map((day) => {
            if (day.programId !== target.programId) return day
            if (day.sortOrder < target.sortOrder) return day
            return { ...day, sortOrder: day.sortOrder - 1 }
          })
        setGym((s) => ({
          ...s,
          programDays: remaining,
          programExercises: s.programExercises.filter(
            (pe) => pe.programDayId !== dayId,
          ),
          sessions: s.sessions.map((session) =>
            session.programDayId === dayId
              ? { ...session, programDayId: null }
              : session,
          ),
        }))
        runPersist(async () => {
          await persistRemoveDay(dayId)
          await persistDayOrder(
            remaining
              .filter((day) => day.programId === target.programId)
              .map((day) => ({ id: day.id, sortOrder: day.sortOrder })),
          )
        })
      },
      addExerciseToDay: ({
        programDayId,
        name,
        targetSets,
        targetReps,
        usesWeight,
      }) => {
        const trimmed = name.trim()
        const existing = state.exercises.find(
          (e) => e.name.toLowerCase() === trimmed.toLowerCase(),
        )
        const exercise = existing ?? { id: createId('ex'), name: trimmed }
        const sortOrder = state.programExercises.filter(
          (pe) => pe.programDayId === programDayId,
        ).length
        const programExercise: ProgramExercise = {
          id: createId('pe'),
          programDayId,
          exerciseId: exercise.id,
          sortOrder,
          targetSets,
          targetReps,
          usesWeight,
        }
        setGym((s) => ({
          ...s,
          exercises: existing ? s.exercises : [...s.exercises, exercise],
          programExercises: [...s.programExercises, programExercise],
        }))
        runPersist(async () => {
          if (!existing) await persistExercise(exercise)
          await persistProgramExercise(programExercise)
        })
      },
      renameExercise: (exerciseId, name) => {
        const trimmed = name.trim()
        setGym((s) => ({
          ...s,
          exercises: s.exercises.map((e) =>
            e.id === exerciseId ? { ...e, name: trimmed } : e,
          ),
        }))
        runPersist(() => persistRenameExercise(exerciseId, trimmed))
      },
      removeProgramExercise: (programExerciseId) => {
        const target = state.programExercises.find(
          (pe) => pe.id === programExerciseId,
        )
        if (!target) return
        const remaining = state.programExercises
          .filter((pe) => pe.id !== programExerciseId)
          .map((pe) => {
            if (pe.programDayId !== target.programDayId) return pe
            if (pe.sortOrder < target.sortOrder) return pe
            return { ...pe, sortOrder: pe.sortOrder - 1 }
          })
        setGym((s) => ({ ...s, programExercises: remaining }))
        runPersist(async () => {
          await persistRemoveProgramExercise(programExerciseId)
          await persistProgramExerciseOrder(
            remaining
              .filter((pe) => pe.programDayId === target.programDayId)
              .map((pe) => ({ id: pe.id, sortOrder: pe.sortOrder })),
          )
        })
      },
      moveProgramExercise: (programExerciseId, direction) => {
        const current = state.programExercises.find(
          (pe) => pe.id === programExerciseId,
        )
        if (!current) return
        const swapOrder =
          direction === 'up' ? current.sortOrder - 1 : current.sortOrder + 1
        const other = state.programExercises.find(
          (pe) =>
            pe.programDayId === current.programDayId && pe.sortOrder === swapOrder,
        )
        if (!other) return
        setGym((s) => ({
          ...s,
          programExercises: s.programExercises.map((pe) => {
            if (pe.id === current.id) return { ...pe, sortOrder: other.sortOrder }
            if (pe.id === other.id) return { ...pe, sortOrder: current.sortOrder }
            return pe
          }),
        }))
        runPersist(() =>
          persistProgramExerciseOrder([
            { id: current.id, sortOrder: other.sortOrder },
            { id: other.id, sortOrder: current.sortOrder },
          ]),
        )
      },
      updateProgramExerciseTargets: (
        programExerciseId,
        targetSets,
        targetReps,
        usesWeight,
      ) => {
        setGym((s) => ({
          ...s,
          programExercises: s.programExercises.map((pe) =>
            pe.id === programExerciseId
              ? { ...pe, targetSets, targetReps, usesWeight }
              : pe,
          ),
        }))
        runPersist(() =>
          persistProgramExerciseTargets(
            programExerciseId,
            targetSets,
            targetReps,
            usesWeight,
          ),
        )
      },
      importHistory: (rows, planDays = []) => {
        let sessionsAdded = 0
        let setsAdded = 0
        const previous = state
        const programs = [...state.programs]
        const programDays = [...state.programDays]
        const exercises = [...state.exercises]
        const programExercises = [...state.programExercises]
        const sessions = [...state.sessions]
        const sessionSets = [...state.sessionSets]
        let program = programs[0]
        if (!program) {
          program = { id: createId('prog'), name: 'Home routine' }
          programs.push(program)
        }

        const dayByKey = new Map<string, ProgramDay>()
        for (const day of programDays) {
          if (day.programId === program.id) {
            dayByKey.set(day.name.toLowerCase(), day)
          }
        }
        const exerciseByName = new Map(
          exercises.map((e) => [e.name.toLowerCase(), e] as const),
        )

        const ensureDay = (name: string) => {
          const key = name.toLowerCase()
          let day = dayByKey.get(key)
          if (day) return day
          day = {
            id: createId('day'),
            programId: program.id,
            name,
            sortOrder: programDays.filter((d) => d.programId === program.id)
              .length,
          }
          programDays.push(day)
          dayByKey.set(key, day)
          return day
        }

        const ensureExercise = (name: string) => {
          const key = name.toLowerCase()
          let exercise = exerciseByName.get(key)
          if (exercise) return exercise
          exercise = { id: createId('ex'), name }
          exercises.push(exercise)
          exerciseByName.set(key, exercise)
          return exercise
        }

        const plansFromRows = (): ProgramPlanDay[] => {
          const days: ProgramPlanDay[] = []
          const index = new Map<string, ProgramPlanDay>()
          for (const row of rows) {
            const name = row.exerciseName.trim()
            if (!name) continue
            const key = row.dayName.toLowerCase()
            let day = index.get(key)
            if (!day) {
              day = { dayName: row.dayName, exercises: [] }
              index.set(key, day)
              days.push(day)
            }
            const existing = day.exercises.find(
              (item) => item.name.toLowerCase() === name.toLowerCase(),
            )
            if (existing) {
              existing.targetSets = Math.max(existing.targetSets, row.setNumber)
              if (row.weightKg > 0) existing.usesWeight = true
            } else {
              day.exercises.push({
                name,
                targetSets: row.setNumber,
                targetReps: row.reps,
                usesWeight: row.weightKg > 0,
              })
            }
          }
          return days
        }

        const applyPlan = (day: ProgramDay, plan: ProgramPlanDay['exercises']) => {
          for (const [sortOrder, item] of plan.entries()) {
            const name = item.name.trim()
            if (!name) continue
            const exercise = ensureExercise(name)
            const existingPe = programExercises.find(
              (pe) =>
                pe.programDayId === day.id && pe.exerciseId === exercise.id,
            )
            const targetSets = Math.max(item.targetSets, 1)
            const targetReps = item.targetReps > 0 ? item.targetReps : 8
            const usesWeight = item.usesWeight !== false
            if (existingPe) {
              existingPe.sortOrder = sortOrder
              existingPe.targetSets = Math.max(existingPe.targetSets, targetSets)
              existingPe.targetReps = targetReps
              existingPe.usesWeight = usesWeight
            } else {
              programExercises.push({
                id: createId('pe'),
                programDayId: day.id,
                exerciseId: exercise.id,
                sortOrder,
                targetSets,
                targetReps,
                usesWeight,
              })
            }
          }
        }

        const plans = planDays.length > 0 ? planDays : plansFromRows()
        for (const plan of plans) {
          applyPlan(ensureDay(plan.dayName), plan.exercises)
        }

        const groups = new Map<string, typeof rows>()
        for (const row of rows) {
          const exerciseName = row.exerciseName.trim()
          if (!exerciseName) continue
          const setNumber = Math.round(row.setNumber)
          const reps = Math.round(row.reps)
          if (!Number.isInteger(setNumber) || setNumber < 1) continue
          if (!Number.isInteger(reps) || reps < 1) continue
          const key = `${row.date}|${row.dayName.toLowerCase()}`
          const list = groups.get(key) ?? []
          list.push({
            ...row,
            exerciseName,
            setNumber,
            reps,
            weightKg: row.weightKg,
          })
          groups.set(key, list)
        }

        for (const [key, group] of groups) {
          const [date, dayKey] = key.split('|')
          const day = ensureDay(group[0]?.dayName ?? dayKey)
          let session = sessions.find(
            (ses) => ses.performedOn === date && ses.programDayId === day.id,
          )
          if (!session) {
            session = {
              id: createId('ses'),
              programDayId: day.id,
              performedOn: date,
              status: 'done',
            }
            sessions.push(session)
            sessionsAdded += 1
          }
          for (const row of group) {
            const exercise = ensureExercise(row.exerciseName)
            const onDay = programExercises.filter(
              (pe) => pe.programDayId === day.id,
            )
            const existingPe = onDay.find((pe) => pe.exerciseId === exercise.id)
            if (existingPe) {
              existingPe.targetSets = Math.max(
                existingPe.targetSets,
                row.setNumber,
              )
              if (row.weightKg > 0) existingPe.usesWeight = true
            } else {
              programExercises.push({
                id: createId('pe'),
                programDayId: day.id,
                exerciseId: exercise.id,
                sortOrder: onDay.length,
                targetSets: row.setNumber,
                targetReps: row.reps,
                usesWeight: row.weightKg > 0,
              })
            }
            const dup = sessionSets.find(
              (set) =>
                set.sessionId === session.id &&
                set.exerciseId === exercise.id &&
                set.setNumber === row.setNumber,
            )
            if (dup) {
              dup.reps = row.reps
              dup.weightKg = row.weightKg
              continue
            }
            sessionSets.push({
              id: createId('set'),
              sessionId: session.id,
              exerciseId: exercise.id,
              setNumber: row.setNumber,
              reps: row.reps,
              weightKg: row.weightKg,
            })
            setsAdded += 1
          }
        }

        const next: StoreState = {
          programs,
          programDays,
          exercises,
          programExercises,
          sessions,
          sessionSets,
        }
        queryClient.setQueryData(GYM_KEY, next)
        runPersist(() => persistImport(next, previous))
        return { sessions: sessionsAdded, sets: setsAdded }
      },
    }
  }, [queryClient, state])

  if (gymQuery.isPending) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background text-sm text-muted-foreground">
        Loading
      </div>
    )
  }

  if (gymQuery.isError) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-2 bg-background px-4 text-center">
        <p className="text-sm font-medium">Could not load gym data</p>
        <p className="text-sm text-muted-foreground">
          {gymQuery.error instanceof Error
            ? gymQuery.error.message
            : 'Check that the Supabase tables exist.'}
        </p>
      </div>
    )
  }

  return <StoreContext.Provider value={api}>{children}</StoreContext.Provider>
}

export function useStore(): StoreApi {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
