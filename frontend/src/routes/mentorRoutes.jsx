import { Navigate } from 'react-router-dom'
import MentorAvailability from '@/pages/mentor/Availability'
import MentorDashboard from '@/pages/mentor/Dashboard'
import MentorNotifications from '@/pages/mentor/Notifications'
import MentorProfile from '@/pages/mentor/Profile'
import MentorResources from '@/pages/mentor/Resources'
import MentorReviews from '@/pages/mentor/Reviews'
import MentorSessions from '@/pages/mentor/Sessions'
import ModulePlaceholder from '@/pages/dashboard/ModulePlaceholder'

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
  { path: 'resources', element: <MentorResources /> },
  { path: 'notifications', element: <MentorNotifications /> },
  { path: 'settings', element: placeholder('Settings', 'Configure your account settings.') },
]
