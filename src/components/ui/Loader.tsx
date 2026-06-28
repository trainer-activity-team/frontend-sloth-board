import { Oval } from 'react-loader-spinner'

export interface LoaderProps {
  className?: string
}

export function Loader({ className = '' }: LoaderProps) {
  return (
    <div
      className={`flex items-center justify-center py-12 ${className}`}
      role="status"
      aria-label="Loading"
    >
      <Oval
        height={48}
        width={48}
        color="var(--color-primary)"
        secondaryColor="var(--color-primary-hover)"
        strokeWidth={4}
        ariaLabel="loading"
      />
    </div>
  )
}
