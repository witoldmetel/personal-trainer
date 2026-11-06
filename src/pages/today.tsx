import { useState } from 'react'
import { Link } from 'react-router-dom'
import { SetLogger } from '@/components/set-logger'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { formatDate, todayIso } from '@/lib/dates'
import { useStore } from '@/lib/store'

export function TodayPage() {
  const {
    programs,
    programDays,
    todaySession,
    sessionDay,
    startSession,
    markSessionDone,
  } = useStore()
  const session = todaySession()
  const [dayId, setDayId] = useState(programDays[0]?.id ?? '')

  if (programs.length === 0) {
    return (
      <div className="mx-auto max-w-lg py-16 text-center">
        <h1 className="text-base font-medium">Create a program first</h1>
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
      <div className="mx-auto max-w-lg">
        <h1 className="text-base font-medium">No session today</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Pick a program day and start logging sets.
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <p className="mb-1.5 text-xs text-muted-foreground">Program day</p>
            <Select value={dayId} onValueChange={setDayId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a day" />
              </SelectTrigger>
              <SelectContent>
                {days.map((day) => (
                  <SelectItem key={day.id} value={day.id}>
                    {day.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            disabled={!dayId}
            onClick={() => {
              if (dayId) startSession(dayId)
            }}
          >
            Start session
          </Button>
        </div>
      </div>
    )
  }

  const day = sessionDay(session)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-base font-medium">
            {day?.name ?? 'Session'} · {formatDate(todayIso())}
          </h1>
          <p className="text-sm text-muted-foreground">
            One row per set. Tab between cells, Enter moves down.
          </p>
        </div>
        {session.status === 'in_progress' ? (
          <Button onClick={() => markSessionDone(session.id)}>Mark done</Button>
        ) : (
          <p className="text-sm text-primary">Session marked done</p>
        )}
      </div>
      <SetLogger sessionId={session.id} />
    </div>
  )
}
