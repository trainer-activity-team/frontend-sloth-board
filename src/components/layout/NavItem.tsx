import type { IconType } from 'react-icons'
import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export interface NavItemProps {
  to: string
  labelKey: string
  icon: IconType
  onNavigate?: () => void
}

export function NavItem({ to, labelKey, icon: Icon, onNavigate }: NavItemProps) {
  const { t } = useTranslation('app')

  return (
    <NavLink
      to={to}
      onClick={onNavigate}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
          isActive
            ? 'bg-primary/15 text-primary-hover'
            : 'text-muted hover:bg-surface-hover hover:text-foreground'
        }`
      }
    >
      <Icon className="text-lg" aria-hidden />
      <span>{t(labelKey)}</span>
    </NavLink>
  )
}
