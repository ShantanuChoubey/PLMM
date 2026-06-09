import { apiGet } from '@/services/mockClient'
import { MENTOR_REVIEWS, MENTOR_REVIEW_SUMMARY, REVIEW_TREND } from '@/mock/reviewData'

export const reviewService = {
  getMentorReviews() {
    return apiGet('/reviews/mentor', {
      mockHandler: () => ({
        data: MENTOR_REVIEWS,
        meta: { summary: MENTOR_REVIEW_SUMMARY, trend: REVIEW_TREND },
      }),
    })
  },
}
