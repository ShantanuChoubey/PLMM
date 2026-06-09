export const ADMIN_MENTORS = [
  {
    id: 'm1', name: 'Sarah Chen', email: 'sarah.chen@example.com', expertise: ['React', 'JavaScript', 'Frontend'],
    rating: 4.9, sessionsCompleted: 48, studentsMentored: 32, status: 'active',
    availability: 'Mon–Fri, 2–6 PM', reviews: 28, responseRate: 96,
    activity: [{ action: 'Completed session', date: '2026-06-09' }, { action: 'Uploaded resource', date: '2026-06-08' }],
  },
  {
    id: 'm2', name: 'Elena Rodriguez', email: 'elena.r@example.com', expertise: ['DSA', 'Algorithms', 'Interviews'],
    rating: 4.8, sessionsCompleted: 42, studentsMentored: 28, status: 'active',
    availability: 'Tue–Sat, 10 AM–2 PM', reviews: 24, responseRate: 94,
    activity: [{ action: 'Mock interview session', date: '2026-06-10' }, { action: 'Group session', date: '2026-06-07' }],
  },
  {
    id: 'm3', name: 'James Wilson', email: 'james.w@example.com', expertise: ['System Design', 'Architecture'],
    rating: 4.7, sessionsCompleted: 35, studentsMentored: 22, status: 'active',
    availability: 'Wed–Sun, 4–8 PM', reviews: 19, responseRate: 91,
    activity: [{ action: 'Architecture review', date: '2026-06-08' }],
  },
  {
    id: 'm4', name: 'Marcus Johnson', email: 'marcus.j@example.com', expertise: ['Python', 'Machine Learning'],
    rating: 0, sessionsCompleted: 0, studentsMentored: 0, status: 'pending',
    availability: 'Not set', reviews: 0, responseRate: 0,
    activity: [{ action: 'Applied for mentor role', date: '2026-05-20' }],
  },
  {
    id: 'm5', name: 'Aisha Patel', email: 'aisha.p@example.com', expertise: ['Interviews', 'Career', 'Behavioral'],
    rating: 4.6, sessionsCompleted: 28, studentsMentored: 18, status: 'active',
    availability: 'Mon–Thu, 6–9 PM', reviews: 15, responseRate: 89,
    activity: [{ action: 'STAR method workshop', date: '2026-06-06' }],
  },
  {
    id: 'm6', name: 'Chris Morgan', email: 'chris.m@example.com', expertise: ['Java', 'Spring Boot'],
    rating: 3.2, sessionsCompleted: 8, studentsMentored: 5, status: 'suspended',
    availability: 'Unavailable', reviews: 6, responseRate: 45,
    activity: [{ action: 'Account suspended', date: '2026-04-15' }],
  },
]

export function getMentorById(id) {
  return ADMIN_MENTORS.find((m) => m.id === id) ?? null
}
