import { Loader2 } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

export function AuthBootstrap({ children }) {
  const { initializing } = useAuth()

  if (initializing) {
    return (
      <div
        className="flex min-h-screen items-center justify-center bg-background"
        role="status"
        aria-live="polite"
        aria-label="Loading application"
      >
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin" aria-hidden="true" />
          <p className="text-sm">Restoring your session...</p>
        </div>
      </div>
    )
  }

  return children
}
