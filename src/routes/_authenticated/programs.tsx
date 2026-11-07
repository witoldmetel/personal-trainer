import { createFileRoute } from '@tanstack/react-router'
import { ProgramsPage } from '@/pages/programs'

export const Route = createFileRoute('/_authenticated/programs')({
  component: ProgramsPage,
})
