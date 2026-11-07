import { createFileRoute } from '@tanstack/react-router'
import { HistoryPage } from '@/pages/history'

export const Route = createFileRoute('/_authenticated/history/')({
  component: HistoryPage,
})
