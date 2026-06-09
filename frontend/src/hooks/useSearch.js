import { useCallback, useEffect, useMemo, useState } from 'react'

export function useSearch({
  initialSearch = '',
  initialFilters = {},
  initialSort = '',
  initialPage = 1,
  pageSize = 10,
  debounceMs = 300,
} = {}) {
  const [search, setSearch] = useState(initialSearch)
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch)
  const [filters, setFilters] = useState(initialFilters)
  const [sort, setSort] = useState(initialSort)
  const [page, setPage] = useState(initialPage)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), debounceMs)
    return () => clearTimeout(timer)
  }, [search, debounceMs])

  const setFilter = useCallback((key, value) => {
    setFilters((current) => ({ ...current, [key]: value }))
    setPage(1)
  }, [])

  const reset = useCallback(() => {
    setSearch(initialSearch)
    setDebouncedSearch(initialSearch)
    setFilters(initialFilters)
    setSort(initialSort)
    setPage(1)
  }, [initialFilters, initialSearch, initialSort])

  const queryParams = useMemo(
    () => ({
      search: debouncedSearch,
      ...filters,
      sort,
      page,
      pageSize,
    }),
    [debouncedSearch, filters, sort, page, pageSize],
  )

  const paginateClient = useCallback(
    (items) => {
      const start = (page - 1) * pageSize
      return {
        items: items.slice(start, start + pageSize),
        total: items.length,
        totalPages: Math.max(1, Math.ceil(items.length / pageSize)),
        page,
        pageSize,
      }
    },
    [page, pageSize],
  )

  return {
    search,
    setSearch,
    debouncedSearch,
    filters,
    setFilter,
    setFilters,
    sort,
    setSort,
    page,
    setPage,
    pageSize,
    queryParams,
    reset,
    paginateClient,
  }
}
