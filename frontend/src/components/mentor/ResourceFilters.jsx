import { RESOURCE_CATEGORIES, RESOURCE_TYPES } from '@/mock/resourceData'

export function ResourceFilters({ search, onSearchChange, type, onTypeChange, category, onCategoryChange }) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <div className="space-y-1.5">
        <label htmlFor="resource-search" className="text-xs font-medium text-muted-foreground">Search</label>
        <input
          id="resource-search"
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search resources..."
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>
      <div className="space-y-1.5">
        <label htmlFor="resource-type" className="text-xs font-medium text-muted-foreground">Type</label>
        <select id="resource-type" value={type} onChange={(e) => onTypeChange(e.target.value)} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label="Resource type">
          <option value="all">All Types</option>
          {RESOURCE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      <div className="space-y-1.5">
        <label htmlFor="resource-category" className="text-xs font-medium text-muted-foreground">Category</label>
        <select id="resource-category" value={category} onChange={(e) => onCategoryChange(e.target.value)} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label="Resource category">
          <option value="all">All Categories</option>
          {RESOURCE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
    </div>
  )
}
