import { apiGet, apiPatch } from '@/services/mockClient'
import { LEARNER_NOTIFICATIONS } from '@/mock/notificationData'
import { MENTOR_NOTIFICATIONS, FACULTY_NOTIFICATIONS } from '@/mock/facultyData'

export const notificationService = {
  getLearnerNotifications() {
    return apiGet('/notifications/learner', { mockHandler: () => ({ data: LEARNER_NOTIFICATIONS }) })
  },

  getMentorNotifications() {
    return apiGet('/notifications/mentor', { mockHandler: () => ({ data: MENTOR_NOTIFICATIONS }) })
  },

  getFacultyNotifications() {
    return apiGet('/notifications/faculty', { mockHandler: () => ({ data: FACULTY_NOTIFICATIONS }) })
  },

  markAsRead(id) {
    return apiPatch(`/notifications/${id}/read`, { mockHandler: () => ({ data: { id, read: true } }) })
  },

  markAllAsRead() {
    return apiPatch('/notifications/read-all', { mockHandler: () => ({ data: { success: true } }) })
  },
}
