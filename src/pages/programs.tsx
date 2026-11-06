import { useMemo, useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { ArrowDown, ArrowUp, Pencil, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'

type DialogKind =
  | { type: 'program' }
  | { type: 'day' }
  | { type: 'exercise' }
  | {
      type: 'rename'
      exerciseId: string
      name: string
      peId: string
      sets: number
      reps: number
      usesWeight: boolean
    }

export function ProgramsPage() {
  const {
    programs,
    programDays,
    exercises,
    programExercises,
    addProgram,
    addDay,
    addExerciseToDay,
    renameExercise,
    removeProgramExercise,
    moveProgramExercise,
    updateProgramExerciseTargets,
  } = useStore()
  const [programId, setProgramId] = useState(programs[0]?.id ?? '')
  const [dayId, setDayId] = useState(
    programDays.find((d) => d.programId === (programs[0]?.id ?? ''))?.id ?? '',
  )
  const [dialog, setDialog] = useState<DialogKind | null>(null)

  const days = useMemo(
    () =>
      programDays
        .filter((d) => d.programId === programId)
        .sort((a, b) => a.sortOrder - b.sortOrder),
    [programDays, programId],
  )
  const dayExercises = useMemo(
    () =>
      programExercises
        .filter((pe) => pe.programDayId === dayId)
        .sort((a, b) => a.sortOrder - b.sortOrder),
    [programExercises, dayId],
  )

  const selectedProgram = programs.find((p) => p.id === programId)
  const selectedDay = days.find((d) => d.id === dayId)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-base font-medium">Programs</h1>
          <p className="text-sm text-muted-foreground">
            Fixed split, ordered exercises, target sets × reps.
          </p>
        </div>
        <Button size="sm" onClick={() => setDialog({ type: 'program' })}>
          <Plus />
          Add program
        </Button>
      </div>

      {programs.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Create a program to lock your split, then start today’s session.
        </p>
      ) : (
        <div className="grid gap-3 lg:grid-cols-3">
          <section className="rounded-lg border">
            <header className="border-b px-3 py-2 text-xs font-medium text-muted-foreground">
              Programs
            </header>
            <ul>
              {programs.map((program) => (
                <li key={program.id}>
                  <button
                    type="button"
                    className={cn(
                      'w-full px-3 py-2 text-left text-sm hover:bg-muted',
                      program.id === programId && 'bg-muted font-medium',
                    )}
                    onClick={() => {
                      setProgramId(program.id)
                      const first = programDays
                        .filter((d) => d.programId === program.id)
                        .sort((a, b) => a.sortOrder - b.sortOrder)[0]
                      setDayId(first?.id ?? '')
                    }}
                  >
                    {program.name}
                  </button>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-lg border">
            <header className="flex items-center justify-between border-b px-3 py-2">
              <span className="text-xs font-medium text-muted-foreground">
                Days{selectedProgram ? ` · ${selectedProgram.name}` : ''}
              </span>
              <Button
                size="xs"
                variant="ghost"
                disabled={!programId}
                onClick={() => setDialog({ type: 'day' })}
              >
                <Plus />
                Add day
              </Button>
            </header>
            {days.length === 0 ? (
              <p className="px-3 py-3 text-sm text-muted-foreground">
                Add a split day to this program.
              </p>
            ) : (
              <ul>
                {days.map((day) => (
                  <li key={day.id}>
                    <button
                      type="button"
                      className={cn(
                        'w-full px-3 py-2 text-left text-sm hover:bg-muted',
                        day.id === dayId && 'bg-muted font-medium',
                      )}
                      onClick={() => setDayId(day.id)}
                    >
                      {day.name}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="rounded-lg border">
            <header className="flex items-center justify-between border-b px-3 py-2">
              <span className="text-xs font-medium text-muted-foreground">
                Exercises{selectedDay ? ` · ${selectedDay.name}` : ''}
              </span>
              <Button
                size="xs"
                variant="ghost"
                disabled={!dayId}
                onClick={() => setDialog({ type: 'exercise' })}
              >
                <Plus />
                Add exercise
              </Button>
            </header>
            {dayExercises.length === 0 ? (
              <p className="px-3 py-3 text-sm text-muted-foreground">
                Add exercises with a sets × reps target.
              </p>
            ) : (
              <ul>
                {dayExercises.map((pe, index) => {
                  const exercise = exercises.find((e) => e.id === pe.exerciseId)
                  return (
                    <li
                      key={pe.id}
                      className="flex items-center gap-2 border-b px-3 py-2 last:border-0"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                          {exercise?.name ?? 'Unknown'}
                        </p>
                        <p className="text-xs text-muted-foreground tabular-nums">
                          {pe.targetSets}×{pe.targetReps}
                          {pe.usesWeight ? '' : ' · no weight'}
                        </p>
                      </div>
                      <div className="flex shrink-0">
                        <Button
                          size="icon-xs"
                          variant="ghost"
                          disabled={index === 0}
                          onClick={() => moveProgramExercise(pe.id, 'up')}
                        >
                          <ArrowUp />
                        </Button>
                        <Button
                          size="icon-xs"
                          variant="ghost"
                          disabled={index === dayExercises.length - 1}
                          onClick={() => moveProgramExercise(pe.id, 'down')}
                        >
                          <ArrowDown />
                        </Button>
                        <Button
                          size="icon-xs"
                          variant="ghost"
                          onClick={() =>
                            setDialog({
                              type: 'rename',
                              exerciseId: pe.exerciseId,
                              name: exercise?.name ?? '',
                              peId: pe.id,
                              sets: pe.targetSets,
                              reps: pe.targetReps,
                              usesWeight: pe.usesWeight,
                            })
                          }
                        >
                          <Pencil />
                        </Button>
                        <Button
                          size="icon-xs"
                          variant="ghost"
                          onClick={() => removeProgramExercise(pe.id)}
                        >
                          <Trash2 />
                        </Button>
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
            {dayExercises.length > 0 ? (
              <p className="px-3 py-2 text-xs text-muted-foreground">
                Removing an exercise from a day does not delete past sessions.
              </p>
            ) : null}
          </section>
        </div>
      )}

      <EditorDialog
        key={
          dialog
            ? `${dialog.type}-${dialog.type === 'rename' ? dialog.exerciseId : 'new'}`
            : 'closed'
        }
        dialog={dialog}
        onClose={() => setDialog(null)}
        onAddProgram={(name) => {
          const id = addProgram(name)
          setProgramId(id)
          setDayId('')
        }}
        onAddDay={(name) => {
          const id = addDay(programId, name)
          setDayId(id)
        }}
        onAddExercise={(value) =>
          addExerciseToDay({ programDayId: dayId, ...value })
        }
        onRename={(exerciseId, name, peId, sets, reps, usesWeight) => {
          renameExercise(exerciseId, name)
          updateProgramExerciseTargets(peId, sets, reps, usesWeight)
        }}
      />
    </div>
  )
}

function EditorDialog({
  dialog,
  onClose,
  onAddProgram,
  onAddDay,
  onAddExercise,
  onRename,
}: {
  dialog: DialogKind | null
  onClose: () => void
  onAddProgram: (name: string) => void
  onAddDay: (name: string) => void
  onAddExercise: (value: {
    name: string
    targetSets: number
    targetReps: number
    usesWeight: boolean
  }) => void
  onRename: (
    exerciseId: string,
    name: string,
    peId: string,
    sets: number,
    reps: number,
    usesWeight: boolean,
  ) => void
}) {
  const open = dialog != null
  const title =
    dialog?.type === 'program'
      ? 'Add program'
      : dialog?.type === 'day'
        ? 'Add day'
        : dialog?.type === 'exercise'
          ? 'Add exercise'
          : 'Edit exercise'

  const form = useForm({
    defaultValues: {
      name:
        dialog?.type === 'rename' ? dialog.name : '',
      targetSets: dialog?.type === 'rename' ? dialog.sets : 3,
      targetReps: dialog?.type === 'rename' ? dialog.reps : 8,
      skipWeight: dialog?.type === 'rename' ? !dialog.usesWeight : false,
    },
    onSubmit: ({ value }) => {
      if (!dialog) return
      if (dialog.type === 'program') onAddProgram(value.name)
      if (dialog.type === 'day') onAddDay(value.name)
      if (dialog.type === 'exercise') {
        onAddExercise({
          name: value.name,
          targetSets: value.targetSets,
          targetReps: value.targetReps,
          usesWeight: !value.skipWeight,
        })
      }
      if (dialog.type === 'rename') {
        onRename(
          dialog.exerciseId,
          value.name,
          dialog.peId,
          value.targetSets,
          value.targetReps,
          !value.skipWeight,
        )
      }
      onClose()
    },
  })

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose()
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {dialog?.type === 'rename'
              ? 'This updates the exercise name and targets. History stays.'
              : 'Keep names short. Targets are a starting point, not a lock.'}
          </DialogDescription>
        </DialogHeader>
        <form
          className="flex flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            void form.handleSubmit()
          }}
        >
          <form.Field name="name">
            {(field) => (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor={field.name}>Name</Label>
                <Input
                  id={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  required
                />
              </div>
            )}
          </form.Field>
          {dialog?.type === 'exercise' || dialog?.type === 'rename' ? (
            <div className="grid grid-cols-2 gap-3">
              <form.Field name="targetSets">
                {(field) => (
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor={field.name}>Sets</Label>
                    <Input
                      id={field.name}
                      type="number"
                      min={1}
                      className="tabular-nums"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) =>
                        field.handleChange(Number(e.target.value) || 1)
                      }
                    />
                  </div>
                )}
              </form.Field>
              <form.Field name="targetReps">
                {(field) => (
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor={field.name}>Reps</Label>
                    <Input
                      id={field.name}
                      type="number"
                      min={1}
                      className="tabular-nums"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) =>
                        field.handleChange(Number(e.target.value) || 1)
                      }
                    />
                  </div>
                )}
              </form.Field>
            </div>
          ) : null}
          {dialog?.type === 'exercise' || dialog?.type === 'rename' ? (
            <form.Field name="skipWeight">
              {(field) => (
                <Label className="flex items-center gap-2 font-normal">
                  <Checkbox
                    checked={field.state.value}
                    onCheckedChange={(checked) =>
                      field.handleChange(checked === true)
                    }
                  />
                  Skip weight
                </Label>
              )}
            </form.Field>
          ) : null}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
