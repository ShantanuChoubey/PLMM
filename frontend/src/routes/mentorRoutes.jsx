import { Navigate } from 'react-router-dom'
import {
  GroupsPage,
  MentorAvailability,
  MentorDashboard,
  MentorNotifications,
  MentorProfile,
  MentorReviews,
  MentorSessions,
  ModulePlaceholder,
  ResourcesHubPage,
} from '@/routes/lazyPages'
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
