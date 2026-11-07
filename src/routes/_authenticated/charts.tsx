import { createFileRoute } from '@tanstack/react-router'
import { ChartsPage } from '@/pages/charts'

export const Route = createFileRoute('/_authenticated/charts')({
  component: ChartsPage,
})
