import { useTranslation } from 'react-i18next'
import { FiMoon, FiSettings, FiSun } from 'react-icons/fi'
import { useTheme } from '../../hooks/useTheme'
import { SidebarActionItem } from './SidebarActionItem'

export function SidebarFooter() {
  const { t } = useTranslation('app')
  const { theme, toggleTheme } = useTheme()

  const ThemeIcon = theme === 'light' ? FiMoon : FiSun
  const themeLabel = theme === 'light' ? t('theme.dark') : t('theme.light')

  return (
    <div className="mt-auto border-t border-border p-4">
      <div className="flex flex-col gap-1">
        <SidebarActionItem
          icon={ThemeIcon}
          label={themeLabel}
          onClick={toggleTheme}
          ariaLabel={themeLabel}
        />
        <SidebarActionItem
          icon={FiSettings}
          label={t('header.settings')}
        />
      </div>
    </div>
  )
}
