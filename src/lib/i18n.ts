import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import appEn from '../locales/en/app.json'
import appFr from '../locales/fr/app.json'
import authEn from '../locales/en/auth.json'
import authFr from '../locales/fr/auth.json'
import classesEn from '../locales/en/classes.json'
import classesFr from '../locales/fr/classes.json'
import contractsEn from '../locales/en/contracts.json'
import contractsFr from '../locales/fr/contracts.json'
import institutionsEn from '../locales/en/institutions.json'
import institutionsFr from '../locales/fr/institutions.json'
import profileEn from '../locales/en/profile.json'
import profileFr from '../locales/fr/profile.json'

const LANGUAGE_KEY = 'app_language'

function getInitialLanguage(): string {
  const stored = localStorage.getItem(LANGUAGE_KEY)
  if (stored === 'fr' || stored === 'en') {
    return stored
  }

  return 'fr'
}

void i18n.use(initReactI18next).init({
  resources: {
    fr: {
      auth: authFr,
      app: appFr,
      institutions: institutionsFr,
      classes: classesFr,
      contracts: contractsFr,
      profile: profileFr,
    },
    en: {
      auth: authEn,
      app: appEn,
      institutions: institutionsEn,
      classes: classesEn,
      contracts: contractsEn,
      profile: profileEn,
    },
  },
  lng: getInitialLanguage(),
  fallbackLng: 'en',
  defaultNS: 'auth',
  interpolation: {
    escapeValue: false,
  },
})

export function setAppLanguage(language: 'fr' | 'en'): void {
  localStorage.setItem(LANGUAGE_KEY, language)
  void i18n.changeLanguage(language)
}

export default i18n
