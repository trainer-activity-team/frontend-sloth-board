import type { InputHTMLAttributes } from 'react'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export function Input({
  label,
  error,
  id,
  className = '',
  ...props
}: InputProps) {
  const inputId = id ?? props.name

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={inputId}
        className="text-sm uppercase tracking-wide text-muted"
      >
        {label}
      </label>
      <input
        id={inputId}
        className={`w-full rounded-xl border border-border bg-background px-3 py-2.5 text-foreground placeholder:text-disabled focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary ${error ? 'border-danger focus:border-danger focus:ring-danger' : ''} ${className}`}
        {...props}
      />
      {error ? <p className="text-sm text-danger">{error}</p> : null}
    </div>
  )
}
