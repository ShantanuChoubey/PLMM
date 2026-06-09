export const ADMIN_GROUPS = [
  { id: 'g1', name: 'React Masters', category: 'Frontend Development', members: 24, resources: 18, sessions: 12, activityScore: 85, growthTrend: '+12%', status: 'active', createdBy: 'Sarah Chen', flagged: false },
  { id: 'g2', name: 'Algorithms Study Circle', category: 'DSA', members: 32, resources: 22, sessions: 16, activityScore: 92, growthTrend: '+18%', status: 'active', createdBy: 'Elena Rodriguez', flagged: false },
  { id: 'g3', name: 'Python for Data Science', category: 'Python', members: 18, resources: 14, sessions: 8, activityScore: 68, growthTrend: '+8%', status: 'active', createdBy: 'Marcus Johnson', flagged: false },
  { id: 'g4', name: 'System Design Guild', category: 'System Design', members: 15, resources: 11, sessions: 6, activityScore: 72, growthTrend: '+5%', status: 'active', createdBy: 'James Wilson', flagged: false },
  { id: 'g5', name: 'Interview Prep Squad', category: 'Interview Preparation', members: 28, resources: 20, sessions: 14, activityScore: 88, growthTrend: '+15%', status: 'active', createdBy: 'Aisha Patel', flagged: false },
  { id: 'g6', name: 'Cloud Native Builders', category: 'Cloud Computing', members: 12, resources: 8, sessions: 4, activityScore: 45, growthTrend: '-2%', status: 'flagged', createdBy: 'David Kim', flagged: true },
  { id: 'g7', name: 'Java Backend Crew', category: 'Java', members: 20, resources: 10, sessions: 7, activityScore: 60, growthTrend: '+3%', status: 'active', createdBy: 'Chris Morgan', flagged: false },
  { id: 'g8', name: 'DBMS Deep Dive', category: 'DBMS', members: 14, resources: 9, sessions: 5, activityScore: 55, growthTrend: '+1%', status: 'active', createdBy: 'Priya Sharma', flagged: false },
]

export function getAdminGroupById(id) {
  return ADMIN_GROUPS.find((g) => g.id === id) ?? null
}
