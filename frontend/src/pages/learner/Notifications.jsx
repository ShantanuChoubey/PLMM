import { PageContainer } from '@/components/layout/PageContainer'
import { PresetEmptyState } from '@/components/common/emptyStates'
import { QueryErrorState } from '@/components/common/QueryErrorState'
import { SectionLoader } from '@/components/common/SectionLoader'
import { NotificationsList } from '@/components/shared/NotificationsList'
import { useLearnerNotifications } from '@/hooks/api/useNotifications'

export default function LearnerNotificationsPage() {
  const { data, isLoading, isError, error, refetch } = useLearnerNotifications()
  const notifications = data?.data ?? []

  return (
    <PageContainer title="Notifications" description="Stay updated on sessions, messages, and platform activity.">
      {isLoading ? (
        <SectionLoader label="Loading notifications..." />
      ) : isError ? (
        <QueryErrorState error={error} onRetry={refetch} />
      ) : notifications.length === 0 ? (
        <PresetEmptyState type="notifications" />
      ) : (
        <NotificationsList notifications={notifications} />
      )}
    </PageContainer>
  )
}
