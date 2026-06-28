import { useTranslation } from 'react-i18next'
import { FaCalendarAlt } from 'react-icons/fa'

export interface LogoProps {
  variant?: 'default' | 'compact'
}

export function Logo({ variant = 'default' }: LogoProps) {
  const { t } = useTranslation('auth')

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-2.5">
        <FaCalendarAlt className="text-2xl text-primary-hover" aria-hidden />
        <p className="text-lg font-semibold text-foreground">{t('appName')}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <FaCalendarAlt className="text-4xl text-primary-hover" aria-hidden />
      <div>
        <p className="text-xl font-semibold text-foreground">{t('appName')}</p>
        <p className="text-sm text-muted">{t('appTagline')}</p>
      </div>
    </div>
  )
}
