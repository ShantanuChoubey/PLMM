import { apiGet } from '@/services/mockClient'
import { LEARNER_RECOMMENDATIONS } from '@/mock/recommendationData'

export const aiService = {
  getRecommendations(params = {}) {
    return apiGet('/ai/recommendations', {
      params,
      mockHandler: () => ({ data: LEARNER_RECOMMENDATIONS }),
    })
  },
}
