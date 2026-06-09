import { PROTECTED_ROUTES } from '@/constants/routes'
import { ROLES } from '@/constants/roles'

export const protectedRouteConfig = [
  {
    path: PROTECTED_ROUTES.LEARNER,
    area: 'Learner',
    allowedRoles: [ROLES.LEARNER],
  },
  {
    path: PROTECTED_ROUTES.MENTOR,
    area: 'Mentor',
    allowedRoles: [ROLES.PEER_MENTOR],
  },
  {
    path: PROTECTED_ROUTES.FACULTY,
    area: 'Faculty',
    allowedRoles: [ROLES.FACULTY_MENTOR],
  },
  {
    path: PROTECTED_ROUTES.ADMIN,
    area: 'Admin',
    allowedRoles: [ROLES.ADMIN],
  },
]
