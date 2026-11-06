import { isoDaysAgo } from '@/lib/dates'
import type {
  Exercise,
  Program,
  ProgramDay,
  ProgramExercise,
  Session,
  SessionSet,
  StoreState,
} from '@/lib/types'

const programs: Program[] = [{ id: 'prog_home', name: 'Home routine' }]

const programDays: ProgramDay[] = [
  { id: 'day_1', programId: 'prog_home', name: 'Day 1', sortOrder: 0 },
  { id: 'day_2', programId: 'prog_home', name: 'Day 2', sortOrder: 1 },
  { id: 'day_3', programId: 'prog_home', name: 'Day 3', sortOrder: 2 },
  { id: 'day_4', programId: 'prog_home', name: 'Day 4', sortOrder: 3 },
]

const exercises: Exercise[] = [
  { id: 'ex_bench', name: 'Bench Press' },
  { id: 'ex_incline', name: 'Incline DB Bench (30o)' },
  { id: 'ex_row', name: 'Barbell Row' },
  { id: 'ex_pullup', name: 'Pull-Ups' },
  { id: 'ex_curls', name: 'Barbell Curls' },
  { id: 'ex_laterals', name: 'Lateral Raises' },
  { id: 'ex_pushdowns', name: 'Tricep Pushdowns' },
  { id: 'ex_neck', name: 'Neck curls' },
  { id: 'ex_forearms', name: 'Forearms' },
  { id: 'ex_squat', name: 'Back Squat' },
  { id: 'ex_bss', name: 'Bulgarian Split Squat' },
  { id: 'ex_rdl', name: 'Barbell Romanian Deadlifts' },
  { id: 'ex_hanging', name: 'Hanging Knee Raises (Abs)' },
  { id: 'ex_ohp', name: 'Overhead Press' },
  { id: 'ex_dips', name: 'Weighted Dips' },
  { id: 'ex_cs_row', name: 'Chest Supported Row' },
  { id: 'ex_chin', name: 'Chin-Ups' },
  { id: 'ex_face', name: 'Face Pulls' },
  { id: 'ex_hammer', name: 'Hammer Curls' },
  { id: 'ex_skull', name: 'Skull Crushers' },
  { id: 'ex_deadlift', name: 'Deadlift' },
  { id: 'ex_front', name: 'Front Squat' },
  { id: 'ex_legcurl', name: 'Lying Leg Curl' },
  { id: 'ex_calf', name: 'Standing Calf Raise' },
]

function pe(
  id: string,
  programDayId: string,
  exerciseId: string,
  sortOrder: number,
  targetSets: number,
  targetReps: number,
): ProgramExercise {
  return { id, programDayId, exerciseId, sortOrder, targetSets, targetReps }
}

const programExercises: ProgramExercise[] = [
  pe('pe_1', 'day_1', 'ex_bench', 0, 5, 7),
  pe('pe_2', 'day_1', 'ex_incline', 1, 3, 15),
  pe('pe_3', 'day_1', 'ex_row', 2, 3, 10),
  pe('pe_4', 'day_1', 'ex_pullup', 3, 2, 11),
  pe('pe_5', 'day_1', 'ex_curls', 4, 3, 10),
  pe('pe_6', 'day_1', 'ex_laterals', 5, 3, 10),
  pe('pe_7', 'day_1', 'ex_pushdowns', 6, 3, 10),
  pe('pe_8', 'day_1', 'ex_neck', 7, 3, 10),
  pe('pe_9', 'day_1', 'ex_forearms', 8, 3, 3),
  pe('pe_10', 'day_2', 'ex_squat', 0, 5, 10),
  pe('pe_11', 'day_2', 'ex_bss', 1, 3, 13),
  pe('pe_12', 'day_2', 'ex_rdl', 2, 5, 13),
  pe('pe_13', 'day_2', 'ex_hanging', 3, 3, 20),
  pe('pe_14', 'day_3', 'ex_ohp', 0, 5, 7),
  pe('pe_15', 'day_3', 'ex_dips', 1, 3, 10),
  pe('pe_16', 'day_3', 'ex_cs_row', 2, 3, 10),
  pe('pe_17', 'day_3', 'ex_chin', 3, 2, 11),
  pe('pe_18', 'day_3', 'ex_face', 4, 3, 15),
  pe('pe_19', 'day_3', 'ex_hammer', 5, 3, 10),
  pe('pe_20', 'day_3', 'ex_skull', 6, 3, 10),
  pe('pe_21', 'day_4', 'ex_deadlift', 0, 3, 5),
  pe('pe_22', 'day_4', 'ex_front', 1, 3, 8),
  pe('pe_23', 'day_4', 'ex_legcurl', 2, 3, 12),
  pe('pe_24', 'day_4', 'ex_calf', 3, 3, 12),
  pe('pe_25', 'day_4', 'ex_hanging', 4, 3, 20),
]

function sets(
  sessionId: string,
  exerciseId: string,
  rows: Array<[number, number, number]>,
): SessionSet[] {
  return rows.map(([setNumber, reps, weightKg]) => ({
    id: `${sessionId}_${exerciseId}_${setNumber}`,
    sessionId,
    exerciseId,
    setNumber,
    reps,
    weightKg,
  }))
}

function session(
  id: string,
  programDayId: string,
  daysAgo: number,
): Session {
  return {
    id,
    programDayId,
    performedOn: isoDaysAgo(daysAgo),
    status: 'done',
  }
}

function work(
  sessionId: string,
  exerciseId: string,
  weightKg: number,
  reps: number[],
): SessionSet[] {
  return reps.map((repCount, i) => ({
    id: `${sessionId}_${exerciseId}_${i + 1}`,
    sessionId,
    exerciseId,
    setNumber: i + 1,
    reps: repCount,
    weightKg,
  }))
}

const sessions: Session[] = [
  session('ses_d1_56', 'day_1', 56),
  session('ses_d1_49', 'day_1', 49),
  session('ses_d1_42', 'day_1', 42),
  session('ses_d1_35', 'day_1', 35),
  session('ses_d1_28', 'day_1', 28),
  session('ses_d1_21', 'day_1', 21),
  session('ses_d1_14', 'day_1', 14),
  session('ses_3', 'day_1', 7),
  session('ses_1', 'day_1', 3),
  session('ses_d2_54', 'day_2', 54),
  session('ses_d2_47', 'day_2', 47),
  session('ses_d2_40', 'day_2', 40),
  session('ses_d2_33', 'day_2', 33),
  session('ses_d2_26', 'day_2', 26),
  session('ses_d2_19', 'day_2', 19),
  session('ses_d2_12', 'day_2', 12),
  session('ses_4', 'day_2', 6),
  session('ses_2', 'day_2', 2),
  session('ses_d3_45', 'day_3', 45),
  session('ses_d3_31', 'day_3', 31),
  session('ses_d3_17', 'day_3', 17),
  session('ses_d3_4', 'day_3', 4),
  session('ses_d4_44', 'day_4', 44),
  session('ses_d4_30', 'day_4', 30),
  session('ses_d4_16', 'day_4', 16),
  session('ses_d4_5', 'day_4', 5),
]

const sessionSets: SessionSet[] = [
  ...work('ses_d1_56', 'ex_bench', 50, [7, 7, 7]),
  ...work('ses_d1_56', 'ex_incline', 20, [15, 15, 12]),
  ...work('ses_d1_56', 'ex_row', 57.5, [10, 10, 10]),
  ...work('ses_d1_49', 'ex_bench', 52.5, [7, 7, 7]),
  ...work('ses_d1_49', 'ex_incline', 20, [15, 15, 15]),
  ...work('ses_d1_49', 'ex_row', 60, [10, 10, 8]),
  ...work('ses_d1_42', 'ex_bench', 55, [7, 7, 6]),
  ...work('ses_d1_42', 'ex_incline', 22.5, [15, 12, 12]),
  ...work('ses_d1_42', 'ex_row', 62.5, [10, 10, 8]),
  ...work('ses_d1_35', 'ex_bench', 55, [7, 7, 7]),
  ...work('ses_d1_35', 'ex_incline', 22.5, [15, 15, 12]),
  ...work('ses_d1_35', 'ex_row', 62.5, [10, 10, 10]),
  ...work('ses_d1_28', 'ex_bench', 57.5, [7, 6, 6]),
  ...work('ses_d1_28', 'ex_incline', 22.5, [15, 15, 15]),
  ...work('ses_d1_28', 'ex_row', 60, [10, 8, 8]),
  ...work('ses_d1_21', 'ex_bench', 57.5, [7, 7, 7]),
  ...work('ses_d1_21', 'ex_incline', 25, [12, 12, 12]),
  ...work('ses_d1_21', 'ex_row', 62.5, [10, 10, 8]),
  ...work('ses_d1_14', 'ex_bench', 60, [6, 6, 5]),
  ...work('ses_d1_14', 'ex_incline', 25, [15, 12, 12]),
  ...work('ses_d1_14', 'ex_row', 65, [8, 8, 8]),
  ...sets('ses_3', 'ex_bench', [
    [1, 8, 55],
    [2, 9, 55],
    [3, 9, 55],
  ]),
  ...sets('ses_3', 'ex_incline', [
    [1, 14, 22.5],
    [2, 15, 22.5],
    [3, 15, 22.5],
  ]),
  ...work('ses_3', 'ex_row', 62.5, [10, 10, 8]),
  ...sets('ses_1', 'ex_bench', [
    [1, 7, 57.5],
    [2, 7, 57.5],
    [3, 8, 57.5],
    [4, 10, 57.5],
  ]),
  ...sets('ses_1', 'ex_incline', [
    [1, 15, 22.5],
    [2, 15, 22.5],
    [3, 15, 22.5],
  ]),
  ...sets('ses_1', 'ex_row', [
    [1, 10, 62.5],
    [2, 10, 62.5],
    [3, 10, 62.5],
  ]),
  ...sets('ses_1', 'ex_pullup', [
    [1, 10, 0],
    [2, 8, 0],
  ]),
  ...sets('ses_1', 'ex_curls', [
    [1, 10, 32.5],
    [2, 10, 32.5],
    [3, 10, 32.5],
  ]),
  ...sets('ses_1', 'ex_laterals', [
    [1, 10, 15],
    [2, 10, 15],
    [3, 10, 15],
  ]),
  ...work('ses_d2_54', 'ex_squat', 50, [10, 10, 10]),
  ...work('ses_d2_54', 'ex_rdl', 50, [13, 13, 13]),
  ...work('ses_d2_47', 'ex_squat', 52.5, [10, 10, 8]),
  ...work('ses_d2_47', 'ex_rdl', 52.5, [13, 13, 12]),
  ...work('ses_d2_40', 'ex_squat', 55, [10, 10, 10]),
  ...work('ses_d2_40', 'ex_rdl', 55, [13, 13, 13]),
  ...work('ses_d2_33', 'ex_squat', 57.5, [8, 8, 8]),
  ...work('ses_d2_33', 'ex_rdl', 55, [13, 13, 13]),
  ...work('ses_d2_26', 'ex_squat', 55, [10, 8, 8]),
  ...work('ses_d2_26', 'ex_rdl', 57.5, [13, 12, 12]),
  ...work('ses_d2_19', 'ex_squat', 57.5, [10, 10, 8]),
  ...work('ses_d2_19', 'ex_rdl', 57.5, [13, 13, 13]),
  ...work('ses_d2_12', 'ex_squat', 60, [8, 8, 8]),
  ...work('ses_d2_12', 'ex_rdl', 60, [13, 12, 10]),
  ...sets('ses_4', 'ex_squat', [
    [1, 10, 55],
    [2, 8, 55],
    [3, 9, 55],
  ]),
  ...sets('ses_4', 'ex_rdl', [
    [1, 13, 55],
    [2, 14, 55],
    [3, 15, 55],
  ]),
  ...sets('ses_2', 'ex_squat', [
    [1, 10, 60],
    [2, 10, 60],
    [3, 10, 60],
    [4, 10, 60],
    [5, 10, 60],
  ]),
  ...sets('ses_2', 'ex_bss', [
    [1, 13, 15],
    [2, 13, 15],
    [3, 13, 15],
  ]),
  ...sets('ses_2', 'ex_rdl', [
    [1, 13, 60],
    [2, 13, 60],
    [3, 13, 60],
  ]),
  ...sets('ses_2', 'ex_hanging', [
    [1, 23, 0],
    [2, 20, 0],
    [3, 18, 0],
  ]),
  ...work('ses_d3_45', 'ex_ohp', 40, [7, 7, 6]),
  ...work('ses_d3_45', 'ex_dips', 10, [10, 10, 8]),
  ...work('ses_d3_31', 'ex_ohp', 42.5, [7, 6, 6]),
  ...work('ses_d3_31', 'ex_dips', 12.5, [10, 8, 8]),
  ...work('ses_d3_17', 'ex_ohp', 45, [6, 6, 5]),
  ...work('ses_d3_17', 'ex_dips', 15, [8, 8, 8]),
  ...work('ses_d3_4', 'ex_ohp', 42.5, [7, 7, 6]),
  ...work('ses_d3_4', 'ex_dips', 15, [10, 8, 8]),
  ...work('ses_d4_44', 'ex_deadlift', 80, [5, 5, 5]),
  ...work('ses_d4_30', 'ex_deadlift', 85, [5, 5, 3]),
  ...work('ses_d4_16', 'ex_deadlift', 90, [5, 3, 3]),
  ...work('ses_d4_5', 'ex_deadlift', 87.5, [5, 5, 3]),
]

export function createSeedState(): StoreState {
  return {
    authenticated: false,
    programs,
    programDays,
    exercises,
    programExercises,
    sessions,
    sessionSets,
  }
}
