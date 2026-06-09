import { PageContainer } from '@/components/layout/PageContainer'
import { ReviewCard } from '@/components/shared/ReviewCard'
import { RatingSummary } from '@/components/mentor/RatingSummary'
import { ReviewStats } from '@/components/mentor/ReviewStats'
import { MENTOR_REVIEWS, MENTOR_REVIEW_SUMMARY, REVIEW_TREND } from '@/mock/reviewData'

export default function MentorReviewsPage() {
  return (
    <PageContainer title="Reviews" description="View feedback and ratings from your mentees.">
      <ReviewStats summary={MENTOR_REVIEW_SUMMARY} trend={REVIEW_TREND} />
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <RatingSummary summary={MENTOR_REVIEW_SUMMARY} />
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Recent Reviews</h2>
          {MENTOR_REVIEWS.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </div>
    </PageContainer>
  )
}
