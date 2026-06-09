export const ADMIN_KPIS = {
  totalUsers: 1248,
  activeLearners: 892,
  activeMentors: 186,
  facultyMentors: 42,
  totalSessions: 342,
  completedSessions: 287,
  activeGroups: 48,
  resourcesUploaded: 356,
}

export const PLATFORM_OVERVIEW = {
  weeklyActiveUsers: 78,
  sessionCompletionRate: 84,
  mentorSatisfaction: 4.6,
  resourceEngagement: 62,
}

export const ADMIN_RECENT_ACTIVITY = [
  { id: 'aa1', title: 'New user registered', description: 'Jamie Lee joined as Learner', timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
  { id: 'aa2', title: 'Session completed', description: 'React Hooks mentoring session with Sarah Chen', timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString() },
  { id: 'aa3', title: 'Resource uploaded', description: 'DSA Patterns Guide by Elena Rodriguez', timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString() },
  { id: 'aa4', title: 'Group created', description: 'Cloud Native Builders study group', timestamp: new Date(Date.now() - 1000 * 60 * 360).toISOString() },
  { id: 'aa5', title: 'Mentor approved', description: 'Marcus Johnson approved as Peer Mentor', timestamp: new Date(Date.now() - 1000 * 60 * 720).toISOString() },
]

export const TOP_MENTORS = [
  { id: 'm1', name: 'Sarah Chen', expertise: 'Frontend Development', rating: 4.9, sessions: 48, students: 32 },
  { id: 'm2', name: 'Elena Rodriguez', expertise: 'DSA', rating: 4.8, sessions: 42, students: 28 },
  { id: 'm3', name: 'James Wilson', expertise: 'System Design', rating: 4.7, sessions: 35, students: 22 },
]

export const POPULAR_GROUPS = [
  { id: 'g1', name: 'React Masters', members: 24, category: 'Frontend Development', activityScore: 85 },
  { id: 'g2', name: 'Algorithms Study Circle', members: 32, category: 'DSA', activityScore: 92 },
  { id: 'g3', name: 'Interview Prep Squad', members: 28, category: 'Interview Preparation', activityScore: 88 },
]

export const RECENT_ADMIN_RESOURCES = [
  { id: 'hub-1', title: 'React Hooks Complete Guide', type: 'PDF', uploader: 'Sarah Chen', views: 420 },
  { id: 'hub-2', title: 'Binary Search Patterns', type: 'Notes', uploader: 'Elena Rodriguez', views: 310 },
  { id: 'hub-3', title: 'Microservices Architecture', type: 'Article', uploader: 'James Wilson', views: 580 },
]

export const GROWTH_METRICS = [
  { month: 'Jan', users: 820, sessions: 180, resources: 210 },
  { month: 'Feb', users: 890, sessions: 210, resources: 245 },
  { month: 'Mar', users: 960, sessions: 245, resources: 268 },
  { month: 'Apr', users: 1040, sessions: 275, resources: 290 },
  { month: 'May', users: 1150, sessions: 310, resources: 320 },
  { month: 'Jun', users: 1248, sessions: 342, resources: 356 },
]
