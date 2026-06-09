import { lazy } from 'react'

// Public
export const Home = lazy(() => import('@/pages/public/Home'))
export const About = lazy(() => import('@/pages/public/About'))
export const Login = lazy(() => import('@/pages/public/Login'))
export const Register = lazy(() => import('@/pages/public/Register'))
export const NotFound = lazy(() => import('@/pages/public/NotFound'))

// Learner
export const LearnerDashboard = lazy(() => import('@/pages/learner/Dashboard'))
export const LearnerProfile = lazy(() => import('@/pages/learner/Profile'))
export const LearnerMentors = lazy(() => import('@/pages/learner/Mentors'))
export const LearnerMentorDetails = lazy(() => import('@/pages/learner/MentorDetails'))
export const LearnerRecommendations = lazy(() => import('@/pages/learner/Recommendations'))
export const LearnerSessions = lazy(() => import('@/pages/learner/Sessions'))
export const LearnerProgress = lazy(() => import('@/pages/learner/Progress'))
export const LearnerNotifications = lazy(() => import('@/pages/learner/Notifications'))

// Hub
export const GroupsPage = lazy(() => import('@/pages/hub/Groups'))
export const GroupDetailsPage = lazy(() => import('@/pages/hub/GroupDetails'))
export const ResourcesHubPage = lazy(() => import('@/pages/hub/Resources'))

// Mentor
export const MentorDashboard = lazy(() => import('@/pages/mentor/Dashboard'))
export const MentorProfile = lazy(() => import('@/pages/mentor/Profile'))
export const MentorAvailability = lazy(() => import('@/pages/mentor/Availability'))
export const MentorSessions = lazy(() => import('@/pages/mentor/Sessions'))
export const MentorReviews = lazy(() => import('@/pages/mentor/Reviews'))
export const MentorResources = lazy(() => import('@/pages/mentor/Resources'))
export const MentorNotifications = lazy(() => import('@/pages/mentor/Notifications'))

// Faculty
export const FacultyDashboard = lazy(() => import('@/pages/faculty/Dashboard'))
export const FacultyProfile = lazy(() => import('@/pages/faculty/Profile'))
export const FacultySessions = lazy(() => import('@/pages/faculty/Sessions'))
export const FacultyResources = lazy(() => import('@/pages/faculty/Resources'))
export const FacultyNotifications = lazy(() => import('@/pages/faculty/Notifications'))

// Admin
export const AdminDashboard = lazy(() => import('@/pages/admin/Dashboard'))
export const AdminUsers = lazy(() => import('@/pages/admin/Users'))
export const AdminMentors = lazy(() => import('@/pages/admin/Mentors'))
export const AdminSessions = lazy(() => import('@/pages/admin/Sessions'))
export const AdminGroups = lazy(() => import('@/pages/admin/Groups'))
export const AdminResources = lazy(() => import('@/pages/admin/Resources'))
export const AdminAnalytics = lazy(() => import('@/pages/admin/Analytics'))
export const AdminAuditLogs = lazy(() => import('@/pages/admin/AuditLogs'))
export const AdminSettings = lazy(() => import('@/pages/admin/Settings'))

export const ModulePlaceholder = lazy(() => import('@/pages/dashboard/ModulePlaceholder'))
