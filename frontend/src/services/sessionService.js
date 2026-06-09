import { apiGet } from '@/services/mockClient'
import { LEARNER_SESSIONS, SESSION_TABS } from '@/mock/sessionData'
import { MENTOR_SESSIONS, MENTOR_SESSION_TABS } from '@/mock/mentorSessionData'
import { FACULTY_SESSIONS } from '@/mock/facultyData'
import { ADMIN_SESSIONS, SESSION_STATUS_OPTIONS } from '@/mock/sessionsAdminData'

function filterByStatus(sessions, status) {
  if (!status || status === 'all') return sessions
  return sessions.filter((s) => s.status === status)
}

export const sessionService = {
  getLearnerSessions(params = {}) {
    return apiGet('/sessions/learner', {
      params,
      mockHandler: () => ({ data: filterByStatus(LEARNER_SESSIONS, params.status), meta: { tabs: SESSION_TABS } }),
    })
  },

  getMentorSessions(params = {}) {
    return apiGet('/sessions/mentor', {
      params,
      mockHandler: () => ({ data: filterByStatus(MENTOR_SESSIONS, params.status), meta: { tabs: MENTOR_SESSION_TABS } }),
    })
  },

  getFacultySessions(params = {}) {
    return apiGet('/sessions/faculty', {
      params,
      mockHandler: () => ({ data: FACULTY_SESSIONS }),
    })
  },

  getAdminSessions(params = {}) {
    let result = [...ADMIN_SESSIONS]
    if (params.search) {
      const q = params.search.toLowerCase()
      result = result.filter((s) => s.topic.toLowerCase().includes(q) || s.learner.toLowerCase().includes(q) || s.mentor.toLowerCase().includes(q))
    }
    if (params.status && params.status !== 'all') result = result.filter((s) => s.status === params.status)
    return apiGet('/admin/sessions', {
      params,
      mockHandler: () => ({ data: result, meta: { total: result.length, statusOptions: SESSION_STATUS_OPTIONS } }),
    })
  },
}
