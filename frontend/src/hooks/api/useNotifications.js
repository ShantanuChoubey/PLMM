import { useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/constants/queryKeys'
import { notificationService } from '@/services/notificationService'
import { useApiMutation, useApiQuery } from '@/hooks/api/useQueryHelpers'

export function useLearnerNotifications(options = {}) {
  return useApiQuery(queryKeys.notifications.list({ role: 'learner' }), () => notificationService.getLearnerNotifications(), options)
}

export function useMentorNotifications(options = {}) {
  return useApiQuery(queryKeys.notifications.list({ role: 'mentor' }), () => notificationService.getMentorNotifications(), options)
}

export function useFacultyNotifications(options = {}) {
  return useApiQuery(queryKeys.notifications.list({ role: 'faculty' }), () => notificationService.getFacultyNotifications(), options)
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient()
  return useApiMutation(notificationService.markAsRead, {
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all }),
  })
}
