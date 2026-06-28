import { Link, useNavigate, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { FiLogOut, FiMenu, FiSearch } from 'react-icons/fi'
import { useAuth } from '../../features/auth/useAuth'
import { useUser } from '../../features/users/hooks/useUser'
import { ROUTES } from '../../lib/routes'
import { resolvePageTitleKey } from '../../lib/pageTitle'
import { LanguageSwitcher } from '../LanguageSwitcher'
import { Avatar } from '../ui/Avatar'
import { Button } from '../ui/Button'

export interface AppHeaderProps {
  onMenuClick: () => void
}

function formatRoleLabel(roleName: string): string {
  return roleName.charAt(0).toUpperCase() + roleName.slice(1)
}

export function AppHeader({ onMenuClick }: AppHeaderProps) {
  const { t } = useTranslation('app')
  const { t: tAuth } = useTranslation('auth')
  const { t: tProfile } = useTranslation('profile')
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const userId = user?.userId ?? 0
  const { data: profileUser } = useUser(userId)

  const pageTitleKey = resolvePageTitleKey(location.pathname)

  const roleLabel = profileUser
    ? tProfile(`roles.${profileUser.role.name}`, {
        defaultValue: formatRoleLabel(profileUser.role.name),
      })
    : t('header.role')

  const handleLogout = () => {
    logout()
    toast.success(tAuth('toast.logoutSuccess'))
    void navigate(ROUTES.LOGIN)
  }

  return (
    <header className="flex shrink-0 items-center gap-4 bg-background px-4 py-4 md:px-6">
      <Button
        type="button"
        variant="ghost"
        className="px-2.5 py-2 lg:hidden"
        onClick={onMenuClick}
        aria-label="Menu"
      >
        <FiMenu className="text-lg" aria-hidden />
      </Button>

      <h1 className="shrink-0 text-xl font-semibold text-foreground md:text-2xl">
        {t(pageTitleKey)}
      </h1>

      <div className="hidden flex-1 justify-center md:flex">
        <div className="relative w-full max-w-md">
          <FiSearch
            className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted"
            aria-hidden
          />
          <input
            type="search"
            disabled
            placeholder={t('header.searchPlaceholder')}
            className="w-full rounded-xl border border-border bg-surface py-2.5 pr-4 pl-10 text-sm text-foreground placeholder:text-disabled"
          />
        </div>
      </div>

      <div className="ml-auto flex items-center gap-1 sm:gap-2">
        <LanguageSwitcher />

        <Link
          to={ROUTES.PROFILE}
          className="hidden items-center gap-3 border-l border-border pl-3 transition-colors hover:opacity-80 sm:flex"
        >
          <Avatar name={user?.fullName ?? ''} />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">
              {user?.fullName}
            </p>
            <p className="text-xs text-muted">{roleLabel}</p>
          </div>
        </Link>

        <Button
          type="button"
          variant="ghost"
          className="px-2.5 py-2"
          onClick={handleLogout}
          aria-label={t('header.logout')}
        >
          <FiLogOut className="text-lg" aria-hidden />
        </Button>
      </div>
    </header>
  )
}
