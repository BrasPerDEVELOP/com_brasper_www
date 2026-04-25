import { createI18n } from 'vue-i18n'
import es from './es.json'
import en from './en.json'
import pt from './pt.json'
import { getSavedAppLocale } from './locales'

export const i18n = createI18n({
  legacy: false,
  locale: getSavedAppLocale(),
  fallbackLocale: 'pt',
  messages: {
    pt: pt as Record<string, string>,
    es: es as Record<string, string>,
    en: en as Record<string, string>
  }
})
