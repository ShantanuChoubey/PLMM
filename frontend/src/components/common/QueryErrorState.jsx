import { API_ERROR_CODES } from '@/utils/apiError'
import { getErrorMessage } from '@/utils/apiError'
import { NetworkError } from '@/components/common/NetworkError'
import { ServerError } from '@/components/common/ServerError'
import { EmptyState } from '@/components/common/EmptyState'
import { FileQuestion } from 'lucide-react'

export function QueryErrorState({ error, onRetry }) {
  const code = error?.code
  const message = getErrorMessage(error)

  if (code === API_ERROR_CODES.NETWORK || code === API_ERROR_CODES.TIMEOUT) {
    return <NetworkError onRetry={onRetry} message={message} />
  }

  if (code === API_ERROR_CODES.NOT_FOUND) {
    return <EmptyState icon={FileQuestion} title="Not Found" description={message} actionLabel="Retry" onAction={onRetry} />
  }

  if (code === API_ERROR_CODES.FORBIDDEN) {
    return <EmptyState title="Access Denied" description={message} />
  }

  return <ServerError onRetry={onRetry} message={message} />
}
