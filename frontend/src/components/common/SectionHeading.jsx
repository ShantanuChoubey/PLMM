import { cn } from '@/lib/utils'

export function SectionHeading({
  id,
  eyebrow,
  title,
  description,
  align = 'center',
  className,
}) {
  const alignment = align === 'left' ? 'text-left' : 'text-center'

  return (
    <div className={cn('max-w-2xl', align === 'center' && 'mx-auto', alignment, className)}>
      {eyebrow ? (
        <p className="mb-3 text-sm font-medium uppercase tracking-wider text-muted-foreground">
          {eyebrow}
        </p>
      ) : null}
      <h2 id={id} className="text-3xl font-semibold tracking-tight sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-base text-muted-foreground sm:text-lg">{description}</p>
      ) : null}
    </div>
  )
}
