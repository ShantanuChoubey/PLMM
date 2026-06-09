import { useState } from 'react'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export function SearchBar({
  placeholder = 'Search...',
  className,
  onSearch,
  defaultValue = '',
  value: controlledValue,
  onChange,
}) {
  const [internalValue, setInternalValue] = useState(defaultValue)
  const isControlled = controlledValue !== undefined
  const value = isControlled ? controlledValue : internalValue

  const setValue = (next) => {
    if (!isControlled) setInternalValue(next)
    onChange?.(next)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    onSearch?.(value.trim())
  }

  const handleClear = () => {
    setValue('')
    onSearch?.('')
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn('relative w-full max-w-md', className)}
      role="search"
    >
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
      <Input
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
        className="h-9 pl-9 pr-9"
        aria-label={placeholder}
      />
      {value ? (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-sm p-1 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Clear search"
        >
          <X className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      ) : null}
    </form>
  )
}
