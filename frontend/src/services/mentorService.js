import { apiGet } from '@/services/mockClient'
import {
  DEPARTMENTS,
  MENTORS,
  MENTOR_PROFILE,
  MENTOR_DASHBOARD_METRICS,
  MENTOR_RECENT_ACTIVITY,
  MENTOR_ACTIVITY_CHART,
  MENTOR_SESSION_TREND,
  SKILLS,
  getMentorById,
} from '@/mock/mentorData'

function filterMentors(mentors, params = {}) {
  let result = [...mentors]
  const { search, skill, department, availability, minRating, sort } = params

  if (search) {
    const q = search.toLowerCase()
    result = result.filter((m) => m.name.toLowerCase().includes(q) || m.department.toLowerCase().includes(q) || m.skills.some((s) => s.toLowerCase().includes(q)))
  }
  if (skill && skill !== 'all') result = result.filter((m) => m.skills.includes(skill))
  if (department && department !== 'all') result = result.filter((m) => m.department === department)
  if (availability && availability !== 'all') result = result.filter((m) => m.availability === availability)
  if (minRating && minRating !== 'all') result = result.filter((m) => m.rating >= Number(minRating))

  if (sort === 'rating-desc') result.sort((a, b) => b.rating - a.rating)
  else if (sort === 'rating-asc') result.sort((a, b) => a.rating - b.rating)
  else if (sort === 'name-asc') result.sort((a, b) => a.name.localeCompare(b.name))

  return result
}

export const mentorService = {
  getMentors(params = {}) {
    const filtered = filterMentors(MENTORS, params)
    return apiGet('/mentors', {
      params,
      mockHandler: () => ({ data: filtered, meta: { total: filtered.length } }),
    })
  },

  getMentorById(id) {
    return apiGet(`/mentors/${id}`, {
      mockHandler: () => {
        const mentor = getMentorById(id)
        if (!mentor) throw new Error('Mentor not found')
        return { data: mentor }
      },
    })
  },

  getProfile() {
    return apiGet('/mentors/profile', { mockHandler: () => ({ data: MENTOR_PROFILE }) })
  },

  getMeta() {
    return apiGet('/mentors/meta', { mockHandler: () => ({ data: { departments: DEPARTMENTS, skills: SKILLS } }) })
  },

  getDashboardMetrics() {
    return apiGet('/mentors/dashboard/metrics', {
      mockHandler: () => ({
        data: {
          metrics: MENTOR_DASHBOARD_METRICS,
          recentActivity: MENTOR_RECENT_ACTIVITY,
          activityChart: MENTOR_ACTIVITY_CHART,
          sessionTrend: MENTOR_SESSION_TREND,
        },
      }),
    })
  },
}
