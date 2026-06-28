import { useTranslation } from 'react-i18next'
import { FiMoon, FiSun } from 'react-icons/fi'
import { useTheme } from '../hooks/useTheme'
import { Button } from './ui/Button'

export function ThemeSwitcher() {
  const { t } = useTranslation('app')
  const { theme, toggleTheme } = useTheme()

  return (
    <Button
      type="button"
      variant="ghost"
      className="px-2.5 py-2"
      onClick={toggleTheme}
      aria-label={theme === 'light' ? t('theme.dark') : t('theme.light')}
    >
      {theme === 'light' ? (
        <FiMoon className="text-lg" aria-hidden />
      ) : (
        <FiSun className="text-lg" aria-hidden />
      )}
    </Button>
  )
}
