import { ApiError } from '../../lib/api'
import { Button } from './Button'

export interface ErrorMessageProps {
  error: unknown
  fallbackMessage: string
  onRetry?: () => void
  retryLabel?: string
}

function getDisplayMessage(error: unknown, fallback: string): string {
  if (error instanceof ApiError) {
    return error.message
  }

  if (error instanceof Error && error.message.length > 0) {
    return error.message
  }

  return fallback
}

export function ErrorMessage({
  error,
  fallbackMessage,
  onRetry,
  retryLabel = 'Retry',
}: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
      <p className="text-sm text-danger">
        {getDisplayMessage(error, fallbackMessage)}
      </p>
      {onRetry ? (
        <Button type="button" variant="ghost" className="mt-4" onClick={onRetry}>
          {retryLabel}
        </Button>
      ) : null}
    </div>
  )
}
