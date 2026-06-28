import { Link, Outlet, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ROUTES } from '../lib/routes'
import { LanguageSwitcher } from './LanguageSwitcher'
import { Logo } from './Logo'
import { ThemeSwitcher } from './ThemeSwitcher'
import { Card } from './ui/Card'

export function AuthLayout() {
  const { t } = useTranslation('auth')
  const location = useLocation()
  const isLogin = location.pathname === ROUTES.LOGIN

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-md space-y-6">
        <Logo />
        <Card>
          <Outlet />
        </Card>
        <div className="mb-4 flex flex-col items-center gap-1 text-center text-sm">
          <p className="text-muted">
            {isLogin ? t('login.noAccount') : t('register.hasAccount')}
          </p>
          <Link
            to={isLogin ? ROUTES.REGISTER : ROUTES.LOGIN}
            className="font-semibold text-primary-hover hover:underline"
          >
            {isLogin ? t('login.registerLink') : t('register.loginLink')}
          </Link>
        </div>
        <div className="flex items-center justify-center gap-2">
          <ThemeSwitcher />
          <LanguageSwitcher />
        </div>
      </div>
    </div>
  )
}
