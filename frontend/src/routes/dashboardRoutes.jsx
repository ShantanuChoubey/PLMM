import { PROTECTED_ROUTES } from '@/constants/routes'
import { ROLES } from '@/constants/roles'
import AdminDashboard from '@/pages/dashboard/AdminDashboard'
import ModulePlaceholder from '@/pages/dashboard/ModulePlaceholder'
import { facultyRoutes } from '@/routes/facultyRoutes'
import { learnerRoutes } from '@/routes/learnerRoutes'
import { mentorRoutes } from '@/routes/mentorRoutes'

function placeholder(title, description) {
  return <ModulePlaceholder title={title} description={description} />
}

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
    routes: [
      { index: true, element: <AdminDashboard /> },
      { path: 'users', element: placeholder('Users', 'Manage platform users.') },
      { path: 'mentors', element: placeholder('Mentors', 'Manage mentor accounts.') },
      { path: 'sessions', element: placeholder('Sessions', 'Oversee platform sessions.') },
      { path: 'groups', element: placeholder('Groups', 'Manage study groups.') },
      { path: 'resources', element: placeholder('Resources', 'Manage shared resources.') },
      { path: 'analytics', element: placeholder('Analytics', 'View platform analytics.') },
      { path: 'audit-logs', element: placeholder('Audit Logs', 'Review system audit logs.') },
      { path: 'settings', element: placeholder('Settings', 'Configure platform settings.') },
      { path: 'notifications', element: placeholder('Notifications', 'View all notifications.') },
    ],
  },
]
