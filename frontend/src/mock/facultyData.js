export const FACULTY_PROFILE = {
  id: 'faculty-1',
  name: 'Dr. Emily Watson',
  email: 'emily.watson@university.edu',
  designation: 'Associate Professor',
  department: 'Computer Science',
  expertise: ['Machine Learning', 'Academic Research', 'Curriculum Design', 'Student Mentorship'],
  bio: 'Faculty mentor with 15 years of experience guiding students through research projects, capstone development, and academic career planning.',
}

export const FACULTY_DASHBOARD_METRICS = {
  sessionsSupervised: 24,
  groupsMonitored: 6,
  resourcesPublished: 12,
  studentEngagement: 87,
}

export const FACULTY_RECENT_ACTIVITY = [
  { id: 'fa1', title: 'Session supervised', description: 'ML capstone review — Marcus & Priya', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString() },
  { id: 'fa2', title: 'Resource published', description: 'Academic Research Methods guide uploaded', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString() },
  { id: 'fa3', title: 'Group monitored', description: 'Algorithms Study Circle activity report', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString() },
  { id: 'fa4', title: 'Engagement alert', description: '3 students below participation threshold', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString() },
]

export const FACULTY_ENGAGEMENT_CHART = [
  { month: 'Jan', engagement: 72, sessions: 14 },
  { month: 'Feb', engagement: 78, sessions: 16 },
  { month: 'Mar', engagement: 81, sessions: 18 },
  { month: 'Apr', engagement: 84, sessions: 20 },
  { month: 'May', engagement: 86, sessions: 22 },
  { month: 'Jun', engagement: 87, sessions: 24 },
]

export const FACULTY_SESSIONS = [
  { id: 'fs1', title: 'ML Capstone Review', mentor: 'Marcus Johnson', students: 4, status: 'scheduled', date: '2026-06-14', participation: 92 },
  { id: 'fs2', title: 'Research Methods Workshop', mentor: 'Sarah Chen', students: 12, status: 'completed', date: '2026-06-08', participation: 88 },
  { id: 'fs3', title: 'Peer Mentoring Orientation', mentor: 'Elena Rodriguez', students: 8, status: 'in_progress', date: '2026-06-12', participation: 75 },
  { id: 'fs4', title: 'Thesis Proposal Review', mentor: 'Aisha Patel', students: 3, status: 'scheduled', date: '2026-06-18', participation: 100 },
  { id: 'fs5', title: 'Algorithms Study Session', mentor: 'James Wilson', students: 6, status: 'completed', date: '2026-06-01', participation: 83 },
]

export const MENTOR_NOTIFICATIONS = [
  { id: 'mn1', title: 'New session request', message: 'Alex Parker requested a React session.', type: 'session', read: false, timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
  { id: 'mn2', title: 'New review received', message: 'Priya Sharma left a 5-star review.', type: 'review', read: false, timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString() },
  { id: 'mn3', title: 'Session reminder', message: 'Upcoming session with Noah Taylor tomorrow.', type: 'session', read: true, timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString() },
  { id: 'mn4', title: 'Resource downloaded', message: 'React Architecture Guide downloaded 5 times.', type: 'resource', read: true, timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
]

export const FACULTY_NOTIFICATIONS = [
  { id: 'fn1', title: 'Session update', message: 'ML Capstone Review session confirmed.', type: 'session', read: false, timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString() },
  { id: 'fn2', title: 'Engagement alert', message: '3 students below participation threshold.', type: 'alert', read: false, timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString() },
  { id: 'fn3', title: 'Group activity', message: 'Algorithms Study Circle submitted weekly report.', type: 'group', read: true, timestamp: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString() },
  { id: 'fn4', title: 'Resource published', message: 'Capstone Project Rubric is now live.', type: 'resource', read: true, timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString() },
]
