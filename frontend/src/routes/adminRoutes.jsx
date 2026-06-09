import { Navigate } from 'react-router-dom'
import {
  AdminAnalytics,
  AdminAuditLogs,
  AdminDashboard,
  AdminGroups,
  AdminMentors,
  AdminResources,
  AdminSessions,
  AdminSettings,
  AdminUsers,
  ModulePlaceholder,
} from '@/routes/lazyPages'

function placeholder(title, description) {
  return <ModulePlaceholder title={title} description={description} />
}

export const adminRoutes = [
  { index: true, element: <Navigate to="dashboard" replace /> },
  { path: 'dashboard', element: <AdminDashboard /> },
  { path: 'users', element: <AdminUsers /> },
  { path: 'mentors', element: <AdminMentors /> },
  { path: 'sessions', element: <AdminSessions /> },
  { path: 'groups', element: <AdminGroups /> },
  { path: 'resources', element: <AdminResources /> },
  { path: 'analytics', element: <AdminAnalytics /> },
  { path: 'audit-logs', element: <AdminAuditLogs /> },
  { path: 'settings', element: <AdminSettings /> },
  { path: 'notifications', element: placeholder('Notifications', 'View all notifications.') },
]
