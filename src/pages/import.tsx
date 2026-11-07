import { useState } from 'react'
import { toast } from 'sonner'
import { Check, CloudUpload } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  APP_FIELDS,
  parseUpload,
  remapTall,
  type AppField,
  type ParsedSpreadsheet,
} from '@/lib/import-file'
import { useStore } from '@/lib/store'

export function ImportPage() {
  const { importHistory } = useStore()
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [parsed, setParsed] = useState<ParsedSpreadsheet | null>(null)
  const [mapping, setMapping] = useState<Partial<Record<AppField, string>>>({})
  const [error, setError] = useState<string | null>(null)

  async function onFile(file: File | undefined) {
    if (!file) return
    setError(null)
    try {
      const result = await parseUpload(file)
      setParsed(result)
      setMapping(result.guessed)
      setStep(result.kind === 'atj' ? 3 : 2)
    } catch {
      setError('Could not read that file. Try .xlsx or .csv.')
    }
  }

  const mappedRows =
    parsed?.kind === 'tall' && parsed.grid.length > 1
      ? remapTall(parsed.headers, parsed.grid.slice(1), mapping)
      : parsed?.allRows ?? []
  const preview = mappedRows.slice(0, 12)

  const steps = [
    { n: 1 as const, label: 'Upload' },
    { n: 2 as const, label: 'Map columns' },
    { n: 3 as const, label: 'Preview' },
  ]

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Import"
        subtitle="Bring in your spreadsheet history."
      />

      <ol className="mb-6 flex items-center">
        {steps.map((item, index) => {
          const done = step > item.n
          const current = step === item.n
          return (
            <li key={item.n} className="flex items-center">
              {index > 0 ? (
                <span className="mx-3 hidden h-px w-16 bg-border sm:block" />
              ) : null}
              <span
                className={cn(
                  'grid size-6 place-items-center rounded-full text-xs font-semibold',
                  (done || current) && 'bg-primary text-primary-foreground',
                  !done && !current && 'bg-muted text-muted-foreground',
                )}
              >
                {done ? <Check className="size-3.5" /> : item.n}
              </span>
              <span
                className={cn(
                  'ml-2 text-sm',
                  current ? 'font-medium' : 'text-muted-foreground',
                )}
              >
                {item.label}
              </span>
            </li>
          )
        })}
      </ol>

      {step === 1 ? (
        <div className="flex flex-col gap-3">
          <div className="rounded-lg border bg-card p-4">
            <label className="flex min-h-[240px] cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border px-6 py-16 text-center transition-colors hover:border-primary/50 hover:bg-primary-soft/40">
              <CloudUpload className="size-8 text-primary" />
              <span className="text-sm font-semibold">
                Drop a file or click to browse
              </span>
              <span className="text-xs text-muted-foreground">.xlsx / .csv</span>
              <span className="max-w-sm text-xs text-muted-foreground">
                Works with a tall log (one row per set) or the Average To Jacked
                Day 1–4 sheets.
              </span>
              <Input
                type="file"
                accept=".xlsx,.xls,.csv,.html"
                className="hidden"
                onChange={(e) => void onFile(e.target.files?.[0])}
              />
            </label>
          </div>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
        </div>
      ) : null}

      {step === 2 && parsed ? (
        <div className="flex flex-col gap-3">
          <p className="text-sm">
            File: <span className="font-medium">{parsed.fileName}</span>
          </p>
          {parsed.headers.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Match your spreadsheet columns, then preview.
            </p>
          ) : (
            <div className="overflow-hidden rounded-lg border bg-card">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-left text-muted-foreground">
                  <tr>
                    <th className="px-3 py-2 font-medium">App field</th>
                    <th className="px-3 py-2 font-medium">Spreadsheet column</th>
                  </tr>
                </thead>
                <tbody>
                  {APP_FIELDS.map((field) => (
                    <tr key={field} className="border-t">
                      <td className="px-3 py-2">{field}</td>
                      <td className="px-3 py-2">
                        <Select
                          value={mapping[field]}
                          onValueChange={(value) =>
                            setMapping((m) => ({ ...m, [field]: value }))
                          }
                        >
                          <SelectTrigger className="w-full max-w-xs">
                            <SelectValue placeholder="Skip" />
                          </SelectTrigger>
                          <SelectContent>
                            {parsed.headers.map((header) => (
                              <SelectItem key={header} value={header}>
                                {header}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button
              disabled={!mapping.Exercise || !mapping.Reps}
              onClick={() => setStep(3)}
            >
              Preview
            </Button>
          </div>
        </div>
      ) : null}

      {step === 3 && parsed ? (
        <div className="flex flex-col gap-3">
          {parsed.warnings.map((warning) => (
            <p key={warning} className="text-sm text-muted-foreground">
              {warning}
            </p>
          ))}
          {preview.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Match your spreadsheet columns, then preview.
            </p>
          ) : (
            <div className="overflow-x-auto rounded-lg border bg-card">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-left text-muted-foreground">
                  <tr>
                    {APP_FIELDS.map((field) => (
                      <th key={field} className="px-3 py-2 font-medium">
                        {field}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {preview.map((row, i) => (
                    <tr key={i} className="border-t">
                      <td className="px-3 py-1.5 tabular-nums">{row.date}</td>
                      <td className="px-3 py-1.5">{row.dayName}</td>
                      <td className="px-3 py-1.5">{row.exerciseName}</td>
                      <td className="px-3 py-1.5 tabular-nums">{row.setNumber}</td>
                      <td className="px-3 py-1.5 tabular-nums">{row.reps}</td>
                      <td className="px-3 py-1.5 tabular-nums">{row.weightKg}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <p className="text-xs text-muted-foreground">
            {mappedRows.length} sets ready.
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setStep(parsed.kind === 'atj' ? 1 : 2)}
            >
              Back
            </Button>
            <Button
              disabled={mappedRows.length === 0}
              onClick={() => {
                const result = importHistory(
                  mappedRows,
                  parsed.kind === 'atj'
                    ? parsed.planDays
                    : undefined,
                )
                toast.success('History imported', {
                  description: `${result.sets} sets across ${result.sessions} sessions.`,
                })
                setStep(1)
                setParsed(null)
              }}
            >
              Import history
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
