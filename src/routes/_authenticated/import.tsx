import { createFileRoute } from '@tanstack/react-router'
import { ImportPage } from '@/pages/import'

export const Route = createFileRoute('/_authenticated/import')({
  component: ImportPage,
})
