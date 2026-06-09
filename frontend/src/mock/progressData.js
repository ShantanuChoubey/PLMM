export const SKILLS_PROGRESS = [
  { skill: 'React', progress: 82, target: 100 },
  { skill: 'JavaScript', progress: 75, target: 100 },
  { skill: 'System Design', progress: 45, target: 100 },
  { skill: 'Machine Learning', progress: 38, target: 100 },
  { skill: 'Algorithms', progress: 68, target: 100 },
]

export const LEARNING_GOALS = [
  { id: 'g1', title: 'Master React patterns', progress: 82, status: 'in_progress' },
  { id: 'g2', title: 'Complete ML capstone', progress: 38, status: 'in_progress' },
  { id: 'g3', title: 'Interview preparation', progress: 55, status: 'in_progress' },
]

export const ACHIEVEMENTS = [
  {
    id: 'ach1',
    title: 'First Session',
    description: 'Completed your first mentoring session',
    earnedAt: '2026-03-10',
    icon: 'session',
  },
  {
    id: 'ach2',
    title: 'Consistency Streak',
    description: 'Attended 5 sessions in a row',
    earnedAt: '2026-04-22',
    icon: 'streak',
  },
  {
    id: 'ach3',
    title: 'Skill Builder',
    description: 'Reached 75% on a learning goal',
    earnedAt: '2026-05-18',
    icon: 'skill',
  },
]

export const MILESTONES = [
  { id: 'ms1', title: 'Complete 10 sessions', current: 8, target: 10 },
  { id: 'ms2', title: 'Connect with 5 mentors', current: 3, target: 5 },
  { id: 'ms3', title: 'Finish 3 learning goals', current: 0, target: 3 },
]

export const PROGRESS_TREND = [
  { month: 'Jan', progress: 22, sessions: 1 },
  { month: 'Feb', progress: 35, sessions: 2 },
  { month: 'Mar', progress: 48, sessions: 4 },
  { month: 'Apr', progress: 58, sessions: 6 },
  { month: 'May', progress: 68, sessions: 7 },
  { month: 'Jun', progress: 78, sessions: 8 },
]

export const SKILL_COMPLETION = [
  { name: 'React', value: 82 },
  { name: 'JavaScript', value: 75 },
  { name: 'Algorithms', value: 68 },
  { name: 'System Design', value: 45 },
  { name: 'ML', value: 38 },
]

export const PROGRESS_SUMMARY = {
  completedSessions: 8,
  overallProgress: 78,
  activeGoals: 3,
  achievementsEarned: 3,
}
