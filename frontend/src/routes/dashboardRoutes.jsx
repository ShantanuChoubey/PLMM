import { PROTECTED_ROUTES } from '@/constants/routes'
import { ROLES } from '@/constants/roles'
import { adminRoutes } from '@/routes/adminRoutes'
import { facultyRoutes } from '@/routes/facultyRoutes'
import { learnerRoutes } from '@/routes/learnerRoutes'
import { mentorRoutes } from '@/routes/mentorRoutes'

export const dashboardRouteGroups = [
  {
    path: `${PROTECTED_ROUTES.LEARNER}/*`,
    allowedRoles: [ROLES.LEARNER],
    routes: learnerRoutes,
  },
  {
    path: `${PROTECTED_ROUTES.MENTOR}/*`,
    allowedRoles: [ROLES.PEER_MENTOR],
    routes: mentorRoutes,
  },
  {
    path: `${PROTECTED_ROUTES.FACULTY}/*`,
    allowedRoles: [ROLES.FACULTY_MENTOR],
    routes: facultyRoutes,
  },
  {
    path: `${PROTECTED_ROUTES.ADMIN}/*`,
    allowedRoles: [ROLES.ADMIN],
    routes: adminRoutes,
  },
]
