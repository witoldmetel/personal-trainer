import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Navigate, Outlet, createRootRoute } from '@tanstack/react-router'
import { Toaster } from '@/components/ui/sonner'
import { AuthProvider } from '@/lib/auth'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 15_000, retry: 1 },
  },
})

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: () => <Navigate to="/dashboard" replace />,
})

function RootComponent() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Outlet />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  )
}
