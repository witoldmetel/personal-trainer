import { useMemo } from 'react'
import {
  createColumnHelper,
  tableFeatures,
  useTable,
} from '@tanstack/react-table'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useStore } from '@/lib/store'
import type { LoggerRow } from '@/lib/types'
import { cn } from '@/lib/utils'

const features = tableFeatures({})
const helper = createColumnHelper<typeof features, LoggerRow>()

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
}: {
  row: LoggerRow
  field: 'reps' | 'weightKg'
  col: string
}) {
  const { updateSet } = useStore()
  const filled = row.reps != null && row.weightKg != null

  return (
    <Input
      type="number"
      inputMode="decimal"
      step={field === 'weightKg' ? 0.5 : 1}
      min={0}
      value={row[field] ?? ''}
      data-logger-col={col}
      data-row-index={row.rowIndex}
      className={cn(
        'h-8 w-20 tabular-nums md:text-sm',
        filled && 'border-primary/40',
      )}
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

function ExerciseCell({ row }: { row: LoggerRow }) {
  const { addSet } = useStore()
  return (
    <div className="flex items-start gap-2 pt-0.5">
      <span className="font-medium">{row.exerciseName}</span>
      <Button
        type="button"
        variant="ghost"
        size="xs"
        className="text-muted-foreground"
        onClick={() => addSet(row.sessionId, row.exerciseId)}
      >
        <Plus />
        Add set
      </Button>
    </div>
  )
}

const columns = helper.columns([
  helper.accessor('exerciseName', {
    header: 'Exercise',
    cell: ({ row }) => <ExerciseCell row={row.original} />,
  }),
  helper.accessor('setNumber', {
    header: 'Set',
    cell: ({ row }) => (
      <span className="tabular-nums text-muted-foreground">
        {row.original.setNumber}
      </span>
    ),
  }),
  helper.accessor('reps', {
    header: 'Reps',
    cell: ({ row }) => (
      <NumberCell row={row.original} field="reps" col="reps" />
    ),
  }),
  helper.accessor('weightKg', {
    header: 'Weight (kg)',
    cell: ({ row }) => (
      <NumberCell row={row.original} field="weightKg" col="weight" />
    ),
  }),
  helper.accessor('lastTime', {
    header: 'Last time',
    cell: ({ row }) => (
      <span className="tabular-nums text-muted-foreground">
        {row.original.lastTime ?? '—'}
      </span>
    ),
  }),
])

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

export function SetLogger({ sessionId }: { sessionId: string }) {
  const { loggerRows } = useStore()
  const data = useMemo(() => loggerRows(sessionId), [loggerRows, sessionId])
  const table = useTable({ features, columns, data })
  const groups = groupedRows(data)

  return (
    <>
      <div className="hidden overflow-x-auto rounded-lg border md:block">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="bg-muted/50 text-left text-muted-foreground">
            {table.getHeaderGroups().map((group) => (
              <tr key={group.id} className="border-b">
                {group.headers.map((header) => (
                  <th key={header.id} className="px-3 py-2 font-medium">
                    {header.isPlaceholder ? null : (
                      <table.FlexRender header={header} />
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {groups.map((group) =>
              group.rows.map((row, i) => {
                const filled = row.reps != null && row.weightKg != null
                return (
                  <tr
                    key={row.setId}
                    className={cn(
                      'border-b last:border-0',
                      filled && 'bg-primary/5',
                    )}
                  >
                    {i === 0 ? (
                      <td
                        rowSpan={group.rows.length}
                        className="px-3 py-1.5 align-top"
                      >
                        <ExerciseCell row={row} />
                      </td>
                    ) : null}
                    <td className="px-3 py-1.5 align-middle">
                      <span className="tabular-nums text-muted-foreground">
                        {row.setNumber}
                      </span>
                    </td>
                    <td className="px-3 py-1.5 align-middle">
                      <NumberCell row={row} field="reps" col="reps" />
                    </td>
                    <td className="px-3 py-1.5 align-middle">
                      <NumberCell row={row} field="weightKg" col="weight" />
                    </td>
                    <td className="px-3 py-1.5 align-middle">
                      <span className="tabular-nums text-muted-foreground">
                        {row.lastTime ?? '—'}
                      </span>
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
          <section
            key={group.exerciseId}
            className="rounded-lg border bg-card p-3"
          >
            <div className="mb-2">
              <h3 className="font-medium">{group.name}</h3>
              <p className="text-xs text-muted-foreground tabular-nums">
                Last time {group.rows[0]?.lastTime ?? '—'}
              </p>
            </div>
            <MobileSets rows={group.rows} />
          </section>
        ))}
      </div>
    </>
  )
}

function MobileSets({ rows }: { rows: LoggerRow[] }) {
  const { addSet } = useStore()
  const last = rows[rows.length - 1]

  return (
    <div className="flex flex-col gap-2">
      {rows.map((row) => (
        <div key={row.setId} className="flex items-center gap-2">
          <span className="w-10 shrink-0 text-xs text-muted-foreground tabular-nums">
            Set {row.setNumber}
          </span>
          <NumberCell row={row} field="reps" col="reps" />
          <NumberCell row={row} field="weightKg" col="weight" />
        </div>
      ))}
      {last ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="self-start"
          onClick={() => addSet(last.sessionId, last.exerciseId)}
        >
          <Plus />
          Add set
        </Button>
      ) : null}
    </div>
  )
}
