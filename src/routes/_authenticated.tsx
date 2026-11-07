import { Navigate, Outlet, createFileRoute } from '@tanstack/react-router'
import { AppShell } from '@/components/app-shell'
import { PageSkeleton } from '@/components/page-skeleton'
import { useAuth } from '@/lib/auth'
import { StoreProvider } from '@/lib/store'

export const Route = createFileRoute('/_authenticated')({
  component: AuthenticatedLayout,
})

function AuthenticatedLayout() {
  const { ready, allowed } = useAuth()
  if (!ready) {
    return (
      <AppShell>
        <PageSkeleton />
      </AppShell>
    )
  }
  if (!allowed) return <Navigate to="/login" replace />
  return (
    <AppShell>
      <StoreProvider>
        <Outlet />
      </StoreProvider>
    </AppShell>
  )
}
