import { queryKeys } from '@/constants/queryKeys'
import { aiService } from '@/services/aiService'
import { useApiQuery } from '@/hooks/api/useQueryHelpers'

export function useRecommendations(params = {}, options = {}) {
  return useApiQuery(queryKeys.recommendations.list(params), () => aiService.getRecommendations(params), options)
}
