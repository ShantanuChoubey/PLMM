import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getErrorMessage } from '@/utils/apiError'
import { appToast } from '@/utils/toast'

export function useApiQuery(queryKey, queryFn, options = {}) {
  return useQuery({
    queryKey,
    queryFn: async () => {
      const response = await queryFn()
      return response?.data !== undefined ? response : { data: response }
    },
    ...options,
  })
}

export function useApiMutation(mutationFn, options = {}) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn,
    onError: (error) => {
      appToast.error(getErrorMessage(error))
      options.onError?.(error)
    },
    onSuccess: (data, variables, context) => {
      if (options.invalidateKeys) {
        options.invalidateKeys.forEach((key) => queryClient.invalidateQueries({ queryKey: key }))
      }
      options.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export function extractData(result) {
  return result?.data?.data ?? result?.data ?? []
}

export function extractMeta(result) {
  return result?.data?.meta ?? result?.meta ?? {}
}
