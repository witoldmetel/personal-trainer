export type Program = {
  id: string
  name: string
  isActive: boolean
  moverPeIds: string[]
}

export type IsoWeekday = 1 | 2 | 3 | 4 | 5 | 6 | 7

export type ProgramDay = {
  id: string
  programId: string
  name: string
  sortOrder: number
  weekday: IsoWeekday | null
}

export type Exercise = {
  id: string
  name: string
  muscleGroup?: string
}

export type ProgramExercise = {
  id: string
  programDayId: string
  exerciseId: string
  sortOrder: number
  targetSets: number
  targetReps: number
  usesWeight: boolean
  sameAsId: string | null
}

export type SessionStatus = 'in_progress' | 'done'

export type Session = {
  id: string
  programDayId: string | null
  performedOn: string
  status: SessionStatus
}

export type SessionSet = {
  id: string
  sessionId: string
  exerciseId: string
  setNumber: number
  reps: number | null
  weightKg: number | null
}

export function isFilledSet(set: SessionSet): boolean {
  return set.reps != null && set.reps > 0
}

export type LoggerRow = {
  setId: string
  sessionId: string
  exerciseId: string
  exerciseName: string
  setNumber: number
  reps: number | null
  weightKg: number | null
  lastTime: string | null
  usesWeight: boolean
  isLastOfExercise: boolean
  rowIndex: number
}

export type ProgramPlanDay = {
  dayName: string
  exercises: Array<{
    name: string
    targetSets: number
    targetReps: number
    usesWeight: boolean
  }>
}

export type StoreState = {
  programs: Program[]
  programDays: ProgramDay[]
  exercises: Exercise[]
  programExercises: ProgramExercise[]
  sessions: Session[]
  sessionSets: SessionSet[]
}
