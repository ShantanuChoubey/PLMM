import { PageContainer } from '@/components/layout/PageContainer'
import { PresetEmptyState } from '@/components/common/emptyStates'
import { QueryErrorState } from '@/components/common/QueryErrorState'
import { CardLoader } from '@/components/common/CardLoader'
import { RecommendationCard } from '@/components/learner/RecommendationCard'
import { useRecommendations } from '@/hooks/api/useRecommendations'

export default function LearnerRecommendationsPage() {
  const { data, isLoading, isError, error, refetch } = useRecommendations()
  const recommendations = data?.data ?? []

  return (
    <PageContainer title="AI Recommendations" description="Personalized mentor and learning suggestions based on your goals.">
      {isLoading ? (
        <CardLoader count={6} />
      ) : isError ? (
        <QueryErrorState error={error} onRetry={refetch} />
      ) : recommendations.length === 0 ? (
        <PresetEmptyState type="recommendations" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recommendations.map((item) => <RecommendationCard key={item.id} recommendation={item} />)}
        </div>
      )}
    </PageContainer>
  )
}
