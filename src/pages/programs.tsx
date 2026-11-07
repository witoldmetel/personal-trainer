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
  | { type: 'edit-program'; id: string; name: string }
  | { type: 'day' }
  | { type: 'edit-day'; id: string; name: string }
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

type ConfirmKind =
  | { type: 'program'; id: string; name: string }
  | { type: 'day'; id: string; name: string }

export function ProgramsPage() {
  const {
    programs,
    programDays,
    exercises,
    programExercises,
    addProgram,
    renameProgram,
    removeProgram,
    addDay,
    renameDay,
    removeDay,
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
  const [confirm, setConfirm] = useState<ConfirmKind | null>(null)

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
                <li
                  key={program.id}
                  className={cn(
                    'flex items-center border-b last:border-0',
                    program.id === programId && 'bg-muted',
                  )}
                >
                  <button
                    type="button"
                    className={cn(
                      'min-w-0 flex-1 px-3 py-2 text-left text-sm hover:bg-muted',
                      program.id === programId && 'font-medium',
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
                  <div className="flex shrink-0 pr-1">
                    <Button
                      size="icon-xs"
                      variant="ghost"
                      onClick={() =>
                        setDialog({
                          type: 'edit-program',
                          id: program.id,
                          name: program.name,
                        })
                      }
                    >
                      <Pencil />
                    </Button>
                    <Button
                      size="icon-xs"
                      variant="ghost"
                      onClick={() =>
                        setConfirm({
                          type: 'program',
                          id: program.id,
                          name: program.name,
                        })
                      }
                    >
                      <Trash2 />
                    </Button>
                  </div>
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
                  <li
                    key={day.id}
                    className={cn(
                      'flex items-center border-b last:border-0',
                      day.id === dayId && 'bg-muted',
                    )}
                  >
                    <button
                      type="button"
                      className={cn(
                        'min-w-0 flex-1 px-3 py-2 text-left text-sm hover:bg-muted',
                        day.id === dayId && 'font-medium',
                      )}
                      onClick={() => setDayId(day.id)}
                    >
                      {day.name}
                    </button>
                    <div className="flex shrink-0 pr-1">
                      <Button
                        size="icon-xs"
                        variant="ghost"
                        onClick={() =>
                          setDialog({
                            type: 'edit-day',
                            id: day.id,
                            name: day.name,
                          })
                        }
                      >
                        <Pencil />
                      </Button>
                      <Button
                        size="icon-xs"
                        variant="ghost"
                        onClick={() =>
                          setConfirm({
                            type: 'day',
                            id: day.id,
                            name: day.name,
                          })
                        }
                      >
                        <Trash2 />
                      </Button>
                    </div>
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
            ? `${dialog.type}-${'id' in dialog ? dialog.id : dialog.type === 'rename' ? dialog.exerciseId : 'new'}`
            : 'closed'
        }
        dialog={dialog}
        onClose={() => setDialog(null)}
        onAddProgram={(name) => {
          const id = addProgram(name)
          setProgramId(id)
          setDayId('')
        }}
        onRenameProgram={(id, name) => renameProgram(id, name)}
        onAddDay={(name) => {
          const id = addDay(programId, name)
          setDayId(id)
        }}
        onRenameDay={(id, name) => renameDay(id, name)}
        onAddExercise={(value) =>
          addExerciseToDay({ programDayId: dayId, ...value })
        }
        onRename={(exerciseId, name, peId, sets, reps, usesWeight) => {
          renameExercise(exerciseId, name)
          updateProgramExerciseTargets(peId, sets, reps, usesWeight)
        }}
      />

      <Dialog
        open={confirm != null}
        onOpenChange={(open) => {
          if (!open) setConfirm(null)
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {confirm?.type === 'program' ? 'Delete this program?' : 'Delete this day?'}
            </DialogTitle>
            <DialogDescription>
              {confirm?.type === 'program'
                ? `Removes ${confirm.name}, its days, and exercise targets. Past sessions stay in History.`
                : confirm
                  ? `Removes ${confirm.name} and its exercise targets. Past sessions stay in History.`
                  : null}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setConfirm(null)}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => {
                if (!confirm) return
                if (confirm.type === 'program') {
                  const remaining = programs.filter((p) => p.id !== confirm.id)
                  const nextProgram = remaining[0]
                  removeProgram(confirm.id)
                  setProgramId(nextProgram?.id ?? '')
                  const first = programDays
                    .filter((d) => d.programId === nextProgram?.id)
                    .sort((a, b) => a.sortOrder - b.sortOrder)[0]
                  setDayId(first?.id ?? '')
                } else {
                  const remaining = days.filter((d) => d.id !== confirm.id)
                  removeDay(confirm.id)
                  setDayId(remaining[0]?.id ?? '')
                }
                setConfirm(null)
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function EditorDialog({
  dialog,
  onClose,
  onAddProgram,
  onRenameProgram,
  onAddDay,
  onRenameDay,
  onAddExercise,
  onRename,
}: {
  dialog: DialogKind | null
  onClose: () => void
  onAddProgram: (name: string) => void
  onRenameProgram: (id: string, name: string) => void
  onAddDay: (name: string) => void
  onRenameDay: (id: string, name: string) => void
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
      : dialog?.type === 'edit-program'
        ? 'Edit program'
        : dialog?.type === 'day'
          ? 'Add day'
          : dialog?.type === 'edit-day'
            ? 'Edit day'
            : dialog?.type === 'exercise'
              ? 'Add exercise'
              : 'Edit exercise'

  const form = useForm({
    defaultValues: {
      name:
        dialog?.type === 'rename' ||
        dialog?.type === 'edit-program' ||
        dialog?.type === 'edit-day'
          ? dialog.name
          : '',
      targetSets: dialog?.type === 'rename' ? dialog.sets : 3,
      targetReps: dialog?.type === 'rename' ? dialog.reps : 8,
      skipWeight: dialog?.type === 'rename' ? !dialog.usesWeight : false,
    },
    onSubmit: ({ value }) => {
      if (!dialog) return
      if (dialog.type === 'program') onAddProgram(value.name)
      if (dialog.type === 'edit-program') onRenameProgram(dialog.id, value.name)
      if (dialog.type === 'day') onAddDay(value.name)
      if (dialog.type === 'edit-day') onRenameDay(dialog.id, value.name)
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
              : dialog?.type === 'edit-program' || dialog?.type === 'edit-day'
                ? 'Past sessions keep their logged sets.'
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
