import { useMemo } from 'react'
import {
  barY,
  createChartScene,
  defineChart,
  lineY,
  linearRegressionY,
  renderChartSvg,
} from '@tanstack/charts'
import { scaleBand } from '@tanstack/charts/scales/band'
import { scaleLinear } from '@tanstack/charts/scales/linear'
import { scaleUtc } from '@tanstack/charts/scales/time'
import { dateIso, formatChartDate } from '@/lib/dates'

const PRIMARY = 'oklch(0.508 0.118 157.8)'
const TREND = 'oklch(0.439 0 0)'
const CHART_SIZE = { width: 720, height: 240 }

type TimeRow = {
  date: Date
  dateIso: string
  value: number
}

type BarRow = {
  label: string
  value: number
}

function formatTickDate(value: Date) {
  return formatChartDate(dateIso(value))
}

function ChartFrame({
  svg,
  ariaLabel,
}: {
  svg: string
  ariaLabel: string
}) {
  return (
    <div
      role="img"
      aria-label={ariaLabel}
      className="h-60 w-full overflow-hidden [&_svg]:h-full [&_svg]:w-full"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}

export function TimeSeriesChart({
  rows,
  ariaLabel,
  yLabel,
  showTrend = false,
}: {
  rows: TimeRow[]
  ariaLabel: string
  yLabel: string
  showTrend?: boolean
}) {
  const svg = useMemo(() => {
    if (rows.length < 2) return null
    const line = lineY(rows, {
      x: 'date',
      y: 'value',
      stroke: PRIMARY,
      strokeWidth: 2,
      points: true,
    })
    const trend =
      showTrend && rows.length >= 3
        ? linearRegressionY(rows, {
            x: 'date',
            y: 'value',
            stroke: TREND,
            strokeWidth: 1.5,
            strokeDasharray: '5 4',
            ci: 0,
          })
        : null
    const definition = defineChart({
      marks: trend ? [trend, line] : [line],
      scales: {
        x: {
          scale: scaleUtc,
          nice: true,
          axis: {
            ticks: { count: Math.min(6, rows.length), format: formatTickDate },
          },
        },
        y: {
          scale: scaleLinear,
          nice: true,
          grid: true,
          axis: { label: yLabel },
        },
      },
    })
    const scene = createChartScene(definition, CHART_SIZE)
    return renderChartSvg(scene, { ariaLabel })
  }, [rows, showTrend, yLabel, ariaLabel])

  if (!svg) {
    return (
      <p className="flex h-60 items-center justify-center text-sm text-muted-foreground">
        Need at least two logged sessions in this range.
      </p>
    )
  }

  return <ChartFrame svg={svg} ariaLabel={ariaLabel} />
}

export function CategoryBarChart({
  rows,
  ariaLabel,
  yLabel,
}: {
  rows: BarRow[]
  ariaLabel: string
  yLabel: string
}) {
  const svg = useMemo(() => {
    if (rows.length === 0) return null
    const definition = defineChart({
      marks: [
        barY(rows, {
          x: 'label',
          y: 'value',
          fill: PRIMARY,
          radius: 4,
        }),
      ],
      scales: {
        x: {
          scale: () => scaleBand().padding(0.22),
        },
        y: {
          scale: scaleLinear,
          nice: true,
          grid: true,
          axis: { label: yLabel },
        },
      },
    })
    const scene = createChartScene(definition, CHART_SIZE)
    return renderChartSvg(scene, { ariaLabel })
  }, [rows, yLabel, ariaLabel])

  if (!svg) {
    return (
      <p className="flex h-60 items-center justify-center text-sm text-muted-foreground">
        No volume in this range.
      </p>
    )
  }

  return <ChartFrame svg={svg} ariaLabel={ariaLabel} />
}
