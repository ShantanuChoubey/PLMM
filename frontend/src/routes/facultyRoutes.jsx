import { Navigate } from 'react-router-dom'
import FacultyDashboard from '@/pages/faculty/Dashboard'
import FacultyNotifications from '@/pages/faculty/Notifications'
import FacultyProfile from '@/pages/faculty/Profile'
import FacultyResources from '@/pages/faculty/Resources'
import FacultySessions from '@/pages/faculty/Sessions'
import ModulePlaceholder from '@/pages/dashboard/ModulePlaceholder'

function placeholder(title, description) {
  return <ModulePlaceholder title={title} description={description} />
}

export const facultyRoutes = [
  { index: true, element: <Navigate to="dashboard" replace /> },
  { path: 'dashboard', element: <FacultyDashboard /> },
  { path: 'profile', element: <FacultyProfile /> },
  { path: 'sessions', element: <FacultySessions /> },
  { path: 'resources', element: <FacultyResources /> },
  { path: 'notifications', element: <FacultyNotifications /> },
  { path: 'mentees', element: placeholder('Mentees', 'View assigned mentees.') },
  { path: 'reviews', element: placeholder('Reviews', 'View mentee feedback.') },
  { path: 'settings', element: placeholder('Settings', 'Configure your account settings.') },
]
