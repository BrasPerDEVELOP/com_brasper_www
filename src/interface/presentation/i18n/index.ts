import { createI18n } from 'vue-i18n'
import es from './es.json'
import en from './en.json'

export const i18n = createI18n({
  legacy: false,
  locale: 'es',
  fallbackLocale: 'en',
  messages: {
    es: es as Record<string, string>,
    en: en as Record<string, string>
  }
})
