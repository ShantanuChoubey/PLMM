import { EmptyState } from '@/components/common/EmptyState'
import { EMPTY_STATES } from '@/constants/emptyStates'

export function PresetEmptyState({ type, actionLabel, onAction }) {
  const preset = EMPTY_STATES[type]
  if (!preset) return null
  return (
    <EmptyState
      icon={preset.icon}
      title={preset.title}
      description={preset.description}
      actionLabel={actionLabel}
      onAction={onAction}
    />
  )
}
