import { useState } from 'react'
import { toast } from 'sonner'
import { FileSpreadsheet } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4">
      <div>
        <h1 className="text-base font-medium">Import</h1>
        <p className="text-sm text-muted-foreground">
          Excel becomes an archive. This app is the system of record. Best
          format: one row per set (date, day, exercise, set, reps, weight).
          Average To Jacked wide sheets are detected automatically.
        </p>
      </div>

      <ol className="flex gap-3 text-xs text-muted-foreground">
        <li className={step === 1 ? 'font-medium text-foreground' : ''}>
          1. Upload
        </li>
        <li className={step === 2 ? 'font-medium text-foreground' : ''}>
          2. Map columns
        </li>
        <li className={step === 3 ? 'font-medium text-foreground' : ''}>
          3. Preview
        </li>
      </ol>

      {step === 1 ? (
        <div className="flex flex-col gap-3">
          <label className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-dashed px-6 py-12 text-center hover:bg-muted/40">
            <FileSpreadsheet className="size-8 text-muted-foreground" />
            <span className="text-sm font-medium">Drop .xlsx or .csv here</span>
            <span className="text-xs text-muted-foreground">
              Tall log, or an Average To Jacked workbook with Day 1–4 sheets.
            </span>
            <Input
              type="file"
              accept=".xlsx,.xls,.csv,.html"
              className="hidden"
              onChange={(e) => void onFile(e.target.files?.[0])}
            />
          </label>
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
            <div className="overflow-hidden rounded-lg border">
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
            <div className="overflow-x-auto rounded-lg border">
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
