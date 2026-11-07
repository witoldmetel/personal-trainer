import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { toast } from 'sonner'
import { Check, Play, Trash2 } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { SetLogger } from '@/components/set-logger'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { formatDate, todayIso } from '@/lib/dates'
import { weekdayShort } from '@/lib/schedule'
import { useStore } from '@/lib/store'
import { isFilledSet } from '@/lib/types'

export function TodayPage() {
  const {
    programs,
    programDays,
    todaySession,
    sessionDay,
    sessionSets,
    startSession,
    markSessionDone,
    removeSession,
    updateSessionDate,
  } = useStore()
  const session = todaySession()
  const [dayId, setDayId] = useState(programDays[0]?.id ?? '')
  const [confirmRemove, setConfirmRemove] = useState(false)

  if (programs.length === 0) {
    return (
      <div className="mx-auto max-w-md py-16 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Create a program first</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Create a program to lock your split, then start today’s session.
        </p>
        <Button asChild className="mt-4">
          <Link to="/programs">Go to Programs</Link>
        </Button>
      </div>
    )
  }

  if (!session) {
    const days = programDays
      .filter((d) => programs.some((p) => p.id === d.programId))
      .sort((a, b) => a.sortOrder - b.sortOrder)

    return (
      <div>
        <PageHeader title="Today" subtitle={formatDate(todayIso())} />
        <div className="max-w-md rounded-lg border bg-card p-6">
          <div className="text-base font-medium">Start today’s session</div>
          <p className="mt-1 text-sm text-muted-foreground">
            Pick a day from {programs[0]?.name ?? 'your program'}.
          </p>
          <label className="eyebrow mt-5 block" htmlFor="today-day">
            Program day
          </label>
          <select
            id="today-day"
            className="mt-2 h-10 w-full rounded-md border border-input bg-card px-2 text-sm outline-none focus:ring-2 focus:ring-ring/30"
            value={dayId}
            onChange={(e) => setDayId(e.target.value)}
          >
            {days.map((day) => (
              <option key={day.id} value={day.id}>
                {day.name}
                {weekdayShort(day.weekday)
                  ? ` · ${weekdayShort(day.weekday)}`
                  : ''}
              </option>
            ))}
          </select>
          <Button
            className="mt-4 w-full"
            disabled={!dayId}
            onClick={() => {
              if (dayId) startSession(dayId)
            }}
          >
            <Play className="size-4" />
            Start session
          </Button>
        </div>
      </div>
    )
  }

  const day = sessionDay(session)
  const sessionId = session.id
  const performedOn = session.performedOn
  const hasFilledSet = sessionSets.some(
    (set) => set.sessionId === session.id && isFilledSet(set),
  )

  function confirmDelete() {
    const description = `${formatDate(performedOn)} · ${day?.name ?? 'Session'}`
    removeSession(sessionId)
    setConfirmRemove(false)
    toast.success('Session removed', { description })
  }

  return (
    <div>
      <PageHeader
        title={day?.name ?? 'Session'}
        subtitle="Tab between cells · Enter moves down"
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
            {session.status === 'in_progress' ? (
              <Button
                disabled={!hasFilledSet}
                onClick={() => {
                  if (!hasFilledSet) return
                  markSessionDone(session.id)
                  toast.success('Session saved', {
                    description: 'It’s in History. You can still edit or remove it here.',
                  })
                }}
              >
                <Check className="size-4" />
                Mark done
              </Button>
            ) : null}
            <Button
              type="button"
              variant="outline"
              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={() => setConfirmRemove(true)}
            >
              <Trash2 className="size-4" />
              Delete
            </Button>
          </>
        }
      />
      <SetLogger sessionId={session.id} />
      <Dialog open={confirmRemove} onOpenChange={setConfirmRemove}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete this session?</DialogTitle>
            <DialogDescription>
              Removes {formatDate(session.performedOn)} · {day?.name ?? 'Session'} and
              its sets. You can start today’s session again.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setConfirmRemove(false)}
            >
              Cancel
            </Button>
            <Button type="button" variant="destructive" onClick={confirmDelete}>
              Delete session
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
