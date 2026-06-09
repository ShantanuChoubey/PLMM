import { Navigate } from 'react-router-dom'
import FacultyDashboard from '@/pages/faculty/Dashboard'
import FacultyNotifications from '@/pages/faculty/Notifications'
import FacultyProfile from '@/pages/faculty/Profile'
import FacultySessions from '@/pages/faculty/Sessions'
import GroupsPage from '@/pages/hub/Groups'
import ResourcesHubPage from '@/pages/hub/Resources'
import ModulePlaceholder from '@/pages/dashboard/ModulePlaceholder'
import { FACULTY_ROUTES } from '@/constants/routes'

function placeholder(title, description) {
  return <ModulePlaceholder title={title} description={description} />
}

export const facultyRoutes = [
  { index: true, element: <Navigate to="dashboard" replace /> },
  { path: 'dashboard', element: <FacultyDashboard /> },
  { path: 'profile', element: <FacultyProfile /> },
  { path: 'sessions', element: <FacultySessions /> },
  { path: 'groups', element: <GroupsPage groupsBasePath={FACULTY_ROUTES.GROUPS} title="Study Groups" description="Monitor student study groups and community engagement." /> },
  { path: 'resources', element: <ResourcesHubPage title="Resource Hub" description="Publish and curate educational resources for learners." /> },
  { path: 'notifications', element: <FacultyNotifications /> },
  { path: 'mentees', element: placeholder('Mentees', 'View assigned mentees.') },
  { path: 'reviews', element: placeholder('Reviews', 'View mentee feedback.') },
  { path: 'settings', element: placeholder('Settings', 'Configure your account settings.') },
]
