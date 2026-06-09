import { Navigate } from 'react-router-dom'
import { getRoleHomeRoute } from '@/constants/roles'
import { ROUTES } from '@/constants/routes'
import { useAuth } from '@/hooks/useAuth'

export function RoleGuard({ allowedRoles = [], children }) {
  const { user } = useAuth()

  if (!user?.role || !allowedRoles.includes(user.role)) {
    const redirectTo = user?.role ? getRoleHomeRoute(user.role) : ROUTES.HOME
    return <Navigate to={redirectTo} replace />
  }

  return children
}
