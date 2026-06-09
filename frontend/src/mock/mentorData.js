export const DEPARTMENTS = [
  'Computer Science',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Business',
  'Mathematics',
]

export const SKILLS = [
  'React',
  'Python',
  'Data Structures',
  'Machine Learning',
  'System Design',
  'JavaScript',
  'Algorithms',
  'UI/UX',
  'Cloud Computing',
  'Statistics',
]

export const MENTORS = [
  {
    id: 'm1',
    name: 'Sarah Chen',
    avatar: null,
    department: 'Computer Science',
    skills: ['React', 'JavaScript', 'System Design'],
    experience: '5 years',
    rating: 4.9,
    reviewCount: 42,
    availability: 'available',
    bio: 'Senior software engineer passionate about helping learners build production-ready frontend skills and strong engineering fundamentals.',
    reviews: [
      { id: 'r1', author: 'Alex P.', rating: 5, comment: 'Incredibly helpful with React architecture.' },
      { id: 'r2', author: 'Jamie L.', rating: 5, comment: 'Clear explanations and great session structure.' },
    ],
    stats: { sessions: 128, mentees: 34, responseRate: '98%' },
    slots: [
      { day: 'Monday', time: '10:00 AM', status: 'available' },
      { day: 'Wednesday', time: '2:00 PM', status: 'available' },
      { day: 'Friday', time: '4:00 PM', status: 'limited' },
    ],
  },
  {
    id: 'm2',
    name: 'Marcus Johnson',
    avatar: null,
    department: 'Computer Science',
    skills: ['Python', 'Machine Learning', 'Statistics'],
    experience: '7 years',
    rating: 4.8,
    reviewCount: 56,
    availability: 'available',
    bio: 'ML engineer focused on practical data science workflows, model evaluation, and career guidance for aspiring AI practitioners.',
    reviews: [
      { id: 'r3', author: 'Priya S.', rating: 5, comment: 'Excellent mentor for ML project planning.' },
    ],
    stats: { sessions: 210, mentees: 48, responseRate: '96%' },
    slots: [
      { day: 'Tuesday', time: '11:00 AM', status: 'available' },
      { day: 'Thursday', time: '3:00 PM', status: 'available' },
    ],
  },
  {
    id: 'm3',
    name: 'Elena Rodriguez',
    avatar: null,
    department: 'Electrical Engineering',
    skills: ['Algorithms', 'Data Structures', 'Cloud Computing'],
    experience: '4 years',
    rating: 4.7,
    reviewCount: 31,
    availability: 'busy',
    bio: 'Backend and systems mentor helping learners strengthen problem-solving skills and technical interview readiness.',
    reviews: [
      { id: 'r4', author: 'Chris M.', rating: 4, comment: 'Great DSA practice sessions.' },
    ],
    stats: { sessions: 95, mentees: 22, responseRate: '94%' },
    slots: [
      { day: 'Monday', time: '5:00 PM', status: 'booked' },
      { day: 'Saturday', time: '9:00 AM', status: 'available' },
    ],
  },
  {
    id: 'm4',
    name: 'David Kim',
    avatar: null,
    department: 'Business',
    skills: ['UI/UX', 'JavaScript', 'React'],
    experience: '6 years',
    rating: 4.6,
    reviewCount: 28,
    availability: 'available',
    bio: 'Product-minded engineer mentoring learners on user-centered design, frontend polish, and portfolio development.',
    reviews: [],
    stats: { sessions: 76, mentees: 19, responseRate: '92%' },
    slots: [
      { day: 'Wednesday', time: '1:00 PM', status: 'available' },
      { day: 'Friday', time: '10:00 AM', status: 'available' },
    ],
  },
  {
    id: 'm5',
    name: 'Aisha Patel',
    avatar: null,
    department: 'Mathematics',
    skills: ['Statistics', 'Python', 'Algorithms'],
    experience: '8 years',
    rating: 4.9,
    reviewCount: 63,
    availability: 'available',
    bio: 'Quantitative mentor specializing in statistics, analytical thinking, and research-oriented learning paths.',
    reviews: [
      { id: 'r5', author: 'Noah T.', rating: 5, comment: 'Helped me finally understand probability.' },
    ],
    stats: { sessions: 184, mentees: 41, responseRate: '99%' },
    slots: [
      { day: 'Tuesday', time: '4:00 PM', status: 'available' },
      { day: 'Thursday', time: '11:00 AM', status: 'limited' },
    ],
  },
  {
    id: 'm6',
    name: 'James Wilson',
    avatar: null,
    department: 'Mechanical Engineering',
    skills: ['System Design', 'Cloud Computing', 'Python'],
    experience: '9 years',
    rating: 4.5,
    reviewCount: 37,
    availability: 'offline',
    bio: 'Infrastructure and systems design mentor guiding learners through scalable architecture and engineering leadership.',
    reviews: [],
    stats: { sessions: 142, mentees: 29, responseRate: '90%' },
    slots: [],
  },
]

export function getMentorById(id) {
  return MENTORS.find((mentor) => mentor.id === id) ?? null
}

// Mentor module (logged-in peer mentor account) — separate from learner directory listings
export const MENTOR_PROFILE = {
  id: 'mentor-account-1',
  name: 'Sarah Chen',
  email: 'sarah.chen@university.edu',
  bio: 'Senior software engineer passionate about helping learners build production-ready frontend skills and strong engineering fundamentals.',
  skills: ['React', 'JavaScript', 'System Design', 'TypeScript', 'Node.js'],
  experience: '5+ years in full-stack development',
  education: 'M.S. Computer Science, State University',
  availabilitySummary: 'Mon, Wed, Fri · 5:00 PM – 8:00 PM EST',
  achievements: [
    { id: 'a1', title: 'Top Rated Mentor', description: 'Maintained 4.8+ rating for 6 months' },
    { id: 'a2', title: '100 Sessions', description: 'Completed 100+ mentoring sessions' },
    { id: 'a3', title: 'Consistency Award', description: '95%+ session attendance rate' },
  ],
}

export const MENTOR_DASHBOARD_METRICS = {
  pendingRequests: 3,
  completedSessions: 128,
  averageRating: 4.9,
  studentsMentored: 34,
  resourcesShared: 18,
}

export const MENTOR_RECENT_ACTIVITY = [
  { id: 'ma1', title: 'Session completed', description: 'React architecture review with Alex P.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString() },
  { id: 'ma2', title: 'New session request', description: 'Jamie L. requested ML project scoping', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString() },
  { id: 'ma3', title: 'Resource shared', description: 'Uploaded System Design primer PDF', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
  { id: 'ma4', title: 'New review', description: '5-star review from Priya S.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString() },
]

export const MENTOR_ACTIVITY_CHART = [
  { week: 'W1', sessions: 4, reviews: 2 },
  { week: 'W2', sessions: 6, reviews: 3 },
  { week: 'W3', sessions: 5, reviews: 4 },
  { week: 'W4', sessions: 8, reviews: 5 },
  { week: 'W5', sessions: 7, reviews: 3 },
  { week: 'W6', sessions: 9, reviews: 6 },
]

export const MENTOR_SESSION_TREND = [
  { month: 'Jan', pending: 2, accepted: 8, completed: 12 },
  { month: 'Feb', pending: 3, accepted: 10, completed: 14 },
  { month: 'Mar', pending: 2, accepted: 12, completed: 18 },
  { month: 'Apr', pending: 4, accepted: 11, completed: 20 },
  { month: 'May', pending: 3, accepted: 14, completed: 22 },
  { month: 'Jun', pending: 3, accepted: 9, completed: 16 },
]
