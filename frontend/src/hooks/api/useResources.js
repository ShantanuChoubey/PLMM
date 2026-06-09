import { useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/constants/queryKeys'
import { resourceService } from '@/services/resourceService'
import { useApiMutation, useApiQuery } from '@/hooks/api/useQueryHelpers'
import { appToast } from '@/utils/toast'

export function useHubResources(params = {}, options = {}) {
  return useApiQuery(queryKeys.resources.list(params), () => resourceService.getHubResources(params), options)
}

export function useRecommendedResources(options = {}) {
  return useApiQuery(queryKeys.resources.recommended, () => resourceService.getRecommended(), options)
}

export function useBookmarkedResources(options = {}) {
  return useApiQuery(queryKeys.resources.bookmarks, () => resourceService.getBookmarks(), options)
}

export function useMentorResources(options = {}) {
  return useApiQuery(['resources', 'mentor'], () => resourceService.getMentorResources(), options)
}

export function useFacultyResources(options = {}) {
  return useApiQuery(['resources', 'faculty'], () => resourceService.getFacultyResources(), options)
}

export function useAdminResources(params = {}, options = {}) {
  return useApiQuery(queryKeys.admin.resources(params), () => resourceService.getAdminResources(params), options)
}

export function useUploadResource() {
  const queryClient = useQueryClient()
  return useApiMutation(resourceService.uploadResource, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.resources.all })
      appToast.success('Resource uploaded successfully.')
    },
  })
}

export function useToggleBookmark() {
  const queryClient = useQueryClient()
  return useApiMutation(resourceService.toggleBookmark, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.resources.bookmarks })
      queryClient.invalidateQueries({ queryKey: queryKeys.resources.all })
    },
  })
}
