import { useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/constants/queryKeys'
import { availabilityService } from '@/services/availabilityService'
import { useApiMutation, useApiQuery } from '@/hooks/api/useQueryHelpers'
import { appToast } from '@/utils/toast'

export function useAvailability(options = {}) {
  return useApiQuery(queryKeys.availability.slots, () => availabilityService.getSlots(), options)
}

export function useCreateAvailabilitySlot() {
  const queryClient = useQueryClient()
  return useApiMutation(availabilityService.createSlot, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.availability.all })
      appToast.success('Availability slot added.')
    },
  })
}

export function useUpdateAvailabilitySlot() {
  const queryClient = useQueryClient()
  return useApiMutation(({ id, ...payload }) => availabilityService.updateSlot(id, payload), {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.availability.all })
      appToast.success('Availability updated.')
    },
  })
}

export function useDeleteAvailabilitySlot() {
  const queryClient = useQueryClient()
  return useApiMutation(availabilityService.deleteSlot, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.availability.all })
      appToast.success('Slot removed.')
    },
  })
}
