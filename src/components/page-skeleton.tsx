import { Skeleton } from '@/components/ui/skeleton'

export function PageSkeleton() {
  return (
    <div aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading</span>
      <div className="mb-6 space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72 max-w-full" />
      </div>
      <div className="grid gap-4 lg:grid-cols-[1.1fr_2fr]">
        <Skeleton className="h-44 rounded-lg" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-[5.5rem] rounded-lg" />
          <Skeleton className="h-[5.5rem] rounded-lg" />
          <Skeleton className="h-[5.5rem] rounded-lg" />
          <Skeleton className="h-[5.5rem] rounded-lg" />
        </div>
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Skeleton className="h-64 rounded-lg" />
        <Skeleton className="h-64 rounded-lg" />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Skeleton className="h-12 rounded-lg" />
        <Skeleton className="h-12 rounded-lg" />
        <Skeleton className="h-12 rounded-lg" />
        <Skeleton className="h-12 rounded-lg" />
      </div>
      <Skeleton className="mt-4 h-48 rounded-lg" />
    </div>
  )
}

export function LoginSkeleton() {
  return (
    <div
      className="flex min-h-svh items-center justify-center bg-background px-4"
      aria-busy="true"
      aria-live="polite"
    >
      <span className="sr-only">Loading</span>
      <div className="w-full max-w-sm rounded-xl border bg-card p-8 shadow-sm">
        <Skeleton className="mb-6 size-10 rounded-lg" />
        <Skeleton className="h-8 w-48" />
        <Skeleton className="mt-2 h-4 w-full" />
        <Skeleton className="mt-8 h-10 w-full rounded-lg" />
      </div>
    </div>
  )
}
