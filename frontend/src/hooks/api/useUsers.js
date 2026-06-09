import { useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/constants/queryKeys'
import { userService } from '@/services/userService'
import { useApiMutation, useApiQuery } from '@/hooks/api/useQueryHelpers'
import { appToast } from '@/utils/toast'

export function useLearnerDashboard(options = {}) {
  return useApiQuery(queryKeys.learner.dashboard, () => userService.getLearnerDashboard(), options)
}

export function useLearnerProfile(options = {}) {
  return useApiQuery(queryKeys.users.profile, () => userService.getLearnerProfile(), options)
}

export function useLearnerProgress(options = {}) {
  return useApiQuery(queryKeys.learner.progress, () => userService.getLearnerProgress(), options)
}

export function useFacultyDashboard(options = {}) {
  return useApiQuery(queryKeys.faculty.dashboard, () => userService.getFacultyDashboard(), options)
}

export function useFacultyProfile(options = {}) {
  return useApiQuery(queryKeys.faculty.profile, () => userService.getFacultyProfile(), options)
}

export function useAdminUsers(params = {}, options = {}) {
  return useApiQuery(queryKeys.admin.users(params), () => userService.getAdminUsers(params), options)
}

export function useUpdateUserStatus() {
  const queryClient = useQueryClient()
  return useApiMutation(({ id, status }) => userService.updateUserStatus(id, status), {
    onSuccess: (_, { status }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all })
      appToast.success(`User ${status === 'active' ? 'activated' : status} (mock).`)
    },
  })
}

export function useDeleteUser() {
  const queryClient = useQueryClient()
  return useApiMutation(userService.deleteUser, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all })
      appToast.success('User deleted (mock).')
    },
  })
}
