import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { findNavItemByPath, flattenNavigation } from '@/constants/navigation'
import { useNavigation } from '@/hooks/useNavigation'

export function useBreadcrumbs() {
  const location = useLocation()
  const navigation = useNavigation()

  return useMemo(() => {
    const items = flattenNavigation(navigation)
    const current = findNavItemByPath(location.pathname, navigation)

    if (!current) {
      const segments = location.pathname.split('/').filter(Boolean)
      const lastSegment = segments[segments.length - 1]

      return [
        { label: 'Dashboard', href: items[0]?.route },
        ...(lastSegment && lastSegment !== segments[0]
          ? [{ label: lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1) }]
          : []),
      ]
    }

    if (current.route === items[0]?.route) {
      return [{ label: current.label }]
    }

    return [{ label: 'Dashboard', href: items[0]?.route }, { label: current.label }]
  }, [location.pathname, navigation])
}
