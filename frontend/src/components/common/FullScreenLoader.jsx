import { Loader2 } from 'lucide-react'

export function FullScreenLoader({ label = 'Loading...' }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm" role="status" aria-live="polite">
      <Loader2 className="h-10 w-10 animate-spin text-primary" aria-hidden="true" />
      <p className="mt-4 text-sm text-muted-foreground">{label}</p>
    </div>
  )
}
