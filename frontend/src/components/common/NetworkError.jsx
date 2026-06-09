import { WifiOff } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function NetworkError({ onRetry, message = 'Unable to connect. Please check your network and try again.' }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border px-6 py-12 text-center" role="alert">
      <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
        <WifiOff className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
      </span>
      <h3 className="text-lg font-semibold">Connection Error</h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">{message}</p>
      {onRetry ? (
        <Button type="button" className="mt-6" onClick={onRetry}>Try Again</Button>
      ) : null}
    </div>
  )
}
