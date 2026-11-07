import { useState } from 'react'
import { Dumbbell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth'

export function LoginPage() {
  const { signInWithGitHub, error } = useAuth()
  const [pending, setPending] = useState(false)

  return (
    <div className="flex min-h-svh items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm rounded-xl border bg-card p-8 shadow-sm">
        <div className="mb-6 grid size-10 place-items-center rounded-lg bg-primary text-primary-foreground">
          <Dumbbell className="size-5" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">Personal Trainer</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Log workouts the way you used to in Excel.
        </p>
        <Button
          className="mt-8 h-10 w-full"
          disabled={pending}
          onClick={() => {
            setPending(true)
            void signInWithGitHub().finally(() => setPending(false))
          }}
        >
          <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden>
            <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.604-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.088 2.91.833.091-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0 1 12 6.844a9.56 9.56 0 0 1 2.504.337c1.909-1.294 2.748-1.025 2.748-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12c0-5.523-4.477-10-10-10Z" />
          </svg>
          {pending ? 'Redirecting…' : 'Continue with GitHub'}
        </Button>
        {error ? (
          <p className="mt-3 min-h-5 text-center text-xs text-destructive" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    </div>
  )
}
