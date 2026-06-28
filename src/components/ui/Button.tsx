import type { ButtonHTMLAttributes } from 'react'
import { Oval } from 'react-loader-spinner'

type ButtonVariant = 'primary' | 'ghost' | 'danger'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  isLoading?: boolean
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-primary text-on-primary hover:bg-primary-hover disabled:opacity-60 disabled:hover:bg-primary',
  ghost:
    'bg-transparent text-muted hover:text-foreground hover:bg-surface-hover disabled:opacity-60',
  danger:
    'border border-danger bg-transparent text-danger hover:bg-danger/10 disabled:opacity-60',
}

export function Button({
  variant = 'primary',
  isLoading = false,
  className = '',
  children,
  disabled,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Oval
          height={18}
          width={18}
          color="currentColor"
          secondaryColor="currentColor"
          strokeWidth={4}
          ariaLabel="loading"
        />
      ) : null}
      {children}
    </button>
  )
}
