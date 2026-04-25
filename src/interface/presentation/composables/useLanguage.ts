import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import {
  appLocaleToRouteLocale,
  routeLocaleToAppLocale,
  type AppLocale,
  type RouteLocale
} from '@/interface/presentation/i18n/locales'

export type Locale = AppLocale

const LOCALE_LABELS: Record<Locale, string> = {
  pt: 'PT',
  es: 'ES',
  en: 'EN'
}

export function useLanguage() {
  const { locale, t } = useI18n()
  const router = useRouter()
  const route = useRoute()

  const setLocale = (newLocale: Locale) => {
    locale.value = newLocale
    localStorage.setItem('locale', newLocale)

    if (route.meta.localized === true && route.name) {
      void router.replace({
        name: String(route.name),
        params: {
          ...route.params,
          locale: appLocaleToRouteLocale(newLocale) as RouteLocale
        },
        query: route.query,
        hash: route.hash
      })
    }
  }

  const currentLocale = computed(() => locale.value as Locale)
  const currentRouteLocale = computed(() => appLocaleToRouteLocale(currentLocale.value))
  const localeFromRoute = computed(() => {
    const routeLocale = route.params.locale
    return typeof routeLocale === 'string' ? routeLocaleToAppLocale(routeLocale as RouteLocale) : currentLocale.value
  })

  const localeLabel = computed(() => LOCALE_LABELS[currentLocale.value] || 'PT')

  return {
    locale: currentLocale,
    localeFromRoute,
    routeLocale: currentRouteLocale,
    localeLabel,
    setLocale,
    t
  }
}
