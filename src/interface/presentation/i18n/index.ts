import { createI18n } from 'vue-i18n'
import es from './es.json'
import en from './en.json'
import pt from './pt.json'

// Obtener idioma guardado en localStorage o usar portugués por defecto
const getSavedLocale = (): string => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('locale') || 'pt'
  }
  return 'pt'
}

export const i18n = createI18n({
  legacy: false,
  locale: getSavedLocale(),
  fallbackLocale: 'pt',
  messages: {
    pt: pt as Record<string, string>,
    es: es as Record<string, string>,
    en: en as Record<string, string>
  }
})
