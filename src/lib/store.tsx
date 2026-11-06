import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { formatLastTime, todayIso } from '@/lib/dates'
import { createId } from '@/lib/ids'
import { createSeedState } from '@/lib/seed'
import type {
  LoggerRow,
  ProgramDay,
  ProgramExercise,
  Session,
  StoreState,
} from '@/lib/types'

type StoreApi = StoreState & {
  login: () => void
  logout: () => void
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

function compareSessionRecency(a: Session, b: Session): number {
  if (a.performedOn === b.performedOn) return a.id.localeCompare(b.id)
  return a.performedOn < b.performedOn ? 1 : -1
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StoreState>(createSeedState)

  const api = useMemo<StoreApi>(() => {
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
        const first = sets.find(
          (set) => set.reps != null && set.weightKg != null,
        )
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
      login: () => setState((s) => ({ ...s, authenticated: true })),
      logout: () => setState((s) => ({ ...s, authenticated: false })),
      todaySession: () =>
        state.sessions.find((s) => s.performedOn === todayIso()),
      sessionDay: (session) =>
        state.programDays.find((d) => d.id === session.programDayId),
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
        setState((s) => ({
          ...s,
          sessions: [
            ...s.sessions,
            {
              id,
              programDayId,
              performedOn: todayIso(),
              status: 'in_progress',
            },
          ],
          sessionSets: [...s.sessionSets, ...newSets],
        }))
        return id
      },
      markSessionDone: (sessionId) => {
        setState((s) => ({
          ...s,
          sessions: s.sessions.map((session) =>
            session.id === sessionId
              ? { ...session, status: 'done' }
              : session,
          ),
        }))
      },
      updateSet: (setId, patch) => {
        setState((s) => ({
          ...s,
          sessionSets: s.sessionSets.map((set) =>
            set.id === setId ? { ...set, ...patch } : set,
          ),
        }))
      },
      addSet: (sessionId, exerciseId) => {
        setState((s) => {
          const existing = s.sessionSets.filter(
            (set) => set.sessionId === sessionId && set.exerciseId === exerciseId,
          )
          const setNumber =
            existing.reduce((max, set) => Math.max(max, set.setNumber), 0) + 1
          return {
            ...s,
            sessionSets: [
              ...s.sessionSets,
              {
                id: createId('set'),
                sessionId,
                exerciseId,
                setNumber,
                reps: null,
                weightKg: null,
              },
            ],
          }
        })
      },
      removeSession: (sessionId) => {
        setState((s) => ({
          ...s,
          sessions: s.sessions.filter((session) => session.id !== sessionId),
          sessionSets: s.sessionSets.filter((set) => set.sessionId !== sessionId),
        }))
      },
      addProgram: (name) => {
        const id = createId('prog')
        setState((s) => ({
          ...s,
          programs: [...s.programs, { id, name }],
        }))
        return id
      },
      addDay: (programId, name) => {
        const id = createId('day')
        setState((s) => {
          const sortOrder =
            s.programDays.filter((d) => d.programId === programId).length
          return {
            ...s,
            programDays: [...s.programDays, { id, programId, name, sortOrder }],
          }
        })
        return id
      },
      addExerciseToDay: ({ programDayId, name, targetSets, targetReps }) => {
        setState((s) => {
          const trimmed = name.trim()
          let exercise = s.exercises.find(
            (e) => e.name.toLowerCase() === trimmed.toLowerCase(),
          )
          let exercises = s.exercises
          if (!exercise) {
            exercise = { id: createId('ex'), name: trimmed }
            exercises = [...s.exercises, exercise]
          }
          const sortOrder = s.programExercises.filter(
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
          return {
            ...s,
            exercises,
            programExercises: [...s.programExercises, programExercise],
          }
        })
      },
      renameExercise: (exerciseId, name) => {
        setState((s) => ({
          ...s,
          exercises: s.exercises.map((e) =>
            e.id === exerciseId ? { ...e, name: name.trim() } : e,
          ),
        }))
      },
      removeProgramExercise: (programExerciseId) => {
        setState((s) => {
          const target = s.programExercises.find(
            (pe) => pe.id === programExerciseId,
          )
          if (!target) return s
          const remaining = s.programExercises
            .filter((pe) => pe.id !== programExerciseId)
            .map((pe) => {
              if (pe.programDayId !== target.programDayId) return pe
              if (pe.sortOrder < target.sortOrder) return pe
              return { ...pe, sortOrder: pe.sortOrder - 1 }
            })
          return { ...s, programExercises: remaining }
        })
      },
      moveProgramExercise: (programExerciseId, direction) => {
        setState((s) => {
          const current = s.programExercises.find(
            (pe) => pe.id === programExerciseId,
          )
          if (!current) return s
          const swapOrder =
            direction === 'up' ? current.sortOrder - 1 : current.sortOrder + 1
          const other = s.programExercises.find(
            (pe) =>
              pe.programDayId === current.programDayId &&
              pe.sortOrder === swapOrder,
          )
          if (!other) return s
          return {
            ...s,
            programExercises: s.programExercises.map((pe) => {
              if (pe.id === current.id) return { ...pe, sortOrder: other.sortOrder }
              if (pe.id === other.id) return { ...pe, sortOrder: current.sortOrder }
              return pe
            }),
          }
        })
      },
      updateProgramExerciseTargets: (
        programExerciseId,
        targetSets,
        targetReps,
      ) => {
        setState((s) => ({
          ...s,
          programExercises: s.programExercises.map((pe) =>
            pe.id === programExerciseId
              ? { ...pe, targetSets, targetReps }
              : pe,
          ),
        }))
      },
      importHistory: (rows) => {
        let sessionsAdded = 0
        let setsAdded = 0
        setState((s) => {
          const programs = [...s.programs]
          const programDays = [...s.programDays]
          const exercises = [...s.exercises]
          const programExercises = [...s.programExercises]
          const sessions = [...s.sessions]
          const sessionSets = [...s.sessionSets]
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
                sortOrder: programDays.filter((d) => d.programId === program.id)
                  .length,
              }
              programDays.push(day)
              dayByKey.set(dayKey, day)
            }
            let session = sessions.find(
              (ses) =>
                ses.performedOn === date && ses.programDayId === day.id,
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

          return {
            ...s,
            programs,
            programDays,
            exercises,
            programExercises,
            sessions,
            sessionSets,
          }
        })
        return { sessions: sessionsAdded, sets: setsAdded }
      },
    }
  }, [state])

  return <StoreContext.Provider value={api}>{children}</StoreContext.Provider>
}

export function useStore(): StoreApi {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
