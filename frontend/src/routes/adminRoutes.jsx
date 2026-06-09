import { Navigate } from 'react-router-dom'
import AdminAnalyticsPage from '@/pages/admin/Analytics'
import AdminAuditLogsPage from '@/pages/admin/AuditLogs'
import AdminDashboardPage from '@/pages/admin/Dashboard'
import AdminGroupsPage from '@/pages/admin/Groups'
import AdminMentorsPage from '@/pages/admin/Mentors'
import AdminResourcesPage from '@/pages/admin/Resources'
import AdminSessionsPage from '@/pages/admin/Sessions'
import AdminSettingsPage from '@/pages/admin/Settings'
import AdminUsersPage from '@/pages/admin/Users'
import ModulePlaceholder from '@/pages/dashboard/ModulePlaceholder'

function placeholder(title, description) {
  return <ModulePlaceholder title={title} description={description} />
}

export const adminRoutes = [
  { index: true, element: <Navigate to="dashboard" replace /> },
  { path: 'dashboard', element: <AdminDashboardPage /> },
  { path: 'users', element: <AdminUsersPage /> },
  { path: 'mentors', element: <AdminMentorsPage /> },
  { path: 'sessions', element: <AdminSessionsPage /> },
  { path: 'groups', element: <AdminGroupsPage /> },
  { path: 'resources', element: <AdminResourcesPage /> },
  { path: 'analytics', element: <AdminAnalyticsPage /> },
  { path: 'audit-logs', element: <AdminAuditLogsPage /> },
  { path: 'settings', element: <AdminSettingsPage /> },
  { path: 'notifications', element: placeholder('Notifications', 'View all notifications.') },
]
