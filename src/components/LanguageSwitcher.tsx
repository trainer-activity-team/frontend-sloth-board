import { useTranslation } from 'react-i18next'
import { setAppLanguage } from '../lib/i18n'
import { Button } from './ui/Button'

export function LanguageSwitcher() {
  const { i18n } = useTranslation('auth')
  const current = i18n.language.startsWith('en') ? 'en' : 'fr'

  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        type="button"
        variant={current === 'fr' ? 'primary' : 'ghost'}
        className="px-3 py-1.5 text-xs"
        onClick={() => setAppLanguage('fr')}
      >
        FR
      </Button>
      <Button
        type="button"
        variant={current === 'en' ? 'primary' : 'ghost'}
        className="px-3 py-1.5 text-xs"
        onClick={() => setAppLanguage('en')}
      >
        EN
      </Button>
    </div>
  )
}
