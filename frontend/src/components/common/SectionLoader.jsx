import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export function SectionLoader({ label = 'Loading...', className }) {
  return (
    <div className={cn('flex items-center justify-center gap-2 py-12', className)} role="status" aria-live="polite">
      <Loader2 className="h-5 w-5 animate-spin text-primary" aria-hidden="true" />
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
  )
}
