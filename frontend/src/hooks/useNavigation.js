import { useMemo } from 'react'
import { getNavigationForRole } from '@/constants/navigation'
import { useAuth } from '@/hooks/useAuth'

export function useNavigation() {
  const { user } = useAuth()

  return useMemo(() => getNavigationForRole(user?.role), [user?.role])
}
