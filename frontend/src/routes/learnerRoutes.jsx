import { Navigate } from 'react-router-dom'
import LearnerDashboard from '@/pages/learner/Dashboard'
import LearnerMentorDetails from '@/pages/learner/MentorDetails'
import LearnerMentors from '@/pages/learner/Mentors'
import LearnerNotifications from '@/pages/learner/Notifications'
import LearnerProfile from '@/pages/learner/Profile'
import LearnerProgress from '@/pages/learner/Progress'
import LearnerRecommendations from '@/pages/learner/Recommendations'
import LearnerSessions from '@/pages/learner/Sessions'
import ModulePlaceholder from '@/pages/dashboard/ModulePlaceholder'

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
  { path: 'groups', element: placeholder('Groups', 'Collaborate with study groups.') },
  { path: 'resources', element: placeholder('Resources', 'Access shared learning resources.') },
  { path: 'settings', element: placeholder('Settings', 'Configure your account settings.') },
]
