import { queryKeys } from '@/constants/queryKeys'
import { reviewService } from '@/services/reviewService'
import { useApiQuery } from '@/hooks/api/useQueryHelpers'

export function useMentorReviews(options = {}) {
  return useApiQuery(queryKeys.reviews.list({ role: 'mentor' }), () => reviewService.getMentorReviews(), options)
}
