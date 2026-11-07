import { createFileRoute } from '@tanstack/react-router'
import { HistoryPage } from '@/pages/history'

export const Route = createFileRoute('/_authenticated/history/$sessionId')({
  component: HistoryDetailRoute,
})

function HistoryDetailRoute() {
  const { sessionId } = Route.useParams()
  return <HistoryPage sessionId={sessionId} />
}
