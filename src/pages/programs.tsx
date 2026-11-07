import { useMemo, useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { ArrowDown, ArrowUp, Pencil, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { PageHeader } from '@/components/page-header'
import {
  WEEKDAYS,
  WEEKDAY_MIGRATION_SQL,
  WeekdayMigrationError,
  parseIsoWeekday,
  previewWeekdayHistory,
  weekdayLabel,
  weekdayShort,
} from '@/lib/schedule'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'

const editIconClass =
  'size-7 text-primary hover:bg-primary-soft hover:text-primary'
const deleteIconClass =
  'size-7 text-destructive hover:bg-destructive/10 hover:text-destructive'

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
    sessions,
    addDay,
    renameDay,
    setDayWeekday,
    applyProgramWeekdays,
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
  const [applyOpen, setApplyOpen] = useState(false)
  const [migrationOpen, setMigrationOpen] = useState(false)

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
  const weekdayPreview = useMemo(
    () => previewWeekdayHistory(sessions, days),
    [sessions, days],
  )
  const weekdaySummary = days
    .filter((day) => day.weekday != null)
    .map((day) => `${day.name} → ${weekdayLabel(day.weekday)}`)
    .join(', ')

  return (
    <div>
      <PageHeader
        title="Programs"
        subtitle="Your split days and the lifts in each, in order."
      />

      {programs.length === 0 ? (
        <div className="max-w-md rounded-lg border bg-card p-6">
          <p className="text-sm text-muted-foreground">
            Create a program to lock your split, then start today’s session.
          </p>
          <Button
            size="sm"
            className="mt-4"
            onClick={() => setDialog({ type: 'program' })}
          >
            <Plus className="size-3.5" />
            Add program
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[1fr_1fr_1.6fr]">
          <section className="flex flex-col rounded-lg border bg-card">
            <div className="flex items-center justify-between border-b px-4 py-2.5">
              <span className="eyebrow">Programs</span>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 text-primary"
                onClick={() => setDialog({ type: 'program' })}
              >
                <Plus className="size-3.5" />
                Add program
              </Button>
            </div>
            <div className="flex-1 p-1.5">
              {programs.map((program) => (
                <div
                  key={program.id}
                  className={cn(
                    'group flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm',
                    program.id === programId
                      ? 'bg-primary-soft font-medium text-primary shadow-[inset_3px_0_0_var(--primary)]'
                      : 'hover:bg-muted',
                  )}
                  onClick={() => {
                    setProgramId(program.id)
                    const first = programDays
                      .filter((d) => d.programId === program.id)
                      .sort((a, b) => a.sortOrder - b.sortOrder)[0]
                    setDayId(first?.id ?? '')
                  }}
                >
                  <div className="min-w-0 flex-1">
                    {program.name}
                    <div className="text-xs font-normal text-muted-foreground num">
                      {
                        programDays.filter((d) => d.programId === program.id)
                          .length
                      }{' '}
                      days
                    </div>
                  </div>
                  <div
                    className="flex items-center gap-0.5 text-muted-foreground"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button
                      size="icon"
                      variant="ghost"
                      className={editIconClass}
                      onClick={() =>
                        setDialog({
                          type: 'edit-program',
                          id: program.id,
                          name: program.name,
                        })
                      }
                    >
                      <Pencil className="size-3.5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className={deleteIconClass}
                      onClick={() =>
                        setConfirm({
                          type: 'program',
                          id: program.id,
                          name: program.name,
                        })
                      }
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="flex flex-col rounded-lg border bg-card">
            <div className="flex items-center justify-between border-b px-4 py-2.5">
              <span className="eyebrow">
                Days{selectedProgram ? ` · ${selectedProgram.name}` : ''}
              </span>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 text-primary"
                disabled={!programId}
                onClick={() => setDialog({ type: 'day' })}
              >
                <Plus className="size-3.5" />
                Add day
              </Button>
            </div>
            <div className="flex-1 p-1.5">
              {days.length === 0 ? (
                <p className="px-3 py-6 text-sm text-muted-foreground">
                  Add a day to this program.
                </p>
              ) : (
                days.map((day, index) => (
                  <div
                    key={day.id}
                    className={cn(
                      'group flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm',
                      day.id === dayId
                        ? 'bg-primary-soft font-medium text-primary shadow-[inset_3px_0_0_var(--primary)]'
                        : 'hover:bg-muted',
                    )}
                    onClick={() => setDayId(day.id)}
                  >
                    <div className="min-w-0 flex-1">
                      <span className="mr-2 text-xs text-muted-foreground num">
                        {index + 1}
                      </span>
                      {day.name}
                      {weekdayShort(day.weekday) ? (
                        <span className="ml-2 text-xs font-normal text-muted-foreground">
                          {weekdayShort(day.weekday)}
                        </span>
                      ) : null}
                      <span className="ml-2 text-xs font-normal text-muted-foreground num">
                        {
                          programExercises.filter(
                            (pe) => pe.programDayId === day.id,
                          ).length
                        }{' '}
                        lifts
                      </span>
                    </div>
                    <div
                      className="flex items-center gap-0.5 text-muted-foreground"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        size="icon"
                        variant="ghost"
                        className={editIconClass}
                        onClick={() =>
                          setDialog({
                            type: 'edit-day',
                            id: day.id,
                            name: day.name,
                          })
                        }
                      >
                        <Pencil className="size-3.5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className={deleteIconClass}
                        onClick={() =>
                          setConfirm({
                            type: 'day',
                            id: day.id,
                            name: day.name,
                          })
                        }
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="flex flex-col rounded-lg border bg-card">
            <div className="flex items-center justify-between border-b px-4 py-2.5">
              <span className="eyebrow">
                Exercises{selectedDay ? ` · ${selectedDay.name}` : ''}
              </span>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 text-primary"
                disabled={!dayId}
                onClick={() => setDialog({ type: 'exercise' })}
              >
                <Plus className="size-3.5" />
                Add exercise
              </Button>
            </div>
            <div className="flex-1 p-1.5">
              {dayExercises.length === 0 ? (
                <p className="px-3 py-6 text-sm text-muted-foreground">
                  Add exercises with a sets × reps target.
                </p>
              ) : (
                dayExercises.map((pe, index) => {
                  const exercise = exercises.find((e) => e.id === pe.exerciseId)
                  return (
                    <div
                      key={pe.id}
                      className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm hover:bg-muted"
                    >
                      <span className="w-4 text-xs text-muted-foreground num">
                        {index + 1}
                      </span>
                      <div className="flex-1">
                        <div className="font-medium">
                          {exercise?.name ?? 'Unknown'}
                        </div>
                        <div className="text-xs text-muted-foreground num">
                          {pe.targetSets}×{pe.targetReps}
                          {pe.usesWeight ? '' : ' · no weight'}
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5 text-muted-foreground">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="size-7"
                          disabled={index === 0}
                          onClick={() => moveProgramExercise(pe.id, 'up')}
                        >
                          <ArrowUp className="size-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="size-7"
                          disabled={index === dayExercises.length - 1}
                          onClick={() => moveProgramExercise(pe.id, 'down')}
                        >
                          <ArrowDown className="size-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className={editIconClass}
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
                          <Pencil className="size-3.5" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className={deleteIconClass}
                          onClick={() => removeProgramExercise(pe.id)}
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
            {dayExercises.length > 0 ? (
              <div className="border-t px-4 py-2.5 text-xs text-muted-foreground">
                Removing a lift from a day does not delete past sessions.
              </div>
            ) : null}
          </section>
        </div>
      )}

      {programs.length > 0 && days.length > 0 ? (
        <section className="mt-4 rounded-lg border bg-card">
          <div className="border-b px-4 py-2.5">
            <span className="eyebrow">Weekdays</span>
            {selectedProgram ? (
              <span className="ml-2 text-xs font-normal text-muted-foreground">
                · {selectedProgram.name}
              </span>
            ) : null}
          </div>
          <div className="grid gap-3 p-4 sm:grid-cols-2">
            <p className="text-sm text-muted-foreground sm:col-span-2">
              If you always train a program day on the same weekday, set it here.
              Leave the rest unset. History dates stay as they are until you
              apply.
            </p>
            {days.map((day) => {
              const taken = new Set(
                days
                  .filter((other) => other.id !== day.id && other.weekday != null)
                  .map((other) => other.weekday),
              )
              return (
                <div
                  key={day.id}
                  className="flex items-center justify-between gap-3"
                >
                  <Label
                    htmlFor={`weekday-${day.id}`}
                    className="min-w-0 truncate font-medium"
                  >
                    {day.name}
                  </Label>
                  <Select
                    value={day.weekday == null ? 'none' : String(day.weekday)}
                    onValueChange={(value) => {
                      void setDayWeekday(day.id, parseIsoWeekday(value)).catch(
                        (error) => {
                          if (error instanceof WeekdayMigrationError) {
                            setMigrationOpen(true)
                            return
                          }
                          toast.error('Could not save', {
                            description:
                              error instanceof Error
                                ? error.message
                                : 'Try again.',
                          })
                        },
                      )
                    }}
                  >
                    <SelectTrigger
                      id={`weekday-${day.id}`}
                      size="sm"
                      className="w-40"
                    >
                      <SelectValue placeholder="Not set" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Not set</SelectItem>
                      {WEEKDAYS.map((weekday) => (
                        <SelectItem
                          key={weekday.value}
                          value={String(weekday.value)}
                          disabled={taken.has(weekday.value)}
                        >
                          {weekday.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )
            })}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3">
            <p className="max-w-xl text-xs text-muted-foreground">
              Apply puts each cycle in its own week: assigned days on those
              weekdays, the rest on the remaining days. One session per calendar
              day.
            </p>
            <Button
              size="sm"
              disabled={weekdayPreview.changes.length === 0}
              onClick={() => setApplyOpen(true)}
            >
              {weekdayPreview.changes.length > 0
                ? `Update ${weekdayPreview.changes.length} history sessions`
                : 'Update history'}
            </Button>
          </div>
        </section>
      ) : null}

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

      <Dialog open={migrationOpen} onOpenChange={setMigrationOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add the weekday column</DialogTitle>
            <DialogDescription>
              Paste this in the Supabase SQL Editor, run it, then set the weekday
              again.
            </DialogDescription>
          </DialogHeader>
          <pre className="max-h-48 overflow-auto rounded-md border bg-muted px-3 py-2 text-xs">
            {WEEKDAY_MIGRATION_SQL}
          </pre>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                void navigator.clipboard.writeText(WEEKDAY_MIGRATION_SQL)
                toast.success('SQL copied')
              }}
            >
              Copy SQL
            </Button>
            <Button type="button" onClick={() => setMigrationOpen(false)}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={applyOpen} onOpenChange={setApplyOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update history dates?</DialogTitle>
            <DialogDescription>
              {weekdayPreview.changes.length} session
              {weekdayPreview.changes.length === 1 ? '' : 's'} will move
              {weekdaySummary ? ` (${weekdaySummary})` : ''}. Each calendar day
              keeps a single session.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setApplyOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => {
                const result = applyProgramWeekdays(programId)
                setApplyOpen(false)
                if (result.updated === 0) {
                  toast.message('No history dates changed.')
                  return
                }
                toast.success(
                  result.skipped > 0
                    ? `Updated ${result.updated} sessions. ${result.skipped} skipped.`
                    : `Updated ${result.updated} history sessions.`,
                )
              }}
            >
              Update history
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
