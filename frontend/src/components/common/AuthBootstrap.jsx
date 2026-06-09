import { FullScreenLoader } from '@/components/common/FullScreenLoader'
import { useAuth } from '@/hooks/useAuth'

export function AuthBootstrap({ children }) {
  const { initializing } = useAuth()

  if (initializing) {
    return <FullScreenLoader label="Restoring your session..." />
  }

  return children
}
