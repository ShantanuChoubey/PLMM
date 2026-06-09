import { Navigate } from 'react-router-dom'
import MentorAvailability from '@/pages/mentor/Availability'
import MentorDashboard from '@/pages/mentor/Dashboard'
import MentorNotifications from '@/pages/mentor/Notifications'
import MentorProfile from '@/pages/mentor/Profile'
import MentorReviews from '@/pages/mentor/Reviews'
import MentorSessions from '@/pages/mentor/Sessions'
import GroupsPage from '@/pages/hub/Groups'
import ResourcesHubPage from '@/pages/hub/Resources'
import ModulePlaceholder from '@/pages/dashboard/ModulePlaceholder'
import { MENTOR_ROUTES } from '@/constants/routes'

function placeholder(title, description) {
  return <ModulePlaceholder title={title} description={description} />
}

export const mentorRoutes = [
  { index: true, element: <Navigate to="dashboard" replace /> },
  { path: 'dashboard', element: <MentorDashboard /> },
  { path: 'profile', element: <MentorProfile /> },
  { path: 'availability', element: <MentorAvailability /> },
  { path: 'sessions', element: <MentorSessions /> },
  { path: 'reviews', element: <MentorReviews /> },
  { path: 'groups', element: <GroupsPage groupsBasePath={MENTOR_ROUTES.GROUPS} title="Study Groups" description="Manage and participate in community study groups." /> },
  { path: 'resources', element: <ResourcesHubPage title="Resource Hub" description="Share and discover learning resources with the community." /> },
  { path: 'notifications', element: <MentorNotifications /> },
  { path: 'settings', element: placeholder('Settings', 'Configure your account settings.') },
]
