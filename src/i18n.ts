import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import tr from './locales/tr.json'
import de from './locales/de.json'
import fr from './locales/fr.json'
import ru from './locales/ru.json'
import zh from './locales/zh.json'
import ja from './locales/ja.json'
import th from './locales/th.json'

const resources = {
  en: {
    translation: en
  },
  tr: {
    translation: tr
  },
  de: {
    translation: de
  },
  fr: {
    translation: fr
  },
  ru: {
    translation: ru
  },
  zh: {
    translation: zh
  },
  ja: {
    translation: ja
  },
  th: {
    translation: th
  }
}

const getInitialLanguage = () => {
  try {
    return localStorage.getItem('countryFlags_language') || 'en'
  } catch {
    return 'en'
  }
}

i18n.use(initReactI18next).init({
  resources,
  lng: getInitialLanguage(),
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false
  }
})

export default i18n
