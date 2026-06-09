import { Navigate } from 'react-router-dom'
import {
  FacultyDashboard,
  FacultyNotifications,
  FacultyProfile,
  FacultySessions,
  GroupsPage,
  ModulePlaceholder,
  ResourcesHubPage,
} from '@/routes/lazyPages'
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
