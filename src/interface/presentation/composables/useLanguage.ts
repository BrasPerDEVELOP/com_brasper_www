import { computed, nextTick } from 'vue'
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

/** Ancla de la calculadora del banner (HomeHeroBanner.vue). */
const CALCULATOR_ID = 'calculadora'
const CALCULATOR_HASH = `#${CALCULATOR_ID}`
const NAVBAR_OFFSET = 88
/** Vistas con formulario: solo cambian de idioma para no perder lo escrito. */
const KEEP_IN_PLACE_ROUTES = new Set(['auth', 'register'])

/**
 * Lleva el scroll a la calculadora aunque la navegación se haya abortado
 * (mismo idioma) o el hash ya fuese el mismo, casos en los que
 * `scrollBehavior` del router no se ejecuta.
 */
function scrollToCalculator(attempt = 0) {
  void nextTick(() => {
    const el = document.getElementById(CALCULATOR_ID)
    if (!el) {
      if (attempt < 10) {
        requestAnimationFrame(() => scrollToCalculator(attempt + 1))
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
      return
    }

    const top = el.getBoundingClientRect().top + window.scrollY - NAVBAR_OFFSET
    window.scrollTo({ top: Math.max(top, 0), behavior: 'smooth' })
  })
}

export function useLanguage() {
  const { locale, t } = useI18n()
  const router = useRouter()
  const route = useRoute()

  const setLocale = (newLocale: Locale) => {
    locale.value = newLocale
    localStorage.setItem('locale', newLocale)

    // Dentro del dashboard solo se cambia el idioma: no se saca al usuario de su flujo.
    if (route.matched.some((r) => r.meta.requiresAuth)) return

    const name = route.name ? String(route.name) : ''
    const routeLocale = appLocaleToRouteLocale(newLocale) as RouteLocale

    if (KEEP_IN_PLACE_ROUTES.has(name) && route.meta.localized === true) {
      void router.replace({
        name,
        params: { ...route.params, locale: routeLocale },
        query: route.query,
        hash: route.hash
      })
      return
    }

    // Cualquier otra vista pública vuelve a la calculadora del landing,
    // descartando el hash actual (#about, #bancos-section, #agenda...).
    const target = {
      name: 'homepage',
      params: { locale: routeLocale },
      hash: CALCULATOR_HASH
    }

    const navigation = name === 'homepage' ? router.replace(target) : router.push(target)
    void navigation.finally(() => scrollToCalculator())
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
