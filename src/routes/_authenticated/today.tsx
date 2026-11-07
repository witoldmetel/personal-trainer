import { createFileRoute } from '@tanstack/react-router'
import { TodayPage } from '@/pages/today'

export const Route = createFileRoute('/_authenticated/today')({
  component: TodayPage,
})
