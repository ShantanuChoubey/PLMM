import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export function PageLoader({ label = 'Loading page...', className }) {
  return (
    <div className={cn('flex min-h-[40vh] flex-col items-center justify-center gap-3', className)} role="status" aria-live="polite">
      <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden="true" />
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  )
}
