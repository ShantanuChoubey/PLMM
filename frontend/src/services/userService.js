import { apiGet, apiPatch, apiDelete } from '@/services/mockClient'
import {
  LEARNER_PROFILE,
  DASHBOARD_METRICS,
  RECENT_ACTIVITY,
  STUDY_GROUP_PREVIEW,
} from '@/mock/learnerData'
import {
  SKILLS_PROGRESS,
  LEARNING_GOALS,
  ACHIEVEMENTS,
  MILESTONES,
  PROGRESS_SUMMARY,
  PROGRESS_TREND,
  SKILL_COMPLETION,
} from '@/mock/progressData'
import {
  FACULTY_PROFILE,
  FACULTY_DASHBOARD_METRICS,
  FACULTY_RECENT_ACTIVITY,
  FACULTY_ENGAGEMENT_CHART,
} from '@/mock/facultyData'
import { ADMIN_USERS, USER_STATUS_OPTIONS, getUserById } from '@/mock/usersData'

function filterUsers(users, params = {}) {
  let result = [...users]
  const { search, role, status, sort } = params

  if (search) {
    const q = search.toLowerCase()
    result = result.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
  }
  if (role && role !== 'all') result = result.filter((u) => u.role === role)
  if (status && status !== 'all') result = result.filter((u) => u.status === status)
  if (sort === 'name') result.sort((a, b) => a.name.localeCompare(b.name))
  if (sort === 'joinDate') result.sort((a, b) => new Date(b.joinDate) - new Date(a.joinDate))
  if (sort === 'lastActive') result.sort((a, b) => new Date(b.lastActive) - new Date(a.lastActive))

  return result
}

export const userService = {
  getLearnerProfile() {
    return apiGet('/users/profile', { mockHandler: () => ({ data: LEARNER_PROFILE }) })
  },

  getLearnerDashboard() {
    return apiGet('/users/learner/dashboard', {
      mockHandler: () => ({
        data: {
          metrics: DASHBOARD_METRICS,
          recentActivity: RECENT_ACTIVITY,
          studyGroupPreview: STUDY_GROUP_PREVIEW,
        },
      }),
    })
  },

  getLearnerProgress() {
    return apiGet('/users/learner/progress', {
      mockHandler: () => ({
        data: {
          skills: SKILLS_PROGRESS,
          goals: LEARNING_GOALS,
          achievements: ACHIEVEMENTS,
          milestones: MILESTONES,
          summary: PROGRESS_SUMMARY,
          trend: PROGRESS_TREND,
          skillCompletion: SKILL_COMPLETION,
        },
      }),
    })
  },

  getFacultyProfile() {
    return apiGet('/faculty/profile', { mockHandler: () => ({ data: FACULTY_PROFILE }) })
  },

  getFacultyDashboard() {
    return apiGet('/faculty/dashboard', {
      mockHandler: () => ({
        data: {
          metrics: FACULTY_DASHBOARD_METRICS,
          recentActivity: FACULTY_RECENT_ACTIVITY,
          engagementChart: FACULTY_ENGAGEMENT_CHART,
        },
      }),
    })
  },

  getAdminUsers(params = {}) {
    const filtered = filterUsers(ADMIN_USERS, params)
    return apiGet('/admin/users', {
      params,
      mockHandler: () => ({
        data: filtered,
        meta: { total: filtered.length, statusOptions: USER_STATUS_OPTIONS },
      }),
    })
  },

  getUserById(id) {
    return apiGet(`/admin/users/${id}`, {
      mockHandler: () => {
        const user = getUserById(id)
        if (!user) throw new Error('User not found')
        return { data: user }
      },
    })
  },

  updateUserStatus(id, status) {
    return apiPatch(`/admin/users/${id}/status`, {
      data: { status },
      mockHandler: () => ({ data: { id, status } }),
    })
  },

  deleteUser(id) {
    return apiDelete(`/admin/users/${id}`, {
      mockHandler: () => ({ data: { id } }),
    })
  },
}
