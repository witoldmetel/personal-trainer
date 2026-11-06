import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { Trash2 } from 'lucide-react'
import { SetLogger } from '@/components/set-logger'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { formatDate } from '@/lib/dates'
import { useStore } from '@/lib/store'
import type { Session } from '@/lib/types'

export function HistoryPage() {
  const { sessionId } = useParams()
  const navigate = useNavigate()
  const { sessions, sessionSets, sessionDay, removeSession } = useStore()
  const [pending, setPending] = useState<Session | null>(null)

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

  const rows = [...sessions].sort((a, b) =>
    a.performedOn === b.performedOn
      ? a.id.localeCompare(b.id)
      : a.performedOn < b.performedOn
        ? 1
        : -1,
  )

  if (rows.length === 0) {
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

  return (
    <div className="flex flex-col gap-3">
      <div>
        <h1 className="text-base font-medium">History</h1>
        <p className="text-sm text-muted-foreground">
          Open a session to fix a mistyped set, or delete one day.
        </p>
      </div>
      <ul className="overflow-hidden rounded-lg border">
        {rows.map((session) => {
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
                  <Badge variant="outline" className="border-primary/40 text-primary">
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
