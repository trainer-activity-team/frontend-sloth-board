import type { InputHTMLAttributes } from 'react'

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string
  error?: string
}

export function Checkbox({
  label,
  error,
  id,
  className = '',
  ...props
}: CheckboxProps) {
  const inputId = id ?? props.name

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={inputId}
        className="flex cursor-pointer items-center gap-3"
      >
        <input
          id={inputId}
          type="checkbox"
          className={`size-4 rounded border-border bg-background text-primary focus:ring-primary focus:ring-offset-0 ${className}`}
          {...props}
        />
        <span className="text-sm text-foreground">{label}</span>
      </label>
      {error ? <p className="text-sm text-danger">{error}</p> : null}
    </div>
  )
}
