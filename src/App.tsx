import type { ReactNode } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from '@/components/app-shell'
import { Toaster } from '@/components/ui/sonner'
import { StoreProvider, useStore } from '@/lib/store'
import { ChartsPage } from '@/pages/charts'
import { DashboardPage } from '@/pages/dashboard'
import { HistoryPage } from '@/pages/history'
import { ImportPage } from '@/pages/import'
import { LoginPage } from '@/pages/login'
import { ProgramsPage } from '@/pages/programs'
import { TodayPage } from '@/pages/today'

function Gate({ children }: { children: ReactNode }) {
  const { authenticated } = useStore()
  if (!authenticated) return <Navigate to="/login" replace />
  return children
}

function LoginGate() {
  const { authenticated } = useStore()
  if (authenticated) return <Navigate to="/dashboard" replace />
  return <LoginPage />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginGate />} />
      <Route
        element={
          <Gate>
            <AppShell />
          </Gate>
        }
      >
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/today" element={<TodayPage />} />
        <Route path="/programs" element={<ProgramsPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/history/:sessionId" element={<HistoryPage />} />
        <Route path="/charts" element={<ChartsPage />} />
        <Route path="/import" element={<ImportPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <AppRoutes />
        <Toaster />
      </BrowserRouter>
    </StoreProvider>
  )
}
