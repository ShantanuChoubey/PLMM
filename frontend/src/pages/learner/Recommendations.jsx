import { Sparkles } from 'lucide-react'
import { PageContainer } from '@/components/layout/PageContainer'
import { EmptyState } from '@/components/common/EmptyState'
import { RecommendationCard } from '@/components/learner/RecommendationCard'
import { RecommendationCardSkeleton } from '@/components/learner/skeletons/LearnerSkeletons'
import { useMockLoading } from '@/hooks/useMockLoading'
import { LEARNER_RECOMMENDATIONS } from '@/mock/recommendationData'

export default function LearnerRecommendationsPage() {
  const loading = useMockLoading(500)
  const recommendations = LEARNER_RECOMMENDATIONS

  return (
    <PageContainer
      title="AI Recommendations"
      description="Personalized mentor matches based on your goals, skills, and availability."
    >
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <RecommendationCardSkeleton key={i} />
          ))}
        </div>
      ) : recommendations.length === 0 ? (
        <EmptyState
          icon={Sparkles}
          title="No recommendations yet"
          description="Complete your profile and learning goals to receive personalized mentor matches."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {recommendations.map((item) => (
            <RecommendationCard key={item.id} recommendation={item} />
          ))}
        </div>
      )}
    </PageContainer>
  )
}
