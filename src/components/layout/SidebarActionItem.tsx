import type { IconType } from 'react-icons'
import { Button } from '../ui/Button'

export interface SidebarActionItemProps {
  icon: IconType
  label: string
  onClick?: () => void
  badge?: boolean
  ariaLabel?: string
}

export function SidebarActionItem({
  icon: Icon,
  label,
  onClick,
  badge = false,
  ariaLabel,
}: SidebarActionItemProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      className="w-full justify-start gap-3 px-3 py-2.5 text-sm font-medium"
      onClick={onClick}
      aria-label={ariaLabel ?? label}
    >
      <span className="relative shrink-0">
        <Icon className="text-lg" aria-hidden />
        {badge ? (
          <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-danger" />
        ) : null}
      </span>
      <span>{label}</span>
    </Button>
  )
}
