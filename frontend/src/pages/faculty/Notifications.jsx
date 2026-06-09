import { PageContainer } from '@/components/layout/PageContainer'
import { NotificationsList } from '@/components/shared/NotificationsList'
import { FACULTY_NOTIFICATIONS } from '@/mock/facultyData'

export default function FacultyNotificationsPage() {
  return (
    <PageContainer title="Notifications" description="Stay updated on sessions, groups, and student engagement.">
      <NotificationsList initialNotifications={FACULTY_NOTIFICATIONS} />
    </PageContainer>
  )
}
