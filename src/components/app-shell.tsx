import { NavLink, Outlet, useLocation } from 'react-router-dom'
import {
  CalendarDays,
  ChartLine,
  Clock,
  History,
  LayoutDashboard,
  LayoutList,
  LogOut,
  Upload,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth'
import { formatDate, todayIso } from '@/lib/dates'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'

const nav = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/today', label: 'Today', icon: CalendarDays },
  { to: '/programs', label: 'Programs', icon: LayoutList },
  { to: '/history', label: 'History', icon: History },
  { to: '/charts', label: 'Charts', icon: ChartLine },
  { to: '/import', label: 'Import', icon: Upload },
]

function statusBadge(
  status: 'in_progress' | 'done' | undefined,
) {
  if (status === 'in_progress') {
    return <Badge>In progress</Badge>
  }
  if (status === 'done') {
    return (
      <Badge variant="outline" className="border-primary/40 text-primary">
        Done
      </Badge>
    )
  }
  return <Badge variant="secondary">No session</Badge>
}

export function AppShell() {
  const { todaySession } = useStore()
  const { username, signOut } = useAuth()
  const location = useLocation()
  const session = todaySession()
  const historyDetail = location.pathname.startsWith('/history/')

  return (
    <div className="min-h-svh bg-background text-foreground">
      <div className="mx-auto flex min-h-svh max-w-[1280px]">
        <aside className="hidden w-52 shrink-0 border-r md:flex md:flex-col">
          <div className="px-4 py-4 text-sm font-medium">Personal Trainer</div>
          <nav className="flex flex-1 flex-col gap-0.5 px-2">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground',
                    isActive && 'bg-muted text-foreground',
                  )
                }
              >
                <item.icon className="size-4" />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col pb-16 md:pb-0">
          <header className="flex items-center justify-between gap-3 border-b px-4 py-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium md:hidden">
                Personal Trainer
              </p>
              <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Clock className="size-3.5" />
                {formatDate(todayIso())}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {username ? (
                <span className="hidden text-xs text-muted-foreground md:inline">
                  @{username}
                </span>
              ) : null}
              {historyDetail ? (
                <Badge variant="outline">Past session</Badge>
              ) : (
                statusBadge(session?.status)
              )}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => void signOut()}
              >
                <LogOut />
                Sign out
              </Button>
            </div>
          </header>
          <main className="flex-1 px-4 py-4">
            <Outlet />
          </main>
        </div>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t bg-background md:hidden">
        <div className="mx-auto grid max-w-[1280px] grid-cols-6">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center gap-0.5 py-2 text-[11px] text-muted-foreground',
                  isActive && 'text-primary',
                )
              }
            >
              <item.icon className="size-4" />
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}
