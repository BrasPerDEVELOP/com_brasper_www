export const ROUTE_LOCALES = ['es', 'en', 'pr'] as const
export const DEFAULT_ROUTE_LOCALE = 'pr'

export type RouteLocale = (typeof ROUTE_LOCALES)[number]
export type AppLocale = 'es' | 'en' | 'pt'

const ROUTE_TO_APP_LOCALE: Record<RouteLocale, AppLocale> = {
  es: 'es',
  en: 'en',
  pr: 'pt'
}

const APP_TO_ROUTE_LOCALE: Record<AppLocale, RouteLocale> = {
  es: 'es',
  en: 'en',
  pt: 'pr'
}

export function isRouteLocale(value: unknown): value is RouteLocale {
  return typeof value === 'string' && ROUTE_LOCALES.includes(value as RouteLocale)
}

export function routeLocaleToAppLocale(locale: RouteLocale): AppLocale {
  return ROUTE_TO_APP_LOCALE[locale]
}

export function appLocaleToRouteLocale(locale: AppLocale): RouteLocale {
  return APP_TO_ROUTE_LOCALE[locale] ?? DEFAULT_ROUTE_LOCALE
}

export function normalizeRouteLocale(value: unknown): RouteLocale {
  return isRouteLocale(value) ? value : DEFAULT_ROUTE_LOCALE
}

export function getSavedAppLocale(): AppLocale {
  if (typeof window === 'undefined') {
    return routeLocaleToAppLocale(DEFAULT_ROUTE_LOCALE)
  }

  const stored = window.localStorage.getItem('locale')
  if (stored === 'es' || stored === 'en' || stored === 'pt') {
    return stored
  }

  return routeLocaleToAppLocale(DEFAULT_ROUTE_LOCALE)
}

export function getPreferredRouteLocale(): RouteLocale {
  if (typeof window === 'undefined') {
    return DEFAULT_ROUTE_LOCALE
  }

  const pathLocale = window.location.pathname.split('/')[1]
  if (isRouteLocale(pathLocale)) {
    return pathLocale
  }

  return appLocaleToRouteLocale(getSavedAppLocale())
}

export function getLanguageTag(locale: AppLocale): string {
  if (locale === 'en') return 'en-US'
  if (locale === 'pt') return 'pt-BR'
  return 'es-PE'
}
