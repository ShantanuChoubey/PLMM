export const LEARNER_PROFILE = {
  id: 'learner-1',
  name: 'Demo User',
  email: 'demo@example.com',
  avatar: null,
  bio: 'Computer Science student focused on full-stack development and machine learning fundamentals.',
  university: 'State University',
  department: 'Computer Science',
  year: 'Junior',
  gpa: '3.7',
  learningGoals: [
    'Master React and modern frontend patterns',
    'Build portfolio-ready capstone projects',
    'Prepare for technical interviews',
  ],
  skillsNeeded: ['React', 'System Design', 'Machine Learning', 'Algorithms'],
  availability: {
    days: ['Monday', 'Wednesday', 'Friday'],
    timeRange: '2:00 PM – 6:00 PM',
    timezone: 'EST',
  },
}

export const DASHBOARD_METRICS = {
  upcomingSessions: 2,
  activeMentors: 3,
  studyGroupsJoined: 2,
  learningProgress: 78,
}

export const RECENT_ACTIVITY = [
  {
    id: 'a1',
    type: 'session',
    title: 'Completed session with Sarah Chen',
    description: 'React component architecture review',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    id: 'a2',
    type: 'resource',
    title: 'New resource added',
    description: 'System Design primer shared by Marcus Johnson',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
  },
  {
    id: 'a3',
    type: 'group',
    title: 'Study group activity',
    description: 'Algorithms Study Circle scheduled a review session',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
  },
  {
    id: 'a4',
    type: 'recommendation',
    title: 'New mentor match',
    description: 'Aisha Patel recommended based on your statistics goals',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
]

export const STUDY_GROUP_PREVIEW = {
  id: 'sg1',
  name: 'Algorithms Study Circle',
  members: 8,
  nextSession: 'Thursday, 4:00 PM',
  topic: 'Graph algorithms practice',
}
