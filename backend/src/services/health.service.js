import { MESSAGES } from '../constants/messages.js'

export const healthService = {
  getHealthStatus() {
    return {
      success: true,
      message: MESSAGES.SERVER_HEALTHY,
    }
  },
}
