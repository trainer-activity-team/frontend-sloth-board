import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Button } from './Button'

export interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  actionLabel?: string
  actionLink?: string
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionLink,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
      {icon ? (
        <div className="mb-4 text-4xl text-muted" aria-hidden>
          {icon}
        </div>
      ) : null}
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      {description ? (
        <p className="mt-2 max-w-sm text-sm text-muted">{description}</p>
      ) : null}
      {actionLabel && actionLink ? (
        <Link to={actionLink} className="mt-6">
          <Button type="button">{actionLabel}</Button>
        </Link>
      ) : null}
    </div>
  )
}
