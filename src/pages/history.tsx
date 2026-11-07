import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { ChevronLeft, ChevronRight, Trash2 } from 'lucide-react'
import { SetLogger } from '@/components/set-logger'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { formatDate, isoDaysAgo, todayIso } from '@/lib/dates'
import { useStore } from '@/lib/store'
import type { Session } from '@/lib/types'

const PAGE_SIZE = 15

type RangePreset = '30' | '90' | 'all' | 'custom'
type StatusFilter = 'all' | 'done' | 'in_progress'

export function HistoryPage() {
  const { sessionId } = useParams()
  const navigate = useNavigate()
  const {
    sessions,
    sessionSets,
    sessionDay,
    removeSession,
    exercises,
    programDays,
    programExercises,
  } = useStore()
  const [pending, setPending] = useState<Session | null>(null)
  const [preset, setPreset] = useState<RangePreset>('all')
  const [from, setFrom] = useState(() =>
    sessions.reduce(
      (min, session) => (session.performedOn < min ? session.performedOn : min),
      todayIso(),
    ),
  )
  const [to, setTo] = useState(todayIso())
  const [dayIds, setDayIds] = useState<string[]>([])
  const [exerciseId, setExerciseId] = useState('all')
  const [status, setStatus] = useState<StatusFilter>('all')
  const [page, setPage] = useState(1)

  const earliest = sessions.reduce(
    (min, session) => (session.performedOn < min ? session.performedOn : min),
    todayIso(),
  )

  function applyPreset(next: RangePreset) {
    setPreset(next)
    setTo(todayIso())
    if (next === '30') setFrom(isoDaysAgo(30))
    if (next === '90') setFrom(isoDaysAgo(90))
    if (next === 'all') setFrom(earliest)
  }

  const days = useMemo(
    () => [...programDays].sort((a, b) => a.sortOrder - b.sortOrder),
    [programDays],
  )

  const exerciseOptions = useMemo(() => {
    const allowed =
      dayIds.length === 0
        ? new Set(exercises.map((e) => e.id))
        : new Set(
            programExercises
              .filter((pe) => dayIds.includes(pe.programDayId))
              .map((pe) => pe.exerciseId),
          )
    return [...exercises]
      .filter((e) => allowed.has(e.id))
      .sort((a, b) => a.name.localeCompare(b.name, 'en'))
  }, [dayIds, exercises, programExercises])

  const filtered = useMemo(() => {
    const exerciseSessionIds =
      exerciseId === 'all'
        ? null
        : new Set(
            sessionSets
              .filter((set) => set.exerciseId === exerciseId)
              .map((set) => set.sessionId),
          )
    return [...sessions]
      .filter((session) => {
        if (session.performedOn < from || session.performedOn > to) return false
        if (status !== 'all' && session.status !== status) return false
        if (
          dayIds.length > 0 &&
          (session.programDayId == null ||
            !dayIds.includes(session.programDayId))
        ) {
          return false
        }
        if (exerciseSessionIds && !exerciseSessionIds.has(session.id)) {
          return false
        }
        return true
      })
      .sort((a, b) =>
        a.performedOn === b.performedOn
          ? a.id.localeCompare(b.id)
          : a.performedOn < b.performedOn
            ? 1
            : -1,
      )
  }, [sessions, sessionSets, from, to, dayIds, exerciseId, status])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, pageCount)
  const paged = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  useEffect(() => {
    setPage(1)
  }, [from, to, dayIds, exerciseId, status])

  function toggleDay(id: string) {
    setDayIds((current) =>
      current.includes(id) ? current.filter((d) => d !== id) : [...current, id],
    )
    setExerciseId('all')
  }

  function confirmDelete() {
    if (!pending) return
    const id = pending.id
    const day = sessionDay(pending)
    const description = `${formatDate(pending.performedOn)} · ${day?.name ?? 'Session'}`
    const leave = sessionId === id
    setPending(null)
    if (leave) navigate('/history', { replace: true })
    removeSession(id)
    toast.success('Day removed', { description })
  }

  const deleteDialog = (
    <Dialog
      open={pending != null}
      onOpenChange={(open) => {
        if (!open) setPending(null)
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete this day?</DialogTitle>
          <DialogDescription>
            {pending
              ? `Removes ${formatDate(pending.performedOn)} · ${sessionDay(pending)?.name ?? 'Session'} and its sets. Other days stay.`
              : null}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setPending(null)}>
            Cancel
          </Button>
          <Button type="button" variant="destructive" onClick={confirmDelete}>
            Delete day
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )

  if (sessionId) {
    return (
      <>
        <HistoryDetail
          sessionId={sessionId}
          onDelete={(session) => setPending(session)}
        />
        {deleteDialog}
      </>
    )
  }

  if (sessions.length === 0) {
    return (
      <div className="mx-auto max-w-lg py-16 text-center">
        <h1 className="text-base font-medium">No sessions yet</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Import your Excel file or finish a session.
        </p>
        <div className="mt-4 flex justify-center gap-2">
          <Button asChild variant="outline">
            <Link to="/import">Import</Link>
          </Button>
          <Button asChild>
            <Link to="/today">Today</Link>
          </Button>
        </div>
      </div>
    )
  }

  const fromIndex = filtered.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1
  const toIndex = Math.min(safePage * PAGE_SIZE, filtered.length)

  return (
    <div className="flex flex-col gap-3">
      <div>
        <h1 className="text-base font-medium">History</h1>
        <p className="text-sm text-muted-foreground">
          Open a session to fix a mistyped set, or delete one day.
        </p>
      </div>

      <Card>
        <CardHeader className="border-b">
          <CardTitle>Filters</CardTitle>
          <CardDescription>
            Narrow by date range, program day, status, and exercise.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label>Range</Label>
            <div className="flex flex-wrap gap-1.5">
              {(
                [
                  ['30', 'Last 30 days'],
                  ['90', 'Last 90 days'],
                  ['all', 'All history'],
                ] as const
              ).map(([id, label]) => (
                <Button
                  key={id}
                  type="button"
                  size="sm"
                  variant={preset === id ? 'default' : 'outline'}
                  onClick={() => applyPreset(id)}
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="history-from">From</Label>
              <Input
                id="history-from"
                type="date"
                value={from}
                max={to}
                onChange={(e) => {
                  setPreset('custom')
                  setFrom(e.target.value)
                }}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="history-to">To</Label>
              <Input
                id="history-to"
                type="date"
                value={to}
                min={from}
                max={todayIso()}
                onChange={(e) => {
                  setPreset('custom')
                  setTo(e.target.value)
                }}
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Program days</Label>
            <div className="flex flex-wrap gap-1.5">
              <Button
                type="button"
                size="sm"
                variant={dayIds.length === 0 ? 'default' : 'outline'}
                onClick={() => {
                  setDayIds([])
                  setExerciseId('all')
                }}
              >
                All days
              </Button>
              {days.map((day) => (
                <Button
                  key={day.id}
                  type="button"
                  size="sm"
                  variant={dayIds.includes(day.id) ? 'default' : 'outline'}
                  onClick={() => toggleDay(day.id)}
                >
                  {day.name}
                </Button>
              ))}
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label>Status</Label>
              <Select
                value={status}
                onValueChange={(value) => setStatus(value as StatusFilter)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                  <SelectItem value="in_progress">In progress</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Exercise</Label>
              <Select value={exerciseId} onValueChange={setExerciseId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All exercises" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All exercises</SelectItem>
                  {exerciseOptions.map((exercise) => (
                    <SelectItem key={exercise.id} value={exercise.id}>
                      {exercise.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {filtered.length === 0 ? (
        <p className="rounded-lg border px-3 py-6 text-center text-sm text-muted-foreground">
          No sessions match these filters.
        </p>
      ) : (
        <>
          <ul className="overflow-hidden rounded-lg border">
            {paged.map((session) => {
              const day = sessionDay(session)
              const setCount = sessionSets.filter(
                (set) => set.sessionId === session.id,
              ).length
              return (
                <li
                  key={session.id}
                  className="flex items-stretch border-b last:border-0"
                >
                  <Link
                    to={`/history/${session.id}`}
                    className="flex min-w-0 flex-1 items-center justify-between gap-3 px-3 py-2.5 hover:bg-muted"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium">
                        {formatDate(session.performedOn)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {day?.name ?? 'Session'} · {setCount} sets
                      </p>
                    </div>
                    {session.status === 'done' ? (
                      <Badge
                        variant="outline"
                        className="border-primary/40 text-primary"
                      >
                        Done
                      </Badge>
                    ) : (
                      <Badge>In progress</Badge>
                    )}
                  </Link>
                  <div className="flex items-center pr-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      className="text-muted-foreground hover:text-destructive"
                      aria-label={`Delete ${formatDate(session.performedOn)}`}
                      onClick={() => setPending(session)}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </li>
              )
            })}
          </ul>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs text-muted-foreground tabular-nums">
              {fromIndex}–{toIndex} of {filtered.length}
            </p>
            {pageCount > 1 ? (
              <div className="flex items-center gap-1.5">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={safePage <= 1}
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                >
                  <ChevronLeft />
                  Previous
                </Button>
                <span className="px-1 text-xs text-muted-foreground tabular-nums">
                  {safePage} / {pageCount}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={safePage >= pageCount}
                  onClick={() =>
                    setPage((current) => Math.min(pageCount, current + 1))
                  }
                >
                  Next
                  <ChevronRight />
                </Button>
              </div>
            ) : null}
          </div>
        </>
      )}
      {deleteDialog}
    </div>
  )
}

function HistoryDetail({
  sessionId,
  onDelete,
}: {
  sessionId: string
  onDelete: (session: Session) => void
}) {
  const { sessions, sessionDay } = useStore()
  const session = sessions.find((s) => s.id === sessionId)

  if (!session) {
    return (
      <div>
        <p className="text-sm text-muted-foreground">Session not found.</p>
        <Button asChild variant="outline" className="mt-3">
          <Link to="/history">Back to history</Link>
        </Button>
      </div>
    )
  }

  const day = sessionDay(session)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-base font-medium">
            {day?.name ?? 'Session'} · {formatDate(session.performedOn)}
          </h1>
          <p className="text-sm text-muted-foreground">
            Edit a set if you mistyped it.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="text-muted-foreground hover:text-destructive"
            aria-label="Delete this day"
            onClick={() => onDelete(session)}
          >
            <Trash2 />
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link to="/history">All sessions</Link>
          </Button>
        </div>
      </div>
      <SetLogger sessionId={session.id} />
    </div>
  )
}
