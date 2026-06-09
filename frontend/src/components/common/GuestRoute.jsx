import { Navigate, Outlet } from 'react-router-dom'
import { getRoleHomeRoute } from '@/constants/roles'
import { useAuth } from '@/hooks/useAuth'

export function GuestRoute() {
  const { isAuthenticated, user } = useAuth()

  if (isAuthenticated && user?.role) {
    return <Navigate to={getRoleHomeRoute(user.role)} replace />
  }

  return <Outlet />
}
