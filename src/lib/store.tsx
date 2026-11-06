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
  persistExercise,
  persistImport,
  persistProgram,
  persistProgramExercise,
  persistProgramExerciseOrder,
  persistProgramExerciseTargets,
  persistRemoveProgramExercise,
  persistRemoveSession,
  persistRenameExercise,
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
  addDay: (programId: string, name: string) => string
  addExerciseToDay: (input: {
    programDayId: string
    name: string
    targetSets: number
    targetReps: number
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
        const first = sets.find((set) => set.reps != null && set.weightKg != null)
        if (first && first.reps != null && first.weightKg != null) {
          return formatLastTime(first.weightKg, first.reps)
        }
      }
      return null
    }

    const loggerRows = (sessionId: string): LoggerRow[] => {
      const session = state.sessions.find((s) => s.id === sessionId)
      if (!session) return []
      const dayExercises = state.programExercises
        .filter((pe) => pe.programDayId === session.programDayId)
        .sort((a, b) => a.sortOrder - b.sortOrder)
      const sets = state.sessionSets
        .filter((set) => set.sessionId === sessionId)
        .sort((a, b) => {
          const aOrder =
            dayExercises.find((pe) => pe.exerciseId === a.exerciseId)?.sortOrder ??
            999
          const bOrder =
            dayExercises.find((pe) => pe.exerciseId === b.exerciseId)?.sortOrder ??
            999
          if (aOrder !== bOrder) return aOrder - bOrder
          return a.setNumber - b.setNumber
        })

      return sets.map((set, index) => {
        const exercise = state.exercises.find((e) => e.id === set.exerciseId)
        const next = sets[index + 1]
        return {
          setId: set.id,
          sessionId: set.sessionId,
          exerciseId: set.exerciseId,
          exerciseName: exercise?.name ?? 'Unknown',
          setNumber: set.setNumber,
          reps: set.reps,
          weightKg: set.weightKg,
          lastTime: lastTimeFor(set.exerciseId, sessionId),
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
      addDay: (programId, name) => {
        const id = createId('day')
        const sortOrder = state.programDays.filter((d) => d.programId === programId)
          .length
        const day: ProgramDay = { id, programId, name, sortOrder }
        setGym((s) => ({ ...s, programDays: [...s.programDays, day] }))
        runPersist(() => persistDay(day))
        return id
      },
      addExerciseToDay: ({ programDayId, name, targetSets, targetReps }) => {
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
      ) => {
        setGym((s) => ({
          ...s,
          programExercises: s.programExercises.map((pe) =>
            pe.id === programExerciseId
              ? { ...pe, targetSets, targetReps }
              : pe,
          ),
        }))
        runPersist(() =>
          persistProgramExerciseTargets(programExerciseId, targetSets, targetReps),
        )
      },
      importHistory: (rows) => {
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

        const groups = new Map<string, typeof rows>()
        for (const row of rows) {
          const key = `${row.date}|${row.dayName.toLowerCase()}`
          const list = groups.get(key) ?? []
          list.push(row)
          groups.set(key, list)
        }

        for (const [key, group] of groups) {
          const [date, dayKey] = key.split('|')
          let day = dayByKey.get(dayKey)
          if (!day) {
            day = {
              id: createId('day'),
              programId: program.id,
              name: group[0]?.dayName ?? 'Day',
              sortOrder: programDays.filter((d) => d.programId === program.id).length,
            }
            programDays.push(day)
            dayByKey.set(dayKey, day)
          }
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
            let exercise = exerciseByName.get(row.exerciseName.toLowerCase())
            if (!exercise) {
              exercise = { id: createId('ex'), name: row.exerciseName }
              exercises.push(exercise)
              exerciseByName.set(row.exerciseName.toLowerCase(), exercise)
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
