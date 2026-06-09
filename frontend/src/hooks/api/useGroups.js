import { useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/constants/queryKeys'
import { groupService } from '@/services/groupService'
import { useApiMutation, useApiQuery } from '@/hooks/api/useQueryHelpers'
import { appToast } from '@/utils/toast'

export function useGroups(params = {}, options = {}) {
  return useApiQuery(queryKeys.groups.list(params), () => groupService.getGroups(params), options)
}

export function useGroup(id, options = {}) {
  return useApiQuery(queryKeys.groups.detail(id), () => groupService.getGroupById(id), {
    enabled: Boolean(id),
    ...options,
  })
}

export function useJoinedGroups(options = {}) {
  return useApiQuery(['groups', 'joined'], () => groupService.getJoinedGroups(), options)
}

export function useRecentGroupActivity(options = {}) {
  return useApiQuery(['groups', 'recent-activity'], () => groupService.getRecentActivity(), options)
}

export function useAdminGroups(params = {}, options = {}) {
  return useApiQuery(queryKeys.admin.groups(params), () => groupService.getAdminGroups(params), options)
}

export function useCreateGroup() {
  const queryClient = useQueryClient()
  return useApiMutation(groupService.createGroup, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.groups.all })
      appToast.success('Group created successfully.')
    },
  })
}

export function useJoinGroup() {
  const queryClient = useQueryClient()
  return useApiMutation(groupService.joinGroup, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.groups.all })
      appToast.success('Joined group.')
    },
  })
}

export function useLeaveGroup() {
  const queryClient = useQueryClient()
  return useApiMutation(groupService.leaveGroup, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.groups.all })
      appToast.success('Left group.')
    },
  })
}
