import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

export type Locale = 'pt' | 'es' | 'en'

const LOCALE_LABELS: Record<Locale, string> = {
  pt: 'PT',
  es: 'ES',
  en: 'EN'
}

export function useLanguage() {
  const { locale, t } = useI18n()

  const setLocale = (newLocale: Locale) => {
    locale.value = newLocale
    localStorage.setItem('locale', newLocale)
  }

  const currentLocale = computed(() => locale.value as Locale)

  const localeLabel = computed(() => LOCALE_LABELS[currentLocale.value] || 'PT')

  return {
    locale: currentLocale,
    localeLabel,
    setLocale,
    t
  }
}
