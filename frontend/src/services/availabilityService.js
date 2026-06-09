import { apiGet, apiPost, apiPatch, apiDelete } from '@/services/mockClient'
import { AVAILABILITY_SUMMARY, INITIAL_AVAILABILITY_SLOTS, WEEK_DAYS } from '@/mock/availabilityData'

export const availabilityService = {
  getSlots() {
    return apiGet('/availability', {
      mockHandler: () => ({
        data: INITIAL_AVAILABILITY_SLOTS,
        meta: { summary: AVAILABILITY_SUMMARY, weekDays: WEEK_DAYS },
      }),
    })
  },

  createSlot(payload) {
    return apiPost('/availability', {
      data: payload,
      mockHandler: () => ({ data: { id: crypto.randomUUID(), ...payload } }),
    })
  },

  updateSlot(id, payload) {
    return apiPatch(`/availability/${id}`, {
      data: payload,
      mockHandler: () => ({ data: { id, ...payload } }),
    })
  },

  deleteSlot(id) {
    return apiDelete(`/availability/${id}`, {
      mockHandler: () => ({ data: { id } }),
    })
  },
}
