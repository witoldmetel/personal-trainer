import { Navigate, createFileRoute } from '@tanstack/react-router'
import { LoginSkeleton } from '@/components/page-skeleton'
import { useAuth } from '@/lib/auth'
import { LoginPage } from '@/pages/login'

export const Route = createFileRoute('/login')({
  component: LoginRoute,
})

function LoginRoute() {
  const { ready, allowed } = useAuth()
  if (!ready) return <LoginSkeleton />
  if (allowed) return <Navigate to="/dashboard" replace />
  return <LoginPage />
}
