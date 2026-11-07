import { useMemo } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useStore } from '@/lib/store'
import type { LoggerRow } from '@/lib/types'
import { cn } from '@/lib/utils'

function parseNumber(value: string): number | null {
  const trimmed = value.trim()
  if (trimmed === '') return null
  const n = Number(trimmed)
  return Number.isFinite(n) ? n : null
}

function moveDown(current: HTMLInputElement) {
  const col = current.dataset.loggerCol
  const row = Number(current.dataset.rowIndex)
  if (!col || Number.isNaN(row)) return
  const next = document.querySelector<HTMLInputElement>(
    `input[data-logger-col="${col}"][data-row-index="${row + 1}"]`,
  )
  next?.focus()
  next?.select()
}

function NumberCell({
  row,
  field,
  col,
  className,
}: {
  row: LoggerRow
  field: 'reps' | 'weightKg'
  col: string
  className?: string
}) {
  const { updateSet } = useStore()

  return (
    <input
      type="number"
      inputMode={field === 'weightKg' ? 'decimal' : 'numeric'}
      step={field === 'weightKg' ? 0.5 : 1}
      min={0}
      value={row[field] ?? ''}
      data-logger-col={col}
      data-row-index={row.rowIndex}
      placeholder={field === 'weightKg' ? 'kg' : undefined}
      className={cn('cell-input', className)}
      onChange={(e) =>
        updateSet(row.setId, { [field]: parseNumber(e.target.value) })
      }
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault()
          moveDown(e.currentTarget)
        }
      }}
    />
  )
}

function groupedRows(rows: LoggerRow[]) {
  const groups: { exerciseId: string; name: string; rows: LoggerRow[] }[] = []
  for (const row of rows) {
    const last = groups[groups.length - 1]
    if (last && last.exerciseId === row.exerciseId) {
      last.rows.push(row)
    } else {
      groups.push({
        exerciseId: row.exerciseId,
        name: row.exerciseName,
        rows: [row],
      })
    }
  }
  return groups
}

function filled(row: LoggerRow) {
  return row.reps != null && (!row.usesWeight || row.weightKg != null)
}

export function SetLogger({ sessionId }: { sessionId: string }) {
  const { loggerRows, programExercises, sessions, addSet } = useStore()
  const data = useMemo(() => loggerRows(sessionId), [loggerRows, sessionId])
  const groups = groupedRows(data)
  const session = sessions.find((s) => s.id === sessionId)

  return (
    <>
      <div className="hidden overflow-hidden rounded-lg border bg-card md:block">
        <table className="w-full text-sm">
          <thead className="bg-muted/60">
            <tr className="text-left">
              <th className="eyebrow w-[32%] px-4 py-2.5">Exercise</th>
              <th className="eyebrow w-16 px-3 py-2.5">Set</th>
              <th className="eyebrow w-32 px-3 py-2.5">Reps</th>
              <th className="eyebrow w-36 px-3 py-2.5">Weight (kg)</th>
              <th className="eyebrow px-4 py-2.5">Last time</th>
            </tr>
          </thead>
          <tbody>
            {groups.map((group) =>
              group.rows.map((row, i) => {
                const pe = programExercises.find(
                  (item) =>
                    item.programDayId === session?.programDayId &&
                    item.exerciseId === row.exerciseId,
                )
                return (
                  <tr
                    key={row.setId}
                    className={cn(i === 0 && 'border-t', filled(row) && 'bg-primary-soft/70')}
                  >
                    {i === 0 ? (
                      <td
                        rowSpan={group.rows.length}
                        className="border-r bg-card px-4 py-3 align-top"
                      >
                        <div className="font-medium">{row.exerciseName}</div>
                        {pe ? (
                          <div className="mt-0.5 text-xs text-muted-foreground num">
                            Target {pe.targetSets}×{pe.targetReps}
                            {pe.usesWeight ? '' : ' · no weight'}
                          </div>
                        ) : null}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="-ml-2 mt-2 h-7 text-primary"
                          onClick={() => addSet(row.sessionId, row.exerciseId)}
                        >
                          <Plus className="size-3.5" />
                          Add set
                        </Button>
                      </td>
                    ) : null}
                    <td className="px-3 py-1 text-muted-foreground num">
                      {row.setNumber}
                    </td>
                    <td className="px-2 py-1">
                      <NumberCell row={row} field="reps" col="reps" />
                    </td>
                    <td className="px-2 py-1">
                      {row.usesWeight ? (
                        <NumberCell row={row} field="weightKg" col="weight" />
                      ) : (
                        <span className="px-2 text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-4 py-1 text-muted-foreground num">
                      {row.lastTime ?? '—'}
                    </td>
                  </tr>
                )
              }),
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 md:hidden">
        {groups.map((group) => (
          <div key={group.exerciseId} className="rounded-lg border bg-card">
            <div className="flex items-baseline justify-between border-b px-4 py-3">
              <div className="font-medium">{group.name}</div>
              <div className="text-xs text-muted-foreground num">
                Last: {group.rows[0]?.lastTime ?? '—'}
              </div>
            </div>
            <div className="divide-y">
              {group.rows.map((row) => (
                <div
                  key={row.setId}
                  className={cn(
                    'flex items-center gap-3 px-4 py-2',
                    filled(row) && 'bg-primary-soft/70',
                  )}
                >
                  <span className="w-12 text-xs text-muted-foreground num">
                    Set {row.setNumber}
                  </span>
                  <NumberCell
                    row={row}
                    field="reps"
                    col="reps"
                    className="h-10 flex-1 border-input bg-background"
                  />
                  {row.usesWeight ? (
                    <NumberCell
                      row={row}
                      field="weightKg"
                      col="weight"
                      className="h-10 flex-1 border-input bg-background"
                    />
                  ) : null}
                </div>
              ))}
            </div>
            <div className="px-2 py-1.5">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-primary"
                onClick={() => {
                  const last = group.rows[group.rows.length - 1]
                  if (last) addSet(last.sessionId, last.exerciseId)
                }}
              >
                <Plus className="size-3.5" />
                Add set
              </Button>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
