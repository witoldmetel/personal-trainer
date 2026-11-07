import { NavLink, Outlet } from 'react-router-dom'
import {
  CalendarDays,
  ChartLine,
  Dumbbell,
  History,
  LayoutDashboard,
  ListTree,
  LogOut,
  Upload,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth'
import { formatDate, todayIso } from '@/lib/dates'
import { cn } from '@/lib/utils'

const nav = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/today', label: 'Today', icon: CalendarDays },
  { to: '/programs', label: 'Programs', icon: ListTree },
  { to: '/history', label: 'History', icon: History },
  { to: '/charts', label: 'Charts', icon: ChartLine },
  { to: '/import', label: 'Import', icon: Upload },
]

export function AppShell() {
  const { username, signOut } = useAuth()

  return (
    <div className="flex min-h-svh bg-background text-foreground">
      <aside className="sticky top-0 hidden h-svh w-52 shrink-0 flex-col border-r border-sidebar-border bg-sidebar md:flex">
        <div className="flex h-14 items-center gap-2 px-4">
          <div className="grid size-7 place-items-center rounded-md bg-primary text-primary-foreground">
            <Dumbbell className="size-4" />
          </div>
          <span className="text-sm font-semibold tracking-tight">
            Personal Trainer
          </span>
        </div>
        <nav className="flex flex-col gap-0.5 px-2 py-2">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-sidebar-foreground transition-colors hover:bg-sidebar-accent/60',
                  isActive &&
                    'bg-sidebar-accent font-medium text-sidebar-accent-foreground',
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
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b bg-background/90 px-4 backdrop-blur md:px-6">
          <span className="text-sm font-medium num">{formatDate(todayIso())}</span>
          <div className="ml-auto flex items-center gap-2">
            {username ? (
              <span className="hidden text-sm text-muted-foreground sm:inline">
                @{username}
              </span>
            ) : null}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => void signOut()}
            >
              <LogOut className="size-4" />
              <span className="hidden sm:inline">Sign out</span>
            </Button>
          </div>
        </header>
        <main className="mx-auto w-full max-w-[1280px] flex-1 px-4 pt-6 pb-24 md:px-8 md:pb-10">
          <Outlet />
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-6 border-t bg-card md:hidden">
        {nav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center gap-1 py-2 text-[10px] text-muted-foreground',
                isActive && 'font-semibold text-primary',
              )
            }
          >
            <item.icon className="size-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
