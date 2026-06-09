import { Navigate } from 'react-router-dom'
import {
  GroupDetailsPage,
  GroupsPage,
  LearnerDashboard,
  LearnerMentorDetails,
  LearnerMentors,
  LearnerNotifications,
  LearnerProfile,
  LearnerProgress,
  LearnerRecommendations,
  LearnerSessions,
  ModulePlaceholder,
  ResourcesHubPage,
} from '@/routes/lazyPages'
import { LEARNER_ROUTES } from '@/constants/routes'

function placeholder(title, description) {
  return <ModulePlaceholder title={title} description={description} />
}

export const learnerRoutes = [
  { index: true, element: <Navigate to="dashboard" replace /> },
  { path: 'dashboard', element: <LearnerDashboard /> },
  { path: 'profile', element: <LearnerProfile /> },
  { path: 'mentors', element: <LearnerMentors /> },
  { path: 'mentors/:id', element: <LearnerMentorDetails /> },
  { path: 'recommendations', element: <LearnerRecommendations /> },
  { path: 'sessions', element: <LearnerSessions /> },
  { path: 'progress', element: <LearnerProgress /> },
  { path: 'notifications', element: <LearnerNotifications /> },
  { path: 'groups', element: <GroupsPage groupsBasePath={LEARNER_ROUTES.GROUPS} /> },
  { path: 'groups/:groupId', element: <GroupDetailsPage groupsBasePath={LEARNER_ROUTES.GROUPS} /> },
  { path: 'resources', element: <ResourcesHubPage /> },
  { path: 'settings', element: placeholder('Settings', 'Configure your account settings.') },
]
