import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { ArrowLeft, ChevronRight, Trash2 } from 'lucide-react'
import { FilterChip } from '@/components/filter-chip'
import { PageHeader } from '@/components/page-header'
import { SetLogger } from '@/components/set-logger'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { formatDate, isoDaysAgo, todayIso } from '@/lib/dates'
import { useStore } from '@/lib/store'
import { isFilledSet, type Session } from '@/lib/types'

const PAGE_SIZE = 15

type RangePreset = '30' | '90' | 'all' | 'custom'

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
        if (!sessionSets.some((set) => set.sessionId === session.id && isFilledSet(set))) {
          return false
        }
        if (session.performedOn < from || session.performedOn > to) return false
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
  }, [sessions, sessionSets, from, to, dayIds, exerciseId])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, pageCount)
  const paged = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  useEffect(() => {
    setPage(1)
  }, [from, to, dayIds, exerciseId])

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
      <div>
        <PageHeader
          title="History"
          subtitle="Every session you’ve logged or imported."
        />
        <div className="rounded-lg border bg-card px-4 py-10 text-center">
          <p className="text-sm font-medium">No sessions yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Import your Excel file or finish a session.
          </p>
          <div className="mt-4 flex justify-center gap-2">
            <Button asChild variant="outline" size="sm">
              <Link to="/import">Import</Link>
            </Button>
            <Button asChild size="sm">
              <Link to="/today">Today</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const fromIndex = filtered.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1
  const toIndex = Math.min(safePage * PAGE_SIZE, filtered.length)

  return (
    <div>
      <PageHeader
        title="History"
        subtitle="Every session you’ve logged or imported."
      />

      <div className="mb-6 flex flex-wrap items-start gap-x-6 gap-y-4 rounded-lg border bg-card p-4 sm:flex-nowrap">
        <div>
          <div className="eyebrow mb-2">Range</div>
          <div className="flex flex-wrap gap-1.5">
            {(
              [
                ['30', 'Last 30'],
                ['90', 'Last 90'],
                ['all', 'All history'],
              ] as const
            ).map(([id, label]) => (
              <FilterChip
                key={id}
                active={preset === id}
                onClick={() => applyPreset(id)}
              >
                {label}
              </FilterChip>
            ))}
          </div>
        </div>
        <div>
          <div className="eyebrow mb-2">From – To</div>
          <div className="flex items-center gap-1.5">
            <Input
              type="date"
              value={from}
              max={to}
              className="h-8 w-36 num"
              onChange={(e) => {
                setPreset('custom')
                setFrom(e.target.value)
              }}
            />
            <span className="text-muted-foreground">–</span>
            <Input
              type="date"
              value={to}
              min={from}
              max={todayIso()}
              className="h-8 w-36 num"
              onChange={(e) => {
                setPreset('custom')
                setTo(e.target.value)
              }}
            />
          </div>
        </div>
        <div>
          <div className="eyebrow mb-2">Program days</div>
          <div className="flex flex-wrap gap-1.5">
            {days.map((day) => (
              <FilterChip
                key={day.id}
                active={dayIds.includes(day.id)}
                onClick={() => toggleDay(day.id)}
              >
                {day.name}
              </FilterChip>
            ))}
          </div>
        </div>
        <div className="shrink-0">
          <div className="eyebrow mb-2">Exercise</div>
          <select
            className="h-8 w-48 rounded-md border border-input bg-card px-2 text-sm outline-none focus:ring-2 focus:ring-ring/30"
            value={exerciseId}
            onChange={(e) => setExerciseId(e.target.value)}
          >
            <option value="all">All exercises</option>
            {exerciseOptions.map((exercise) => (
              <option key={exercise.id} value={exercise.id}>
                {exercise.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-lg border bg-card px-4 py-6 text-center text-sm text-muted-foreground">
          No sessions match these filters.
        </p>
      ) : (
        <div className="overflow-hidden rounded-lg border bg-card">
          <div className="divide-y">
            {paged.map((session) => {
              const day = sessionDay(session)
              const setCount = sessionSets.filter(
                (set) => set.sessionId === session.id && isFilledSet(set),
              ).length
              return (
                <div
                  key={session.id}
                  className="group flex items-center gap-4 px-4 py-2.5 hover:bg-muted/50"
                >
                  <Link
                    to={`/history/${session.id}`}
                    className="flex flex-1 items-center gap-4"
                  >
                    <span className="w-36 text-sm font-medium num">
                      {formatDate(session.performedOn)}
                    </span>
                    <span className="flex-1 text-sm text-muted-foreground num">
                      {day?.name ?? 'Session'} · {setCount} sets
                    </span>
                    <ChevronRight className="size-4 text-muted-foreground" />
                  </Link>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-7 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    aria-label={`Delete ${formatDate(session.performedOn)}`}
                    onClick={() => setPending(session)}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              )
            })}
          </div>
          <div className="flex items-center justify-between border-t bg-muted/40 px-4 py-2.5 text-sm">
            <span className="text-muted-foreground num">
              {fromIndex}–{toIndex} of {filtered.length}
            </span>
            {pageCount > 1 ? (
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={safePage <= 1}
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                >
                  Previous
                </Button>
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
                </Button>
              </div>
            ) : null}
          </div>
        </div>
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
  const { sessions, sessionDay, updateSessionDate } = useStore()
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
    <div>
      <Button
        asChild
        variant="ghost"
        size="sm"
        className="-ml-2 mb-2 text-muted-foreground"
      >
        <Link to="/history">
          <ArrowLeft className="size-4" />
          All sessions
        </Link>
      </Button>
      <PageHeader
        title={day?.name ?? 'Session'}
        subtitle="Edits save to this session."
        actions={
          <>
            <Input
              type="date"
              value={session.performedOn}
              max={todayIso()}
              className="h-8 w-36 num"
              onChange={(e) => {
                if (e.target.value) updateSessionDate(session.id, e.target.value)
              }}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={() => onDelete(session)}
            >
              <Trash2 className="size-4" />
              Delete
            </Button>
          </>
        }
      />
      <SetLogger sessionId={session.id} />
    </div>
  )
}
