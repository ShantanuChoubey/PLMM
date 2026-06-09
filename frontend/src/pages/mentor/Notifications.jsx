import { PageContainer } from '@/components/layout/PageContainer'
import { NotificationsList } from '@/components/shared/NotificationsList'
import { MENTOR_NOTIFICATIONS } from '@/mock/facultyData'

export default function MentorNotificationsPage() {
  return (
    <PageContainer title="Notifications" description="Stay updated on sessions, reviews, and mentee activity.">
      <NotificationsList initialNotifications={MENTOR_NOTIFICATIONS} />
    </PageContainer>
  )
}
