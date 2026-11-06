import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Session } from '@supabase/supabase-js'
import { ensureProfile } from '@/lib/gym'
import { supabase } from '@/lib/supabase'

const ALLOWED = (
  import.meta.env.VITE_ALLOWED_GITHUB_USERNAME || 'witoldmetel'
).toLowerCase()

function githubUsername(session: Session): string | null {
  const meta = session.user.user_metadata
  if (typeof meta.user_name === 'string' && meta.user_name) return meta.user_name
  if (typeof meta.preferred_username === 'string' && meta.preferred_username) {
    return meta.preferred_username
  }
  const identity = session.user.identities?.find((item) => item.provider === 'github')
  const data = identity?.identity_data
  if (data && typeof data.user_name === 'string' && data.user_name) {
    return data.user_name
  }
  if (data && typeof data.preferred_username === 'string' && data.preferred_username) {
    return data.preferred_username
  }
  return null
}

type AuthApi = {
  ready: boolean
  allowed: boolean
  username: string | null
  error: string | null
  signInWithGitHub: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthApi | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false)
  const [allowed, setAllowed] = useState(false)
  const [username, setUsername] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!supabase) {
      setReady(true)
      setError(
        'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.',
      )
      return
    }

    let cancelled = false

    async function applySession(session: Session | null) {
      if (!supabase) return
      if (!session) {
        if (!cancelled) {
          setAllowed(false)
          setUsername(null)
        }
        return
      }
      const name = githubUsername(session)
      if ((name ?? '').toLowerCase() !== ALLOWED) {
        await supabase.auth.signOut()
        if (!cancelled) {
          setAllowed(false)
          setUsername(null)
          setError(
            name
              ? `GitHub account @${name} is not allowed.`
              : 'This GitHub account is not allowed.',
          )
        }
        return
      }
      try {
        await ensureProfile(name ?? ALLOWED)
      } catch (profileError) {
        if (!cancelled) {
          setAllowed(false)
          setUsername(null)
          setError(
            profileError instanceof Error
              ? profileError.message
              : 'Could not create profile.',
          )
        }
        return
      }
      if (!cancelled) {
        setAllowed(true)
        setUsername(name)
        setError(null)
      }
    }

    void supabase.auth.getSession().then(({ data }) =>
      applySession(data.session).finally(() => {
        if (!cancelled) setReady(true)
      }),
    )

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      void applySession(session)
    })

    return () => {
      cancelled = true
      data.subscription.unsubscribe()
    }
  }, [])

  const api = useMemo<AuthApi>(
    () => ({
      ready,
      allowed,
      username,
      error,
      signInWithGitHub: async () => {
        setError(null)
        if (!supabase) {
          setError('Supabase is not configured.')
          return
        }
        const { error: signInError } = await supabase.auth.signInWithOAuth({
          provider: 'github',
          options: {
            redirectTo: `${window.location.origin}/login`,
            scopes: 'read:user',
          },
        })
        if (signInError) setError(signInError.message)
      },
      signOut: async () => {
        if (supabase) await supabase.auth.signOut()
        setAllowed(false)
        setUsername(null)
      },
    }),
    [allowed, error, ready, username],
  )

  return <AuthContext.Provider value={api}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const value = useContext(AuthContext)
  if (!value) throw new Error('useAuth must be used within AuthProvider')
  return value
}
